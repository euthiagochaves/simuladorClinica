# 04 - Modelo de Dados

## Visão Geral

O sistema possui **15 tabelas** no PostgreSQL (Supabase). Todas usam Entity Framework Core (Code-First).

---

## Tabelas

### USERS
Usuários do sistema (futura autenticação).

| Campo        | Tipo     | Observações                    |
|--------------|----------|--------------------------------|
| Id           | int (PK) | Identificador único            |
| FullName     | string   | Obrigatório                    |
| Email        | string   | Pode ser único                 |
| PasswordHash | string   | Para futuro login              |
| Role         | string   | Student, Teacher, Admin        |
| Active       | bool     |                                |
| CreatedAt    | datetime |                                |
| UpdatedAt    | datetime |                                |

### CLINICAL_CASES
Casos clínicos simulados.

| Campo           | Tipo     | Observações                |
|-----------------|----------|----------------------------|
| Id              | int (PK) |                            |
| Title           | string   | Título curto               |
| PatientName     | string   | Nome fictício              |
| Age             | int      |                            |
| Sex             | string   |                            |
| ChiefComplaint  | string   | Queixa principal (obrigatório) |
| Triage          | string   | Classificação de triagem   |
| Summary         | string   | Resumo interno (para professor) |
| Active          | bool     |                            |
| CreatedAt       | datetime |                            |
| UpdatedAt       | datetime |                            |
| CreatedByUserId | int (FK) | FK para Users (opcional)   |

### QUESTION_BANK
Banco global de perguntas de anamnese.

| Campo         | Tipo     | Observações                          |
|---------------|----------|--------------------------------------|
| Id            | int (PK) |                                      |
| Text          | string   | Texto da pergunta (ordenação alfabética) |
| Section       | string   | Ex.: Anamnesis                       |
| Category      | string   | Ex.: dolor, fiebre, antecedentes     |
| DefaultAnswer | string   | Resposta padrão (paciente saudável)  |
| Active        | bool     |                                      |
| SortOrder     | int      | Ordem opcional                       |
| CreatedAt     | datetime |                                      |
| UpdatedAt     | datetime |                                      |

### CASE_QUESTION_ANSWERS
Respostas específicas de um caso para perguntas globais.

| Campo         | Tipo     | Observações                        |
|---------------|----------|------------------------------------|
| Id            | int (PK) |                                    |
| CaseId        | int (FK) | FK para ClinicalCases              |
| QuestionId    | int (FK) | FK para QuestionBank               |
| AnswerText    | string   | Resposta específica (sobrescreve)  |
| IsHighlighted | bool     | Se é relevante/patológica          |
| CreatedAt     | datetime |                                    |
| UpdatedAt     | datetime |                                    |

### PHYSICAL_FINDING_BANK
Banco global de achados/manobras de exame físico.

| Campo             | Tipo     | Observações                          |
|-------------------|----------|--------------------------------------|
| Id                | int (PK) |                                      |
| Name              | string   | Nome do achado ou manobra            |
| SystemCategory    | string   | Respiratorio, Cardiovascular, etc.   |
| Description       | string   | Descrição opcional                   |
| DefaultResultText | string   | Resultado padrão (paciente saudável) |
| Active            | bool     |                                      |
| CreatedAt         | datetime |                                      |
| UpdatedAt         | datetime |                                      |

### CASE_PHYSICAL_FINDINGS
Achados específicos de um caso clínico.

| Campo         | Tipo     | Observações                    |
|---------------|----------|--------------------------------|
| Id            | int (PK) |                                |
| CaseId        | int (FK) | FK para ClinicalCases          |
| FindingId     | int (FK) | FK para PhysicalFindingBank    |
| Present       | bool     | Se o achado está presente      |
| DetailText    | string   | Resultado específico (opcional)|
| IsHighlighted | bool     | Se é relevante/patológico      |
| CreatedAt     | datetime |                                |
| UpdatedAt     | datetime |                                |

### SESSIONS
Sessões de atendimento dos alunos.

| Campo       | Tipo     | Observações                          |
|-------------|----------|--------------------------------------|
| Id          | int (PK) |                                      |
| CaseId      | int (FK) | FK para ClinicalCases                |
| StudentId   | int (FK) | Pode ser nulo no MVP                 |
| SessionCode | string   | Código único (para recuperação/PDF)  |
| StartedAt   | datetime |                                      |
| FinishedAt  | datetime |                                      |
| Status      | string   | Started, InProgress, Finished        |
| CreatedAt   | datetime |                                      |
| UpdatedAt   | datetime |                                      |

