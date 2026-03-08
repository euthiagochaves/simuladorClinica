namespace ClinicaSim.API.DTOs.NotasClinicas;

/// <summary>
/// Dados para salvar uma nota clínica ao final de uma sessão de simulação.
/// </summary>
public record SalvarNotaClinicaRequest(
    /// <summary>Texto do resumo clínico elaborado pelo aluno.</summary>
    string TextoResumo,
    /// <summary>Texto do diagnóstico provável elaborado pelo aluno.</summary>
    string TextoDiagnosticoProvavel,
    /// <summary>Texto da conduta proposta pelo aluno.</summary>
    string TextoConduta,
    /// <summary>Lista de diagnósticos diferenciais em ordem de prioridade.</summary>
    List<DiagnosticoDiferencialItem> DiagnosticosDiferenciais
);
