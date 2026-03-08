using ClinicaSim.API.DTOs.Usuarios;

namespace ClinicaSim.API.Services.Interfaces;

/// <summary>
/// Contrato do serviço de gerenciamento de usuários.
/// </summary>
public interface IUsuarioService
{
    /// <summary>Obtém todos os usuários cadastrados no sistema.</summary>
    Task<List<UsuarioResponse>> ObterTodosAsync();

    /// <summary>Obtém um usuário pelo seu identificador.</summary>
    /// <param name="id">Identificador do usuário.</param>
    Task<UsuarioResponse?> ObterPorIdAsync(int id);

    /// <summary>Cria um novo usuário no sistema.</summary>
    /// <param name="request">Dados para criação do usuário.</param>
    Task<UsuarioResponse> CriarAsync(CriarUsuarioRequest request);

    /// <summary>Atualiza os dados de um usuário existente.</summary>
    /// <param name="id">Identificador do usuário.</param>
    /// <param name="request">Dados atualizados do usuário.</param>
    Task<UsuarioResponse?> AtualizarAsync(int id, AtualizarUsuarioRequest request);

    /// <summary>Remove (soft delete) um usuário do sistema.</summary>
    /// <param name="id">Identificador do usuário.</param>
    Task<bool> DeletarAsync(int id);
}
