using Microsoft.EntityFrameworkCore;
using ClinicaSim.API.Data;
using ClinicaSim.API.DTOs.CasosClinicos;
using ClinicaSim.API.DTOs.RespostasCasos;
using ClinicaSim.API.DTOs.AchadosFisicosCasos;
using ClinicaSim.API.Models.Entities;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Services;

/// <summary>
/// Implementacao do servico de gerenciamento de casos clinicos.
/// Responsavel por operacoes CRUD sobre a entidade <see cref="CasoClinico"/>
/// e gerenciamento de respostas e achados fisicos especificos de cada caso.
/// </summary>
public class CasoClinicoService : ICasoClinicoService
{
    private readonly ClinicaSimDbContext _contexto;

    /// <summary>
    /// Inicializa uma nova instancia de <see cref="CasoClinicoService"/>.
    /// </summary>
    /// <param name="contexto">Contexto do banco de dados.</param>
    public CasoClinicoService(ClinicaSimDbContext contexto)
    {
        _contexto = contexto;
    }

    /// <inheritdoc />
    public async Task<List<CasoClinicoResumoResponse>> ObterTodosAsync(bool apenasAtivos = true)
    {
        var query = _contexto.CasosClinicos.AsNoTracking();

        if (apenasAtivos)
            query = query.Where(c => c.Ativo);

        var casos = await query
            .OrderBy(c => c.Titulo)
            .ToListAsync();

        return casos.Select(MapearParaResumoResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<CasoClinicoResponse?> ObterPorIdAsync(int id)
    {
        var caso = await _contexto.CasosClinicos
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Id == id);

        return caso is null ? null : MapearParaResponse(caso);
    }

    /// <inheritdoc />
    public async Task<CasoClinicoResponse> CriarAsync(CriarCasoClinicoRequest request)
    {
        var caso = new CasoClinico
        {
            Titulo = request.Titulo,
            NomePaciente = request.NomePaciente,
            Idade = request.Idade,
            Sexo = request.Sexo,
            QueixaPrincipal = request.QueixaPrincipal,
            Triagem = request.Triagem,
            Resumo = request.Resumo,
            CriadoPorUsuarioId = request.CriadoPorUsuarioId.HasValue
                ? request.CriadoPorUsuarioId.Value
                : null,
            Ativo = true
        };

        _contexto.CasosClinicos.Add(caso);
        await _contexto.SaveChangesAsync();

        return MapearParaResponse(caso);
    }

    /// <inheritdoc />
    public async Task<CasoClinicoResponse?> AtualizarAsync(int id, AtualizarCasoClinicoRequest request)
    {
        var caso = await _contexto.CasosClinicos.FindAsync(id);
        if (caso is null)
            return null;

        caso.Titulo = request.Titulo;
        caso.NomePaciente = request.NomePaciente;
        caso.Idade = request.Idade;
        caso.Sexo = request.Sexo;
        caso.QueixaPrincipal = request.QueixaPrincipal;
        caso.Triagem = request.Triagem;
        caso.Resumo = request.Resumo;
        caso.Ativo = request.Ativo;

        await _contexto.SaveChangesAsync();

        return MapearParaResponse(caso);
    }

    /// <inheritdoc />
    public async Task<bool> DeletarAsync(int id)
    {
        var caso = await _contexto.CasosClinicos.FindAsync(id);
        if (caso is null)
            return false;

        // Soft delete: desativa o caso em vez de remover do banco
        caso.Ativo = false;
        await _contexto.SaveChangesAsync();

        return true;
    }

    /// <inheritdoc />
    public async Task<List<RespostaCasoResponse>> ObterRespostasCasoAsync(int casoClinicoId)
    {
        var respostas = await _contexto.RespostasCasosPerguntas
            .AsNoTracking()
            .Include(r => r.Pergunta)
            .Where(r => r.CasoClinicoId == casoClinicoId)
            .OrderBy(r => r.Pergunta.Texto)
            .ToListAsync();

        return respostas.Select(MapearRespostaParaResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<RespostaCasoResponse> AdicionarRespostaCasoAsync(int casoClinicoId, CriarRespostaCasoRequest request)
    {
        var resposta = new RespostaCasoPergunta
        {
            CasoClinicoId = casoClinicoId,
            PerguntaId = request.PerguntaId,
            TextoResposta = request.TextoResposta,
            Destacada = request.Destacada
        };

        _contexto.RespostasCasosPerguntas.Add(resposta);
        await _contexto.SaveChangesAsync();

        // Carrega a pergunta associada para incluir no response
        await _contexto.Entry(resposta).Reference(r => r.Pergunta).LoadAsync();

        return MapearRespostaParaResponse(resposta);
    }

    /// <inheritdoc />
    public async Task<List<AchadoFisicoCasoResponse>> ObterAchadosFisicosCasoAsync(int casoClinicoId)
    {
        var achados = await _contexto.AchadosFisicosCasos
            .AsNoTracking()
            .Include(a => a.AchadoFisico)
            .Where(a => a.CasoClinicoId == casoClinicoId)
            .OrderBy(a => a.AchadoFisico.Nome)
            .ToListAsync();

        return achados.Select(MapearAchadoCasoParaResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<AchadoFisicoCasoResponse> AdicionarAchadoFisicoCasoAsync(int casoClinicoId, CriarAchadoFisicoCasoRequest request)
    {
        var achado = new AchadoFisicoCaso
        {
            CasoClinicoId = casoClinicoId,
            AchadoFisicoId = request.AchadoFisicoId,
            Presente = request.Presente,
            TextoDetalhe = request.TextoDetalhe,
            Destacado = request.Destacado
        };

        _contexto.AchadosFisicosCasos.Add(achado);
        await _contexto.SaveChangesAsync();

        // Carrega o achado fisico associado para incluir no response
        await _contexto.Entry(achado).Reference(a => a.AchadoFisico).LoadAsync();

        return MapearAchadoCasoParaResponse(achado);
    }

    // =====================================================================
    // Metodos auxiliares de mapeamento
    // =====================================================================

    /// <summary>
    /// Mapeia uma entidade <see cref="CasoClinico"/> para o DTO <see cref="CasoClinicoResponse"/>.
    /// </summary>
    private static CasoClinicoResponse MapearParaResponse(CasoClinico caso)
    {
        return new CasoClinicoResponse(
            Id: caso.Id,
            Titulo: caso.Titulo,
            NomePaciente: caso.NomePaciente,
            Idade: caso.Idade,
            Sexo: caso.Sexo,
            QueixaPrincipal: caso.QueixaPrincipal,
            Triagem: caso.Triagem,
            Resumo: caso.Resumo,
            Ativo: caso.Ativo,
            CriadoEm: caso.CriadoEm
        );
    }

    /// <summary>
    /// Mapeia uma entidade <see cref="CasoClinico"/> para o DTO <see cref="CasoClinicoResumoResponse"/>.
    /// </summary>
    private static CasoClinicoResumoResponse MapearParaResumoResponse(CasoClinico caso)
    {
        return new CasoClinicoResumoResponse(
            Id: caso.Id,
            Titulo: caso.Titulo,
            NomePaciente: caso.NomePaciente,
            Idade: caso.Idade,
            Sexo: caso.Sexo,
            QueixaPrincipal: caso.QueixaPrincipal,
            Triagem: caso.Triagem,
            Ativo: caso.Ativo
        );
    }

    /// <summary>
    /// Mapeia uma entidade <see cref="RespostaCasoPergunta"/> para o DTO <see cref="RespostaCasoResponse"/>.
    /// </summary>
    private static RespostaCasoResponse MapearRespostaParaResponse(RespostaCasoPergunta resposta)
    {
        return new RespostaCasoResponse(
            Id: resposta.Id,
            CasoClinicoId: resposta.CasoClinicoId,
            PerguntaId: resposta.PerguntaId,
            TextoResposta: resposta.TextoResposta,
            Destacada: resposta.Destacada,
            TextoPergunta: resposta.Pergunta?.Texto
        );
    }

    /// <summary>
    /// Mapeia uma entidade <see cref="AchadoFisicoCaso"/> para o DTO <see cref="AchadoFisicoCasoResponse"/>.
    /// </summary>
    private static AchadoFisicoCasoResponse MapearAchadoCasoParaResponse(AchadoFisicoCaso achado)
    {
        return new AchadoFisicoCasoResponse(
            Id: achado.Id,
            CasoClinicoId: achado.CasoClinicoId,
            AchadoFisicoId: achado.AchadoFisicoId,
            Presente: achado.Presente,
            TextoDetalhe: achado.TextoDetalhe,
            Destacado: achado.Destacado,
            NomeAchado: achado.AchadoFisico?.Nome
        );
    }
}
