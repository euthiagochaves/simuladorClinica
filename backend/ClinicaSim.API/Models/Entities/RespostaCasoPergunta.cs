namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Resposta específica de um caso clínico para uma pergunta do banco global.
/// Quando existe, sobrescreve a resposta padrão da pergunta.
/// Se não existe registro aqui, o sistema usa a RespostaPadrao da Pergunta.
/// </summary>
public class RespostaCasoPergunta
{
    /// <summary>Identificador único do registro.</summary>
    public int Id { get; set; }

    /// <summary>Caso clínico ao qual esta resposta pertence.</summary>
    public int CasoClinicoId { get; set; }

    /// <summary>Pergunta global que está sendo sobrescrita.</summary>
    public int PerguntaId { get; set; }

    /// <summary>Resposta específica deste caso (sobrescreve a padrão).</summary>
    public string TextoResposta { get; set; } = string.Empty;

    /// <summary>Indica se esta resposta é clinicamente relevante ou patológica.</summary>
    public bool Destacada { get; set; }

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    // --- Navegação ---
    public CasoClinico CasoClinico { get; set; } = null!;
    public Pergunta Pergunta { get; set; } = null!;
}
