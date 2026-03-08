using ClinicaSim.API.DTOs.NotasClinicas;

namespace ClinicaSim.API.Services.Interfaces;

/// <summary>
/// Contrato do servico de gerenciamento de notas clinicas.
/// </summary>
public interface INotaClinicaService
{
    /// <summary>Obtem a nota clinica de uma sessao.</summary>
    /// <param name="sessaoId">Identificador da sessao.</param>
    Task<NotaClinicaResponse?> ObterPorSessaoIdAsync(int sessaoId);

    /// <summary>Salva ou atualiza a nota clinica de uma sessao.</summary>
    /// <param name="sessaoId">Identificador da sessao.</param>
    /// <param name="request">Dados da nota clinica.</param>
    Task<NotaClinicaResponse> SalvarAsync(int sessaoId, SalvarNotaClinicaRequest request);
}
