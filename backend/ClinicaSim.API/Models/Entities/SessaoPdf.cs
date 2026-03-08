namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Referência ao PDF gerado após finalização de uma sessão.
/// O PDF contém todos os dados do atendimento: interações, notas e diagnósticos.
/// </summary>
public class SessaoPdf
{
    /// <summary>Identificador único do PDF.</summary>
    public int Id { get; set; }

    /// <summary>Sessão associada a este PDF.</summary>
    public int SessaoId { get; set; }

    /// <summary>Nome do arquivo PDF gerado.</summary>
    public string NomeArquivo { get; set; } = string.Empty;

    /// <summary>Caminho ou URL onde o PDF está armazenado.</summary>
    public string CaminhoArquivo { get; set; } = string.Empty;

    /// <summary>Data e hora em que o PDF foi gerado.</summary>
    public DateTime GeradoEm { get; set; }

    // --- Navegação ---
    public Sessao Sessao { get; set; } = null!;
}
