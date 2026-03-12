using ClinicaSim.API.DTOs.Perguntas;

namespace ClinicaSim.API.Services.Interfaces;

/// <summary>
/// Contrato do servico de gerenciamento de perguntas.
/// </summary>
public interface IPerguntaService
{
    /// <summary>Obtem as perguntas globais e, opcionalmente, perguntas especificas de um caso.</summary>
    /// <param name="apenasAtivas">Se verdadeiro, retorna apenas perguntas ativas.</param>
    /// <param name="casoClinicoId">Identificador do caso clinico para incluir perguntas especificas (opcional).</param>
    Task<List<PerguntaResponse>> ObterTodasAsync(bool apenasAtivas = true, int? casoClinicoId = null);

    /// <summary>Obtem uma pergunta pelo seu identificador.</summary>
    /// <param name="id">Identificador da pergunta.</param>
    Task<PerguntaResponse?> ObterPorIdAsync(int id);

    /// <summary>Cria uma nova pergunta.</summary>
    /// <param name="request">Dados para criacao da pergunta.</param>
    Task<PerguntaResponse> CriarAsync(CriarPerguntaRequest request);

    /// <summary>Atualiza os dados de uma pergunta existente.</summary>
    /// <param name="id">Identificador da pergunta.</param>
    /// <param name="request">Dados atualizados da pergunta.</param>
    Task<PerguntaResponse?> AtualizarAsync(int id, AtualizarPerguntaRequest request);

    /// <summary>Remove (soft delete) uma pergunta.</summary>
    /// <param name="id">Identificador da pergunta.</param>
    Task<bool> DeletarAsync(int id);
}
