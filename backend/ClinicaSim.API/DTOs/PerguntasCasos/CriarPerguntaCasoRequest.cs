namespace ClinicaSim.API.DTOs.PerguntasCasos;

/// <summary>
/// Dados para criar uma pergunta especifica de caso clinico.
/// </summary>
public record CriarPerguntaCasoRequest(
    /// <summary>Texto da pergunta.</summary>
    string Texto,
    /// <summary>Secao da pergunta.</summary>
    string Secao,
    /// <summary>Categoria da pergunta.</summary>
    string Categoria,
    /// <summary>Resposta padrao da pergunta especifica.</summary>
    string RespostaPadrao,
    /// <summary>Ordem de exibicao da pergunta (opcional).</summary>
    int? OrdemExibicao,
    /// <summary>Indica se a pergunta esta ativa.</summary>
    bool Ativo = true
);
