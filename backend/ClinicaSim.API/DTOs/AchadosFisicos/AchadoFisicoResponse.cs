namespace ClinicaSim.API.DTOs.AchadosFisicos;

/// <summary>
/// Dados de retorno de um achado físico.
/// </summary>
public record AchadoFisicoResponse(
    /// <summary>Identificador único do achado físico.</summary>
    Guid Id,
    /// <summary>Nome do achado físico.</summary>
    string Nome,
    /// <summary>Sistema ou categoria do achado.</summary>
    string SistemaCategoria,
    /// <summary>Descrição detalhada do achado físico.</summary>
    string? Descricao,
    /// <summary>Resultado padrão exibido quando não há resultado específico para o caso.</summary>
    string ResultadoPadrao,
    /// <summary>Indica se o achado físico está ativo.</summary>
    bool Ativo
);
