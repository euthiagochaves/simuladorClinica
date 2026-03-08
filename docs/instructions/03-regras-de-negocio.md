# 03 - Regras de Negócio

## Conceito Central: Bancos Globais + Sobrescrita por Caso

Esta é a regra mais importante do sistema.

O sistema é baseado em **bancos globais reutilizáveis**. Casos clínicos **não possuem perguntas próprias isoladas**. Eles utilizam os bancos globais e sobrescrevem apenas o que for patológico, específico ou relevante para aquele caso.

O banco global representa um **paciente padrão sem patologia**. Isso vale tanto para anamnese quanto para exame físico.

---

## Banco Global de Perguntas

- Contém **todas** as perguntas possíveis de anamnese
- Listadas em **ordem alfabética**
- Organizadas internamente por **categoria** (dolor, fiebre, antecedentes, etc.)
- Cada pergunta possui uma **resposta padrão** (paciente sem patologia)

---

## Respostas Específicas de Caso

- Cada caso clínico pode **sobrescrever** a resposta padrão de uma pergunta
- Se houver resposta específica do caso → sistema usa ela
- Se não houver → sistema usa a resposta padrão global
- Um caso **nunca altera** a resposta padrão global — a sobrescrita vale somente para aquele caso

### Fluxo de Resolução de Resposta (Anamnese)
```
1. Aluno seleciona pergunta
2. Sistema procura resposta específica do caso (RespostaCasoPergunta)
3. Se não existir → usa resposta padrão global (Pergunta.RespostaPadrao)
4. Registra evento (EventoSessao tipo PerguntaClicada)
5. Retorna resposta ao aluno (exibe no chat)
```

---

## Banco Global de Exame Físico

- Contém achados, resultados e manobras de exame físico
- **Não são perguntas** — são observações/resultados estruturados
- Cada achado pertence a um **sistema clínico** (Respiratorio, Cardiovascular, etc.)
- Mesma lógica de sobrescrita: banco global = paciente saudável, caso sobrescreve o patológico

### Fluxo de Resolução (Exame Físico)
```
1. Aluno seleciona achado
2. Sistema verifica se existe achado específico do caso (AchadoFisicoCaso)
3. Se não existir → usa resultado padrão global (AchadoFisico.ResultadoPadrao)
4. Registra evento (EventoSessao tipo AchadoSelecionado)
5. Retorna resultado ao aluno (exibe no chat)
```

---

## Sessão de Atendimento

- Cada atendimento gera uma **sessão clínica** (`Sessao`)
- A sessão registra: caso utilizado, início, fim e status (Iniciada, EmAndamento, Finalizada)
- Possui um **CodigoSessao único** para recuperação/exportação
- Cada interação gera um **EventoSessao** persistido no banco

---

## Chat da Sessão

- Registra perguntas feitas, respostas do paciente e resultados de exame físico
- **Altura fixa**, scroll vertical, não cresce indefinidamente
- Timestamp exibido é **relativo ao início do atendimento** (não hora do servidor)
- Formato das mensagens:
  - `Médico: [pergunta]`
  - `Paciente: [resposta]`
  - `Examen Físico: [achado] [resultado]`

---

## História Clínica

Registrada pelo aluno em campos estruturados. Todos obrigatórios:

1. **Resumen** — resumo das informações coletadas
2. **Diagnóstico más probable** — o diagnóstico que o aluno considera mais provável
3. **Diagnósticos diferenciales** — 5 diagnósticos em ordem de prioridade clínica
4. **Conducta** — conduta clínica proposta (exames, tratamento, interconsultas, etc.)

---

## Finalização da Sessão

Uma sessão **só pode ser finalizada** quando todos os campos obrigatórios estiverem preenchidos:
- Resumen preenchido
- Diagnóstico provável preenchido
- 5 diagnósticos diferenciais preenchidos
- Conducta preenchida

Após finalizar: sistema libera geração de PDF e opção de voltar para outros casos ou refazer o mesmo.

---

## Exportação PDF

O PDF deve conter:
- Dados do caso/paciente
- Todas as interações (perguntas + respostas + achados)
- História clínica completa
- Diagnósticos diferenciais ordenados
- Diagnóstico provável
- Conducta

---

## Importação de Casos (YAML)

- Importação em massa de casos por arquivo YAML
- Fluxo: professor baixa template → preenche → envia → sistema cria/atualiza caso
- Logs de importação registrados em `LogImportacaoCaso`
- Download de template YAML é funcionalidade futura (não MVP)
