namespace ClinicaSim.API.DTOs.Sessoes;

/// <summary>
/// Dados de retorno de um evento registrado durante a sessão.
/// </summary>
public record EventoSessaoResponse(
    /// <summary>Identificador único do evento.</summary>
    Guid Id,
    /// <summary>Tipo do evento (ex.: "Pergunta", "AchadoFisico").</summary>
    string Tipo,
    /// <summary>Texto exibido ao aluno (texto da pergunta ou nome do achado).</summary>
    string TextoExibido,
    /// <summary>Texto da resposta retornada pelo sistema.</summary>
    string TextoResposta,
    /// <summary>Data e hora em que o evento ocorreu.</summary>
    DateTime OcorridoEm,
    /// <summary>Tempo em segundos desde o início da sessão até este evento.</summary>
    int SegundosDesdeInicio
);
