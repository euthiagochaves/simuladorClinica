namespace ClinicaSim.API.DTOs.Sessoes;

/// <summary>
/// Dados para selecionar um achado físico durante uma sessão de simulação.
/// </summary>
public record SelecionarAchadoRequest(
    /// <summary>Identificador do achado físico selecionado pelo aluno.</summary>
    int AchadoFisicoId
);
