namespace ClinicaSim.API.DTOs.NotasClinicas;

/// <summary>
/// Dados de retorno de uma nota clínica.
/// </summary>
public record NotaClinicaResponse(
    /// <summary>Identificador único da nota clínica.</summary>
    Guid Id,
    /// <summary>Texto do resumo clínico elaborado pelo aluno.</summary>
    string TextoResumo,
    /// <summary>Texto do diagnóstico provável elaborado pelo aluno.</summary>
    string TextoDiagnosticoProvavel,
    /// <summary>Texto da conduta proposta pelo aluno.</summary>
    string TextoConduta,
    /// <summary>Lista de diagnósticos diferenciais em ordem de prioridade.</summary>
    List<DiagnosticoDiferencialItem> DiagnosticosDiferenciais,
    /// <summary>Data e hora de criação da nota clínica.</summary>
    DateTime CriadoEm
);
