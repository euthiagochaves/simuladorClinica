using Microsoft.AspNetCore.Mvc;
using ClinicaSim.API.DTOs.Sessoes;
using ClinicaSim.API.DTOs.NotasClinicas;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Controllers;

/// <summary>
/// Controlador responsavel pelo gerenciamento de sessoes de simulacao clinica.
/// Este e o controlador mais importante do sistema, pois orquestra todo o fluxo
/// de atendimento: inicio da sessao, perguntas, achados fisicos, notas clinicas e finalizacao.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class SessoesController : ControllerBase
{
    private readonly ISessaoService _sessaoService;
    private readonly INotaClinicaService _notaClinicaService;

    /// <summary>
    /// Inicializa uma nova instancia do controlador de sessoes.
    /// </summary>
    /// <param name="sessaoService">Servico de gerenciamento de sessoes.</param>
    /// <param name="notaClinicaService">Servico de gerenciamento de notas clinicas.</param>
    public SessoesController(ISessaoService sessaoService, INotaClinicaService notaClinicaService)
    {
        _sessaoService = sessaoService;
        _notaClinicaService = notaClinicaService;
    }

    /// <summary>
    /// Inicia uma nova sessao de simulacao clinica.
    /// Cria uma sessao vinculada a um caso clinico e gera um codigo unico para compartilhamento.
    /// </summary>
    /// <param name="request">Dados para inicio da sessao, incluindo o caso clinico e opcionalmente o aluno.</param>
    /// <returns>Dados da sessao criada com o codigo unico gerado.</returns>
    /// <response code="201">Sessao iniciada com sucesso.</response>
    /// <response code="400">Dados invalidos na requisicao (ex.: caso clinico inexistente).</response>
    [HttpPost]
    [ProducesResponseType(typeof(SessaoResponse), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SessaoResponse>> IniciarSessao([FromBody] IniciarSessaoRequest request)
    {
        var sessao = await _sessaoService.IniciarSessaoAsync(request);
        return CreatedAtAction(nameof(ObterSessao), new { id = sessao.Id }, sessao);
    }

    /// <summary>
    /// Obtem uma sessao pelo seu identificador.
    /// </summary>
    /// <param name="id">Identificador da sessao.</param>
    /// <returns>Dados da sessao encontrada, incluindo dados resumidos do caso clinico.</returns>
    /// <response code="200">Sessao encontrada com sucesso.</response>
    /// <response code="404">Sessao nao encontrada.</response>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(SessaoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SessaoResponse>> ObterSessao(int id)
    {
        var sessao = await _sessaoService.ObterSessaoAsync(id);

        if (sessao is null)
            return NotFound();

        return Ok(sessao);
    }

    /// <summary>
    /// Obtem uma sessao pelo seu codigo unico de compartilhamento.
    /// Util para recuperar sessoes sem conhecer o identificador interno.
    /// </summary>
    /// <param name="codigo">Codigo unico da sessao (ex.: "WZDRGPAED").</param>
    /// <returns>Dados da sessao encontrada.</returns>
    /// <response code="200">Sessao encontrada com sucesso.</response>
    /// <response code="404">Sessao com o codigo informado nao encontrada.</response>
    [HttpGet("codigo/{codigo}")]
    [ProducesResponseType(typeof(SessaoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<SessaoResponse>> ObterSessaoPorCodigo(string codigo)
    {
        var sessao = await _sessaoService.ObterSessaoPorCodigoAsync(codigo);

        if (sessao is null)
            return NotFound();

        return Ok(sessao);
    }

    /// <summary>
    /// Registra uma pergunta feita pelo aluno durante a sessao de simulacao.
    /// O sistema retorna a resposta correspondente ao caso clinico em andamento.
    /// </summary>
    /// <param name="id">Identificador da sessao.</param>
    /// <param name="request">Dados da pergunta realizada, contendo o identificador da pergunta selecionada.</param>
    /// <returns>Resposta da interacao contendo o texto da resposta do paciente simulado.</returns>
    /// <response code="200">Pergunta registrada e resposta retornada com sucesso.</response>
    /// <response code="400">Dados invalidos (ex.: sessao finalizada ou pergunta inexistente).</response>
    /// <response code="404">Sessao nao encontrada.</response>
    [HttpPost("{id}/perguntas")]
    [ProducesResponseType(typeof(RespostaInteracaoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespostaInteracaoResponse>> FazerPergunta(int id, [FromBody] FazerPerguntaRequest request)
    {
        var resposta = await _sessaoService.FazerPerguntaAsync(id, request);
        return Ok(resposta);
    }

    /// <summary>
    /// Registra a selecao de um achado fisico pelo aluno durante a sessao de simulacao.
    /// O sistema retorna o resultado do exame fisico correspondente ao caso clinico.
    /// </summary>
    /// <param name="id">Identificador da sessao.</param>
    /// <param name="request">Dados do achado selecionado, contendo o identificador do achado fisico.</param>
    /// <returns>Resposta da interacao contendo o resultado do exame fisico.</returns>
    /// <response code="200">Achado fisico registrado e resultado retornado com sucesso.</response>
    /// <response code="400">Dados invalidos (ex.: sessao finalizada ou achado inexistente).</response>
    /// <response code="404">Sessao nao encontrada.</response>
    [HttpPost("{id}/achados")]
    [ProducesResponseType(typeof(RespostaInteracaoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<RespostaInteracaoResponse>> SelecionarAchado(int id, [FromBody] SelecionarAchadoRequest request)
    {
        var resposta = await _sessaoService.SelecionarAchadoAsync(id, request);
        return Ok(resposta);
    }

    /// <summary>
    /// Obtem todos os eventos registrados durante uma sessao.
    /// Inclui perguntas realizadas e achados fisicos selecionados em ordem cronologica.
    /// </summary>
    /// <param name="id">Identificador da sessao.</param>
    /// <returns>Lista de eventos da sessao em ordem cronologica.</returns>
    /// <response code="200">Lista de eventos retornada com sucesso.</response>
    [HttpGet("{id}/eventos")]
    [ProducesResponseType(typeof(List<EventoSessaoResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<EventoSessaoResponse>>> ObterEventos(int id)
    {
        var eventos = await _sessaoService.ObterEventosAsync(id);
        return Ok(eventos);
    }

    /// <summary>
    /// Obtem a nota clinica de uma sessao.
    /// A nota clinica contem o resumo, diagnostico provavel, conduta e diagnosticos diferenciais.
    /// </summary>
    /// <param name="id">Identificador da sessao.</param>
    /// <returns>Dados da nota clinica da sessao.</returns>
    /// <response code="200">Nota clinica encontrada com sucesso.</response>
    /// <response code="404">Nota clinica nao encontrada para esta sessao.</response>
    [HttpGet("{id}/nota-clinica")]
    [ProducesResponseType(typeof(NotaClinicaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<NotaClinicaResponse>> ObterNotaClinica(int id)
    {
        var nota = await _notaClinicaService.ObterPorSessaoIdAsync(id);

        if (nota is null)
            return NotFound();

        return Ok(nota);
    }

    /// <summary>
    /// Salva ou atualiza a nota clinica de uma sessao.
    /// O aluno utiliza este endpoint para registrar o resumo do caso,
    /// diagnostico provavel, conduta e diagnosticos diferenciais.
    /// </summary>
    /// <param name="id">Identificador da sessao.</param>
    /// <param name="request">Dados da nota clinica a ser salva.</param>
    /// <returns>Dados da nota clinica salva.</returns>
    /// <response code="200">Nota clinica salva com sucesso.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPut("{id}/nota-clinica")]
    [ProducesResponseType(typeof(NotaClinicaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<NotaClinicaResponse>> SalvarNotaClinica(int id, [FromBody] SalvarNotaClinicaRequest request)
    {
        var nota = await _notaClinicaService.SalvarAsync(id, request);
        return Ok(nota);
    }

    /// <summary>
    /// Finaliza uma sessao de simulacao clinica.
    /// Marca a sessao como finalizada e registra a data/hora de finalizacao.
    /// Apos a finalizacao, nao e mais possivel realizar perguntas ou selecionar achados.
    /// </summary>
    /// <param name="id">Identificador da sessao.</param>
    /// <returns>Dados da sessao finalizada.</returns>
    /// <response code="200">Sessao finalizada com sucesso.</response>
    /// <response code="404">Sessao nao encontrada.</response>
    /// <response code="400">Sessao ja estava finalizada.</response>
    [HttpPost("{id}/finalizar")]
    [ProducesResponseType(typeof(SessaoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<SessaoResponse>> FinalizarSessao(int id)
    {
        var sessao = await _sessaoService.FinalizarSessaoAsync(id);

        if (sessao is null)
            return NotFound();

        return Ok(sessao);
    }
}
