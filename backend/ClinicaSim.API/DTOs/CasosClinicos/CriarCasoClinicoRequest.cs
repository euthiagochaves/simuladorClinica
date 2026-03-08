namespace ClinicaSim.API.DTOs.CasosClinicos;

/// <summary>
/// Dados para criar um novo caso clínico.
/// </summary>
public record CriarCasoClinicoRequest(
    /// <summary>Título do caso clínico.</summary>
    string Titulo,
    /// <summary>Nome do paciente fictício.</summary>
    string NomePaciente,
    /// <summary>Idade do paciente.</summary>
    int Idade,
    /// <summary>Sexo do paciente (ex.: "Masculino", "Feminino").</summary>
    string Sexo,
    /// <summary>Queixa principal relatada pelo paciente.</summary>
    string QueixaPrincipal,
    /// <summary>Classificação de triagem (opcional).</summary>
    string? Triagem,
    /// <summary>Resumo geral do caso clínico (opcional).</summary>
    string? Resumo,
    /// <summary>Identificador do usuário que criou o caso (opcional).</summary>
    Guid? CriadoPorUsuarioId
);
