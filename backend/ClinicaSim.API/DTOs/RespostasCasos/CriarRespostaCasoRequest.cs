namespace ClinicaSim.API.DTOs.RespostasCasos;

/// <summary>
/// Dados para criar uma resposta específica de um caso clínico para uma pergunta.
/// </summary>
public record CriarRespostaCasoRequest(
    /// <summary>Identificador do caso clínico.</summary>
    Guid CasoClinicoId,
    /// <summary>Identificador da pergunta.</summary>
    Guid PerguntaId,
    /// <summary>Texto da resposta específica para este caso e pergunta.</summary>
    string TextoResposta,
    /// <summary>Indica se esta resposta deve ser destacada como relevante.</summary>
    bool Destacada
);
