namespace ClinicaSim.API.DTOs.Sessoes;

/// <summary>
/// Dados para iniciar uma nova sessão de simulação clínica.
/// </summary>
public record IniciarSessaoRequest(
    /// <summary>Identificador do caso clínico a ser simulado.</summary>
    int CasoClinicoId,
    /// <summary>Identificador do aluno que está realizando a sessão (opcional).</summary>
    int? AlunoId
);
