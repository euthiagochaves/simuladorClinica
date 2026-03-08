using Microsoft.EntityFrameworkCore;
using ClinicaSim.API.Data;
using ClinicaSim.API.DTOs.CasosClinicos;
using ClinicaSim.API.DTOs.Sessoes;
using ClinicaSim.API.Models.Entities;
using ClinicaSim.API.Models.Enums;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Services;

/// <summary>
/// Implementacao do servico de gerenciamento de sessoes de simulacao clinica.
/// Este e o servico principal que contem a logica de negocio central do sistema,
/// incluindo o processamento de perguntas, achados fisicos e finalizacao de sessoes.
/// </summary>
public class SessaoService : ISessaoService
{
    private readonly ClinicaSimDbContext _contexto;

    /// <summary>Caracteres utilizados para gerar o codigo unico da sessao.</summary>
    private const string CaracteresCodigoSessao = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    /// <summary>Tamanho do codigo unico da sessao.</summary>
    private const int TamanhoCodigoSessao = 9;

    /// <summary>
    /// Inicializa uma nova instancia de <see cref="SessaoService"/>.
    /// </summary>
    /// <param name="contexto">Contexto do banco de dados.</param>
    public SessaoService(ClinicaSimDbContext contexto)
    {
        _contexto = contexto;
    }

    /// <inheritdoc />
    public async Task<SessaoResponse> IniciarSessaoAsync(IniciarSessaoRequest request)
    {
        var casoClinicoId = request.CasoClinicoId;

        // Verifica se o caso clinico existe
        var casoExiste = await _contexto.CasosClinicos.AnyAsync(c => c.Id == casoClinicoId);
        if (!casoExiste)
            throw new InvalidOperationException($"Caso clinico com Id {casoClinicoId} nao encontrado.");

        var agora = DateTime.UtcNow;
        var codigoSessao = await GerarCodigoSessaoUnicoAsync();

        var sessao = new Sessao
        {
            CasoClinicoId = casoClinicoId,
            AlunoId = request.AlunoId.HasValue ? request.AlunoId.Value : null,
            CodigoSessao = codigoSessao,
            IniciadoEm = agora,
            Status = StatusSessao.Iniciada
        };

        _contexto.Sessoes.Add(sessao);
        await _contexto.SaveChangesAsync();

        // Carrega o caso clinico para incluir no response
        await _contexto.Entry(sessao).Reference(s => s.CasoClinico).LoadAsync();

        return MapearSessaoParaResponse(sessao);
    }

    /// <inheritdoc />
    public async Task<SessaoResponse?> ObterSessaoAsync(int id)
    {
        var sessao = await _contexto.Sessoes
            .AsNoTracking()
            .Include(s => s.CasoClinico)
            .FirstOrDefaultAsync(s => s.Id == id);

        return sessao is null ? null : MapearSessaoParaResponse(sessao);
    }

    /// <inheritdoc />
    public async Task<SessaoResponse?> ObterSessaoPorCodigoAsync(string codigo)
    {
        var sessao = await _contexto.Sessoes
            .AsNoTracking()
            .Include(s => s.CasoClinico)
            .FirstOrDefaultAsync(s => s.CodigoSessao == codigo);

        return sessao is null ? null : MapearSessaoParaResponse(sessao);
    }

    /// <inheritdoc />
    /// <remarks>
    /// Logica principal de interacao por pergunta:
    /// 1. Localiza a sessao e seu CasoClinicoId.
    /// 2. Busca RespostaCasoPergunta onde CasoClinicoId E PerguntaId coincidem.
    /// 3. Se encontrada, usa o TextoResposta da RespostaCasoPergunta.
    /// 4. Se nao encontrada, usa a RespostaPadrao da Pergunta (banco global).
    /// 5. Cria um EventoSessao com TipoEvento.PerguntaClicada.
    /// 6. Calcula SegundosDesdeInicio a partir do inicio da sessao.
    /// </remarks>
    public async Task<RespostaInteracaoResponse> FazerPerguntaAsync(int sessaoId, FazerPerguntaRequest request)
    {
        var sessao = await _contexto.Sessoes
            .FirstOrDefaultAsync(s => s.Id == sessaoId);

        if (sessao is null)
            throw new InvalidOperationException($"Sessao com Id {sessaoId} nao encontrada.");

        var perguntaId = request.PerguntaId;

        // Busca a pergunta no banco global
        var pergunta = await _contexto.Perguntas
            .AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == perguntaId);

        if (pergunta is null)
            throw new InvalidOperationException($"Pergunta com Id {perguntaId} nao encontrada.");

        // Busca resposta especifica do caso para esta pergunta
        var respostaCaso = await _contexto.RespostasCasosPerguntas
            .AsNoTracking()
            .FirstOrDefaultAsync(r => r.CasoClinicoId == sessao.CasoClinicoId && r.PerguntaId == perguntaId);

