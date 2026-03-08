using ClinicaSim.API.DTOs.ConfiguracoesSistema;

namespace ClinicaSim.API.Services.Interfaces;

/// <summary>
/// Contrato do servico de gerenciamento de configuracoes do sistema.
/// </summary>
public interface IConfiguracaoSistemaService
{
    /// <summary>Obtem todas as configuracoes do sistema.</summary>
    Task<List<ConfiguracaoSistemaResponse>> ObterTodasAsync();

    /// <summary>Obtem uma configuracao pela sua chave.</summary>
    /// <param name="chave">Chave da configuracao.</param>
    Task<ConfiguracaoSistemaResponse?> ObterPorChaveAsync(string chave);

    /// <summary>Atualiza o valor de uma configuracao existente.</summary>
    /// <param name="chave">Chave da configuracao.</param>
    /// <param name="request">Dados atualizados da configuracao.</param>
    Task<ConfiguracaoSistemaResponse?> AtualizarAsync(string chave, AtualizarConfiguracaoRequest request);
}
