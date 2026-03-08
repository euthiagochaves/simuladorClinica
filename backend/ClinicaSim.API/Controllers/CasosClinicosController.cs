using Microsoft.AspNetCore.Mvc;
using ClinicaSim.API.DTOs.CasosClinicos;
using ClinicaSim.API.DTOs.RespostasCasos;
using ClinicaSim.API.DTOs.AchadosFisicosCasos;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Controllers;

/// <summary>
/// Controlador responsavel pelo gerenciamento de casos clinicos.
/// Permite criar, consultar, atualizar e remover casos clinicos,
/// alem de gerenciar respostas de perguntas e achados fisicos vinculados.
/// </summary>
[ApiController]
[Route("api/casos-clinicos")]
public class CasosClinicosController : ControllerBase
{
    private readonly ICasoClinicoService _casoClinicoService;

    /// <summary>
    /// Inicializa uma nova instancia do controlador de casos clinicos.
    /// </summary>
    /// <param name="casoClinicoService">Servico de gerenciamento de casos clinicos.</param>
    public CasosClinicosController(ICasoClinicoService casoClinicoService)
    {
        _casoClinicoService = casoClinicoService;
    }

    /// <summary>
    /// Obtem todos os casos clinicos cadastrados.
    /// </summary>
    /// <param name="apenasAtivos">Se verdadeiro, retorna apenas casos ativos. Padrao: true.</param>
    /// <returns>Lista de casos clinicos resumidos.</returns>
    /// <response code="200">Lista de casos clinicos retornada com sucesso.</response>
    [HttpGet]
    [ProducesResponseType(typeof(List<CasoClinicoResumoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<CasoClinicoResumoResponse>>> ObterTodos([FromQuery] bool apenasAtivos = true)
    {
        var casos = await _casoClinicoService.ObterTodosAsync(apenasAtivos);
        return Ok(casos);
    }

    /// <summary>
    /// Obtem um caso clinico pelo seu identificador.
    /// </summary>
    /// <param name="id">Identificador do caso clinico.</param>
    /// <returns>Dados completos do caso clinico.</returns>
    /// <response code="200">Caso clinico encontrado com sucesso.</response>
    /// <response code="404">Caso clinico nao encontrado.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(CasoClinicoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<CasoClinicoResponse>> ObterPorId(int id)
    {
        var caso = await _casoClinicoService.ObterPorIdAsync(id);

        if (caso is null)
            return NotFound();

        return Ok(caso);
    }

    /// <summary>
    /// Cria um novo caso clinico.
    /// </summary>
    /// <param name="request">Dados para criacao do caso clinico.</param>
    /// <returns>Dados do caso clinico criado.</returns>
    /// <response code="201">Caso clinico criado com sucesso.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPost]
    [ProducesResponseType(typeof(CasoClinicoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CasoClinicoResponse>> Criar([FromBody] CriarCasoClinicoRequest request)
    {
        var caso = await _casoClinicoService.CriarAsync(request);
        return CreatedAtAction(nameof(ObterPorId), new { id = caso.Id }, caso);
    }

    /// <summary>
    /// Atualiza os dados de um caso clinico existente.
    /// </summary>
    /// <param name="id">Identificador do caso clinico.</param>
    /// <param name="request">Dados atualizados do caso clinico.</param>
    /// <returns>Dados do caso clinico atualizado.</returns>
    /// <response code="200">Caso clinico atualizado com sucesso.</response>
    /// <response code="404">Caso clinico nao encontrado.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPut("{id}")]
    [ProducesResponseType(typeof(CasoClinicoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<CasoClinicoResponse>> Atualizar(int id, [FromBody] AtualizarCasoClinicoRequest request)
    {
        var caso = await _casoClinicoService.AtualizarAsync(id, request);

        if (caso is null)
            return NotFound();

        return Ok(caso);
    }

    /// <summary>
    /// Remove (desativa) um caso clinico.
    /// </summary>
    /// <param name="id">Identificador do caso clinico.</param>
    /// <returns>Sem conteudo em caso de sucesso.</returns>
    /// <response code="204">Caso clinico removido com sucesso.</response>
    /// <response code="404">Caso clinico nao encontrado.</response>
    [HttpDelete("{id}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Deletar(int id)
    {
        var removido = await _casoClinicoService.DeletarAsync(id);

        if (!removido)
            return NotFound();

        return NoContent();
    }

    /// <summary>
    /// Obtem todas as respostas de perguntas vinculadas a um caso clinico.
    /// </summary>
    /// <param name="id">Identificador do caso clinico.</param>
    /// <returns>Lista de respostas de perguntas do caso.</returns>
    /// <response code="200">Lista de respostas retornada com sucesso.</response>
    [HttpGet("{id}/respostas")]
    [ProducesResponseType(typeof(List<RespostaCasoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<RespostaCasoResponse>>> ObterRespostasCaso(int id)
    {
        var respostas = await _casoClinicoService.ObterRespostasCasoAsync(id);
        return Ok(respostas);
    }

    /// <summary>
    /// Adiciona uma resposta de pergunta a um caso clinico.
    /// </summary>
    /// <param name="id">Identificador do caso clinico.</param>
    /// <param name="request">Dados da resposta a ser adicionada.</param>
    /// <returns>Dados da resposta criada.</returns>
    /// <response code="201">Resposta adicionada com sucesso.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPost("{id}/respostas")]
    [ProducesResponseType(typeof(RespostaCasoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<RespostaCasoResponse>> AdicionarRespostaCaso(int id, [FromBody] CriarRespostaCasoRequest request)
    {
        var resposta = await _casoClinicoService.AdicionarRespostaCasoAsync(id, request);
        return Created($"api/casos-clinicos/{id}/respostas/{resposta.Id}", resposta);
    }

    /// <summary>
    /// Obtem todos os achados fisicos vinculados a um caso clinico.
    /// </summary>
    /// <param name="id">Identificador do caso clinico.</param>
    /// <returns>Lista de achados fisicos do caso.</returns>
    /// <response code="200">Lista de achados fisicos retornada com sucesso.</response>
    [HttpGet("{id}/achados-fisicos")]
    [ProducesResponseType(typeof(List<AchadoFisicoCasoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<AchadoFisicoCasoResponse>>> ObterAchadosFisicosCaso(int id)
    {
        var achados = await _casoClinicoService.ObterAchadosFisicosCasoAsync(id);
        return Ok(achados);
    }

    /// <summary>
    /// Adiciona um achado fisico a um caso clinico.
    /// </summary>
    /// <param name="id">Identificador do caso clinico.</param>
    /// <param name="request">Dados do achado fisico a ser adicionado.</param>
    /// <returns>Dados do achado fisico criado.</returns>
    /// <response code="201">Achado fisico adicionado com sucesso.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPost("{id}/achados-fisicos")]
    [ProducesResponseType(typeof(AchadoFisicoCasoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<AchadoFisicoCasoResponse>> AdicionarAchadoFisicoCaso(int id, [FromBody] CriarAchadoFisicoCasoRequest request)
    {
        var achado = await _casoClinicoService.AdicionarAchadoFisicoCasoAsync(id, request);
        return Created($"api/casos-clinicos/{id}/achados-fisicos/{achado.Id}", achado);
    }
}
