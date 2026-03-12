namespace ClinicaSim.API.DTOs.Importacao;

/// <summary>
/// Dados de retorno do resultado de uma importacao de caso clinico.
/// </summary>
public record ResultadoImportacaoResponse(
    /// <summary>Indica se a importacao foi realizada com sucesso.</summary>
    bool Sucesso,
    /// <summary>Mensagem de erro caso a importacao tenha falhado (nulo se sucesso).</summary>
    string? MensagemErro,
    /// <summary>Identificador do caso clinico criado pela importacao (nulo se falhou).</summary>
    int? CasoClinicoId,
    /// <summary>Lista de avisos para revisao manual apos importacao.</summary>
    List<string>? AvisosRevisao
);
