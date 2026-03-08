using ClinicaSim.API.Models.Enums;

namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Registro de auditoria para ações administrativas.
/// Rastreia quem fez o quê e quando no sistema.
/// </summary>
public class LogAuditoria
{
    /// <summary>Identificador único do log.</summary>
    public int Id { get; set; }

    /// <summary>Usuário que realizou a ação.</summary>
    public int UsuarioId { get; set; }

    /// <summary>Nome da entidade que foi alterada (ex: "CasoClinico", "Pergunta").</summary>
    public string NomeEntidade { get; set; } = string.Empty;

    /// <summary>Id do registro que foi alterado.</summary>
    public int EntidadeId { get; set; }

    /// <summary>Tipo da ação: Criar, Atualizar, Deletar ou Importar.</summary>
    public TipoAcao TipoAcao { get; set; }

    /// <summary>Valores antigos (JSON serializado, opcional).</summary>
    public string? ValoresAntigos { get; set; }

    /// <summary>Valores novos (JSON serializado, opcional).</summary>
    public string? ValoresNovos { get; set; }

    public DateTime CriadoEm { get; set; }

    // --- Navegação ---
    public Usuario Usuario { get; set; } = null!;
}
