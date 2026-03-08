using ClinicaSim.API.Models.Enums;

namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Registro de importação de caso clínico via arquivo YAML.
/// Armazena o resultado da importação (sucesso ou erro) e quem realizou.
/// </summary>
public class LogImportacaoCaso
{
    /// <summary>Identificador único do log.</summary>
    public int Id { get; set; }

    /// <summary>Caso clínico criado ou atualizado pela importação (se sucesso).</summary>
    public int? CasoClinicoId { get; set; }

    /// <summary>Usuário que realizou a importação.</summary>
    public int ImportadoPorUsuarioId { get; set; }

    /// <summary>Tipo da origem (ex: "YAML").</summary>
    public string TipoOrigem { get; set; } = string.Empty;

    /// <summary>Conteúdo bruto do arquivo importado (opcional).</summary>
    public string? ConteudoOrigem { get; set; }

    /// <summary>Resultado da importação: Sucesso ou Erro.</summary>
    public StatusImportacao Status { get; set; }

    /// <summary>Mensagem de erro, se houver.</summary>
    public string? MensagemErro { get; set; }

    public DateTime CriadoEm { get; set; }

    // --- Navegação ---
    public CasoClinico? CasoClinico { get; set; }
    public Usuario ImportadoPor { get; set; } = null!;
}
