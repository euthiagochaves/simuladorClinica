namespace ClinicaSim.API.DTOs.AchadosFisicosCasos;

/// <summary>
/// Dados de retorno de um achado físico específico de caso clínico.
/// Inclui o nome do achado desnormalizado para facilitar a exibição.
/// </summary>
public record AchadoFisicoCasoResponse(
    /// <summary>Identificador único do achado físico do caso.</summary>
    Guid Id,
    /// <summary>Identificador do caso clínico.</summary>
    Guid CasoClinicoId,
    /// <summary>Identificador do achado físico.</summary>
    Guid AchadoFisicoId,
    /// <summary>Indica se o achado está presente no paciente deste caso.</summary>
    bool Presente,
    /// <summary>Texto com detalhes adicionais sobre o achado neste caso.</summary>
    string? TextoDetalhe,
    /// <summary>Indica se este achado está destacado como relevante.</summary>
    bool Destacado,
    /// <summary>Nome do achado físico associado (desnormalizado para conveniência).</summary>
    string? NomeAchado
);
