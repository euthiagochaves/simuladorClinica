using Microsoft.AspNetCore.Mvc;
using ClinicaSim.API.DTOs.ConfiguracoesSistema;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Controllers;

/// <summary>
/// Controlador responsavel pelo gerenciamento de configuracoes do sistema.
/// Permite consultar e atualizar configuracoes globais armazenadas como pares chave-valor.
/// </summary>
[ApiController]
[Route("api/configuracoes")]
public class ConfiguracoesSistemaController : ControllerBase
{
    private readonly IConfiguracaoSistemaService _configuracaoService;

    /// <summary>
    /// Inicializa uma nova instancia do controlador de configuracoes do sistema.
    /// </summary>
    /// <param name="configuracaoService">Servico de gerenciamento de configuracoes.</param>
    public ConfiguracoesSistemaController(IConfiguracaoSistemaService configuracaoService)
    {
        _configuracaoService = configuracaoService;
    }

    /// <summary>
    /// Obtem todas as configuracoes do sistema.
    /// </summary>
    /// <returns>Lista de configuracoes do sistema.</returns>
    /// <response code="200">Lista de configuracoes retornada com sucesso.</response>
    [HttpGet]
    [ProducesResponseType(typeof(List<ConfiguracaoSistemaResponse>), StatusCodes.Status200OK)]
    public async Task<ActionResult<List<ConfiguracaoSistemaResponse>>> ObterTodas()
    {
        var configuracoes = await _configuracaoService.ObterTodasAsync();
        return Ok(configuracoes);
    }

    /// <summary>
    /// Obtem uma configuracao pela sua chave.
    /// </summary>
    /// <param name="chave">Chave da configuracao (ex.: "TempoMaximoSessao").</param>
    /// <returns>Dados da configuracao encontrada.</returns>
    /// <response code="200">Configuracao encontrada com sucesso.</response>
    /// <response code="404">Configuracao com a chave informada nao encontrada.</response>
    [HttpGet("{chave}")]
    [ProducesResponseType(typeof(ConfiguracaoSistemaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<ActionResult<ConfiguracaoSistemaResponse>> ObterPorChave(string chave)
    {
        var configuracao = await _configuracaoService.ObterPorChaveAsync(chave);

        if (configuracao is null)
            return NotFound();

        return Ok(configuracao);
    }

    /// <summary>
    /// Atualiza o valor de uma configuracao existente.
    /// </summary>
    /// <param name="chave">Chave da configuracao a ser atualizada.</param>
    /// <param name="request">Dados atualizados da configuracao.</param>
    /// <returns>Dados da configuracao atualizada.</returns>
    /// <response code="200">Configuracao atualizada com sucesso.</response>
    /// <response code="404">Configuracao com a chave informada nao encontrada.</response>
    /// <response code="400">Dados invalidos na requisicao.</response>
    [HttpPut("{chave}")]
    [ProducesResponseType(typeof(ConfiguracaoSistemaResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ConfiguracaoSistemaResponse>> Atualizar(string chave, [FromBody] AtualizarConfiguracaoRequest request)
    {
        var configuracao = await _configuracaoService.AtualizarAsync(chave, request);

        if (configuracao is null)
            return NotFound();

        return Ok(configuracao);
    }
}
