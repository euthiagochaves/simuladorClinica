using Microsoft.AspNetCore.Mvc;
using ClinicaSim.API.DTOs.AchadosFisicos;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Controllers;

/// <summary>
/// Controlador responsavel pelo gerenciamento do banco de achados fisicos.
/// Permite criar, consultar, atualizar e remover achados fisicos disponiveis para os casos clinicos.
/// </summary>
[ApiController]
[Route("api/achados-fisicos")]
public class AchadosFisicosController : ControllerBase
{
    private readonly IAchadoFisicoService _achadoFisicoService;

    /// <summary>
    /// Inicializa uma nova instancia do controlador de achados fisicos.
    /// </summary>
    /// <param name="achadoFisicoService">Servico de gerenciamento de achados fisicos.</param>
    public AchadosFisicosController(IAchadoFisicoService achadoFisicoService)
    {
        _achadoFisicoService = achadoFisicoService;
    }

    /// <summary>
    /// Obtem todos os achados fisicos cadastrados.
    /// </summary>
    /// <param name="apenasAtivos">Se verdadeiro, retorna apenas achados ativos. Padrao: true.</param>
    /// <returns>Lista de achados fisicos.</returns>
    /// <response code="200">Lista de achados fisicos retornada com sucesso.</response>
    [HttpGet]
    [ProducesResponseType(typeof(List<AchadoFisicoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<AchadoFisicoResponse>>> ObterTodos([FromQuery] bool apenasAtivos = true)
    {
        var achados = await _achadoFisicoService.ObterTodosAsync(apenasAtivos);
        return Ok(achados);
    }

    /// <summary>
    /// Obtem um achado fisico pelo seu identificador.
    /// </summary>
    /// <param name="id">Identificador do achado fisico.</param>
    /// <returns>Dados do achado fisico encontrado.</returns>
    /// <response code="200">Achado fisico encontrado com sucesso.</response>
    /// <response code="404">Achado fisico nao encontrado.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(AchadoFisicoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<AchadoFisicoResponse>> ObterPorId(int id)
    {
        var achado = await _achadoFisicoService.ObterPorIdAsync(id);

        if (achado is null)
            return NotFound();

        return Ok(achado);
    }

    /// <summary>
    /// Cria um novo achado fisico no banco de achados.
    /// </summary>
    /// <param name="request">Dados para criacao do achado fisico.</param>
    /// <returns>Dados do achado fisico criado.</returns>
    /// <response code="201">Achado fisico criado com sucesso.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPost]
    [ProducesResponseType(typeof(AchadoFisicoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AchadoFisicoResponse>> Criar([FromBody] CriarAchadoFisicoRequest request)
    {
        var achado = await _achadoFisicoService.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = achado.Id }, achado);
    }

    /// <summary>
    /// Atualiza os dados de um achado fisico existente.
    /// </summary>
    /// <param name="id">Identificador do achado fisico.</param>
    /// <param name="request">Dados atualizados do achado fisico.</param>
    /// <returns>Dados do achado fisico atualizado.</returns>
    /// <response code="200">Achado fisico atualizado com sucesso.</response>
    /// <response code="404">Achado fisico nao encontrado.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(AchadoFisicoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AchadoFisicoResponse>> Atualizar(int id, [FromBody] AtualizarAchadoFisicoRequest request)
    {
        var achado = await _achadoFisicoService.AtualizarAsync(id, request);

        if (achado is null)
            return NotFound();

        return Ok(achado);
    }

    /// <summary>
    /// Remove (desativa) um achado fisico do banco de achados.
    /// </summary>
    /// <param name="id">Identificador do achado fisico.</param>
    /// <returns>Sem conteudo em caso de sucesso.</returns>
    /// <response code="204">Achado fisico removido com sucesso.</response>
    /// <response code="404">Achado fisico nao encontrado.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deletar(int id)
    {
        var removido = await _achadoFisicoService.DeletarAsync(id);

        if (!removido)
            return NotFound();

        return NoContent();
    }
}
