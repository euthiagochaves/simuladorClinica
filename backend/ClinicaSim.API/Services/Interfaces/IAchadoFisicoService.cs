using ClinicaSim.API.DTOs.AchadosFisicos;

namespace ClinicaSim.API.Services.Interfaces;

/// <summary>
/// Contrato do servico de gerenciamento de achados fisicos.
/// </summary>
public interface IAchadoFisicoService
{
    /// <summary>Obtem todos os achados fisicos, com filtro opcional de ativos.</summary>
    /// <param name="apenasAtivos">Se verdadeiro, retorna apenas achados ativos.</param>
    Task<List<AchadoFisicoResponse>> ObterTodosAsync(bool apenasAtivos = true);

    /// <summary>Obtem um achado fisico pelo seu identificador.</summary>
    /// <param name="id">Identificador do achado fisico.</param>
    Task<AchadoFisicoResponse?> ObterPorIdAsync(int id);

    /// <summary>Cria um novo achado fisico.</summary>
    /// <param name="request">Dados para criacao do achado fisico.</param>
    Task<AchadoFisicoResponse> CriarAsync(CriarAchadoFisicoRequest request);

    /// <summary>Atualiza os dados de um achado fisico existente.</summary>
    /// <param name="id">Identificador do achado fisico.</param>
    /// <param name="request">Dados atualizados do achado fisico.</param>
    Task<AchadoFisicoResponse?> AtualizarAsync(int id, AtualizarAchadoFisicoRequest request);

    /// <summary>Remove (soft delete) um achado fisico.</summary>
    /// <param name="id">Identificador do achado fisico.</param>
    Task<bool> DeletarAsync(int id);
}