        // Se encontrou resposta especifica, usa ela; senao, usa a resposta padrao da pergunta
        var textoResposta = respostaCaso != null
            ? respostaCaso.TextoResposta
            : pergunta.RespostaPadrao;

        // Calcula o tempo decorrido desde o inicio da sessao
        var agora = DateTime.UtcNow;
        var segundosDesdeInicio = (int)(agora - sessao.IniciadoEm).TotalSeconds;

        // Registra o evento de interacao
        var evento = new EventoSessao
        {
            SessaoId = sessaoId,
            Tipo = TipoEvento.PerguntaClicada,
            ReferenciaId = perguntaId,
            TextoExibido = pergunta.Texto,
            TextoResposta = textoResposta,
            OcorridoEm = agora,
            SegundosDesdeInicio = segundosDesdeInicio
        };

        _contexto.EventosSessoes.Add(evento);

        // Atualiza o status da sessao para EmAndamento se ainda estiver Iniciada
        if (sessao.Status == StatusSessao.Iniciada)
        {
            sessao.Status = StatusSessao.EmAndamento;
        }

        await _contexto.SaveChangesAsync();

        return new RespostaInteracaoResponse(
            TipoEvento: TipoEvento.PerguntaClicada.ToString(),
            TextoExibido: pergunta.Texto,
            TextoResposta: textoResposta,
            SegundosDesdeInicio: segundosDesdeInicio
        );
    }

    /// <inheritdoc />
    /// <remarks>
    /// Logica principal de interacao por achado fisico:
    /// 1. Localiza a sessao e seu CasoClinicoId.
    /// 2. Busca AchadoFisicoCaso para este caso e achado.
    /// 3. Se encontrado, usa TextoDetalhe (ou "Presente"/"Ausente" baseado no bool Presente).
    /// 4. Se nao encontrado, usa ResultadoPadrao do AchadoFisico (banco global).
    /// 5. Cria um EventoSessao com TipoEvento.AchadoSelecionado.
    /// 6. Calcula SegundosDesdeInicio a partir do inicio da sessao.
    /// </remarks>
    public async Task<RespostaInteracaoResponse> SelecionarAchadoAsync(int sessaoId, SelecionarAchadoRequest request)
    {
        var sessao = await _contexto.Sessoes
            .FirstOrDefaultAsync(s => s.Id == sessaoId);

        if (sessao is null)
            throw new InvalidOperationException($"Sessao com Id {sessaoId} nao encontrada.");

        var achadoFisicoId = request.AchadoFisicoId;

        // Busca o achado fisico no banco global
        var achadoFisico = await _contexto.AchadosFisicos
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.Id == achadoFisicoId);

        if (achadoFisico is null)
            throw new InvalidOperationException($"Achado fisico com Id {achadoFisicoId} nao encontrado.");

        // Busca achado especifico do caso
        var achadoCaso = await _contexto.AchadosFisicosCasos
            .AsNoTracking()
            .FirstOrDefaultAsync(a => a.CasoClinicoId == sessao.CasoClinicoId && a.AchadoFisicoId == achadoFisicoId);

        // Determina o texto da resposta
        string textoResposta;
        if (achadoCaso != null)
        {
            // Se ha texto de detalhe especifico, usa ele; senao, informa se esta presente ou ausente
            textoResposta = !string.IsNullOrWhiteSpace(achadoCaso.TextoDetalhe)
                ? achadoCaso.TextoDetalhe
                : (achadoCaso.Presente ? "Presente" : "Ausente");
        }
        else
        {
            // Usa o resultado padrao do achado fisico (banco global)
            textoResposta = achadoFisico.ResultadoPadrao;
        }

        // Calcula o tempo decorrido desde o inicio da sessao
        var agora = DateTime.UtcNow;
        var segundosDesdeInicio = (int)(agora - sessao.IniciadoEm).TotalSeconds;

        // Registra o evento de interacao
        var evento = new EventoSessao
        {
            SessaoId = sessaoId,
            Tipo = TipoEvento.AchadoSelecionado,
            ReferenciaId = achadoFisicoId,
            TextoExibido = achadoFisico.Nome,
            TextoResposta = textoResposta,
            OcorridoEm = agora,
            SegundosDesdeInicio = segundosDesdeInicio
        };

        _contexto.EventosSessoes.Add(evento);

        // Atualiza o status da sessao para EmAndamento se ainda estiver Iniciada
        if (sessao.Status == StatusSessao.Iniciada)
        {
            sessao.Status = StatusSessao.EmAndamento;
        }

        await _contexto.SaveChangesAsync();

        return new RespostaInteracaoResponse(
            TipoEvento: TipoEvento.AchadoSelecionado.ToString(),
            TextoExibido: achadoFisico.Nome,
            TextoResposta: textoResposta,
            SegundosDesdeInicio: segundosDesdeInicio
        );
    }

    /// <inheritdoc />
    public async Task<List<EventoSessaoResponse>> ObterEventosAsync(int sessaoId)
    {
        var eventos = await _contexto.EventosSessoes
            .AsNoTracking()
            .Where(e => e.SessaoId == sessaoId)
            .OrderBy(e => e.OcorridoEm)
            .ToListAsync();

        return eventos.Select(MapearEventoParaResponse).ToList();
    }

    /// <inheritdoc />
    /// <remarks>
    /// Para finalizar a sessao, valida que:
    /// - A nota clinica existe (TextoResumo, TextoDiagnosticoProvavel e TextoConduta preenchidos).
    /// - Existem exatamente 5 diagnosticos diferenciais registrados.
    /// Se as validacoes passarem, define Status = Finalizada e FinalizadoEm = agora.
    /// </remarks>
    public async Task<SessaoResponse?> FinalizarSessaoAsync(int sessaoId)
    {
        var sessao = await _contexto.Sessoes
            .Include(s => s.CasoClinico)
            .Include(s => s.NotaClinica)
            .Include(s => s.DiagnosticosDiferenciais)
            .FirstOrDefaultAsync(s => s.Id == sessaoId);

        if (sessao is null)
            return null;

        // Validacao: a nota clinica deve existir
        if (sessao.NotaClinica is null)
            throw new InvalidOperationException("Nao e possivel finalizar a sessao sem uma nota clinica preenchida.");

        // Validacao: devem existir 5 diagnosticos diferenciais
        if (sessao.DiagnosticosDiferenciais.Count != 5)
            throw new InvalidOperationException(
                $"Sao necessarios exatamente 5 diagnosticos diferenciais para finalizar. Atualmente existem {sessao.DiagnosticosDiferenciais.Count}.");

        // Finaliza a sessao
        sessao.Status = StatusSessao.Finalizada;
        sessao.FinalizadoEm = DateTime.UtcNow;

        await _contexto.SaveChangesAsync();

        return MapearSessaoParaResponse(sessao);
    }

    // =====================================================================
    // Metodos auxiliares
    // =====================================================================

    /// <summary>
    /// Gera um codigo de sessao unico alfanumerico de 9 caracteres.
    /// Verifica unicidade no banco de dados antes de retornar.
    /// </summary>
    private async Task<string> GerarCodigoSessaoUnicoAsync()
    {
        var random = new Random();
        string codigo;

        do
        {
            var caracteres = new char[TamanhoCodigoSessao];
            for (int i = 0; i < TamanhoCodigoSessao; i++)
            {
                caracteres[i] = CaracteresCodigoSessao[random.Next(CaracteresCodigoSessao.Length)];
            }
            codigo = new string(caracteres);
        }
        while (await _contexto.Sessoes.AnyAsync(s => s.CodigoSessao == codigo));

        return codigo;
    }

    /// <summary>
    /// Mapeia uma entidade <see cref="Sessao"/> para o DTO <see cref="SessaoResponse"/>.
    /// Inclui os dados resumidos do caso clinico associado.
    /// </summary>
    private static SessaoResponse MapearSessaoParaResponse(Sessao sessao)
    {
        CasoClinicoResumoResponse? casoResumo = null;
        if (sessao.CasoClinico != null)
        {
            casoResumo = new CasoClinicoResumoResponse(
                Id: sessao.CasoClinico.Id,
                Titulo: sessao.CasoClinico.Titulo,
                NomePaciente: sessao.CasoClinico.NomePaciente,
                Idade: sessao.CasoClinico.Idade,
                Sexo: sessao.CasoClinico.Sexo,
                QueixaPrincipal: sessao.CasoClinico.QueixaPrincipal,
                Triagem: sessao.CasoClinico.Triagem,
                Ativo: sessao.CasoClinico.Ativo
            );
        }

        return new SessaoResponse(
            Id: sessao.Id,
            CasoClinicoId: sessao.CasoClinicoId,
            AlunoId: sessao.AlunoId.HasValue ? sessao.AlunoId.Value : null,
            CodigoSessao: sessao.CodigoSessao,
            IniciadoEm: sessao.IniciadoEm,
            FinalizadoEm: sessao.FinalizadoEm,
            Status: sessao.Status.ToString(),
            CasoClinico: casoResumo
        );
    }

    /// <summary>
    /// Mapeia uma entidade <see cref="EventoSessao"/> para o DTO <see cref="EventoSessaoResponse"/>.
    /// </summary>
    private static EventoSessaoResponse MapearEventoParaResponse(EventoSessao evento)
    {
        return new EventoSessaoResponse(
            Id: evento.Id,
            Tipo: evento.Tipo.ToString(),
            TextoExibido: evento.TextoExibido,
            TextoResposta: evento.TextoResposta,
            OcorridoEm: evento.OcorridoEm,
            SegundosDesdeInicio: evento.SegundosDesdeInicio
        );
    }
}
