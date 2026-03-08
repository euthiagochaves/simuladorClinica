namespace ClinicaSim.API.DTOs.CasosClinicos;

/// <summary>
/// Dados para atualizar um caso clínico existente.
/// </summary>
public record AtualizarCasoClinicoRequest(
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
    /// <summary>Indica se o caso clínico está ativo.</summary>
    bool Ativo
);
