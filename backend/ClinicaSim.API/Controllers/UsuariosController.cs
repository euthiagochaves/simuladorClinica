using Microsoft.AspNetCore.Mvc;
using ClinicaSim.API.DTOs.Usuarios;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Controllers;

/// <summary>
/// Controlador responsavel pelo gerenciamento de usuarios do sistema.
/// Permite criar, consultar, atualizar e remover usuarios.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsuariosController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    /// <summary>
    /// Inicializa uma nova instancia do controlador de usuarios.
    /// </summary>
    /// <param name="usuarioService">Servico de gerenciamento de usuarios.</param>
    public UsuariosController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    /// <summary>
    /// Obtem todos os usuarios cadastrados no sistema.
    /// </summary>
    /// <returns>Lista de usuarios.</returns>
    /// <response code="200">Lista de usuarios retornada com sucesso.</response>
    [HttpGet]
    [ProducesResponseType(typeof(List<UsuarioResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<UsuarioResponse>>> ObterTodos()
    {
        var usuarios = await _usuarioService.ObterTodosAsync();
        return Ok(usuarios);
    }

    /// <summary>
    /// Obtem um usuario pelo seu identificador.
    /// </summary>
    /// <param name="id">Identificador do usuario.</param>
    /// <returns>Dados do usuario encontrado.</returns>
    /// <response code="200">Usuario encontrado com sucesso.</response>
    /// <response code="404">Usuario nao encontrado.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(UsuarioResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<UsuarioResponse>> ObterPorId(int id)
    {
        var usuario = await _usuarioService.ObterPorIdAsync(id);

        if (usuario is null)
            return NotFound();

        return Ok(usuario);
    }

    /// <summary>
    /// Cria um novo usuario no sistema.
    /// </summary>
    /// <param name="request">Dados para criacao do usuario.</param>
    /// <returns>Dados do usuario criado.</returns>
    /// <response code="201">Usuario criado com sucesso.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPost]
    [ProducesResponseType(typeof(UsuarioResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UsuarioResponse>> Criar([FromBody] CriarUsuarioRequest request)
    {
        var usuario = await _usuarioService.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = usuario.Id }, usuario);
    }

    /// <summary>
    /// Atualiza os dados de um usuario existente.
    /// </summary>
    /// <param name="id">Identificador do usuario.</param>
    /// <param name="request">Dados atualizados do usuario.</param>
    /// <returns>Dados do usuario atualizado.</returns>
    /// <response code="200">Usuario atualizado com sucesso.</response>
    /// <response code="404">Usuario nao encontrado.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(UsuarioResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<UsuarioResponse>> Atualizar(int id, [FromBody] AtualizarUsuarioRequest request)
    {
        var usuario = await _usuarioService.AtualizarAsync(id, request);

        if (usuario is null)
            return NotFound();

        return Ok(usuario);
    }

    /// <summary>
    /// Remove (desativa) um usuario do sistema.
    /// </summary>
    /// <param name="id">Identificador do usuario.</param>
    /// <returns>Sem conteudo em caso de sucesso.</returns>
    /// <response code="204">Usuario removido com sucesso.</response>
    /// <response code="404">Usuario nao encontrado.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deletar(int id)
    {
        var removido = await _usuarioService.DeletarAsync(id);

        if (!removido)
            return NotFound();

        return NoContent();
    }
}
