namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Pergunta do banco global de anamnese.
/// Cada pergunta possui uma resposta padrão que representa um paciente SEM patologia.
/// Casos clínicos podem sobrescrever essa resposta com uma resposta específica.
/// </summary>
public class Pergunta
{
    /// <summary>Identificador único da pergunta.</summary>
    public int Id { get; set; }

    /// <summary>Texto da pergunta (ex: "¿Cuál es la principal molestia?").</summary>
    public string Texto { get; set; } = string.Empty;

    /// <summary>Seção à qual pertence (ex: "Anamnesis").</summary>
    public string Secao { get; set; } = string.Empty;

    /// <summary>Categoria da pergunta (ex: "dolor", "fiebre", "antecedentes").</summary>
    public string Categoria { get; set; } = string.Empty;

    /// <summary>
    /// Resposta padrão — representa o que um paciente SAUDÁVEL responderia.
    /// Se o caso não sobrescrever, esta resposta é usada.
    /// </summary>
    public string RespostaPadrao { get; set; } = string.Empty;

    /// <summary>Indica se a pergunta está ativa e disponível.</summary>
    public bool Ativo { get; set; } = true;

    /// <summary>Ordem de exibição (opcional, padrão é alfabético por texto).</summary>
    public int OrdemExibicao { get; set; }

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    // --- Navegação ---

    /// <summary>Respostas específicas que casos clínicos definiram para esta pergunta.</summary>
    public ICollection<RespostaCasoPergunta> RespostasCasos { get; set; } = new List<RespostaCasoPergunta>();
}
