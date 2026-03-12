namespace ClinicaSim.API.Models.Entities;

/// <summary>
/// Caso clinico simulado. Contem os dados do paciente ficticio
/// e referencia as respostas/achados especificos deste caso.
/// O caso sobrescreve apenas o que e patologico - o resto vem do banco global.
/// </summary>
public class CasoClinico
{
    /// <summary>Identificador unico do caso clinico.</summary>
    public int Id { get; set; }

    /// <summary>Titulo curto do caso (ex: "Dor abdominal aguda").</summary>
    public string Titulo { get; set; } = string.Empty;

    /// <summary>Nome ficticio do paciente.</summary>
    public string NomePaciente { get; set; } = string.Empty;

    /// <summary>Idade do paciente.</summary>
    public int Idade { get; set; }

    /// <summary>Sexo do paciente (ex: "Masculino", "Feminino").</summary>
    public string Sexo { get; set; } = string.Empty;

    /// <summary>Queixa principal que trouxe o paciente a consulta.</summary>
    public string QueixaPrincipal { get; set; } = string.Empty;

    /// <summary>Classificacao de triagem (ex: "Verde", "Amarelo", "Vermelho").</summary>
    public string? Triagem { get; set; }

    /// <summary>Resumo interno do caso - visivel apenas para professores/admins.</summary>
    public string? Resumo { get; set; }

    /// <summary>Indica se o caso esta disponivel para os alunos.</summary>
    public bool Ativo { get; set; } = true;

    public DateTime CriadoEm { get; set; }
    public DateTime AtualizadoEm { get; set; }

    /// <summary>Usuario que criou o caso (opcional).</summary>
    public int? CriadoPorUsuarioId { get; set; }

    // --- Navegacao ---

    public Usuario? CriadoPor { get; set; }

    /// <summary>Respostas especificas de anamnese para este caso.</summary>
    public ICollection<RespostaCasoPergunta> RespostasPerguntas { get; set; } = new List<RespostaCasoPergunta>();

    /// <summary>Perguntas especificas criadas exclusivamente para este caso.</summary>
    public ICollection<PerguntaCaso> PerguntasCasos { get; set; } = new List<PerguntaCaso>();

    /// <summary>Achados de exame fisico especificos deste caso.</summary>
    public ICollection<AchadoFisicoCaso> AchadosFisicos { get; set; } = new List<AchadoFisicoCaso>();

    /// <summary>Sessoes de atendimento realizadas com este caso.</summary>
    public ICollection<Sessao> Sessoes { get; set; } = new List<Sessao>();

    /// <summary>Arquivos anexados ao caso (imagens, PDFs, etc.).</summary>
    public ICollection<AnexoCaso> Anexos { get; set; } = new List<AnexoCaso>();
}
