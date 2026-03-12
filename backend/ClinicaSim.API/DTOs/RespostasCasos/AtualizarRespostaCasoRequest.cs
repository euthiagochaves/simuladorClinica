namespace ClinicaSim.API.DTOs.RespostasCasos;

/// <summary>
/// Dados para atualizar uma resposta especifica de caso clinico.
/// </summary>
public record AtualizarRespostaCasoRequest(
    /// <summary>Texto da resposta especifica para este caso e pergunta.</summary>
    string TextoResposta,
    /// <summary>Indica se esta resposta deve ser destacada como relevante.</summary>
    bool Destacada
);
