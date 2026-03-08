namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Configuração global do sistema.
/// Armazena pares chave-valor para configurações dinâmicas.
/// </summary>
public class ConfiguracaoSistema
{
    /// <summary>Identificador único.</summary>
    public int Id { get; set; }

    /// <summary>Nome/chave da configuração (ex: "TempoMaximoSessao").</summary>
    public string Chave { get; set; } = string.Empty;

    /// <summary>Valor da configuração.</summary>
    public string Valor { get; set; } = string.Empty;

    /// <summary>Descrição do que esta configuração faz.</summary>
    public string? Descricao { get; set; }

    public DateTime AtualizadoEm { get; set; }
}
