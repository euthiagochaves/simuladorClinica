namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// História clínica escrita pelo aluno durante a sessão.
/// Contém o resumo do caso, diagnóstico provável e conduta.
/// Todos os campos são obrigatórios para finalizar o atendimento.
/// </summary>
public class NotaClinica
{
    /// <summary>Identificador único do registro.</summary>
    public int Id { get; set; }

    /// <summary>Sessão à qual esta nota pertence.</summary>
    public int SessaoId { get; set; }

    /// <summary>Resumo do caso escrito pelo aluno (obrigatório).</summary>
    public string TextoResumo { get; set; } = string.Empty;

    /// <summary>Diagnóstico mais provável segundo o aluno (obrigatório).</summary>
    public string TextoDiagnosticoProvavel { get; set; } = string.Empty;

    /// <summary>Conduta clínica proposta pelo aluno (obrigatório).</summary>
    public string TextoConduta { get; set; } = string.Empty;

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    // --- Navegação ---
    public Sessao Sessao { get; set; } = null!;
}
