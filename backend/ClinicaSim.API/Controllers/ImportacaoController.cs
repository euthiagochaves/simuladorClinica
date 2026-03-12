using Microsoft.AspNetCore.Mvc;
using ClinicaSim.API.DTOs.Importacao;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Controllers;

/// <summary>
/// Controlador responsavel pela importacao de casos clinicos via YAML.
/// Permite que professores e administradores importem casos clinicos
/// completos a partir de arquivos YAML ou texto bruto.
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ImportacaoController : ControllerBase
{
    private readonly IImportacaoService _importacaoService;

    /// <summary>
    /// Inicializa uma nova instancia do controlador de importacao.
    /// </summary>
    /// <param name="importacaoService">Servico de importacao de casos clinicos.</param>
    public ImportacaoController(IImportacaoService importacaoService)
    {
        _importacaoService = importacaoService;
    }

    /// <summary>
    /// Gera a plantilla YAML base para criacao de caso clinico.
    /// Inclui instrucoes e opcoes atuais de secao/categoria.
    /// </summary>
    /// <returns>Arquivo YAML de template.</returns>
    [HttpGet("yaml/template")]
    [Produces("text/yaml")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> BaixarTemplateYaml()
    {
        var conteudo = await _importacaoService.GerarTemplateYamlAsync();
        var bytes = System.Text.Encoding.UTF8.GetBytes(conteudo);
        return File(bytes, "text/yaml", "plantilla-caso-clinico.yaml");
    }

    /// <summary>
    /// Importa um caso clinico a partir de conteudo YAML.
    /// Aceita tanto o envio de um arquivo YAML quanto texto bruto no corpo da requisicao.
    /// Quando um arquivo e enviado, o conteudo do arquivo tem prioridade sobre o texto bruto.
    /// </summary>
    /// <param name="arquivo">Arquivo YAML contendo a definicao do caso clinico (opcional).</param>
    /// <param name="conteudoYaml">Texto YAML bruto com a definicao do caso clinico (opcional se arquivo for enviado).</param>
    /// <param name="usuarioId">Identificador do usuario que esta realizando a importacao (opcional).</param>
    /// <returns>Resultado da importacao indicando sucesso ou falha.</returns>
    /// <response code="200">Importacao realizada com sucesso.</response>
    /// <response code="400">Dados invalidos: nenhum conteudo YAML fornecido ou YAML mal formatado.</response>
    [HttpPost("yaml")]
    [ProducesResponseType(typeof(ResultadoImportacaoResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<ActionResult<ResultadoImportacaoResponse>> ImportarYaml(
        IFormFile? arquivo,
        [FromForm] string? conteudoYaml,
        [FromForm] int? usuarioId)
    {
        string yaml;

        if (arquivo is not null && arquivo.Length > 0)
        {
            using var leitor = new StreamReader(arquivo.OpenReadStream());
            yaml = await leitor.ReadToEndAsync();
        }
        else if (!string.IsNullOrWhiteSpace(conteudoYaml))
        {
            yaml = conteudoYaml;
        }
        else
        {
            return BadRequest(new { mensagem = "Nenhum conteudo YAML foi fornecido. Envie um arquivo ou informe o texto bruto." });
        }

        var resultado = await _importacaoService.ImportarYamlAsync(yaml, usuarioId);

        if (!resultado.Sucesso)
            return BadRequest(resultado);

        return Ok(resultado);
    }
}
