using ClinicaSim.API.Models.Enums;

namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Usuário do sistema. Pode ser Aluno, Professor ou Administrador.
/// No MVP, a autenticação é opcional — a tabela existe para uso futuro.
/// </summary>
public class Usuario
{
    /// <summary>Identificador único do usuário.</summary>
    public int Id { get; set; }

    /// <summary>Nome completo do usuário.</summary>
    public string NomeCompleto { get; set; } = string.Empty;

    /// <summary>E-mail do usuário (pode ser único).</summary>
    public string Email { get; set; } = string.Empty;

    /// <summary>Hash da senha para futuro login.</summary>
    public string? SenhaHash { get; set; }

    /// <summary>Perfil de acesso: Aluno, Professor ou Administrador.</summary>
    public PerfilUsuario Perfil { get; set; }

    /// <summary>Indica se o usuário está ativo no sistema.</summary>
    public bool Ativo { get; set; } = true;

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    // --- Navegação ---

    /// <summary>Casos clínicos criados por este usuário (se Professor/Admin).</summary>
    public ICollection<CasoClinico> CasosCriados { get; set; } = new List<CasoClinico>();

    /// <summary>Sessões de atendimento realizadas (se Aluno).</summary>
    public ICollection<Sessao> Sessoes { get; set; } = new List<Sessao>();

    /// <summary>Registros de auditoria gerados por este usuário.</summary>
    public ICollection<LogAuditoria> LogsAuditoria { get; set; } = new List<LogAuditoria>();

    /// <summary>Importações de casos realizadas por este usuário.</summary>
    public ICollection<LogImportacaoCaso> LogsImportacao { get; set; } = new List<LogImportacaoCaso>();
}
