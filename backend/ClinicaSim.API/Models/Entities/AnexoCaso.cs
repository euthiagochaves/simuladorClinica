namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Arquivo auxiliar anexado a um caso clínico (imagens, PDFs, etc.).
/// Funcionalidade preparada para expansão futura.
/// </summary>
public class AnexoCaso
{
    /// <summary>Identificador único do anexo.</summary>
    public int Id { get; set; }

    /// <summary>Caso clínico ao qual este anexo pertence.</summary>
    public int CasoClinicoId { get; set; }

    /// <summary>Nome do arquivo.</summary>
    public string NomeArquivo { get; set; } = string.Empty;

    /// <summary>Caminho ou URL de armazenamento.</summary>
    public string CaminhoArquivo { get; set; } = string.Empty;

    /// <summary>Tipo do arquivo (ex: "image", "pdf", "yaml").</summary>
    public string TipoArquivo { get; set; } = string.Empty;

    public DateTime CriadoEm { get; set; }

    // --- Navegação ---
    public CasoClinico CasoClinico { get; set; } = null!;
}
