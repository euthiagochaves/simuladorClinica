using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ClinicaSim.API.Data;
using ClinicaSim.API.DTOs.Importacao;
using ClinicaSim.API.Models.Entities;
using ClinicaSim.API.Models.Enums;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Services;

/// <summary>
/// Implementacao do servico de importacao de casos clinicos via arquivo YAML.
/// Por enquanto, este servico funciona como um placeholder que registra a tentativa
/// de importacao e retorna sucesso. A logica completa de parsing YAML sera implementada futuramente.
/// </summary>
public class ImportacaoService : IImportacaoService
{
    private readonly ClinicaSimDbContext _contexto;
    private readonly ILogger<ImportacaoService> _logger;

    /// <summary>
    /// Inicializa uma nova instancia de <see cref="ImportacaoService"/>.
    /// </summary>
    /// <param name="contexto">Contexto do banco de dados.</param>
    /// <param name="logger">Logger para registro de eventos.</param>
    public ImportacaoService(ClinicaSimDbContext contexto, ILogger<ImportacaoService> logger)
    {
        _contexto = contexto;
        _logger = logger;
    }

    /// <inheritdoc />
    /// <remarks>
    /// Implementacao placeholder: registra a tentativa de importacao no log
    /// e retorna sucesso. A logica de parsing YAML sera implementada futuramente.
    /// </remarks>
    public async Task<ResultadoImportacaoResponse> ImportarYamlAsync(string conteudoYaml, int? usuarioId)
    {
        _logger.LogInformation(
            "Tentativa de importacao YAML recebida. Tamanho do conteudo: {Tamanho} caracteres. UsuarioId: {UsuarioId}",
            conteudoYaml?.Length ?? 0,
            usuarioId?.ToString() ?? "nulo");

        try
        {
            // Registra o log de importacao no banco de dados
            var logImportacao = new LogImportacaoCaso
            {
                ImportadoPorUsuarioId = usuarioId ?? 0,
                TipoOrigem = "YAML",
                ConteudoOrigem = conteudoYaml,
                Status = StatusImportacao.Sucesso,
                MensagemErro = null
            };

            // Somente registra o log se o usuarioId for valido
            if (usuarioId.HasValue && usuarioId.Value > 0)
            {
                var usuarioExiste = await _contexto.Usuarios.AnyAsync(u => u.Id == usuarioId.Value);
                if (usuarioExiste)
                {
                    logImportacao.ImportadoPorUsuarioId = usuarioId.Value;
                    _contexto.LogsImportacaoCasos.Add(logImportacao);
                    await _contexto.SaveChangesAsync();
                }
                else
                {
                    _logger.LogWarning("Usuario com Id {UsuarioId} nao encontrado. Log de importacao nao registrado.", usuarioId);
                }
            }

            _logger.LogInformation("Importacao YAML registrada com sucesso (placeholder). Parsing completo sera implementado futuramente.");

            return new ResultadoImportacaoResponse(
                Sucesso: true,
                MensagemErro: null,
                CasoClinicoId: null
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao processar importacao YAML.");

            return new ResultadoImportacaoResponse(
                Sucesso: false,
                MensagemErro: $"Erro ao processar importacao: {ex.Message}",
                CasoClinicoId: null
            );
        }
    }
}
