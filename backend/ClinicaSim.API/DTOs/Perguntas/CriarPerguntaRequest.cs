namespace ClinicaSim.API.DTOs.Perguntas;

/// <summary>
/// Dados para criar uma nova pergunta no banco de perguntas.
/// </summary>
public record CriarPerguntaRequest(
    /// <summary>Texto da pergunta.</summary>
    string Texto,
    /// <summary>Seção à qual a pergunta pertence (ex.: "Anamnese", "Exame Físico").</summary>
    string Secao,
    /// <summary>Categoria da pergunta dentro da seção.</summary>
    string Categoria,
    /// <summary>Resposta padrão exibida quando não há resposta específica para o caso.</summary>
    string RespostaPadrao,
    /// <summary>Ordem de exibição da pergunta na listagem (opcional).</summary>
    int? OrdemExibicao
);
