using ClinicaSim.API.DTOs.Importacao;

namespace ClinicaSim.API.Services.Interfaces;

/// <summary>
/// Contrato do servico de importacao de casos clinicos via YAML.
/// </summary>
public interface IImportacaoService
{
    /// <summary>Importa um caso clinico a partir de conteudo YAML.</summary>
    /// <param name="conteudoYaml">Texto YAML com a definicao do caso clinico.</param>
    /// <param name="usuarioId">Identificador do usuario que esta realizando a importacao (opcional).</param>
    Task<ResultadoImportacaoResponse> ImportarYamlAsync(string conteudoYaml, int? usuarioId);
}
