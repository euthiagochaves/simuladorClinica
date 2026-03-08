namespace ClinicaSim.API.DTOs.NotasClinicas;

/// <summary>
/// Item de diagnóstico diferencial com ordem de prioridade.
/// </summary>
public record DiagnosticoDiferencialItem(
    /// <summary>Ordem de prioridade do diagnóstico (1 = mais provável).</summary>
    int OrdemPrioridade,
    /// <summary>Texto descritivo do diagnóstico diferencial.</summary>
    string TextoDiagnostico
);
