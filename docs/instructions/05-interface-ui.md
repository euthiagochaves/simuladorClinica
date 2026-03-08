# 05 - Interface do Usuário (UI)

## Princípios da Interface

- Interface limpa e minimalista
- Navegação clara entre etapas do atendimento
- Evitar chat livre desorganizado
- Evitar telas com scroll infinito
- Manter o aluno focado no caso clínico
- Exibir apenas informações relevantes ao momento
- Priorizar clareza e rapidez de interação

---

## Idioma da Interface: ESPANHOL

Toda a interface voltada ao aluno deve estar em espanhol:

- Anamnesis
- Examen Físico
- Historia Clínica
- Diagnóstico Diferencial
- Diagnóstico Probable
- Conducta

---

## Tela de Atendimento — 3 Áreas

### 1. Informações do Paciente (topo)
Dados básicos pré-carregados do caso clínico:
- Nome, Idade, Sexo
- Queixa principal (Motivo de consulta)
- Triagem

### 2. Chat Clínico (centro)
Histórico das interações do atendimento:
- **Altura fixa** com scroll vertical (não cresce indefinidamente)
- Formato das mensagens:
  - `Médico: [pergunta]`
  - `Paciente: [resposta]`
  - `Examen Físico: [achado] [resultado]`
- Timestamp relativo ao início do atendimento

### 3. Painel de Navegação Clínica (direita)
Navegação por abas sem abrir novas páginas:

#### Aba "Anamnesis"
- Lista de perguntas do banco global
- **Dropdown pesquisável** (ordem alfabética)
- Ao selecionar: registra pergunta + exibe resposta no chat

#### Aba "Examen Físico"
- Achados organizados por **sistema clínico**:
  - Estado General
  - Aparato Cardiovascular
  - Aparato Digestivo
  - Sistema Respiratorio
  - Sistema Nefrourológico
  - Sistema Neurológico
  - Sistema Osteoartromuscular
- Ao selecionar: registra achado + exibe resultado no chat

#### Aba "Historia Clínica"
Campos estruturados:
- **Resumen** — caixa de texto para resumo
- **Diagnóstico Probable** — campo texto obrigatório
- **Diagnósticos Diferenciales** — 5 campos separados, em ordem de prioridade
- **Conducta** — caixa de texto para conduta clínica

Botões ao final:
- **Finalizar Atendimento** (só habilitado quando tudo preenchido)
- **Generar PDF** (só após finalizar)

---

## Layout Wireframe

```
+============================================================================+
|                        CLINICASIM - Atendimento                            |
+============================================================================+
|                                                                            |
|  +-- INFO DO PACIENTE ------------------------------------------------+   |
|  |  Nome: ...  |  Idade: ...  |  Sexo: ...                            |   |
|  |  Motivo de consulta: ...              |  Triaje: ...               |   |
|  +--------------------------------------------------------------------+   |
|                                                                            |
|  +-- CHAT CLINICO ----------+  +-- PAINEL NAVEGACAO ------------------+   |
|  | [altura fixa, scroll]    |  |                                      |   |
|  |                          |  |  [Anamnesis] [Ex.Fisico] [H.Clinica] |   |
|  | Medico: ...              |  |                                      |   |
|  | Paciente: ...            |  |  (conteúdo da aba ativa)             |   |
|  |                          |  |                                      |   |
|  | Examen Fisico: ...       |  |                                      |   |
|  |                          |  |                                      |   |
|  | ...                      |  |  [FINALIZAR]  [GENERAR PDF]          |   |
|  +--------------------------+  +--------------------------------------+   |
+============================================================================+
```

---

## Área Administrativa (separada)

Interface exclusiva para professores/admins:
- Criar e editar perguntas globais
- Gerenciar achados de exame físico globais
- Criar e editar casos clínicos
- Configurar respostas específicas de cada caso
- Importar casos via YAML
- Gerenciar usuários (admin)

Essa área é **separada** da interface do aluno.
