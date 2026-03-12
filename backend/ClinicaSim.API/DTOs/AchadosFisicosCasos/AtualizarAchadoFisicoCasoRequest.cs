namespace ClinicaSim.API.DTOs.AchadosFisicosCasos;

/// <summary>
/// Dados para atualizar um achado fisico especifico de um caso clinico.
/// </summary>
public record AtualizarAchadoFisicoCasoRequest(
    /// <summary>Indica se o achado esta presente no paciente deste caso.</summary>
    bool Presente,
    /// <summary>Texto com detalhes adicionais sobre o achado neste caso.</summary>
    string? TextoDetalhe,
    /// <summary>Indica se este achado deve ser destacado como relevante.</summary>
    bool Destacado
);
