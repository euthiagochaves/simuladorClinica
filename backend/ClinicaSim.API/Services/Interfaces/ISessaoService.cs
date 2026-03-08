using ClinicaSim.API.DTOs.Sessoes;

namespace ClinicaSim.API.Services.Interfaces;

/// <summary>
/// Contrato do servico de gerenciamento de sessoes de simulacao clinica.
/// </summary>
public interface ISessaoService
{
    /// <summary>Inicia uma nova sessao de simulacao clinica.</summary>
    /// <param name="request">Dados para inicio da sessao.</param>
    Task<SessaoResponse> IniciarSessaoAsync(IniciarSessaoRequest request);

    /// <summary>Obtem uma sessao pelo seu identificador.</summary>
    /// <param name="id">Identificador da sessao.</param>
    Task<SessaoResponse?> ObterSessaoAsync(int id);

    /// <summary>Obtem uma sessao pelo seu codigo unico.</summary>
    /// <param name="codigo">Codigo unico da sessao.</param>
    Task<SessaoResponse?> ObterSessaoPorCodigoAsync(string codigo);

    /// <summary>Registra uma pergunta feita pelo aluno durante a sessao.</summary>
    /// <param name="sessaoId">Identificador da sessao.</param>
    /// <param name="request">Dados da pergunta realizada.</param>
    Task<RespostaInteracaoResponse> FazerPerguntaAsync(int sessaoId, FazerPerguntaRequest request);

    /// <summary>Registra a selecao de um achado fisico pelo aluno durante a sessao.</summary>
    /// <param name="sessaoId">Identificador da sessao.</param>
    /// <param name="request">Dados do achado selecionado.</param>
    Task<RespostaInteracaoResponse> SelecionarAchadoAsync(int sessaoId, SelecionarAchadoRequest request);

    /// <summary>Obtem todos os eventos registrados durante uma sessao.</summary>
    /// <param name="sessaoId">Identificador da sessao.</param>
    Task<List<EventoSessaoResponse>> ObterEventosAsync(int sessaoId);

    /// <summary>Finaliza uma sessao de simulacao clinica.</summary>
    /// <param name="sessaoId">Identificador da sessao.</param>
    Task<SessaoResponse?> FinalizarSessaoAsync(int sessaoId);
}
