namespace ClinicaSim.API.DTOs.ConfiguracoesSistema;

/// <summary>
/// Dados de retorno de uma configuração do sistema.
/// </summary>
public record ConfiguracaoSistemaResponse(
    /// <summary>Identificador único da configuração.</summary>
    int Id,
    /// <summary>Chave única da configuração (ex.: "TempoMaximoSessao").</summary>
    string Chave,
    /// <summary>Valor da configuração.</summary>
    string Valor,
    /// <summary>Descrição explicativa da configuração.</summary>
    string? Descricao
);
