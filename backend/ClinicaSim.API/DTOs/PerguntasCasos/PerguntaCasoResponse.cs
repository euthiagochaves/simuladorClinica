namespace ClinicaSim.API.DTOs.PerguntasCasos;

/// <summary>
/// Dados de retorno de uma pergunta especifica de caso clinico.
/// </summary>
public record PerguntaCasoResponse(
    /// <summary>Identificador unico da pergunta do caso.</summary>
    int Id,
    /// <summary>Identificador do caso clinico.</summary>
    int CasoClinicoId,
    /// <summary>Texto da pergunta.</summary>
    string Texto,
    /// <summary>Secao da pergunta.</summary>
    string Secao,
    /// <summary>Categoria da pergunta.</summary>
    string Categoria,
    /// <summary>Resposta padrao da pergunta especifica.</summary>
    string RespostaPadrao,
    /// <summary>Indica se a pergunta esta ativa.</summary>
    bool Ativo,
    /// <summary>Ordem de exibicao da pergunta.</summary>
    int OrdemExibicao
);
