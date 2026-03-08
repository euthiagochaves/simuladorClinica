using Microsoft.EntityFrameworkCore;
using ClinicaSim.API.Models.Entities;
using ClinicaSim.API.Models.Enums;

namespace ClinicaSim.API.Data;

/// <summary>
/// Contexto principal do banco de dados do ClinicaSim.
/// Configura todas as entidades, relacionamentos e convenções para PostgreSQL.
/// </summary>
public class ClinicaSimDbContext : DbContext
{
    public ClinicaSimDbContext(DbContextOptions<ClinicaSimDbContext> options)
        : base(options)
    {
    }

    // =====================================================================
    // DbSets — tabelas do sistema
    // =====================================================================

    /// <summary>Usuários do sistema (alunos, professores, administradores).</summary>
    public DbSet<Usuario> Usuarios => Set<Usuario>();

    /// <summary>Casos clínicos simulados.</summary>
    public DbSet<CasoClinico> CasosClinicos => Set<CasoClinico>();

    /// <summary>Banco global de perguntas de anamnese.</summary>
    public DbSet<Pergunta> Perguntas => Set<Pergunta>();

    /// <summary>Respostas específicas de cada caso para perguntas do banco global.</summary>
    public DbSet<RespostaCasoPergunta> RespostasCasosPerguntas => Set<RespostaCasoPergunta>();

    /// <summary>Banco global de achados de exame físico.</summary>
    public DbSet<AchadoFisico> AchadosFisicos => Set<AchadoFisico>();

    /// <summary>Achados de exame físico específicos de cada caso clínico.</summary>
    public DbSet<AchadoFisicoCaso> AchadosFisicosCasos => Set<AchadoFisicoCaso>();

    /// <summary>Sessões de atendimento realizadas pelos alunos.</summary>
    public DbSet<Sessao> Sessoes => Set<Sessao>();

    /// <summary>Eventos/interações registrados durante as sessões.</summary>
    public DbSet<EventoSessao> EventosSessoes => Set<EventoSessao>();

    /// <summary>Notas clínicas escritas pelos alunos.</summary>
    public DbSet<NotaClinica> NotasClinicas => Set<NotaClinica>();

    /// <summary>Diagnósticos diferenciais informados pelos alunos.</summary>
    public DbSet<DiagnosticoDiferencial> DiagnosticosDiferenciais => Set<DiagnosticoDiferencial>();

    /// <summary>PDFs gerados ao finalizar sessões.</summary>
    public DbSet<SessaoPdf> SessoesPdfs => Set<SessaoPdf>();

    /// <summary>Arquivos anexados aos casos clínicos.</summary>
    public DbSet<AnexoCaso> AnexosCasos => Set<AnexoCaso>();

    /// <summary>Logs de importação de casos via YAML.</summary>
    public DbSet<LogImportacaoCaso> LogsImportacaoCasos => Set<LogImportacaoCaso>();

    /// <summary>Logs de auditoria de ações administrativas.</summary>
    public DbSet<LogAuditoria> LogsAuditoria => Set<LogAuditoria>();

    /// <summary>Configurações globais do sistema (chave-valor).</summary>
    public DbSet<ConfiguracaoSistema> ConfiguracoesSistema => Set<ConfiguracaoSistema>();

    // =====================================================================
    // Configuração do modelo (Fluent API)
    // =====================================================================

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // -----------------------------------------------------------------
        // Armazenar enums como texto no PostgreSQL para legibilidade
        // -----------------------------------------------------------------
        modelBuilder.HasPostgresEnum<PerfilUsuario>();
        modelBuilder.HasPostgresEnum<StatusSessao>();
        modelBuilder.HasPostgresEnum<TipoEvento>();
        modelBuilder.HasPostgresEnum<TipoAcao>();
        modelBuilder.HasPostgresEnum<StatusImportacao>();

        // =================================================================
        // USUARIO
        // =================================================================
        modelBuilder.Entity<Usuario>(entity =>
        {
            entity.ToTable("usuarios");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.NomeCompleto).HasColumnName("nome_completo").IsRequired().HasMaxLength(200);
            entity.Property(e => e.Email).HasColumnName("email").IsRequired().HasMaxLength(200);
            entity.Property(e => e.SenhaHash).HasColumnName("senha_hash").HasMaxLength(500);
            entity.Property(e => e.Perfil).HasColumnName("perfil").IsRequired()
                .HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.Ativo).HasColumnName("ativo").HasDefaultValue(true);
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");

