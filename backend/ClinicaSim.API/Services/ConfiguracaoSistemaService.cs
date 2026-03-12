using Microsoft.EntityFrameworkCore;
using ClinicaSim.API.Data;
using ClinicaSim.API.DTOs.ConfiguracoesSistema;
using ClinicaSim.API.Models.Entities;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Services;

/// <summary>
/// Implementacao do servico de gerenciamento de configuracoes globais do sistema.
/// Responsavel por operacoes de leitura e atualizacao sobre a entidade <see cref="ConfiguracaoSistema"/>.
/// </summary>
public class ConfiguracaoSistemaService : IConfiguracaoSistemaService
{
    private readonly ClinicaSimDbContext _contexto;

    /// <summary>
    /// Inicializa uma nova instancia de <see cref="ConfiguracaoSistemaService"/>.
    /// </summary>
    /// <param name="contexto">Contexto do banco de dados.</param>
    public ConfiguracaoSistemaService(ClinicaSimDbContext contexto)
    {
        _contexto = contexto;
    }

    /// <inheritdoc />
    public async Task<List<ConfiguracaoSistemaResponse>> ObterTodasAsync()
    {
        var configuracoes = await _contexto.ConfiguracoesSistema
            .AsNoTracking()
            .OrderBy(c => c.Chave)
            .ToListAsync();

        return configuracoes.Select(MapearParaResponse).ToList();
    }

    /// <inheritdoc />
    public async Task<ConfiguracaoSistemaResponse?> ObterPorChaveAsync(string chave)
    {
        var configuracao = await _contexto.ConfiguracoesSistema
            .AsNoTracking()
            .FirstOrDefaultAsync(c => c.Chave == chave);

        return configuracao is null ? null : MapearParaResponse(configuracao);
    }

    /// <inheritdoc />
    public async Task<ConfiguracaoSistemaResponse?> AtualizarAsync(string chave, AtualizarConfiguracaoRequest request)
    {
        var configuracao = await _contexto.ConfiguracoesSistema
            .FirstOrDefaultAsync(c => c.Chave == chave);

        if (configuracao is null)
        {
            configuracao = new ConfiguracaoSistema
            {
                Chave = chave,
                Valor = request.Valor,
                Descricao = request.Descricao
            };

            _contexto.ConfiguracoesSistema.Add(configuracao);
            await _contexto.SaveChangesAsync();
            return MapearParaResponse(configuracao);
        }

        configuracao.Valor = request.Valor;
        configuracao.Descricao = request.Descricao;

        await _contexto.SaveChangesAsync();

        return MapearParaResponse(configuracao);
    }

    // =====================================================================
    // Metodos auxiliares de mapeamento
    // =====================================================================

    /// <summary>
    /// Mapeia uma entidade <see cref="ConfiguracaoSistema"/> para o DTO <see cref="ConfiguracaoSistemaResponse"/>.
    /// </summary>
    private static ConfiguracaoSistemaResponse MapearParaResponse(ConfiguracaoSistema configuracao)
    {
        return new ConfiguracaoSistemaResponse(
            Id: configuracao.Id,
            Chave: configuracao.Chave,
            Valor: configuracao.Valor,
            Descricao: configuracao.Descricao
        );
    }
}
