namespace ClinicaSim.API.Models.Enums;

/// <summary>
/// Estado atual de uma sessão de atendimento.
/// </summary>
public enum StatusSessao
{
    /// <summary>Sessão criada, atendimento ainda não começou.</summary>
    Iniciada,

    /// <summary>Atendimento em andamento.</summary>
    EmAndamento,

    /// <summary>Atendimento finalizado com todos os campos preenchidos.</summary>
    Finalizada
}
