namespace ClinicaSim.API.DTOs.Sessoes;

/// <summary>
/// Dados de retorno de uma interação (pergunta ou achado físico) durante a sessão.
/// Representa a resposta exibida ao aluno após realizar uma pergunta ou selecionar um achado.
/// </summary>
public record RespostaInteracaoResponse(
    /// <summary>Tipo do evento (ex.: "Pergunta", "AchadoFisico").</summary>
    string TipoEvento,
    /// <summary>Texto exibido ao aluno (texto da pergunta ou nome do achado).</summary>
    string TextoExibido,
    /// <summary>Texto da resposta retornada pelo sistema.</summary>
    string TextoResposta,
    /// <summary>Tempo em segundos desde o início da sessão até esta interação.</summary>
    int SegundosDesdeInicio
);
