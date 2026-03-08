namespace ClinicaSim.API.Models.Enums;

/// <summary>
/// Perfil de acesso do usuário no sistema.
/// </summary>
public enum PerfilUsuario
{
    /// <summary>Aluno — realiza atendimentos simulados.</summary>
    Aluno,

    /// <summary>Professor — cria e gerencia casos clínicos.</summary>
    Professor,

    /// <summary>Administrador — gerencia todo o sistema.</summary>
    Administrador
}
