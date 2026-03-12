-- ============================================================================
-- ClinicaSim - Migracao incremental: criar tabela pergunta_casos
-- ============================================================================
-- Objetivo:
--   Armazenar perguntas especificas criadas dentro de cada caso clinico.
-- ============================================================================

CREATE TABLE IF NOT EXISTS pergunta_casos (
    id                  SERIAL PRIMARY KEY,
    caso_clinico_id     INTEGER         NOT NULL REFERENCES casos_clinicos(id) ON DELETE CASCADE,
    texto               TEXT            NOT NULL,
    secao               VARCHAR(100)    NOT NULL,
    categoria           VARCHAR(100)    NOT NULL,
    resposta_padrao     TEXT            NOT NULL,
    ativo               BOOLEAN         NOT NULL DEFAULT TRUE,
    ordem_exibicao      INTEGER         NOT NULL DEFAULT 0,
    criado_em           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    atualizado_em       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS ix_pergunta_casos_caso_clinico_id
    ON pergunta_casos (caso_clinico_id);

SELECT 'Tabela pergunta_casos criada com sucesso.' AS resultado;
