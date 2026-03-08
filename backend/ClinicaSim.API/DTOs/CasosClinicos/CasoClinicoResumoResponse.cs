namespace ClinicaSim.API.DTOs.CasosClinicos;

/// <summary>
/// Dados resumidos de um caso clínico para exibição em listagens.
/// </summary>
public record CasoClinicoResumoResponse(
    /// <summary>Identificador único do caso clínico.</summary>
    int Id,
    /// <summary>Título do caso clínico.</summary>
    string Titulo,
    /// <summary>Nome do paciente fictício.</summary>
    string NomePaciente,
    /// <summary>Idade do paciente.</summary>
    int Idade,
    /// <summary>Sexo do paciente.</summary>
    string Sexo,
    /// <summary>Queixa principal relatada pelo paciente.</summary>
    string QueixaPrincipal,
    /// <summary>Classificação de triagem.</summary>
    string? Triagem,
    /// <summary>Indica se o caso clínico está ativo.</summary>
    bool Ativo
);
