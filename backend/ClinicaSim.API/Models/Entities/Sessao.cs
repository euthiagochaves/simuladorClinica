using ClinicaSim.API.Models.Enums;

namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Sessão de atendimento realizada por um aluno.
/// Cada atendimento gera uma sessão com código único.
/// Registra todas as interações, notas clínicas e diagnósticos.
/// </summary>
public class Sessao
{
    /// <summary>Identificador único da sessão.</summary>
    public int Id { get; set; }

    /// <summary>Caso clínico que está sendo atendido.</summary>
    public int CasoClinicoId { get; set; }

    /// <summary>Aluno que está realizando o atendimento (opcional no MVP).</summary>
    public int? AlunoId { get; set; }

    /// <summary>Código único da sessão para recuperação e exportação (ex: "WZDRGPAED").</summary>
    public string CodigoSessao { get; set; } = string.Empty;

    /// <summary>Data e hora de início do atendimento.</summary>
    public DateTime IniciadoEm { get; set; }

    /// <summary>Data e hora de finalização (null se ainda em andamento).</summary>
    public DateTime? FinalizadoEm { get; set; }

    /// <summary>Estado atual: Iniciada, EmAndamento ou Finalizada.</summary>
    public StatusSessao Status { get; set; }

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    // --- Navegação ---
    public CasoClinico CasoClinico { get; set; } = null!;
    public Usuario? Aluno { get; set; }

    /// <summary>Todos os eventos/interações registrados durante o atendimento.</summary>
    public ICollection<EventoSessao> Eventos { get; set; } = new List<EventoSessao>();

    /// <summary>História clínica escrita pelo aluno (1:1).</summary>
    public NotaClinica? NotaClinica { get; set; }

    /// <summary>Diagnósticos diferenciais informados pelo aluno.</summary>
    public ICollection<DiagnosticoDiferencial> DiagnosticosDiferenciais { get; set; } = new List<DiagnosticoDiferencial>();

    /// <summary>PDF gerado após finalização (1:1).</summary>
    public SessaoPdf? Pdf { get; set; }
}
