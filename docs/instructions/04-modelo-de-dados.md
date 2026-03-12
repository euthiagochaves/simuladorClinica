# 04 - Modelo de Dados

## Visão Geral

O sistema possui **16 tabelas** no PostgreSQL (Supabase). Todas usam Entity Framework Core (Code-First) com Fluent API.

**Convenção**: nomes de classes e propriedades em **português brasileiro (PT-BR)**. No banco PostgreSQL, todas as tabelas e colunas usam **snake_case** (configurado via Fluent API no DbContext).

---

## Entidades (Models/Entities/)

### Usuario
Usuários do sistema (futura autenticação).

| Propriedade   | Tipo            | Observações                         |
|---------------|-----------------|-------------------------------------|
| Id            | int (PK)        | Identificador único                 |
| NomeCompleto  | string          | Obrigatório                         |
| Email         | string          | Único                               |
| SenhaHash     | string?         | Para futuro login                   |
| Perfil        | PerfilUsuario   | Aluno, Professor, Administrador     |
| Ativo         | bool            | Default: true                       |
| CriadoEm      | DateTime        | Auto-preenchido                     |
| AtualizadoEm  | DateTime        | Auto-atualizado                     |

### CasoClinico
Casos clínicos simulados.

| Propriedade         | Tipo     | Observações                    |
|---------------------|----------|--------------------------------|
| Id                  | int (PK) |                                |
| Titulo              | string   | Título curto                   |
| NomePaciente        | string   | Nome fictício                  |
| Idade               | int      |                                |
| Sexo                | string   |                                |
| QueixaPrincipal     | string   | Obrigatório                    |
| Triagem             | string?  | Classificação de triagem       |
| Resumo              | string?  | Resumo interno (para professor)|
| Ativo               | bool     | Default: true                  |
| CriadoPorUsuarioId  | int? (FK)| FK para Usuario (opcional)     |
| CriadoEm            | DateTime |                                |
| AtualizadoEm        | DateTime |                                |

### Pergunta
Banco global de perguntas de anamnese.

| Propriedade    | Tipo     | Observações                          |
|----------------|----------|--------------------------------------|
| Id             | int (PK) |                                      |
| Texto          | string   | Texto da pergunta                    |
| Secao          | string?  | Ex.: Anamnesis                       |
| Categoria      | string?  | Ex.: dolor, fiebre, antecedentes     |
| RespostaPadrao | string   | Resposta padrão (paciente saudável)  |
| Ativo          | bool     | Default: true                        |
| OrdemExibicao  | int      | Ordem opcional                       |
| CriadoEm       | DateTime |                                      |
| AtualizadoEm   | DateTime |                                      |

### PerguntaCaso
Perguntas especificas criadas dentro de um caso clinico.

| Propriedade    | Tipo     | Observa��es                              |
|----------------|----------|------------------------------------------|
| Id             | int (PK) |                                          |
| CasoClinicoId  | int (FK) | FK para CasoClinico                      |
| Texto          | string   | Texto da pergunta especifica             |
| Secao          | string   | Secao clinica da pergunta                |
| Categoria      | string   | Categoria clinica da pergunta            |
| RespostaPadrao | string   | Resposta padrao daquela pergunta do caso |
| OrdemExibicao  | int      | Ordem opcional                           |
| Ativo          | bool     | Default: true                            |
| CriadoEm       | DateTime |                                          |
| AtualizadoEm   | DateTime |                                      |

### RespostaCasoPergunta
Respostas específicas de um caso para perguntas globais.

| Propriedade    | Tipo     | Observações                        |
|----------------|----------|------------------------------------|
| Id             | int (PK) |                                    |
| CasoClinicoId  | int (FK) | FK para CasoClinico                |
| PerguntaId     | int (FK) | FK para Pergunta                   |
| TextoResposta  | string   | Resposta específica (sobrescreve)  |
| Destacada      | bool     | Se é relevante/patológica          |
| CriadoEm       | DateTime |                                    |
| AtualizadoEm   | DateTime |                                    |

**Constraint**: índice único em (CasoClinicoId, PerguntaId).

