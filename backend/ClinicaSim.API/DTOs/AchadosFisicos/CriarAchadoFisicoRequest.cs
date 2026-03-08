namespace ClinicaSim.API.DTOs.AchadosFisicos;

/// <summary>
/// Dados para criar um novo achado físico no banco de achados.
/// </summary>
public record CriarAchadoFisicoRequest(
    /// <summary>Nome do achado físico (ex.: "Ausculta Cardíaca").</summary>
    string Nome,
    /// <summary>Sistema ou categoria do achado (ex.: "Cardiovascular", "Respiratório").</summary>
    string SistemaCategoria,
    /// <summary>Descrição detalhada do achado físico (opcional).</summary>
    string? Descricao,
    /// <summary>Resultado padrão exibido quando não há resultado específico para o caso.</summary>
    string ResultadoPadrao
);
