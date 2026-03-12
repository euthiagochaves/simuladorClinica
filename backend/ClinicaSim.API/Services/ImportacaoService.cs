using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using YamlDotNet.Serialization;
using YamlDotNet.Serialization.NamingConventions;
using ClinicaSim.API.Data;
using ClinicaSim.API.DTOs.Importacao;
using ClinicaSim.API.Models.Entities;
using ClinicaSim.API.Models.Enums;
using ClinicaSim.API.Services.Interfaces;

namespace ClinicaSim.API.Services;

/// <summary>
/// Implementacao do servico de importacao de casos clinicos via YAML.
/// </summary>
public class ImportacaoService : IImportacaoService
{
    private readonly ClinicaSimDbContext _contexto;
    private readonly ILogger<ImportacaoService> _logger;

    public ImportacaoService(ClinicaSimDbContext contexto, ILogger<ImportacaoService> logger)
    {
        _contexto = contexto;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<ResultadoImportacaoResponse> ImportarYamlAsync(string conteudoYaml, int? usuarioId)
    {
        if (string.IsNullOrWhiteSpace(conteudoYaml))
        {
            return new ResultadoImportacaoResponse(
                Sucesso: false,
                MensagemErro: "El contenido YAML esta vacio.",
                CasoClinicoId: null,
                AvisosRevisao: null
            );
        }

        var avisos = new List<string>();
        CasoClinico? casoCriado = null;

        try
        {
            var yaml = ParseYaml(conteudoYaml);
            ValidarEstruturaMinima(yaml);

            await using var transacao = await _contexto.Database.BeginTransactionAsync();

            casoCriado = await CriarCasoBaseAsync(yaml.Caso!, usuarioId);
            await CriarAnamnesisAsync(casoCriado.Id, yaml.Caso!, avisos);
            await CriarExameFisicoAsync(casoCriado.Id, yaml.Caso!, avisos);

            await _contexto.SaveChangesAsync();
            await transacao.CommitAsync();

            await RegistrarLogImportacaoAsync(
                conteudoYaml,
                usuarioId,
                StatusImportacao.Sucesso,
                null,
                casoCriado.Id
            );

            return new ResultadoImportacaoResponse(
                Sucesso: true,
                MensagemErro: null,
                CasoClinicoId: casoCriado.Id,
                AvisosRevisao: avisos.Count > 0 ? avisos : null
            );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao importar YAML.");

            await RegistrarLogImportacaoAsync(
                conteudoYaml,
                usuarioId,
                StatusImportacao.Erro,
                ex.Message,
                casoCriado?.Id
            );

            return new ResultadoImportacaoResponse(
                Sucesso: false,
                MensagemErro: $"Error al procesar el YAML: {ex.Message}",
                CasoClinicoId: null,
                AvisosRevisao: null
            );
        }
    }

    /// <inheritdoc />
    public async Task<string> GerarTemplateYamlAsync()
    {
        var perguntasGlobais = await _contexto.Perguntas
            .AsNoTracking()
            .Where(p => p.Ativo)
            .OrderBy(p => p.Secao)
            .ThenBy(p => p.Categoria)
            .ThenBy(p => p.OrdemExibicao)
            .ThenBy(p => p.Texto)
            .ToListAsync();

        var achadosGlobais = await _contexto.AchadosFisicos
            .AsNoTracking()
            .Where(a => a.Ativo)
            .OrderBy(a => a.SistemaCategoria)
            .ThenBy(a => a.Nome)
            .ToListAsync();

        var secoes = perguntasGlobais
            .Select(p => p.Secao)
            .Distinct()
            .OrderBy(s => s)
            .ToList();

        var categorias = perguntasGlobais
            .Select(p => p.Categoria)
            .Distinct()
            .OrderBy(c => c)
            .ToList();

        var sb = new StringBuilder();
        sb.AppendLine("# plantilla_yaml_version: 1.0");
        sb.AppendLine("# INSTRUCCIONES:");
        sb.AppendLine("# 1) Usar solo opciones fijas permitidas para triaje, sexo, secao, categoria y sistema_categoria.");
        sb.AppendLine("# 2) Priorizar la edicion de respuestas de preguntas y hallazgos globales del template.");
        sb.AppendLine("# 3) Crear preguntas_del_caso y hallazgos_del_caso solo en excepciones reales.");
        sb.AppendLine("# 4) En hallazgos_del_caso, NO enviar 'presente': se define automaticamente.");
        sb.AppendLine("# triaje: [\"Urgente\", \"Prioritario\", \"Normal\"]");
        sb.AppendLine("# sexo: [\"Masculino\", \"Femenino\", \"Otro\"]");
        sb.AppendLine("# secao: [\"Antecedentes Hereditarios y Familiares\", \"Antecedentes Personales\", \"Datos Personales\", \"Historia de la Enfermedad Actual\", \"Motivo de Consulta\"]");
        sb.AppendLine("# categoria: [\"Alergias\", \"Antecedentes familiares\", \"Cardiovascular\", \"Contexto social\", \"Dolor\", \"Fisiológicos\", \"Gastrointestinal\", \"Hábitos\", \"Identificación\", \"Medicación\", \"Medio\", \"Motivo de consulta\", \"Neurológico\", \"Patológicos\", \"Respiratorio\", \"Salud mental\", \"Sexual\", \"Síntomas generales\", \"Sueño\", \"Urinario\", \"Vacunación\"]");
        sb.AppendLine("# sistema_categoria: [\"Estado General\", \"Aparato Cardiovascular\", \"Aparato Digestivo\", \"Sistema Respiratorio\", \"Sistema Nefrourológico\", \"Sistema Neurológico\", \"Sistema Osteoartromuscular\", \"Sistema Respiratorio\"]");
        sb.AppendLine($"# secoes_globais_no_banco: [{FormatearListaComoYaml(secoes)}]");
        sb.AppendLine($"# categorias_globais_no_banco: [{FormatearListaComoYaml(categorias)}]");
        sb.AppendLine();
        sb.AppendLine("caso:");
        sb.AppendLine("  triage:");
        sb.AppendLine($"    titulo: {YamlTexto("Caso ejemplo")}");
        sb.AppendLine($"    nombre_paciente: {YamlTexto("Paciente Ejemplo")}");
        sb.AppendLine("    edad: 45");
        sb.AppendLine($"    sexo: {YamlTexto("Masculino")}");
        sb.AppendLine($"    motivo_consulta: {YamlTexto("Dolor abdominal")}");
        sb.AppendLine($"    triaje: {YamlTexto("Urgente")}");
        sb.AppendLine($"    resumen: {YamlTexto("Resumen del caso.")}");
        sb.AppendLine("    activo: true");
        sb.AppendLine();
        sb.AppendLine("  anamnesis:");
        sb.AppendLine("    preguntas_globales:");

        if (perguntasGlobais.Count == 0)
        {
            sb.AppendLine("      []");
        }
        else
        {
            foreach (var pergunta in perguntasGlobais)
            {
                sb.AppendLine("      - referencia_global:");
                sb.AppendLine($"          id: {pergunta.Id}");
                sb.AppendLine($"          texto: {YamlTexto(pergunta.Texto)}");
                sb.AppendLine($"        respuesta_especifica_caso: {YamlTexto(pergunta.RespostaPadrao)}");
                sb.AppendLine("        destacada: false");
            }
        }

        sb.AppendLine("    preguntas_del_caso:");
        sb.AppendLine("      []");
        sb.AppendLine();
        sb.AppendLine("  examen_fisico:");
        sb.AppendLine("    hallazgos_globales:");

        if (achadosGlobais.Count == 0)
        {
            sb.AppendLine("      []");
        }
        else
        {
            foreach (var achado in achadosGlobais)
            {
                sb.AppendLine("      - referencia_global:");
                sb.AppendLine($"          id: {achado.Id}");
                sb.AppendLine($"          nombre: {YamlTexto(achado.Nome)}");
                sb.AppendLine($"        respuesta_especifica_caso: {YamlTexto(achado.ResultadoPadrao)}");
                sb.AppendLine("        destacado: false");
            }
        }

        sb.AppendLine("    hallazgos_del_caso:");
        sb.AppendLine("      []");
        sb.AppendLine();
        sb.AppendLine("avisos_revision:");
        sb.AppendLine("  - \"Si se crean preguntas/hallazgos del caso, revisarlos en la pantalla de edicion.\"");
        sb.AppendLine();
        sb.AppendLine("# MODELOS DE REFERENCIA (NO se importan, solo guia para IA):");
        sb.AppendLine("modelos_referencia:");
        sb.AppendLine("  preguntas_del_caso:");
        sb.AppendLine("    - texto: \"Pregunta especifica del caso\"");
        sb.AppendLine("      secao: \"Historia de la Enfermedad Actual\"");
        sb.AppendLine("      categoria: \"Síntomas generales\"");
        sb.AppendLine("      resposta_padrao: \"Respuesta para esta pregunta en este caso\"");
        sb.AppendLine("      ordem_exibicao: 0");
        sb.AppendLine("      ativo: true");
        sb.AppendLine("  hallazgos_del_caso:");
        sb.AppendLine("    - nombre: \"Hallazgo especifico del caso\"");
        sb.AppendLine("      sistema_categoria: \"Estado General\"");
        sb.AppendLine("      descripcion: \"Descripcion opcional\"");
        sb.AppendLine("      resultado_caso: \"Resultado del caso\"");
        sb.AppendLine("      destacado: false");

        return sb.ToString();
    }

    private YamlCasoEnvelope ParseYaml(string conteudoYaml)
    {
        var deserializer = new DeserializerBuilder()
            .WithNamingConvention(UnderscoredNamingConvention.Instance)
            .IgnoreUnmatchedProperties()
            .Build();

        var yaml = deserializer.Deserialize<YamlCasoEnvelope>(conteudoYaml);

        if (yaml is null)
            throw new InvalidOperationException("No se pudo interpretar el contenido YAML.");

        return yaml;
    }

    private static void ValidarEstruturaMinima(YamlCasoEnvelope yaml)
    {
        if (yaml.Caso is null)
            throw new InvalidOperationException("Bloque 'caso' no encontrado.");

        var triage = yaml.Caso.ObterTriage();
        if (triage is null)
            throw new InvalidOperationException("Bloque 'caso.triage' no encontrado.");

        if (string.IsNullOrWhiteSpace(triage.Titulo))
            throw new InvalidOperationException("Campo obligatorio faltante: caso.triage.titulo.");
        if (string.IsNullOrWhiteSpace(triage.NombrePaciente))
            throw new InvalidOperationException("Campo obligatorio faltante: caso.triage.nombre_paciente.");
        if (triage.Edad is null || triage.Edad < 0)
            throw new InvalidOperationException("Campo obligatorio invalido: caso.triage.edad.");
        if (string.IsNullOrWhiteSpace(triage.Sexo))
            throw new InvalidOperationException("Campo obligatorio faltante: caso.triage.sexo.");
        if (string.IsNullOrWhiteSpace(triage.MotivoConsulta))
            throw new InvalidOperationException("Campo obligatorio faltante: caso.triage.motivo_consulta.");
    }

    private async Task<CasoClinico> CriarCasoBaseAsync(YamlCaso yamlCaso, int? usuarioId)
    {
        var triage = yamlCaso.ObterTriage()!;

        var caso = new CasoClinico
        {
            Titulo = triage.Titulo!.Trim(),
            NomePaciente = triage.NombrePaciente!.Trim(),
            Idade = triage.Edad!.Value,
            Sexo = triage.Sexo!.Trim(),
            QueixaPrincipal = triage.MotivoConsulta!.Trim(),
            Triagem = triage.Triaje?.Trim(),
            Resumo = triage.Resumen?.Trim(),
            Ativo = triage.Ativo ?? true,
            CriadoPorUsuarioId = await ObterUsuarioValidoAsync(usuarioId)
        };

        _contexto.CasosClinicos.Add(caso);
        await _contexto.SaveChangesAsync();
        return caso;
    }

    private async Task CriarAnamnesisAsync(int casoId, YamlCaso yamlCaso, List<string> avisos)
    {
        var yamlAnamnesis = yamlCaso.Anamnesis;
        if (yamlAnamnesis is null)
            return;

        var perguntasGlobais = await _contexto.Perguntas
            .AsNoTracking()
            .Where(p => p.Ativo)
            .ToListAsync();

        var respostasCriadasPorPerguntaId = new Dictionary<int, RespostaCasoPergunta>();

        foreach (var item in yamlAnamnesis.PreguntasGlobales ?? [])
        {
            var perguntaGlobal = ResolverPerguntaGlobal(perguntasGlobais, item.ReferenciaGlobal);

            if (perguntaGlobal is null)
            {
                var textoPergunta = item.ReferenciaGlobal?.Texto?.Trim();
                if (string.IsNullOrWhiteSpace(textoPergunta))
                    continue;

                _contexto.PerguntasCasos.Add(new PerguntaCaso
                {
                    CasoClinicoId = casoId,
                    Texto = textoPergunta,
                    Secao = "Anamnesis",
                    Categoria = "Importado",
                    RespostaPadrao = item.RespuestaEspecificaCaso?.Trim() ?? string.Empty,
                    OrdemExibicao = 0,
                    Ativo = true
                });

                avisos.Add($"Pregunta global no encontrada y creada como pregunta del caso: '{textoPergunta}'. Revisar en edicion.");
                continue;
            }

            var resposta = new RespostaCasoPergunta
            {
                CasoClinicoId = casoId,
                PerguntaId = perguntaGlobal.Id,
                TextoResposta = string.IsNullOrWhiteSpace(item.RespuestaEspecificaCaso)
                    ? perguntaGlobal.RespostaPadrao
                    : item.RespuestaEspecificaCaso.Trim(),
                Destacada = item.Destacada ?? false
            };

            respostasCriadasPorPerguntaId[perguntaGlobal.Id] = resposta;
        }

        if (respostasCriadasPorPerguntaId.Count > 0)
            _contexto.RespostasCasosPerguntas.AddRange(respostasCriadasPorPerguntaId.Values);

        foreach (var item in yamlAnamnesis.PreguntasDelCaso ?? [])
        {
            if (ItemPerguntaCasoVazio(item))
                continue;

            _contexto.PerguntasCasos.Add(new PerguntaCaso
            {
                CasoClinicoId = casoId,
                Texto = (item.Texto ?? string.Empty).Trim(),
                Secao = string.IsNullOrWhiteSpace(item.Secao) ? "Anamnesis" : item.Secao.Trim(),
                Categoria = string.IsNullOrWhiteSpace(item.Categoria) ? "Importado" : item.Categoria.Trim(),
                RespostaPadrao = item.RespostaPadrao?.Trim() ?? string.Empty,
                OrdemExibicao = item.OrdemExibicao ?? 0,
                Ativo = item.Ativo ?? true
            });
        }
    }

    private async Task CriarExameFisicoAsync(int casoId, YamlCaso yamlCaso, List<string> avisos)
    {
        var yamlExameFisico = yamlCaso.ObterExameFisico();
        if (yamlExameFisico is null)
            return;

        var achadosGlobais = await _contexto.AchadosFisicos
            .Where(a => a.Ativo)
            .ToListAsync();

        var achadosCriadosPorAchadoId = new Dictionary<int, AchadoFisicoCaso>();

        foreach (var item in yamlExameFisico.HallazgosGlobales ?? [])
        {
            var achadoGlobal = ResolverAchadoGlobal(achadosGlobais, item.ReferenciaGlobal);

            if (achadoGlobal is null)
            {
                var nome = item.ReferenciaGlobal?.Nombre?.Trim();
                if (string.IsNullOrWhiteSpace(nome))
                    continue;

                var novoGlobal = new AchadoFisico
                {
                    Nome = nome,
                    SistemaCategoria = string.IsNullOrWhiteSpace(item.SistemaCategoria) ? "Importado" : item.SistemaCategoria.Trim(),
                    Descricao = "Criado automaticamente durante importacao YAML.",
                    ResultadoPadrao = item.RespuestaEspecificaCaso?.Trim() ?? string.Empty,
                    Ativo = true
                };

                _contexto.AchadosFisicos.Add(novoGlobal);
                await _contexto.SaveChangesAsync();

                achadosGlobais.Add(novoGlobal);
                achadoGlobal = novoGlobal;

                avisos.Add($"Hallazgo global no encontrado y creado para uso en el caso: '{nome}'. Revisar en edicion.");
            }

            var achadoCaso = new AchadoFisicoCaso
            {
                CasoClinicoId = casoId,
                AchadoFisicoId = achadoGlobal.Id,
                Presente = true,
                TextoDetalhe = string.IsNullOrWhiteSpace(item.RespuestaEspecificaCaso)
                    ? achadoGlobal.ResultadoPadrao
                    : item.RespuestaEspecificaCaso.Trim(),
                Destacado = item.Destacado ?? false
            };

            achadosCriadosPorAchadoId[achadoGlobal.Id] = achadoCaso;
        }

        foreach (var item in yamlExameFisico.HallazgosDelCaso ?? [])
        {
            if (ItemHallazgoCasoVazio(item))
                continue;

            var nomeAchado = (item.Nombre ?? string.Empty).Trim();
            var achadoGlobal = achadosGlobais.FirstOrDefault(a => string.Equals(a.Nome, nomeAchado, StringComparison.OrdinalIgnoreCase));

            if (achadoGlobal is null)
            {
                achadoGlobal = new AchadoFisico
                {
                    Nome = nomeAchado,
                    SistemaCategoria = string.IsNullOrWhiteSpace(item.SistemaCategoria) ? "Importado" : item.SistemaCategoria.Trim(),
                    Descricao = item.Descripcion?.Trim(),
                    ResultadoPadrao = item.ResultadoCaso?.Trim() ?? string.Empty,
                    Ativo = true
                };

                _contexto.AchadosFisicos.Add(achadoGlobal);
                await _contexto.SaveChangesAsync();
                achadosGlobais.Add(achadoGlobal);

                avisos.Add($"Hallazgo del caso sin equivalente global. Se creo uno auxiliar: '{nomeAchado}'. Revisar en edicion.");
            }

            var achadoCaso = new AchadoFisicoCaso
            {
                CasoClinicoId = casoId,
                AchadoFisicoId = achadoGlobal.Id,
                Presente = true,
                TextoDetalhe = item.ResultadoCaso?.Trim(),
                Destacado = item.Destacado ?? false
            };

            achadosCriadosPorAchadoId[achadoGlobal.Id] = achadoCaso;
        }

        if (achadosCriadosPorAchadoId.Count > 0)
            _contexto.AchadosFisicosCasos.AddRange(achadosCriadosPorAchadoId.Values);
    }

    private static Pergunta? ResolverPerguntaGlobal(List<Pergunta> perguntasGlobais, YamlReferenciaPerguntaGlobal? referencia)
    {
        if (referencia is null)
            return null;

        if (referencia.Id.HasValue && referencia.Id.Value > 0)
        {
            var porId = perguntasGlobais.FirstOrDefault(p => p.Id == referencia.Id.Value);
            if (porId is not null)
                return porId;
        }

        if (!string.IsNullOrWhiteSpace(referencia.Texto))
        {
            var texto = referencia.Texto.Trim();
            return perguntasGlobais.FirstOrDefault(p => string.Equals(p.Texto, texto, StringComparison.OrdinalIgnoreCase));
        }

        return null;
    }

    private static AchadoFisico? ResolverAchadoGlobal(List<AchadoFisico> achadosGlobais, YamlReferenciaAchadoGlobal? referencia)
    {
        if (referencia is null)
            return null;

        if (referencia.Id.HasValue && referencia.Id.Value > 0)
        {
            var porId = achadosGlobais.FirstOrDefault(a => a.Id == referencia.Id.Value);
            if (porId is not null)
                return porId;
        }

        if (!string.IsNullOrWhiteSpace(referencia.Nombre))
        {
            var nome = referencia.Nombre.Trim();
            return achadosGlobais.FirstOrDefault(a => string.Equals(a.Nome, nome, StringComparison.OrdinalIgnoreCase));
        }

        return null;
    }

    private async Task<int?> ObterUsuarioValidoAsync(int? usuarioId)
    {
        if (!usuarioId.HasValue || usuarioId.Value <= 0)
            return null;

        var existe = await _contexto.Usuarios.AnyAsync(u => u.Id == usuarioId.Value);
        return existe ? usuarioId.Value : null;
    }

    private async Task RegistrarLogImportacaoAsync(
        string conteudoYaml,
        int? usuarioId,
        StatusImportacao status,
        string? mensagemErro,
        int? casoClinicoId)
    {
        if (!usuarioId.HasValue || usuarioId.Value <= 0)
            return;

        var usuarioExiste = await _contexto.Usuarios.AnyAsync(u => u.Id == usuarioId.Value);
        if (!usuarioExiste)
            return;

        _contexto.LogsImportacaoCasos.Add(new LogImportacaoCaso
        {
            ImportadoPorUsuarioId = usuarioId.Value,
            CasoClinicoId = casoClinicoId,
            TipoOrigem = "YAML",
            ConteudoOrigem = conteudoYaml,
            Status = status,
            MensagemErro = mensagemErro
        });

        await _contexto.SaveChangesAsync();
    }

    private static string FormatearListaComoYaml(IEnumerable<string> valores)
    {
        return string.Join(", ", valores
            .Where(v => !string.IsNullOrWhiteSpace(v))
            .Select(v => $"\"{v.Replace("\"", "\\\"")}\""));
    }

    private static string YamlTexto(string? valor)
    {
        var texto = valor ?? string.Empty;
        return $"\"{texto.Replace("\\", "\\\\").Replace("\"", "\\\"")}\"";
    }

    private static bool ItemPerguntaCasoVazio(YamlPreguntaCasoItem item)
    {
        return string.IsNullOrWhiteSpace(item.Texto)
            && string.IsNullOrWhiteSpace(item.Secao)
            && string.IsNullOrWhiteSpace(item.Categoria)
            && string.IsNullOrWhiteSpace(item.RespostaPadrao)
            && !item.OrdemExibicao.HasValue
            && !item.Ativo.HasValue;
    }

    private static bool ItemHallazgoCasoVazio(YamlHallazgoCasoItem item)
    {
        return string.IsNullOrWhiteSpace(item.Nombre)
            && string.IsNullOrWhiteSpace(item.SistemaCategoria)
            && string.IsNullOrWhiteSpace(item.Descripcion)
            && string.IsNullOrWhiteSpace(item.ResultadoCaso)
            && !item.Destacado.HasValue;
    }

    private sealed class YamlCasoEnvelope
    {
        public YamlCaso? Caso { get; set; }
        public List<string>? AvisosRevision { get; set; }
    }

    private sealed class YamlCaso
    {
        public YamlTriage? Triage { get; set; }
        public YamlTriage? Triagem { get; set; }
        public YamlAnamnesis? Anamnesis { get; set; }
        public YamlExamenFisico? ExamenFisico { get; set; }
        public YamlExamenFisico? ExameFisico { get; set; }

        public YamlTriage? ObterTriage() => Triage ?? Triagem;
        public YamlExamenFisico? ObterExameFisico() => ExamenFisico ?? ExameFisico;
    }

    private sealed class YamlTriage
    {
        public string? Titulo { get; set; }
        public string? NombrePaciente { get; set; }
        public int? Edad { get; set; }
        public string? Sexo { get; set; }
        public string? MotivoConsulta { get; set; }
        public string? Triaje { get; set; }
        public string? Resumen { get; set; }
        public bool? Ativo { get; set; }
    }

    private sealed class YamlAnamnesis
    {
        public List<YamlPreguntaGlobalItem>? PreguntasGlobales { get; set; }
        public List<YamlPreguntaCasoItem>? PreguntasDelCaso { get; set; }
    }

    private sealed class YamlPreguntaGlobalItem
    {
        public YamlReferenciaPerguntaGlobal? ReferenciaGlobal { get; set; }
        public string? RespuestaEspecificaCaso { get; set; }
        public bool? Destacada { get; set; }
    }

    private sealed class YamlReferenciaPerguntaGlobal
    {
        public int? Id { get; set; }
        public string? Texto { get; set; }
    }

    private sealed class YamlPreguntaCasoItem
    {
        public string? Texto { get; set; }
        public string? Secao { get; set; }
        public string? Categoria { get; set; }
        public string? RespostaPadrao { get; set; }
        public int? OrdemExibicao { get; set; }
        public bool? Ativo { get; set; }
    }

    private sealed class YamlExamenFisico
    {
        public List<YamlHallazgoGlobalItem>? HallazgosGlobales { get; set; }
        public List<YamlHallazgoCasoItem>? HallazgosDelCaso { get; set; }
    }

    private sealed class YamlHallazgoGlobalItem
    {
        public YamlReferenciaAchadoGlobal? ReferenciaGlobal { get; set; }
        public string? RespuestaEspecificaCaso { get; set; }
        public bool? Destacado { get; set; }
        public string? SistemaCategoria { get; set; }
    }

    private sealed class YamlReferenciaAchadoGlobal
    {
        public int? Id { get; set; }
        public string? Nombre { get; set; }
    }

    private sealed class YamlHallazgoCasoItem
    {
        public string? Nombre { get; set; }
        public string? SistemaCategoria { get; set; }
        public string? Descripcion { get; set; }
        public string? ResultadoCaso { get; set; }
        public bool? Destacado { get; set; }
    }
}