### AchadoFisico
Banco global de achados/manobras de exame físico.

| Propriedade       | Tipo     | Observações                          |
|-------------------|----------|--------------------------------------|
| Id                | int (PK) |                                      |
| Nome              | string   | Nome do achado ou manobra            |
| SistemaCategoria  | string?  | Respiratorio, Cardiovascular, etc.   |
| Descricao         | string?  | Descrição opcional                   |
| ResultadoPadrao   | string   | Resultado padrão (paciente saudável) |
| Ativo             | bool     | Default: true                        |
| CriadoEm          | DateTime |                                      |
| AtualizadoEm      | DateTime |                                      |

### AchadoFisicoCaso
Achados específicos de um caso clínico.

| Propriedade    | Tipo     | Observações                    |
|----------------|----------|--------------------------------|
| Id             | int (PK) |                                |
| CasoClinicoId  | int (FK) | FK para CasoClinico            |
| AchadoFisicoId | int (FK) | FK para AchadoFisico           |
| Presente       | bool     | Se o achado está presente      |
| TextoDetalhe   | string?  | Resultado específico           |
| Destacado      | bool     | Se é relevante/patológico      |
| CriadoEm       | DateTime |                                |
| AtualizadoEm   | DateTime |                                |

**Constraint**: índice único em (CasoClinicoId, AchadoFisicoId).

### Sessao
Sessões de atendimento dos alunos.

| Propriedade    | Tipo          | Observações                          |
|----------------|---------------|--------------------------------------|
| Id             | int (PK)      |                                      |
| CasoClinicoId  | int (FK)      | FK para CasoClinico                  |
| AlunoId        | int? (FK)     | FK para Usuario (nulo no MVP)        |
| CodigoSessao   | string        | Código único (para recuperação/PDF)  |
| IniciadoEm     | DateTime      |                                      |
| FinalizadoEm   | DateTime?     |                                      |
| Status         | StatusSessao  | Iniciada, EmAndamento, Finalizada    |
| CriadoEm       | DateTime      |                                      |
| AtualizadoEm   | DateTime      |                                      |

### EventoSessao
Eventos/interações durante a sessão.

| Propriedade          | Tipo         | Observações                          |
|----------------------|--------------|--------------------------------------|
| Id                   | int (PK)     |                                      |
| SessaoId             | int (FK)     | FK para Sessao                       |
| Tipo                 | TipoEvento   | PerguntaClicada, AchadoSelecionado   |
| ReferenciaId         | int          | Id da pergunta ou achado             |
| TextoExibido         | string       | Texto exibido no chat                |
| TextoResposta        | string       | Resposta/resultado do sistema        |
| OcorridoEm           | DateTime     |                                      |
| SegundosDesdeInicio  | int          | Tempo relativo ao início da sessão   |

### NotaClinica
História clínica escrita pelo aluno.

| Propriedade                | Tipo     | Observações      |
|----------------------------|----------|------------------|
| Id                         | int (PK) |                  |
| SessaoId                   | int (FK) | FK para Sessao   |
| TextoResumo                | string?  | Obrigatório      |
| TextoDiagnosticoProvavel   | string?  | Obrigatório      |
| TextoConduta               | string?  | Obrigatório      |
| CriadoEm                   | DateTime |                  |
| AtualizadoEm               | DateTime |                  |

### DiagnosticoDiferencial
Diagnósticos diferenciais informados pelo aluno.

| Propriedade       | Tipo     | Observações                |
|-------------------|----------|----------------------------|
| Id                | int (PK) |                            |
| SessaoId          | int (FK) | FK para Sessao             |
| OrdemPrioridade   | int      | 1 a 5                     |
| TextoDiagnostico  | string   | Texto do diagnóstico       |
| CriadoEm          | DateTime |                            |
| AtualizadoEm      | DateTime |                            |

### SessaoPdf
Referência ao PDF gerado.