### SESSION_EVENTS
Eventos/interações durante a sessão.

| Campo                    | Tipo     | Observações                          |
|--------------------------|----------|--------------------------------------|
| Id                       | int (PK) |                                      |
| SessionId                | int (FK) | FK para Sessions                     |
| Type                     | string   | QuestionClicked, FindingSelected     |
| ReferenceId              | int      | Id da pergunta ou achado             |
| DisplayText              | string   | Texto exibido no chat                |
| ResponseText             | string   | Resposta/resultado do sistema        |
| OccurredAt               | datetime |                                      |
| RelativeSecondsFromStart | int      | Tempo relativo ao início da sessão   |

### CLINICAL_NOTES
História clínica escrita pelo aluno.

| Campo                  | Tipo     | Observações      |
|------------------------|----------|------------------|
| Id                     | int (PK) |                  |
| SessionId              | int (FK) | FK para Sessions |
| SummaryText            | string   | Obrigatório      |
| ProbableDiagnosisText  | string   | Obrigatório      |
| ConductText            | string   | Obrigatório      |
| CreatedAt              | datetime |                  |
| UpdatedAt              | datetime |                  |

### DIFFERENTIAL_DIAGNOSES
Diagnósticos diferenciais informados pelo aluno.

| Campo         | Tipo     | Observações                |
|---------------|----------|----------------------------|
| Id            | int (PK) |                            |
| SessionId     | int (FK) | FK para Sessions           |
| PriorityOrder | int      | 1 a 5                     |
| DiagnosisText | string   | Texto do diagnóstico       |
| CreatedAt     | datetime |                            |
| UpdatedAt     | datetime |                            |

### SESSION_PDFS
Referência ao PDF gerado.

| Campo       | Tipo     | Observações      |
|-------------|----------|------------------|
| Id          | int (PK) |                  |
| SessionId   | int (FK) | FK para Sessions |
| FileName    | string   |                  |
| FilePath    | string   | Caminho ou URL   |
| GeneratedAt | datetime |                  |

### CASE_ATTACHMENTS
Arquivos auxiliares (futuro).

| Campo    | Tipo     | Observações               |
|----------|----------|---------------------------|
| Id       | int (PK) |                           |
| CaseId   | int (FK) | FK para ClinicalCases     |
| FileName | string   |                           |
| FilePath | string   |                           |
| FileType | string   | image, pdf, yaml, etc.    |
| CreatedAt| datetime |                           |

### CASE_IMPORT_LOGS
Logs de importação via YAML.

| Campo            | Tipo     | Observações             |
|------------------|----------|-------------------------|
| Id               | int (PK) |                         |
| CaseId           | int (FK) | Opcional                |
| ImportedByUserId | int (FK) | FK para Users           |
| SourceType       | string   | Ex.: YAML               |
| SourceContent    | string   | Conteúdo bruto (opcional)|
| Status           | string   | Success, Error          |
| ErrorMessage     | string   | Se houver               |
| CreatedAt        | datetime |                         |

### AUDIT_LOGS
Registro de ações administrativas.

| Campo      | Tipo     | Observações                      |
|------------|----------|----------------------------------|
| Id         | int (PK) |                                  |
| UserId     | int (FK) | FK para Users                    |
| EntityName | string   | Nome da entidade alterada        |
| EntityId   | int      |                                  |
| ActionType | string   | Create, Update, Delete, Import   |
| OldValues  | string   | Opcional                         |
| NewValues  | string   | Opcional                         |
| CreatedAt  | datetime |                                  |

### SYSTEM_SETTINGS
Configurações globais.

| Campo       | Tipo     | Observações       |
|-------------|----------|-------------------|
| Id          | int (PK) |                   |
| Key         | string   | Nome da config    |
| Value       | string   | Valor             |
| Description | string   |                   |
| UpdatedAt   | datetime |                   |

---

## Relacionamentos Principais

```
Users 1──N ClinicalCases (CreatedByUserId)
Users 1──N Sessions (StudentId)
Users 1──N AuditLogs
Users 1──N CaseImportLogs

ClinicalCases 1──N CaseQuestionAnswers
ClinicalCases 1──N CasePhysicalFindings
ClinicalCases 1──N Sessions
ClinicalCases 1──N CaseAttachments

QuestionBank 1──N CaseQuestionAnswers
PhysicalFindingBank 1──N CasePhysicalFindings

Sessions 1──N SessionEvents
Sessions 1──1 ClinicalNotes
Sessions 1──N DifferentialDiagnoses
Sessions 1──1 SessionPdfs
```
