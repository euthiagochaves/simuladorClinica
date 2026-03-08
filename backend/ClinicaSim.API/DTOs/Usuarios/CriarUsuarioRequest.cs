namespace ClinicaSim.API.DTOs.Usuarios;

/// <summary>
/// Dados para criar um novo usuário no sistema.
/// </summary>
public record CriarUsuarioRequest(
    /// <summary>Nome completo do usuário.</summary>
    string NomeCompleto,
    /// <summary>E-mail do usuário.</summary>
    string Email,
    /// <summary>Hash da senha (opcional no MVP).</summary>
    string? SenhaHash,
    /// <summary>Perfil: "Aluno", "Professor" ou "Administrador".</summary>
    string Perfil
);
