namespace ClinicaSim.API.DTOs.Sessoes;

/// <summary>
/// Dados para realizar uma pergunta durante uma sessao de simulacao.
/// </summary>
public record FazerPerguntaRequest(
    /// <summary>Identificador da pergunta global selecionada pelo aluno.</summary>
    int? PerguntaId,
    /// <summary>Identificador da pergunta especifica de caso selecionada pelo aluno.</summary>
    int? PerguntaCasoId
);
