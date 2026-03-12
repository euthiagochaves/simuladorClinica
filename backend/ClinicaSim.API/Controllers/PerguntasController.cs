using Microsoft.AspNetCore.Mvc;
using ClinicaSim.API.DTOs.Perguntas;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Controllers;

/// <summary>
/// Controlador responsavel pelo gerenciamento do banco de perguntas.
/// Permite criar, consultar, atualizar e remover perguntas disponiveis para os casos clinicos.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PerguntasController : ControllerBase
{
    private readonly IPerguntaService _perguntaService;

    /// <summary>
    /// Inicializa uma nova instancia do controlador de perguntas.
    /// </summary>
    /// <param name="perguntaService">Servico de gerenciamento de perguntas.</param>
    public PerguntasController(IPerguntaService perguntaService)
    {
        _perguntaService = perguntaService;
    }

    /// <summary>
    /// Obtem todas as perguntas cadastradas.
    /// </summary>
    /// <param name="apenasAtivas">Se verdadeiro, retorna apenas perguntas ativas. Padrao: true.</param>
    /// <param name="casoClinicoId">Se informado, inclui tambem perguntas especificas deste caso clinico.</param>
    /// <returns>Lista de perguntas.</returns>
    /// <response code="200">Lista de perguntas retornada com sucesso.</response>
    [HttpGet]
    [ProducesResponseType(typeof(List<PerguntaResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<PerguntaResponse>>> ObterTodas(
        [FromQuery] bool apenasAtivas = true,
        [FromQuery] int? casoClinicoId = null)
    {
        var perguntas = await _perguntaService.ObterTodasAsync(apenasAtivas, casoClinicoId);
        return Ok(perguntas);
    }

    /// <summary>
    /// Obtem uma pergunta pelo seu identificador.
    /// </summary>
    /// <param name="id">Identificador da pergunta.</param>
    /// <returns>Dados da pergunta encontrada.</returns>
    /// <response code="200">Pergunta encontrada com sucesso.</response>
    /// <response code="404">Pergunta nao encontrada.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(PerguntaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<PerguntaResponse>> ObterPorId(int id)
    {
        var pergunta = await _perguntaService.ObterPorIdAsync(id);

        if (pergunta is null)
            return NotFound();

        return Ok(pergunta);
    }

    /// <summary>
    /// Cria uma nova pergunta no banco de perguntas.
    /// </summary>
    /// <param name="request">Dados para criacao da pergunta.</param>
    /// <returns>Dados da pergunta criada.</returns>
    /// <response code="201">Pergunta criada com sucesso.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPost]
    [ProducesResponseType(typeof(PerguntaResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PerguntaResponse>> Criar([FromBody] CriarPerguntaRequest request)
    {
        var pergunta = await _perguntaService.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = pergunta.Id }, pergunta);
    }

    /// <summary>
    /// Atualiza os dados de uma pergunta existente.
    /// </summary>
    /// <param name="id">Identificador da pergunta.</param>
    /// <param name="request">Dados atualizados da pergunta.</param>
    /// <returns>Dados da pergunta atualizada.</returns>
    /// <response code="200">Pergunta atualizada com sucesso.</response>
    /// <response code="404">Pergunta nao encontrada.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(PerguntaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<PerguntaResponse>> Atualizar(int id, [FromBody] AtualizarPerguntaRequest request)
    {
        var pergunta = await _perguntaService.AtualizarAsync(id, request);

        if (pergunta is null)
            return NotFound();

        return Ok(pergunta);
    }

    /// <summary>
    /// Remove (desativa) uma pergunta do banco de perguntas.
    /// </summary>
    /// <param name="id">Identificador da pergunta.</param>
    /// <returns>Sem conteudo em caso de sucesso.</returns>
    /// <response code="204">Pergunta removida com sucesso.</response>
    /// <response code="404">Pergunta nao encontrada.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deletar(int id)
    {
        var removida = await _perguntaService.DeletarAsync(id);

        if (!removida)
            return NotFound();

        return NoContent();
    }
}
