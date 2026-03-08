namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Diagnóstico diferencial informado pelo aluno.
/// O aluno deve registrar 5 diagnósticos em ordem de prioridade clínica.
/// </summary>
public class DiagnosticoDiferencial
{
    /// <summary>Identificador único do diagnóstico diferencial.</summary>
    public int Id { get; set; }

    /// <summary>Sessão à qual este diagnóstico pertence.</summary>
    public int SessaoId { get; set; }

    /// <summary>Ordem de prioridade (1 = mais provável, 5 = menos provável).</summary>
    public int OrdemPrioridade { get; set; }

    /// <summary>Texto do diagnóstico diferencial (ex: "Apendicitis aguda").</summary>
    public string TextoDiagnostico { get; set; } = string.Empty;

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    // --- Navegação ---
    public Sessao Sessao { get; set; } = null!;
}
