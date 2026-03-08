namespace ClinicaSim.API.DTOs.Perguntas;

/// <summary>
/// Dados de retorno de uma pergunta.
/// </summary>
public record PerguntaResponse(
    /// <summary>Identificador único da pergunta.</summary>
    int Id,
    /// <summary>Texto da pergunta.</summary>
    string Texto,
    /// <summary>Seção à qual a pergunta pertence.</summary>
    string Secao,
    /// <summary>Categoria da pergunta dentro da seção.</summary>
    string Categoria,
    /// <summary>Resposta padrão exibida quando não há resposta específica para o caso.</summary>
    string RespostaPadrao,
    /// <summary>Indica se a pergunta está ativa.</summary>
    bool Ativo,
    /// <summary>Ordem de exibição da pergunta na listagem.</summary>
    int? OrdemExibicao
);
