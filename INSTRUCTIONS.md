# ClinicaSim - Instruções do Projeto

Plataforma educacional para treinamento clínico de estudantes de medicina.
Permite que alunos pratiquem o atendimento de pacientes simulados em ambiente controlado e determinístico.

**Não é um prontuário médico real.**

## Status do Projeto

| Camada   | Status         | Detalhes                                     |
|----------|----------------|----------------------------------------------|
| Backend  | Implementado   | 16 entidades, 8 services, 7 controllers, DTOs por feature |
| Frontend | Implementado   | Angular 21 com fluxo do aluno e area administrativa ativos |
| Banco    | Modelado       | DbContext pronto, falta criar migrations      |

## Documentação

Cada aspecto do projeto está documentado em arquivo separado:

| Arquivo | Conteúdo |
|---------|----------|
| [Visão Geral](docs/instructions/01-visao-geral.md) | Objetivo do sistema, perfis de usuário, princípios |
| [Stack e Estrutura](docs/instructions/02-stack-e-estrutura.md) | Tecnologias (.NET 10, Angular 21), estrutura de pastas, como rodar |
| [Regras de Negócio](docs/instructions/03-regras-de-negocio.md) | Bancos globais, sobrescrita, sessão, fluxos |
| [Modelo de Dados](docs/instructions/04-modelo-de-dados.md) | 16 entidades em PT-BR, enums, relacionamentos |
| [Interface (UI)](docs/instructions/05-interface-ui.md) | Layout, abas, chat clínico, idioma espanhol |
| [Convenções de Código](docs/instructions/06-convencoes-de-codigo.md) | Naming PT-BR, padrões backend/frontend |
| [Restrições do MVP](docs/instructions/07-restricoes-mvp.md) | O que faz e o que NÃO faz parte do MVP |
| [Endpoints da API](docs/instructions/08-endpoints-api.md) | Rotas REST, métodos HTTP, descrições |

