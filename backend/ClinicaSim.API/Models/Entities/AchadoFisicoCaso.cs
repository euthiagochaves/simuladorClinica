namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Achado de exame físico específico de um caso clínico.
/// Quando existe, sobrescreve o resultado padrão do achado global.
/// </summary>
public class AchadoFisicoCaso
{
    /// <summary>Identificador único do registro.</summary>
    public int Id { get; set; }

    /// <summary>Caso clínico ao qual este achado pertence.</summary>
    public int CasoClinicoId { get; set; }

    /// <summary>Achado global que está sendo sobrescrito.</summary>
    public int AchadoFisicoId { get; set; }

    /// <summary>Indica se o achado está presente neste paciente.</summary>
    public bool Presente { get; set; }

    /// <summary>Texto complementar descrevendo o resultado específico.</summary>
    public string? TextoDetalhe { get; set; }

    /// <summary>Indica se este achado é clinicamente relevante ou patológico.</summary>
    public bool Destacado { get; set; }

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    // --- Navegação ---
    public CasoClinico CasoClinico { get; set; } = null!;
    public AchadoFisico AchadoFisico { get; set; } = null!;
}
