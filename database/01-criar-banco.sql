-- ============================================================================
-- ClinicaSim — Script de criação do banco de dados (PostgreSQL / Supabase)
-- ============================================================================
-- Executar este script no SQL Editor do Supabase (https://supabase.com/dashboard)
-- Ou via psql: psql -h HOST -U postgres -d postgres -f 01-criar-banco.sql
-- ============================================================================

-- Limpar tabelas existentes (caso queira recriar do zero)
-- CUIDADO: isto apaga TODOS os dados!
-- DROP SCHEMA public CASCADE;
-- CREATE SCHEMA public;

-- ============================================================================
-- 1. TABELA: usuarios
-- ============================================================================
CREATE TABLE IF NOT EXISTS usuarios (
    id                  SERIAL PRIMARY KEY,
    nome_completo       VARCHAR(200)    NOT NULL,
    email               VARCHAR(200)    NOT NULL,
    senha_hash          VARCHAR(500),
    perfil              VARCHAR(20)     NOT NULL DEFAULT 'Aluno',
    ativo               BOOLEAN         NOT NULL DEFAULT TRUE,
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_perfil CHECK (perfil IN ('Aluno', 'Professor', 'Administrador'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_usuarios_email ON usuarios (email);

-- ============================================================================
-- 2. TABELA: casos_clinicos
-- ============================================================================
CREATE TABLE IF NOT EXISTS casos_clinicos (
    id                      SERIAL PRIMARY KEY,
    titulo                  VARCHAR(300)    NOT NULL,
    nome_paciente           VARCHAR(200)    NOT NULL,
    idade                   INTEGER         NOT NULL,
    sexo                    VARCHAR(20)     NOT NULL,
    queixa_principal        TEXT            NOT NULL,
    triagem                 VARCHAR(30),
    resumo                  TEXT,
    ativo                   BOOLEAN         NOT NULL DEFAULT TRUE,
    criado_por_usuario_id   INTEGER         REFERENCES usuarios(id) ON DELETE SET NULL,
    criado_em               TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 3. TABELA: perguntas (banco global de anamnese)
-- ============================================================================
CREATE TABLE IF NOT EXISTS perguntas (
    id                  SERIAL PRIMARY KEY,
    texto               TEXT            NOT NULL,
    secao               VARCHAR(100)    NOT NULL DEFAULT 'Anamnesis',
    categoria           VARCHAR(100)    NOT NULL,
    resposta_padrao     TEXT            NOT NULL,
    ativo               BOOLEAN         NOT NULL DEFAULT TRUE,
    ordem_exibicao      INTEGER         NOT NULL DEFAULT 0,
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 4. TABELA: respostas_casos_perguntas (sobrescrita caso → pergunta global)
-- ============================================================================
CREATE TABLE IF NOT EXISTS respostas_casos_perguntas (
    id                  SERIAL PRIMARY KEY,
    caso_clinico_id     INTEGER         NOT NULL REFERENCES casos_clinicos(id) ON DELETE CASCADE,
    pergunta_id         INTEGER         NOT NULL REFERENCES perguntas(id) ON DELETE CASCADE,
    texto_resposta      TEXT            NOT NULL,
    destacada           BOOLEAN         NOT NULL DEFAULT FALSE,
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Cada caso só pode ter UMA resposta por pergunta
CREATE UNIQUE INDEX IF NOT EXISTS ix_respostas_casos_perguntas_caso_pergunta
    ON respostas_casos_perguntas (caso_clinico_id, pergunta_id);

-- ============================================================================
-- 5. TABELA: achados_fisicos (banco global de exame físico)
-- ============================================================================
CREATE TABLE IF NOT EXISTS achados_fisicos (
    id                  SERIAL PRIMARY KEY,
    nome                VARCHAR(200)    NOT NULL,
    sistema_categoria   VARCHAR(100)    NOT NULL,
    descricao           TEXT,
    resultado_padrao    TEXT            NOT NULL,
    ativo               BOOLEAN         NOT NULL DEFAULT TRUE,
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 6. TABELA: achados_fisicos_casos (sobrescrita caso → achado global)
-- ============================================================================
CREATE TABLE IF NOT EXISTS achados_fisicos_casos (
    id                  SERIAL PRIMARY KEY,
    caso_clinico_id     INTEGER         NOT NULL REFERENCES casos_clinicos(id) ON DELETE CASCADE,
    achado_fisico_id    INTEGER         NOT NULL REFERENCES achados_fisicos(id) ON DELETE CASCADE,
    presente            BOOLEAN         NOT NULL DEFAULT TRUE,
    texto_detalhe       TEXT,
    destacado           BOOLEAN         NOT NULL DEFAULT FALSE,
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Cada caso só pode ter UM achado por achado físico global
CREATE UNIQUE INDEX IF NOT EXISTS ix_achados_fisicos_casos_caso_achado
    ON achados_fisicos_casos (caso_clinico_id, achado_fisico_id);

-- ============================================================================
-- 7. TABELA: sessoes (atendimentos dos alunos)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessoes (
    id                  SERIAL PRIMARY KEY,
    caso_clinico_id     INTEGER         NOT NULL REFERENCES casos_clinicos(id) ON DELETE RESTRICT,
    aluno_id            INTEGER         REFERENCES usuarios(id) ON DELETE SET NULL,
    codigo_sessao       VARCHAR(20)     NOT NULL,
    iniciado_em         TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    finalizado_em       TIMESTAMPTZ,
    status              VARCHAR(20)     NOT NULL DEFAULT 'Iniciada',
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_status_sessao CHECK (status IN ('Iniciada', 'EmAndamento', 'Finalizada'))
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_sessoes_codigo ON sessoes (codigo_sessao);

-- ============================================================================
-- 8. TABELA: eventos_sessoes (interações durante a sessão)
-- ============================================================================
CREATE TABLE IF NOT EXISTS eventos_sessoes (
    id                      SERIAL PRIMARY KEY,
    sessao_id               INTEGER         NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
    tipo                    VARCHAR(30)     NOT NULL,
    referencia_id           INTEGER         NOT NULL,
    texto_exibido           TEXT            NOT NULL,
    texto_resposta          TEXT            NOT NULL,
    ocorrido_em             TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    segundos_desde_inicio   INTEGER         NOT NULL DEFAULT 0,

    CONSTRAINT chk_tipo_evento CHECK (tipo IN ('PerguntaClicada', 'AchadoSelecionado'))
);

-- ============================================================================
-- 9. TABELA: notas_clinicas (história clínica — 1:1 com sessão)
-- ============================================================================
CREATE TABLE IF NOT EXISTS notas_clinicas (
    id                              SERIAL PRIMARY KEY,
    sessao_id                       INTEGER     NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
    texto_resumo                    TEXT        NOT NULL,
    texto_diagnostico_provavel      TEXT        NOT NULL,
    texto_conduta                   TEXT        NOT NULL,
    criado_em                       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    atualizado_em                   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Garantir relação 1:1 com sessão
CREATE UNIQUE INDEX IF NOT EXISTS ix_notas_clinicas_sessao ON notas_clinicas (sessao_id);

-- ============================================================================
-- 10. TABELA: diagnosticos_diferenciais (5 por sessão)
-- ============================================================================
CREATE TABLE IF NOT EXISTS diagnosticos_diferenciais (
    id                  SERIAL PRIMARY KEY,
    sessao_id           INTEGER         NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
    ordem_prioridade    INTEGER         NOT NULL,
    texto_diagnostico   TEXT            NOT NULL,
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_ordem CHECK (ordem_prioridade BETWEEN 1 AND 5)
);

-- Cada sessão só tem um diagnóstico por posição de prioridade
CREATE UNIQUE INDEX IF NOT EXISTS ix_diagnosticos_sessao_ordem
    ON diagnosticos_diferenciais (sessao_id, ordem_prioridade);

-- ============================================================================
-- 11. TABELA: sessoes_pdfs (referência ao PDF gerado — 1:1 com sessão)
-- ============================================================================
CREATE TABLE IF NOT EXISTS sessoes_pdfs (
    id                  SERIAL PRIMARY KEY,
    sessao_id           INTEGER         NOT NULL REFERENCES sessoes(id) ON DELETE CASCADE,
    nome_arquivo        VARCHAR(300)    NOT NULL,
    caminho_arquivo     VARCHAR(500)    NOT NULL,
    gerado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Garantir relação 1:1 com sessão
CREATE UNIQUE INDEX IF NOT EXISTS ix_sessoes_pdfs_sessao ON sessoes_pdfs (sessao_id);

-- ============================================================================
-- 12. TABELA: anexos_casos (arquivos auxiliares — futuro)
-- ============================================================================
CREATE TABLE IF NOT EXISTS anexos_casos (
    id                  SERIAL PRIMARY KEY,
    caso_clinico_id     INTEGER         NOT NULL REFERENCES casos_clinicos(id) ON DELETE CASCADE,
    nome_arquivo        VARCHAR(300)    NOT NULL,
    caminho_arquivo     VARCHAR(500)    NOT NULL,
    tipo_arquivo        VARCHAR(50)     NOT NULL,
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ============================================================================
-- 13. TABELA: logs_importacao_casos (logs de importação YAML)
-- ============================================================================
CREATE TABLE IF NOT EXISTS logs_importacao_casos (
    id                          SERIAL PRIMARY KEY,
    caso_clinico_id             INTEGER     REFERENCES casos_clinicos(id) ON DELETE SET NULL,
    importado_por_usuario_id    INTEGER     NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    tipo_origem                 VARCHAR(30) NOT NULL DEFAULT 'YAML',
    conteudo_origem             TEXT,
    status                      VARCHAR(20) NOT NULL,
    mensagem_erro               TEXT,
    criado_em                   TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_status_importacao CHECK (status IN ('Sucesso', 'Erro'))
);

-- ============================================================================
-- 14. TABELA: logs_auditoria (registro de ações administrativas)
-- ============================================================================
CREATE TABLE IF NOT EXISTS logs_auditoria (
    id                  SERIAL PRIMARY KEY,
    usuario_id          INTEGER         NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
    nome_entidade       VARCHAR(100)    NOT NULL,
    entidade_id         INTEGER         NOT NULL,
    tipo_acao           VARCHAR(20)     NOT NULL,
    valores_antigos     TEXT,
    valores_novos       TEXT,
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_tipo_acao CHECK (tipo_acao IN ('Criar', 'Atualizar', 'Deletar', 'Importar'))
);

-- ============================================================================
-- 15. TABELA: configuracoes_sistema (chave-valor)
-- ============================================================================
CREATE TABLE IF NOT EXISTS configuracoes_sistema (
    id                  SERIAL PRIMARY KEY,
    chave               VARCHAR(100)    NOT NULL,
    valor               TEXT            NOT NULL,
    descricao           TEXT,
    atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS ix_configuracoes_chave ON configuracoes_sistema (chave);

-- ============================================================================
-- FIM DA CRIAÇÃO DAS TABELAS
-- ============================================================================

SELECT 'Banco de dados criado com sucesso! 15 tabelas.' AS resultado;