            // Índice único no e-mail
            entity.HasIndex(e => e.Email).IsUnique();
        });

        // =================================================================
        // CASO CLÍNICO
        // =================================================================
        modelBuilder.Entity<CasoClinico>(entity =>
        {
            entity.ToTable("casos_clinicos");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Titulo).HasColumnName("titulo").IsRequired().HasMaxLength(300);
            entity.Property(e => e.NomePaciente).HasColumnName("nome_paciente").IsRequired().HasMaxLength(200);
            entity.Property(e => e.Idade).HasColumnName("idade").IsRequired();
            entity.Property(e => e.Sexo).HasColumnName("sexo").IsRequired().HasMaxLength(20);
            entity.Property(e => e.QueixaPrincipal).HasColumnName("queixa_principal").IsRequired();
            entity.Property(e => e.Triagem).HasColumnName("triagem").HasMaxLength(30);
            entity.Property(e => e.Resumo).HasColumnName("resumo");
            entity.Property(e => e.Ativo).HasColumnName("ativo").HasDefaultValue(true);
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");
            entity.Property(e => e.CriadoPorUsuarioId).HasColumnName("criado_por_usuario_id");

            // Relacionamento: CasoClinico -> Usuario (criador, opcional)
            // Se o usuário for excluído, seta nulo no caso clínico
            entity.HasOne(e => e.CriadoPor)
                .WithMany(u => u.CasosCriados)
                .HasForeignKey(e => e.CriadoPorUsuarioId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // =================================================================
        // PERGUNTA
        // =================================================================
        modelBuilder.Entity<Pergunta>(entity =>
        {
            entity.ToTable("perguntas");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Texto).HasColumnName("texto").IsRequired();
            entity.Property(e => e.Secao).HasColumnName("secao").IsRequired().HasMaxLength(100);
            entity.Property(e => e.Categoria).HasColumnName("categoria").IsRequired().HasMaxLength(100);
            entity.Property(e => e.RespostaPadrao).HasColumnName("resposta_padrao").IsRequired();
            entity.Property(e => e.Ativo).HasColumnName("ativo").HasDefaultValue(true);
            entity.Property(e => e.OrdemExibicao).HasColumnName("ordem_exibicao");
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");
        });

        // =================================================================
        // RESPOSTA CASO PERGUNTA (tabela de junção com dados extras)
        // =================================================================
        modelBuilder.Entity<RespostaCasoPergunta>(entity =>
        {
            entity.ToTable("respostas_casos_perguntas");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CasoClinicoId).HasColumnName("caso_clinico_id").IsRequired();
            entity.Property(e => e.PerguntaId).HasColumnName("pergunta_id").IsRequired();
            entity.Property(e => e.TextoResposta).HasColumnName("texto_resposta").IsRequired();
            entity.Property(e => e.Destacada).HasColumnName("destacada");
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");

            // Índice composto único: cada caso só tem uma resposta por pergunta
            entity.HasIndex(e => new { e.CasoClinicoId, e.PerguntaId }).IsUnique();

            // Relacionamento: RespostaCasoPergunta -> CasoClinico
            entity.HasOne(e => e.CasoClinico)
                .WithMany(c => c.RespostasPerguntas)
                .HasForeignKey(e => e.CasoClinicoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relacionamento: RespostaCasoPergunta -> Pergunta
            entity.HasOne(e => e.Pergunta)
                .WithMany(p => p.RespostasCasos)
                .HasForeignKey(e => e.PerguntaId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =================================================================
        // ACHADO FÍSICO
        // =================================================================
        modelBuilder.Entity<AchadoFisico>(entity =>
        {
            entity.ToTable("achados_fisicos");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Nome).HasColumnName("nome").IsRequired().HasMaxLength(200);
            entity.Property(e => e.SistemaCategoria).HasColumnName("sistema_categoria").IsRequired().HasMaxLength(100);
            entity.Property(e => e.Descricao).HasColumnName("descricao");
            entity.Property(e => e.ResultadoPadrao).HasColumnName("resultado_padrao").IsRequired();
            entity.Property(e => e.Ativo).HasColumnName("ativo").HasDefaultValue(true);
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");
        });

        // =================================================================
        // ACHADO FÍSICO CASO (tabela de junção com dados extras)
        // =================================================================
        modelBuilder.Entity<AchadoFisicoCaso>(entity =>
        {
            entity.ToTable("achados_fisicos_casos");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CasoClinicoId).HasColumnName("caso_clinico_id").IsRequired();
            entity.Property(e => e.AchadoFisicoId).HasColumnName("achado_fisico_id").IsRequired();
            entity.Property(e => e.Presente).HasColumnName("presente");
            entity.Property(e => e.TextoDetalhe).HasColumnName("texto_detalhe");
            entity.Property(e => e.Destacado).HasColumnName("destacado");
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");

            // Índice composto único: cada caso só tem um achado por achado físico global
            entity.HasIndex(e => new { e.CasoClinicoId, e.AchadoFisicoId }).IsUnique();

            // Relacionamento: AchadoFisicoCaso -> CasoClinico
            entity.HasOne(e => e.CasoClinico)
                .WithMany(c => c.AchadosFisicos)
                .HasForeignKey(e => e.CasoClinicoId)
                .OnDelete(DeleteBehavior.Cascade);

            // Relacionamento: AchadoFisicoCaso -> AchadoFisico
            entity.HasOne(e => e.AchadoFisico)
                .WithMany(a => a.AchadosCasos)
                .HasForeignKey(e => e.AchadoFisicoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =================================================================
        // SESSÃO
        // =================================================================
        modelBuilder.Entity<Sessao>(entity =>
        {
            entity.ToTable("sessoes");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CasoClinicoId).HasColumnName("caso_clinico_id").IsRequired();
            entity.Property(e => e.AlunoId).HasColumnName("aluno_id");
            entity.Property(e => e.CodigoSessao).HasColumnName("codigo_sessao").IsRequired().HasMaxLength(20);
            entity.Property(e => e.IniciadoEm).HasColumnName("iniciado_em");
            entity.Property(e => e.FinalizadoEm).HasColumnName("finalizado_em");
            entity.Property(e => e.Status).HasColumnName("status").IsRequired()
                .HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");

            // Índice único no código da sessão (para busca rápida)
            entity.HasIndex(e => e.CodigoSessao).IsUnique();

            // Relacionamento: Sessao -> CasoClinico (obrigatório, restrito na exclusão)
            entity.HasOne(e => e.CasoClinico)
                .WithMany(c => c.Sessoes)
                .HasForeignKey(e => e.CasoClinicoId)
                .OnDelete(DeleteBehavior.Restrict);

            // Relacionamento: Sessao -> Usuario (aluno, opcional, seta nulo na exclusão)
            entity.HasOne(e => e.Aluno)
                .WithMany(u => u.Sessoes)
                .HasForeignKey(e => e.AlunoId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // =================================================================
        // EVENTO SESSÃO
        // =================================================================
        modelBuilder.Entity<EventoSessao>(entity =>
        {
            entity.ToTable("eventos_sessoes");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SessaoId).HasColumnName("sessao_id").IsRequired();
            entity.Property(e => e.Tipo).HasColumnName("tipo").IsRequired()
                .HasConversion<string>().HasMaxLength(30);
            entity.Property(e => e.ReferenciaId).HasColumnName("referencia_id");
            entity.Property(e => e.TextoExibido).HasColumnName("texto_exibido").IsRequired();
            entity.Property(e => e.TextoResposta).HasColumnName("texto_resposta").IsRequired();
            entity.Property(e => e.OcorridoEm).HasColumnName("ocorrido_em");
            entity.Property(e => e.SegundosDesdeInicio).HasColumnName("segundos_desde_inicio");

            // Relacionamento: EventoSessao -> Sessao (cascata ao excluir sessão)
            entity.HasOne(e => e.Sessao)
                .WithMany(s => s.Eventos)
                .HasForeignKey(e => e.SessaoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =================================================================
        // NOTA CLÍNICA (1:1 com Sessão)
        // =================================================================
        modelBuilder.Entity<NotaClinica>(entity =>
        {
            entity.ToTable("notas_clinicas");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SessaoId).HasColumnName("sessao_id").IsRequired();
            entity.Property(e => e.TextoResumo).HasColumnName("texto_resumo").IsRequired();
            entity.Property(e => e.TextoDiagnosticoProvavel).HasColumnName("texto_diagnostico_provavel").IsRequired();
            entity.Property(e => e.TextoConduta).HasColumnName("texto_conduta").IsRequired();
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");

            // Índice único para garantir relação 1:1 com Sessão
            entity.HasIndex(e => e.SessaoId).IsUnique();

            // Relacionamento 1:1: NotaClinica -> Sessao (cascata ao excluir sessão)
            entity.HasOne(e => e.Sessao)
                .WithOne(s => s.NotaClinica)
                .HasForeignKey<NotaClinica>(e => e.SessaoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =================================================================
        // DIAGNÓSTICO DIFERENCIAL
        // =================================================================
        modelBuilder.Entity<DiagnosticoDiferencial>(entity =>
        {
            entity.ToTable("diagnosticos_diferenciais");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SessaoId).HasColumnName("sessao_id").IsRequired();
            entity.Property(e => e.OrdemPrioridade).HasColumnName("ordem_prioridade").IsRequired();
            entity.Property(e => e.TextoDiagnostico).HasColumnName("texto_diagnostico").IsRequired();
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");

            // Índice composto único: cada sessão só tem um diagnóstico por ordem de prioridade
            entity.HasIndex(e => new { e.SessaoId, e.OrdemPrioridade }).IsUnique();

            // Relacionamento: DiagnosticoDiferencial -> Sessao (cascata ao excluir sessão)
            entity.HasOne(e => e.Sessao)
                .WithMany(s => s.DiagnosticosDiferenciais)
                .HasForeignKey(e => e.SessaoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =================================================================
        // SESSÃO PDF (1:1 com Sessão)
        // =================================================================
        modelBuilder.Entity<SessaoPdf>(entity =>
        {
            entity.ToTable("sessoes_pdfs");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.SessaoId).HasColumnName("sessao_id").IsRequired();
            entity.Property(e => e.NomeArquivo).HasColumnName("nome_arquivo").IsRequired().HasMaxLength(300);
            entity.Property(e => e.CaminhoArquivo).HasColumnName("caminho_arquivo").IsRequired().HasMaxLength(500);
            entity.Property(e => e.GeradoEm).HasColumnName("gerado_em");

            // Índice único para garantir relação 1:1 com Sessão
            entity.HasIndex(e => e.SessaoId).IsUnique();

            // Relacionamento 1:1: SessaoPdf -> Sessao (cascata ao excluir sessão)
            entity.HasOne(e => e.Sessao)
                .WithOne(s => s.Pdf)
                .HasForeignKey<SessaoPdf>(e => e.SessaoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =================================================================
        // ANEXO CASO
        // =================================================================
        modelBuilder.Entity<AnexoCaso>(entity =>
        {
            entity.ToTable("anexos_casos");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CasoClinicoId).HasColumnName("caso_clinico_id").IsRequired();
            entity.Property(e => e.NomeArquivo).HasColumnName("nome_arquivo").IsRequired().HasMaxLength(300);
            entity.Property(e => e.CaminhoArquivo).HasColumnName("caminho_arquivo").IsRequired().HasMaxLength(500);
            entity.Property(e => e.TipoArquivo).HasColumnName("tipo_arquivo").IsRequired().HasMaxLength(50);
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");

            // Relacionamento: AnexoCaso -> CasoClinico (cascata ao excluir caso)
            entity.HasOne(e => e.CasoClinico)
                .WithMany(c => c.Anexos)
                .HasForeignKey(e => e.CasoClinicoId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =================================================================
        // LOG IMPORTAÇÃO CASO
        // =================================================================
        modelBuilder.Entity<LogImportacaoCaso>(entity =>
        {
            entity.ToTable("logs_importacao_casos");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.CasoClinicoId).HasColumnName("caso_clinico_id");
            entity.Property(e => e.ImportadoPorUsuarioId).HasColumnName("importado_por_usuario_id").IsRequired();
            entity.Property(e => e.TipoOrigem).HasColumnName("tipo_origem").IsRequired().HasMaxLength(30);
            entity.Property(e => e.ConteudoOrigem).HasColumnName("conteudo_origem");
            entity.Property(e => e.Status).HasColumnName("status").IsRequired()
                .HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.MensagemErro).HasColumnName("mensagem_erro");
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");

            // Relacionamento: LogImportacaoCaso -> CasoClinico (opcional, seta nulo)
            entity.HasOne(e => e.CasoClinico)
                .WithMany()
                .HasForeignKey(e => e.CasoClinicoId)
                .OnDelete(DeleteBehavior.SetNull);

            // Relacionamento: LogImportacaoCaso -> Usuario (quem importou)
            entity.HasOne(e => e.ImportadoPor)
                .WithMany(u => u.LogsImportacao)
                .HasForeignKey(e => e.ImportadoPorUsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =================================================================
        // LOG AUDITORIA
        // =================================================================
        modelBuilder.Entity<LogAuditoria>(entity =>
        {
            entity.ToTable("logs_auditoria");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.UsuarioId).HasColumnName("usuario_id").IsRequired();
            entity.Property(e => e.NomeEntidade).HasColumnName("nome_entidade").IsRequired().HasMaxLength(100);
            entity.Property(e => e.EntidadeId).HasColumnName("entidade_id");
            entity.Property(e => e.TipoAcao).HasColumnName("tipo_acao").IsRequired()
                .HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.ValoresAntigos).HasColumnName("valores_antigos");
            entity.Property(e => e.ValoresNovos).HasColumnName("valores_novos");
            entity.Property(e => e.CriadoEm).HasColumnName("criado_em");

            // Relacionamento: LogAuditoria -> Usuario
            entity.HasOne(e => e.Usuario)
                .WithMany(u => u.LogsAuditoria)
                .HasForeignKey(e => e.UsuarioId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // =================================================================
        // CONFIGURAÇÃO SISTEMA
        // =================================================================
        modelBuilder.Entity<ConfiguracaoSistema>(entity =>
        {
            entity.ToTable("configuracoes_sistema");

            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Chave).HasColumnName("chave").IsRequired().HasMaxLength(100);
            entity.Property(e => e.Valor).HasColumnName("valor").IsRequired();
            entity.Property(e => e.Descricao).HasColumnName("descricao");
            entity.Property(e => e.AtualizadoEm).HasColumnName("atualizado_em");

            // Índice único na chave de configuração
            entity.HasIndex(e => e.Chave).IsUnique();
        });
    }

    // =====================================================================
    // Preenchimento automático de timestamps (CriadoEm / AtualizadoEm)
    // =====================================================================

    /// <summary>
    /// Sobrescreve SaveChangesAsync para preencher automaticamente
    /// CriadoEm (ao adicionar) e AtualizadoEm (ao adicionar ou modificar).
    /// Usa DateTime.UtcNow para consistência com PostgreSQL.
    /// </summary>
    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        var agora = DateTime.UtcNow;

        foreach (var entrada in ChangeTracker.Entries())
        {
            // Preencher CriadoEm ao adicionar novas entidades
            if (entrada.State == EntityState.Added)
            {
                var propCriadoEm = entrada.Properties
                    .FirstOrDefault(p => p.Metadata.Name == "CriadoEm");

                if (propCriadoEm != null && propCriadoEm.CurrentValue is DateTime dt && dt == default)
                {
                    propCriadoEm.CurrentValue = agora;
                }
            }

            // Preencher AtualizadoEm ao adicionar ou modificar
            if (entrada.State == EntityState.Added || entrada.State == EntityState.Modified)
            {
                var propAtualizadoEm = entrada.Properties
                    .FirstOrDefault(p => p.Metadata.Name == "AtualizadoEm");

                if (propAtualizadoEm != null)
                {
                    propAtualizadoEm.CurrentValue = agora;
                }
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
}
