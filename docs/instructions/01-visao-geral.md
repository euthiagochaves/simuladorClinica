# 01 - Visão Geral do Sistema

## Objetivo

O sistema ClinicaSim é uma plataforma educacional para treinamento clínico de estudantes de medicina.
Ele permite que estudantes pratiquem o atendimento de pacientes simulados em um ambiente controlado e determinístico.

O objetivo é reproduzir, em formato estruturado, o raciocínio clínico necessário para conduzir um caso desde a coleta de dados até a definição de conduta:

- Anamnese estruturada
- Exame físico estruturado
- Organização da história clínica
- Formulação de diagnósticos diferenciais
- Definição de diagnóstico provável
- Definição de conduta

---

## Perfis de Usuário

### Aluno
- Visualizar lista de casos clínicos disponíveis
- Iniciar atendimento de um caso clínico
- Realizar perguntas de anamnese
- Selecionar achados de exame físico
- Escrever história clínica
- Registrar diagnósticos diferenciais (5, em ordem de prioridade)
- Registrar diagnóstico provável
- Registrar conduta
- Finalizar atendimento
- Exportar resultado em PDF

### Professor
- Criar e editar casos clínicos
- Configurar respostas específicas de casos (anamnese)
- Configurar achados de exame físico de casos
- Acessar histórico de atendimentos
- Revisar resultados de alunos

### Administrador
- Gerenciar usuários
- Gerenciar banco global de perguntas
- Gerenciar banco global de achados de exame físico
- Importar casos clínicos em massa (YAML)
- Manter a integridade do sistema

---

## Princípios do Sistema

- **Determinístico** — mesma entrada, mesma saída, sempre
- **Estruturado** — nada de chat livre ou input aberto para anamnese/exame
- **Educacional** — foco no aprendizado do raciocínio clínico
- **Extensível** — preparado para evoluções futuras (IA, feedback, avaliação)
- **Modular** — separação clara entre camadas
