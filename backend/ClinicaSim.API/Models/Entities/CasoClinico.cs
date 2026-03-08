namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Caso clínico simulado. Contém os dados do paciente fictício
/// e referencia as respostas/achados específicos deste caso.
/// O caso sobrescreve apenas o que é patológico — o resto vem do banco global.
/// </summary>
public class CasoClinico
{
    /// <summary>Identificador único do caso clínico.</summary>
    public int Id { get; set; }

    /// <summary>Título curto do caso (ex: "Dor abdominal aguda").</summary>
    public string Titulo { get; set; } = string.Empty;

    /// <summary>Nome fictício do paciente.</summary>
    public string NomePaciente { get; set; } = string.Empty;

    /// <summary>Idade do paciente.</summary>
    public int Idade { get; set; }

    /// <summary>Sexo do paciente (ex: "Masculino", "Feminino").</summary>
    public string Sexo { get; set; } = string.Empty;

    /// <summary>Queixa principal que trouxe o paciente à consulta.</summary>
    public string QueixaPrincipal { get; set; } = string.Empty;

    /// <summary>Classificação de triagem (ex: "Verde", "Amarelo", "Vermelho").</summary>
    public string? Triagem { get; set; }

    /// <summary>Resumo interno do caso — visível apenas para professores/admins.</summary>
    public string? Resumo { get; set; }

    /// <summary>Indica se o caso está disponível para os alunos.</summary>
    public bool Ativo { get; set; } = true;

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    /// <summary>Usuário que criou o caso (opcional).</summary>
    public int? CriadoPorUsuarioId { get; set; }

    // --- Navegação ---

    public Usuario? CriadoPor { get; set; }

    /// <summary>Respostas específicas de anamnese para este caso.</summary>
    public ICollection<RespostaCasoPergunta> RespostasPerguntas { get; set; } = new List<RespostaCasoPergunta>();

    /// <summary>Achados de exame físico específicos deste caso.</summary>
    public ICollection<AchadoFisicoCaso> AchadosFisicos { get; set; } = new List<AchadoFisicoCaso>();

    /// <summary>Sessões de atendimento realizadas com este caso.</summary>
    public ICollection<Sessao> Sessoes { get; set; } = new List<Sessao>();

    /// <summary>Arquivos anexados ao caso (imagens, PDFs, etc.).</summary>
    public ICollection<AnexoCaso> Anexos { get; set; } = new List<AnexoCaso>();
}
