namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Achado do banco global de exame físico.
/// Representa uma manobra, observação ou resultado de exame.
/// Cada achado possui um resultado padrão (paciente saudável).
/// Casos clínicos podem sobrescrever com resultados patológicos.
/// </summary>
public class AchadoFisico
{
    /// <summary>Identificador único do achado.</summary>
    public int Id { get; set; }

    /// <summary>Nome do achado ou manobra (ex: "Signo de rebote").</summary>
    public string Nome { get; set; } = string.Empty;

    /// <summary>Sistema clínico ao qual pertence (ex: "Respiratorio", "Cardiovascular").</summary>
    public string SistemaCategoria { get; set; } = string.Empty;

    /// <summary>Descrição opcional do achado ou manobra.</summary>
    public string? Descricao { get; set; }

    /// <summary>
    /// Resultado padrão para paciente sem patologia.
    /// Se o caso não sobrescrever, este resultado é usado.
    /// </summary>
    public string ResultadoPadrao { get; set; } = string.Empty;

    /// <summary>Indica se o achado está ativo e disponível.</summary>
    public bool Ativo { get; set; } = true;

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    // --- Navegação ---

    /// <summary>Achados específicos que casos clínicos definiram.</summary>
    public ICollection<AchadoFisicoCaso> AchadosCasos { get; set; } = new List<AchadoFisicoCaso>();
}
