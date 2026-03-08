using Microsoft.EntityFrameworkCore;
using ClinicaSim.API.Data;
using ClinicaSim.API.DTOs.Usuarios;
using ClinicaSim.API.Models.Entities;
using ClinicaSim.API.Models.Enums;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Services;

/// <summary>
/// Implementação do serviço de gerenciamento de usuários.
/// Responsável por operações CRUD sobre a entidade <see cref="Usuario"/>.
/// </summary>
public class UsuarioService : IUsuarioService
{
    private readonly ClinicaSimDbContext _contexto;

    /// <summary>
    /// Inicializa uma nova instância de <see cref="UsuarioService"/>.
    /// </summary>
    /// <param name="contexto">Contexto do banco de dados.</param>
    public UsuarioService(ClinicaSimDbContext contexto)
    {
        _contexto = contexto;
    }

    /// <inheritdoc />
    public async Task<List<UsuarioResponse>> ObterTodosAsync()
    {
        var usuarios = await _contexto.Usuarios
            .AsNoTracking()
            .OrderBy(u => u.NomeCompleto)
            .ToListAsync();

        return usuarios.Select(MapearParaResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<UsuarioResponse?> ObterPorIdAsync(int id)
    {
        var usuario = await _contexto.Usuarios
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Id == id);

        return usuario is null ? null : MapearParaResponse(usuario);
    }

    /// <inheritdoc />
    public async Task<UsuarioResponse> CriarAsync(CriarUsuarioRequest request)
    {
        var perfil = Enum.Parse<PerfilUsuario>(request.Perfil, ignoreCase: true);

        var usuario = new Usuario
        {
            NomeCompleto = request.NomeCompleto,
            Email = request.Email,
            SenhaHash = request.SenhaHash,
            Perfil = perfil,
            Ativo = true
        };

        _contexto.Usuarios.Add(usuario);
        await _contexto.SaveChangesAsync();

        return MapearParaResponse(usuario);
    }

    /// <inheritdoc />
    public async Task<UsuarioResponse?> AtualizarAsync(int id, AtualizarUsuarioRequest request)
    {
        var usuario = await _contexto.Usuarios.FindAsync(id);
        if (usuario is null)
            return null;

        var perfil = Enum.Parse<PerfilUsuario>(request.Perfil, ignoreCase: true);

        usuario.NomeCompleto = request.NomeCompleto;
        usuario.Email = request.Email;
        usuario.Perfil = perfil;
        usuario.Ativo = request.Ativo;

        await _contexto.SaveChangesAsync();

        return MapearParaResponse(usuario);
    }

    /// <inheritdoc />
    public async Task<bool> DeletarAsync(int id)
    {
        var usuario = await _contexto.Usuarios.FindAsync(id);
        if (usuario is null)
            return false;

        // Soft delete: desativa o usuário em vez de remover do banco
        usuario.Ativo = false;
        await _contexto.SaveChangesAsync();

        return true;
    }

    // =====================================================================
    // Métodos auxiliares de mapeamento
    // =====================================================================

    /// <summary>
    /// Converte um identificador inteiro em um Guid determinístico.
    /// Utilizado para manter compatibilidade com os DTOs que usam Guid.
    /// </summary>
    private static Guid IntParaGuid(int id)
    {
        var bytes = new byte[16];
        BitConverter.GetBytes(id).CopyTo(bytes, 0);
        return new Guid(bytes);
    }

    /// <summary>
    /// Mapeia uma entidade <see cref="Usuario"/> para o DTO <see cref="UsuarioResponse"/>.
    /// </summary>
    private static UsuarioResponse MapearParaResponse(Usuario usuario)
    {
        return new UsuarioResponse(
            Id: IntParaGuid(usuario.Id),
            NomeCompleto: usuario.NomeCompleto,
            Email: usuario.Email,
            Perfil: usuario.Perfil.ToString(),
            Ativo: usuario.Ativo,
            CriadoEm: usuario.CriadoEm
        );
    }
}
