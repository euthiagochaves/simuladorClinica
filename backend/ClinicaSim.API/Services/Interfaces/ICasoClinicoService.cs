using ClinicaSim.API.DTOs.CasosClinicos;
using ClinicaSim.API.DTOs.RespostasCasos;
using ClinicaSim.API.DTOs.AchadosFisicosCasos;

namespace ClinicaSim.API.Services.Interfaces;

/// <summary>
/// Contrato do servico de gerenciamento de casos clinicos.
/// </summary>
public interface ICasoClinicoService
{
    /// <summary>Obtem todos os casos clinicos, com filtro opcional de ativos.</summary>
    /// <param name="apenasAtivos">Se verdadeiro, retorna apenas casos ativos.</param>
    Task<List<CasoClinicoResumoResponse>> ObterTodosAsync(bool apenasAtivos = true);

    /// <summary>Obtem um caso clinico pelo seu identificador.</summary>
    /// <param name="id">Identificador do caso clinico.</param>
    Task<CasoClinicoResponse?> ObterPorIdAsync(int id);

    /// <summary>Cria um novo caso clinico.</summary>
    /// <param name="request">Dados para criacao do caso clinico.</param>
    Task<CasoClinicoResponse> CriarAsync(CriarCasoClinicoRequest request);

    /// <summary>Atualiza os dados de um caso clinico existente.</summary>
    /// <param name="id">Identificador do caso clinico.</param>
    /// <param name="request">Dados atualizados do caso clinico.</param>
    Task<CasoClinicoResponse?> AtualizarAsync(int id, AtualizarCasoClinicoRequest request);

    /// <summary>Remove (soft delete) um caso clinico.</summary>
    /// <param name="id">Identificador do caso clinico.</param>
    Task<bool> DeletarAsync(int id);

    /// <summary>Obtem todas as respostas de perguntas vinculadas a um caso clinico.</summary>
    /// <param name="casoClinicoId">Identificador do caso clinico.</param>
    Task<List<RespostaCasoResponse>> ObterRespostasCasoAsync(int casoClinicoId);

    /// <summary>Adiciona uma resposta de pergunta a um caso clinico.</summary>
    /// <param name="casoClinicoId">Identificador do caso clinico.</param>
    /// <param name="request">Dados da resposta a ser adicionada.</param>
    Task<RespostaCasoResponse> AdicionarRespostaCasoAsync(int casoClinicoId, CriarRespostaCasoRequest request);

    /// <summary>Obtem todos os achados fisicos vinculados a um caso clinico.</summary>
    /// <param name="casoClinicoId">Identificador do caso clinico.</param>
    Task<List<AchadoFisicoCasoResponse>> ObterAchadosFisicosCasoAsync(int casoClinicoId);

    /// <summary>Adiciona um achado fisico a um caso clinico.</summary>
    /// <param name="casoClinicoId">Identificador do caso clinico.</param>
    /// <param name="request">Dados do achado fisico a ser adicionado.</param>
    Task<AchadoFisicoCasoResponse> AdicionarAchadoFisicoCasoAsync(int casoClinicoId, CriarAchadoFisicoCasoRequest request);
}
