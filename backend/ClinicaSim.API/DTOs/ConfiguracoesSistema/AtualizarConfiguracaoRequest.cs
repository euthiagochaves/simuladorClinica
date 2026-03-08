namespace ClinicaSim.API.DTOs.ConfiguracoesSistema;

/// <summary>
/// Dados para atualizar uma configuração do sistema.
/// </summary>
public record AtualizarConfiguracaoRequest(
    /// <summary>Novo valor da configuração.</summary>
    string Valor,
    /// <summary>Descrição explicativa da configuração (opcional).</summary>
    string? Descricao
);
