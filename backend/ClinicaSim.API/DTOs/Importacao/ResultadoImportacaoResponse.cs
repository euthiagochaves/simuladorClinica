namespace ClinicaSim.API.DTOs.Importacao;

/// <summary>
/// Dados de retorno do resultado de uma importação de caso clínico.
/// </summary>
public record ResultadoImportacaoResponse(
    /// <summary>Indica se a importação foi realizada com sucesso.</summary>
    bool Sucesso,
    /// <summary>Mensagem de erro caso a importação tenha falhado (nulo se sucesso).</summary>
    string? MensagemErro,
    /// <summary>Identificador do caso clínico criado pela importação (nulo se falhou).</summary>
    int? CasoClinicoId
);
