namespace ClinicaSim.API.DTOs.Usuarios;

/// <summary>
/// Dados de retorno de um usuário.
/// </summary>
public record UsuarioResponse(
    /// <summary>Identificador único do usuário.</summary>
    Guid Id,
    /// <summary>Nome completo do usuário.</summary>
    string NomeCompleto,
    /// <summary>E-mail do usuário.</summary>
    string Email,
    /// <summary>Perfil: "Aluno", "Professor" ou "Administrador".</summary>
    string Perfil,
    /// <summary>Indica se o usuário está ativo no sistema.</summary>
    bool Ativo,
    /// <summary>Data e hora de criação do registro.</summary>
    DateTime CriadoEm
);
