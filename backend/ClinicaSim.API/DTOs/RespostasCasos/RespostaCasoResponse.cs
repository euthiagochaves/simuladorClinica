namespace ClinicaSim.API.DTOs.RespostasCasos;

/// <summary>
/// Dados de retorno de uma resposta específica de caso clínico.
/// Inclui o texto da pergunta desnormalizado para facilitar a exibição.
/// </summary>
public record RespostaCasoResponse(
    /// <summary>Identificador único da resposta do caso.</summary>
    Guid Id,
    /// <summary>Identificador do caso clínico.</summary>
    Guid CasoClinicoId,
    /// <summary>Identificador da pergunta.</summary>
    Guid PerguntaId,
    /// <summary>Texto da resposta específica para este caso e pergunta.</summary>
    string TextoResposta,
    /// <summary>Indica se esta resposta está destacada como relevante.</summary>
    bool Destacada,
    /// <summary>Texto da pergunta associada (desnormalizado para conveniência).</summary>
    string? TextoPergunta
);