| Propriedade    | Tipo     | Observações      |
|----------------|----------|------------------|
| Id             | int (PK) |                  |
| SessaoId       | int (FK) | FK para Sessao   |
| NomeArquivo    | string   |                  |
| CaminhoArquivo | string   | Caminho ou URL   |
| GeradoEm       | DateTime |                  |

### AnexoCaso
Arquivos auxiliares (futuro).

| Propriedade    | Tipo     | Observações               |
|----------------|----------|---------------------------|
| Id             | int (PK) |                           |
| CasoClinicoId  | int (FK) | FK para CasoClinico       |
| NomeArquivo    | string   |                           |
| CaminhoArquivo | string   |                           |
| TipoArquivo    | string?  | image, pdf, yaml, etc.    |
| CriadoEm       | DateTime |                           |

### LogImportacaoCaso
Logs de importação via YAML.

| Propriedade           | Tipo              | Observações             |
|-----------------------|-------------------|-------------------------|
| Id                    | int (PK)          |                         |
| CasoClinicoId         | int? (FK)         | Opcional                |
| ImportadoPorUsuarioId | int? (FK)         | FK para Usuario         |
| TipoOrigem            | string?           | Ex.: YAML               |
| ConteudoOrigem        | string?           | Conteúdo bruto          |
| Status                | StatusImportacao  | Sucesso, Erro           |
| MensagemErro          | string?           | Se houver               |
| CriadoEm              | DateTime          |                         |

### LogAuditoria
Registro de ações administrativas.

| Propriedade    | Tipo       | Observações                      |
|----------------|------------|----------------------------------|
| Id             | int (PK)   |                                  |
| UsuarioId      | int? (FK)  | FK para Usuario                  |
| NomeEntidade   | string     | Nome da entidade alterada        |
| EntidadeId     | int        |                                  |
| TipoAcao       | TipoAcao   | Criar, Atualizar, Deletar, Importar |
| ValoresAntigos | string?    | JSON opcional                    |
| ValoresNovos   | string?    | JSON opcional                    |
| CriadoEm       | DateTime   |                                  |

### ConfiguracaoSistema
Configurações globais.

| Propriedade | Tipo      | Observações       |
|-------------|-----------|-------------------|
| Id          | int (PK)  |                   |
| Chave       | string    | Nome da config (único) |
| Valor       | string?   | Valor             |
| Descricao   | string?   |                   |
| AtualizadoEm| DateTime  |                   |

---

## Enums (Models/Enums/)

| Enum             | Valores                                |
|------------------|----------------------------------------|
| PerfilUsuario    | Aluno, Professor, Administrador        |
| StatusSessao     | Iniciada, EmAndamento, Finalizada      |
| TipoEvento       | PerguntaClicada, AchadoSelecionado     |
| TipoAcao         | Criar, Atualizar, Deletar, Importar    |
| StatusImportacao | Sucesso, Erro                          |

---

## Relacionamentos Principais

```
Usuario 1──N CasoClinico (CriadoPorUsuarioId)
Usuario 1──N Sessao (AlunoId)
Usuario 1──N LogAuditoria
Usuario 1──N LogImportacaoCaso

CasoClinico 1──N RespostaCasoPergunta
CasoClinico 1──N PerguntaCaso
CasoClinico 1──N AchadoFisicoCaso
CasoClinico 1──N Sessao
CasoClinico 1──N AnexoCaso

Pergunta 1──N RespostaCasoPergunta
AchadoFisico 1──N AchadoFisicoCaso

Sessao 1──N EventoSessao
Sessao 1──1 NotaClinica
Sessao 1──N DiagnosticoDiferencial
Sessao 1──1 SessaoPdf
```

---

## Configuração do DbContext

- **Fluent API** para configurar relacionamentos, constraints e indexes
- **Snake_case** para nomes de tabelas e colunas no PostgreSQL (ex: `caso_clinico_id`)
- **Enums armazenados como string** no banco
- **Timestamps automáticos**: `CriadoEm` e `AtualizadoEm` preenchidos automaticamente no `SaveChangesAsync`
- **Cascade delete** para entidades dependentes (eventos, notas, PDFs, diagnósticos)
- **Restrict delete** para referências opcionais (usuario criador)

