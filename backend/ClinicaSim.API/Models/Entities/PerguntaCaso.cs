namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Pergunta especifica de um caso clinico.
/// Representa uma pergunta criada exclusivamente para aquele caso.
/// </summary>
public class PerguntaCaso
{
    /// <summary>Identificador unico da pergunta do caso.</summary>
    public int Id { get; set; }

    /// <summary>Identificador do caso clinico ao qual a pergunta pertence.</summary>
    public int CasoClinicoId { get; set; }

    /// <summary>Texto da pergunta.</summary>
    public string Texto { get; set; } = string.Empty;

    /// <summary>Secao da pergunta (ex: "Anamnesis").</summary>
    public string Secao { get; set; } = string.Empty;

    /// <summary>Categoria da pergunta (ex: "dolor", "fiebre").</summary>
    public string Categoria { get; set; } = string.Empty;

    /// <summary>Resposta padrao da pergunta especifica do caso.</summary>
    public string RespostaPadrao { get; set; } = string.Empty;

    /// <summary>Indica se a pergunta especifica do caso esta ativa.</summary>
    public bool Ativo { get; set; } = true;

    /// <summary>Ordem de exibicao na listagem.</summary>
    public int OrdemExibicao { get; set; }

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    // --- Navegacao ---
    public CasoClinico CasoClinico { get; set; } = null!;
}
