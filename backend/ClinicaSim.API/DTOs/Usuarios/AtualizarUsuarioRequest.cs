namespace ClinicaSim.API.DTOs.Usuarios;

/// <summary>
/// Dados para atualizar um usuário existente.
/// </summary>
public record AtualizarUsuarioRequest(
    /// <summary>Nome completo do usuário.</summary>
    string NomeCompleto,
    /// <summary>E-mail do usuário.</summary>
    string Email,
    /// <summary>Perfil: "Aluno", "Professor" ou "Administrador".</summary>
    string Perfil,
    /// <summary>Indica se o usuário está ativo no sistema.</summary>
    bool Ativo
);
