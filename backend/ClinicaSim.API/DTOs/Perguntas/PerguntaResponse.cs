namespace ClinicaSim.API.DTOs.Perguntas;

/// <summary>
/// Dados de retorno de uma pergunta.
/// </summary>
public record PerguntaResponse(
    /// <summary>Identificador unico da pergunta.</summary>
    int Id,
    /// <summary>Texto da pergunta.</summary>
    string Texto,
    /// <summary>Secao a qual a pergunta pertence.</summary>
    string Secao,
    /// <summary>Categoria da pergunta dentro da secao.</summary>
    string Categoria,
    /// <summary>Resposta padrao exibida quando nao ha resposta especifica para o caso.</summary>
    string RespostaPadrao,
    /// <summary>Indica se a pergunta esta ativa.</summary>
    bool Ativo,
    /// <summary>Ordem de exibicao da pergunta na listagem.</summary>
    int? OrdemExibicao,
    /// <summary>Indica se a pergunta e especifica de caso clinico.</summary>
    bool EhPerguntaCaso = false
);
