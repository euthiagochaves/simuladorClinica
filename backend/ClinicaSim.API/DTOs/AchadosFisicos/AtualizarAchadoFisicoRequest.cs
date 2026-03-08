namespace ClinicaSim.API.DTOs.AchadosFisicos;

/// <summary>
/// Dados para atualizar um achado físico existente.
/// </summary>
public record AtualizarAchadoFisicoRequest(
    /// <summary>Nome do achado físico (ex.: "Ausculta Cardíaca").</summary>
    string Nome,
    /// <summary>Sistema ou categoria do achado (ex.: "Cardiovascular", "Respiratório").</summary>
    string SistemaCategoria,
    /// <summary>Descrição detalhada do achado físico (opcional).</summary>
    string? Descricao,
    /// <summary>Resultado padrão exibido quando não há resultado específico para o caso.</summary>
    string ResultadoPadrao,
    /// <summary>Indica se o achado físico está ativo.</summary>
    bool Ativo
);
