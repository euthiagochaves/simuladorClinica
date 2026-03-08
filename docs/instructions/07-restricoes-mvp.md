# 07 - Restrições do MVP

## O que FAZ parte do MVP

- Bancos globais de perguntas e achados de exame físico
- Casos clínicos com sobrescrita de respostas/achados
- Sessão de atendimento completa (anamnese + exame físico + história clínica)
- Chat clínico estruturado com timestamp relativo
- Registro de eventos (QuestionClicked, FindingSelected)
- História clínica com campos obrigatórios
- 5 diagnósticos diferenciais em ordem
- Diagnóstico provável e conduta
- Finalização de sessão com validação de campos
- Exportação de PDF da sessão
- Importação de casos via YAML
- Área administrativa separada
- Modelagem de usuários (tabela Users) preparada para futuro login
- Comportamento 100% determinístico

---

## O que NÃO faz parte do MVP

- **Sem IA obrigatória** — o sistema não depende de modelos de IA
- **Sem respostas aleatórias** — sempre a mesma entrada = mesma saída
- **Sem chat livre** — todas as interações são estruturadas (seleção, não digitação livre)
- **Sem perguntas específicas por caso** — usa exclusivamente o banco global
- **Sem dependência de APIs externas**
- **Sem autenticação obrigatória** — MVP funciona sem login
- **Sem TTL no chat** — funcionalidade futura e configurável
- **Sem download de template YAML** — funcionalidade futura
- **Sem variação de respostas** — funcionalidade futura
- **Sem deterioração do paciente** — funcionalidade futura
- **Sem feedback automático** — funcionalidade futura
- **Sem avaliação automática** — funcionalidade futura

---

## Funcionalidades Futuras (pós-MVP)

Estas funcionalidades devem ser consideradas na modelagem, mas NÃO implementadas agora:

1. Autenticação e controle de acesso
2. Variação de respostas (respostas diferentes para mesma pergunta)
3. Deterioração do paciente ao longo do tempo
4. Feedback automático sobre o desempenho do aluno
5. Avaliação automática do raciocínio clínico
6. TTL (tempo de expiração) das mensagens no chat
7. Download de template YAML para preenchimento
8. Regras dinâmicas configuráveis
