namespace ClinicaSim.API.Models.Enums;

/// <summary>
/// Tipo de interação que o aluno fez durante o atendimento.
/// </summary>
public enum TipoEvento
{
    /// <summary>Aluno clicou em uma pergunta de anamnese.</summary>
    PerguntaClicada,

    /// <summary>Aluno selecionou um achado de exame físico.</summary>
    AchadoSelecionado
}
