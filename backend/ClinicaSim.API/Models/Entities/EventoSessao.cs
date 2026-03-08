using ClinicaSim.API.Models.Enums;

namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Evento de interação durante uma sessão de atendimento.
/// Cada pergunta feita ou achado selecionado gera um evento.
/// </summary>
public class EventoSessao
{
    /// <summary>Identificador único do evento.</summary>
    public int Id { get; set; }

    /// <summary>Sessão à qual este evento pertence.</summary>
    public int SessaoId { get; set; }

    /// <summary>Tipo do evento: PerguntaClicada ou AchadoSelecionado.</summary>
    public TipoEvento Tipo { get; set; }

    /// <summary>Id da pergunta ou do achado relacionado.</summary>
    public int ReferenciaId { get; set; }

    /// <summary>Texto principal exibido no chat (a pergunta ou nome do achado).</summary>
    public string TextoExibido { get; set; } = string.Empty;

    /// <summary>Resposta ou resultado retornado pelo sistema.</summary>
    public string TextoResposta { get; set; } = string.Empty;

    /// <summary>Momento exato em que o evento aconteceu.</summary>
    public DateTime OcorridoEm { get; set; }

    /// <summary>Tempo em segundos desde o início da sessão (para timestamp relativo).</summary>
    public int SegundosDesdeInicio { get; set; }

    // --- Navegação ---
    public Sessao Sessao { get; set; } = null!;
}
