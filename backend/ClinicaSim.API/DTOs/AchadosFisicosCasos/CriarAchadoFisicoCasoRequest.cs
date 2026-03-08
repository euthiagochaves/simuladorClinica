namespace ClinicaSim.API.DTOs.AchadosFisicosCasos;

/// <summary>
/// Dados para criar um achado físico específico de um caso clínico.
/// </summary>
public record CriarAchadoFisicoCasoRequest(
    /// <summary>Identificador do caso clínico.</summary>
    Guid CasoClinicoId,
    /// <summary>Identificador do achado físico.</summary>
    Guid AchadoFisicoId,
    /// <summary>Indica se o achado está presente no paciente deste caso.</summary>
    bool Presente,
    /// <summary>Texto com detalhes adicionais sobre o achado neste caso (opcional).</summary>
    string? TextoDetalhe,
    /// <summary>Indica se este achado deve ser destacado como relevante.</summary>
    bool Destacado
);
