using ClinicaSim.API.DTOs.CasosClinicos;

namespace ClinicaSim.API.DTOs.Sessoes;

/// <summary>
/// Dados de retorno de uma sessão de simulação clínica.
/// </summary>
public record SessaoResponse(
    /// <summary>Identificador único da sessão.</summary>
    int Id,
    /// <summary>Identificador do caso clínico associado.</summary>
    int CasoClinicoId,
    /// <summary>Identificador do aluno que realizou a sessão.</summary>
    int? AlunoId,
    /// <summary>Código único da sessão para compartilhamento.</summary>
    string CodigoSessao,
    /// <summary>Data e hora de início da sessão.</summary>
    DateTime IniciadoEm,
    /// <summary>Data e hora de finalização da sessão (nulo se ainda em andamento).</summary>
    DateTime? FinalizadoEm,
    /// <summary>Status da sessão (ex.: "EmAndamento", "Finalizada").</summary>
    string Status,
    /// <summary>Dados resumidos do caso clínico associado.</summary>
    CasoClinicoResumoResponse? CasoClinico
);
