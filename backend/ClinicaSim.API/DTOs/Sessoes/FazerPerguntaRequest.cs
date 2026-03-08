namespace ClinicaSim.API.DTOs.Sessoes;

/// <summary>
/// Dados para realizar uma pergunta durante uma sessão de simulação.
/// </summary>
public record FazerPerguntaRequest(
    /// <summary>Identificador da pergunta selecionada pelo aluno.</summary>
    int PerguntaId
);
