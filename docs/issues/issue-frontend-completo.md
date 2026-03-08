# Implementar Frontend Completo — Angular 21 (ClinicaSim MVP)

## Contexto

O backend da API REST (.NET 10) já está **100% implementado** com 40 endpoints, 15 entidades, 8 services e 7 controllers. O frontend Angular 21 está apenas com o scaffolding (projeto criado, sem componentes).

**Stack frontend**: Angular 21, TypeScript, SCSS, HttpClient, Angular Router com lazy loading.

**Idioma da interface do aluno**: **ESPANHOL** (labels, botões, placeholders, mensagens).
**Idioma da área administrativa**: **ESPANHOL** (pode ser português se preferir, mas manter consistente).
**Idioma do código**: **Português brasileiro** (nomes de variáveis, classes, métodos, services).

**API Base URL**: `http://localhost:5000/api`

**CORS** já configurado no backend para `http://localhost:4200`.

---

## Estrutura de Pastas Esperada

```
frontend/clinica-sim/src/app/
├── core/                           ← serviços globais, interceptors, guards
│   ├── services/
│   │   ├── caso-clinico.service.ts
│   │   ├── pergunta.service.ts
│   │   ├── achado-fisico.service.ts
│   │   ├── sessao.service.ts
│   │   ├── usuario.service.ts
│   │   ├── importacao.service.ts
│   │   └── configuracao.service.ts
│   ├── models/
│   │   ├── caso-clinico.model.ts
│   │   ├── pergunta.model.ts
│   │   ├── achado-fisico.model.ts
│   │   ├── sessao.model.ts
│   │   ├── usuario.model.ts
│   │   ├── nota-clinica.model.ts
│   │   └── evento-sessao.model.ts
│   └── interceptors/
│       └── erro-http.interceptor.ts
├── pages/
│   ├── inicio/                     ← landing page / lista de casos
│   │   └── inicio.component.ts|html|scss
│   ├── atendimento/                ← tela principal do aluno
│   │   ├── atendimento.component.ts|html|scss
│   │   ├── info-paciente/
│   │   │   └── info-paciente.component.ts|html|scss
│   │   ├── chat-clinico/
│   │   │   └── chat-clinico.component.ts|html|scss
│   │   ├── painel-anamnese/
│   │   │   └── painel-anamnese.component.ts|html|scss
│   │   ├── painel-exame-fisico/
│   │   │   └── painel-exame-fisico.component.ts|html|scss
│   │   └── painel-historia-clinica/
│   │       └── painel-historia-clinica.component.ts|html|scss
│   ├── resultado/                  ← tela pós-finalização com opção de PDF
│   │   └── resultado.component.ts|html|scss
│   └── admin/                      ← área administrativa
│       ├── admin-layout/
│       │   └── admin-layout.component.ts|html|scss
│       ├── gerenciar-casos/
│       │   ├── lista-casos/
│       │   │   └── lista-casos.component.ts|html|scss
│       │   └── formulario-caso/
│       │       └── formulario-caso.component.ts|html|scss
│       ├── gerenciar-perguntas/
│       │   ├── lista-perguntas/
│       │   │   └── lista-perguntas.component.ts|html|scss
│       │   └── formulario-pergunta/
│       │       └── formulario-pergunta.component.ts|html|scss
│       ├── gerenciar-achados/
│       │   ├── lista-achados/
│       │   │   └── lista-achados.component.ts|html|scss
│       │   └── formulario-achado/
│       │       └── formulario-achado.component.ts|html|scss
│       ├── gerenciar-usuarios/
│       │   ├── lista-usuarios/
│       │   │   └── lista-usuarios.component.ts|html|scss
│       │   └── formulario-usuario/
│       │       └── formulario-usuario.component.ts|html|scss
│       ├── importacao-yaml/
│       │   └── importacao-yaml.component.ts|html|scss
│       └── configuracoes/
│           └── configuracoes.component.ts|html|scss
├── shared/                         ← componentes reutilizáveis
│   ├── navbar/
│   │   └── navbar.component.ts|html|scss
│   ├── footer/
│   │   └── footer.component.ts|html|scss
│   └── loading-spinner/
│       └── loading-spinner.component.ts|html|scss
└── environments/
    ├── environment.ts              ← apiUrl: 'http://localhost:5000/api'
    └── environment.prod.ts
```

---

## Routing

```typescript
const routes: Routes = [
  { path: '', component: InicioComponent },
  { path: 'atendimento/:sessaoId', component: AtendimentoComponent },
  { path: 'resultado/:sessaoId', component: ResultadoComponent },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'casos', pathMatch: 'full' },
      { path: 'casos', component: ListaCasosComponent },
      { path: 'casos/novo', component: FormularioCasoComponent },
      { path: 'casos/:id/editar', component: FormularioCasoComponent },
      { path: 'perguntas', component: ListaPerguntasComponent },
      { path: 'perguntas/nova', component: FormularioPerguntaComponent },
      { path: 'perguntas/:id/editar', component: FormularioPerguntaComponent },
      { path: 'achados', component: ListaAchadosComponent },
      { path: 'achados/novo', component: FormularioAchadoComponent },
      { path: 'achados/:id/editar', component: FormularioAchadoComponent },
      { path: 'usuarios', component: ListaUsuariosComponent },
      { path: 'usuarios/novo', component: FormularioUsuarioComponent },
      { path: 'usuarios/:id/editar', component: FormularioUsuarioComponent },
      { path: 'importacao', component: ImportacaoYamlComponent },
      { path: 'configuracoes', component: ConfiguracoesComponent },
    ]
  },
  { path: '**', redirectTo: '' }
];
```

---

## TELA 1: Inicio (Landing Page / Lista de Casos)

**Rota**: `/`
**Endpoint**: `GET /api/casos-clinicos?somenteAtivos=true`

### Descrição
Tela inicial onde o aluno vê os casos clínicos disponíveis e pode iniciar um atendimento. Interface limpa e direta.

### Wireframe

```
+============================================================================+
|  [LOGO] CLINICASIM            [Inicio]  [Admin]                            |
+============================================================================+
|                                                                            |
|                     Bienvenido al Simulador Clínico                        |
|            Seleccione un caso clínico para iniciar la atención             |
|                                                                            |
|  +---------------------------------------------------------------------+  |
|  |                                                                     |  |
|  |  +-------------------------------+  +-----------------------------+ |  |
|  |  | CASO CLINICO 1                |  | CASO CLINICO 2              | |  |
|  |  | +--------------------------+  |  | +------------------------+ | |  |
|  |  | | Paciente: Juan Pérez     |  |  | | Paciente: María López  | | |  |
|  |  | | Edad: 45 años            |  |  | | Edad: 32 años          | | |  |
|  |  | | Sexo: Masculino          |  |  | | Sexo: Femenino         | | |  |
|  |  | | Motivo de consulta:      |  |  | | Motivo de consulta:    | | |  |
|  |  | | Dolor torácico agudo     |  |  | | Cefalea persistente    | | |  |
|  |  | | Triaje: Urgente          |  |  | | Triaje: Normal         | | |  |
|  |  | +--------------------------+  |  | +------------------------+ | |  |
|  |  |                               |  |                            | |  |
|  |  |  [ INICIAR ATENCIÓN  >>>  ]   |  |  [ INICIAR ATENCIÓN >>> ] | |  |
|  |  +-------------------------------+  +-----------------------------+ |  |
|  |                                                                     |  |
|  |  +-------------------------------+  +-----------------------------+ |  |
|  |  | CASO CLINICO 3                |  | CASO CLINICO 4              | |  |
|  |  | +--------------------------+  |  | +------------------------+ | |  |
|  |  | | Paciente: ...            |  |  | | Paciente: ...          | | |  |
|  |  | | ...                      |  |  | | ...                    | | |  |
|  |  | +--------------------------+  |  | +------------------------+ | |  |
|  |  |  [ INICIAR ATENCIÓN  >>>  ]   |  |  [ INICIAR ATENCIÓN >>> ] | |  |
|  |  +-------------------------------+  +-----------------------------+ |  |
|  |                                                                     |  |
|  +---------------------------------------------------------------------+  |
|                                                                            |
+============================================================================+
|  ClinicaSim © 2026 - Plataforma de Simulación Clínica                     |
+============================================================================+
```

### Comportamento
1. Ao carregar, faz `GET /api/casos-clinicos?somenteAtivos=true`
2. Exibe os casos em **cards** (grid 2 colunas desktop, 1 coluna mobile)
3. Cada card mostra: Título, NomePaciente, Idade, Sexo, QueixaPrincipal, Triagem
4. Botão "Iniciar Atención" faz `POST /api/sessoes` com body `{ casoClinicoId: "...", alunoId: null }`
5. Recebe o `SessaoResponse` com o `id` da sessão
6. Redireciona para `/atendimento/{sessaoId}`

### Labels (Espanhol)
- Título da página: "Bienvenido al Simulador Clínico"
- Subtítulo: "Seleccione un caso clínico para iniciar la atención"
- Card labels: "Paciente:", "Edad:", "Sexo:", "Motivo de consulta:", "Triaje:"
- Botão: "Iniciar Atención"

---

## TELA 2: Atendimento (Tela Principal do Aluno)

**Rota**: `/atendimento/:sessaoId`
**Endpoints usados**:
- `GET /api/sessoes/{id}` — dados da sessão + caso clínico
- `GET /api/perguntas?somenteAtivas=true` — banco global de perguntas
- `GET /api/achados-fisicos?somenteAtivos=true` — banco global de achados
- `POST /api/sessoes/{id}/perguntas` — fazer pergunta
- `POST /api/sessoes/{id}/achados` — selecionar achado
- `GET /api/sessoes/{id}/eventos` — listar eventos
- `PUT /api/sessoes/{id}/nota-clinica` — salvar nota clínica
- `POST /api/sessoes/{id}/finalizar` — finalizar sessão

### Descrição
Tela principal dividida em 3 áreas: Info do Paciente (topo), Chat Clínico (esquerda), Painel de Navegação com abas (direita). Esta é a tela mais complexa e importante do sistema.

### Wireframe Completo

```
+============================================================================+
|  [LOGO] CLINICASIM               Sesión: ABC-1234         [Volver]         |
+============================================================================+
|                                                                            |
|  +-- INFORMACIÓN DEL PACIENTE -------------------------------------------+ |
|  |                                                                       | |
|  |  Paciente: Juan Pérez    |  Edad: 45 años   |  Sexo: Masculino       | |
|  |  Motivo de consulta: Dolor torácico agudo    |  Triaje: Urgente       | |
|  |                                                                       | |
|  +-----------------------------------------------------------------------+ |
|                                                                            |
|  +-- CHAT CLÍNICO ---------------+  +-- PANEL CLÍNICO -----------------+ | |
|  | [ALTURA FIJA: ~500px, scroll] |  |                                  | | |
|  |                               |  | [Anamnesis] [Ex.Físico] [H.Clín]| | |
|  | 00:00  Inicio de atención     |  | ________________________________ | | |
|  |                               |  |                                  | | |
|  | 00:15  Médico:                |  | (contenido de la aba activa)     | | |
|  |   ¿Tiene dolor de cabeza?     |  |                                  | | |
|  |                               |  |                                  | | |
|  | 00:15  Paciente:              |  |                                  | | |
|  |   No refiere cefalea          |  |                                  | | |
|  |                               |  |                                  | | |
|  | 00:32  Médico:                |  |                                  | | |
|  |   ¿Tiene fiebre?              |  |                                  | | |
|  |                               |  |                                  | | |
|  | 00:32  Paciente:              |  |                                  | | |
|  |   Temperatura normal          |  |                                  | | |
|  |                               |  |                                  | | |
|  | 01:05  Examen Físico:         |  |                                  | | |
|  |   Auscultación cardíaca:      |  |                                  | | |
|  |   Soplo sistólico grado II/VI |  |                                  | | |
|  |                               |  |                                  | | |
|  +-------------------------------+  +----------------------------------+ | |
|                                                                            |
+============================================================================+
```

---

### TELA 2A: Aba "Anamnesis" (dentro do Painel Clínico)

```
+----------------------------------+
| [Anamnesis] [Ex.Físico] [H.Clín]|
|__________________________________|
|                                  |
|  Buscar pregunta:                |
|  +----------------------------+  |
|  | [dropdown pesquisável]     |▼ |
|  +----------------------------+  |
|                                  |
|  Resultados filtrados:           |
|  +----------------------------+  |
|  | ¿Tiene dolor de cabeza?    |  |
|  | ¿Tiene fiebre?             |  |
|  | ¿Tiene náuseas?            |  |
|  | ¿Tiene tos?                |  |
|  | ¿Tiene vómitos?            |  |
|  | ...                        |  |
|  +----------------------------+  |
|                                  |
|  Categoría:                      |
|  [Todas ▼]                       |
|                                  |
|  Preguntas ya realizadas: 3      |
|                                  |
+----------------------------------+
```

**Comportamento**:
1. Ao abrir, carrega todas as perguntas ativas: `GET /api/perguntas?somenteAtivas=true`
2. Exibe dropdown pesquisável (filtro por texto digitado) — ordem alfabética
3. Opcionalmente, filtro por **categoria** (dolor, fiebre, antecedentes, etc.)
4. Ao clicar numa pergunta: `POST /api/sessoes/{id}/perguntas` com body `{ perguntaId: "..." }`
5. Recebe `RespostaInteracaoResponse` com `textoExibido` e `textoResposta`
6. Adiciona duas mensagens no chat:
   - `Médico: [textoExibido]`
   - `Paciente: [textoResposta]`
7. Timestamp formatado como `MM:SS` relativo ao início da sessão (campo `segundosDesdeInicio`)
8. Pergunta já feita deve aparecer marcada/desabilitada (não impedir refazer, mas indicar visualmente)

**Labels**: "Buscar pregunta:", "Categoría:", "Preguntas ya realizadas:"

---

### TELA 2B: Aba "Examen Físico" (dentro do Painel Clínico)

```
+----------------------------------+
| [Anamnesis] [Ex.Físico] [H.Clín]|
|__________________________________|
|                                  |
|  ▼ Estado General                |
|    [ ] Aspecto general           |
|    [ ] Estado de consciencia     |
|    [ ] Signos vitales            |
|                                  |
|  ▼ Aparato Cardiovascular        |
|    [✓] Auscultación cardíaca     |
|    [ ] Pulsos periféricos        |
|    [ ] Presión arterial          |
|                                  |
|  ▶ Aparato Digestivo             |
|    (colapsado)                   |
|                                  |
|  ▶ Sistema Respiratorio          |
|    (colapsado)                   |
|                                  |
|  ▶ Sistema Nefrourológico        |
|    (colapsado)                   |
|                                  |
|  ▶ Sistema Neurológico           |
|    (colapsado)                   |
|                                  |
|  ▶ Sistema Osteoartromuscular    |
|    (colapsado)                   |
|                                  |
|  Hallazgos seleccionados: 1      |
|                                  |
+----------------------------------+
```

**Comportamento**:
1. Ao abrir, carrega todos os achados ativos: `GET /api/achados-fisicos?somenteAtivos=true`
2. Agrupa os achados por `sistemaCategoria` em seções expansíveis (accordion)
3. Categorias fixas (em espanhol):
   - Estado General
   - Aparato Cardiovascular
   - Aparato Digestivo
   - Sistema Respiratorio
   - Sistema Nefrourológico
   - Sistema Neurológico
   - Sistema Osteoartromuscular
4. Ao clicar num achado: `POST /api/sessoes/{id}/achados` com body `{ achadoFisicoId: "..." }`
5. Recebe `RespostaInteracaoResponse`
6. Adiciona mensagem no chat:
   - `Examen Físico: [textoExibido]: [textoResposta]`
7. Achado já selecionado fica marcado com checkbox preenchido (indicação visual)

**Labels**: nomes dos sistemas em espanhol, "Hallazgos seleccionados:"

---

### TELA 2C: Aba "Historia Clínica" (dentro do Painel Clínico)

```
+----------------------------------+
| [Anamnesis] [Ex.Físico] [H.Clín]|
|__________________________________|
|                                  |
|  Resumen:                        |
|  +----------------------------+  |
|  | [textarea grande, 4 linhas]|  |
|  |                            |  |
|  |                            |  |
|  +----------------------------+  |
|                                  |
|  Diagnóstico Probable:           |
|  +----------------------------+  |
|  | [input text]               |  |
|  +----------------------------+  |
|                                  |
|  Diagnósticos Diferenciales:     |
|  1. +-------------------------+  |
|     | [input text]            |  |
|     +-------------------------+  |
|  2. +-------------------------+  |
|     | [input text]            |  |
|     +-------------------------+  |
|  3. +-------------------------+  |
|     | [input text]            |  |
|     +-------------------------+  |
|  4. +-------------------------+  |
|     | [input text]            |  |
|     +-------------------------+  |
|  5. +-------------------------+  |
|     | [input text]            |  |
|     +-------------------------+  |
|                                  |
|  Conducta:                       |
|  +----------------------------+  |
|  | [textarea grande, 4 linhas]|  |
|  |                            |  |
|  |                            |  |
|  +----------------------------+  |
|                                  |
|  +----------------------------+  |
|  | [ GUARDAR BORRADOR ]       |  |
|  +----------------------------+  |
|  +----------------------------+  |
|  | [>>> FINALIZAR ATENCIÓN <<<]| |
|  +----------------------------+  |
|                                  |
+----------------------------------+
```

**Comportamento**:
1. Ao abrir, verifica se já existe nota: `GET /api/sessoes/{id}/nota-clinica`
2. Se existir, preenche os campos com os dados salvos
3. Botão "Guardar Borrador" salva sem finalizar: `PUT /api/sessoes/{id}/nota-clinica`
   - Body:
   ```json
   {
     "textoResumo": "...",
     "textoDiagnosticoProvavel": "...",
     "textoConduta": "...",
     "diagnosticosDiferenciais": [
       { "ordemPrioridade": 1, "textoDiagnostico": "..." },
       { "ordemPrioridade": 2, "textoDiagnostico": "..." },
       { "ordemPrioridade": 3, "textoDiagnostico": "..." },
       { "ordemPrioridade": 4, "textoDiagnostico": "..." },
       { "ordemPrioridade": 5, "textoDiagnostico": "..." }
     ]
   }
   ```
4. Botão "Finalizar Atención":
   - Valida que **TODOS** os campos estão preenchidos (resumen, diagnóstico probable, 5 diferenciais, conducta)
   - Se algum vazio: mostra mensagem de erro em espanhol: "Todos los campos son obligatorios para finalizar la atención"
   - Se tudo preenchido: primeiro salva a nota (`PUT`), depois finaliza (`POST /api/sessoes/{id}/finalizar`)
   - Ao finalizar com sucesso: redireciona para `/resultado/{sessaoId}`
5. Botão "Finalizar Atención" fica **desabilitado** (cinza) se algum campo estiver vazio. Fica **verde/habilitado** quando todos preenchidos.

**Labels**: "Resumen:", "Diagnóstico Probable:", "Diagnósticos Diferenciales:", "Conducta:", "Guardar Borrador", "Finalizar Atención"

---

## TELA 3: Resultado (Pós-finalização)

**Rota**: `/resultado/:sessaoId`
**Endpoints**:
- `GET /api/sessoes/{id}` — dados da sessão
- `GET /api/sessoes/{id}/eventos` — todos os eventos
- `GET /api/sessoes/{id}/nota-clinica` — nota clínica

### Wireframe

```
+============================================================================+
|  [LOGO] CLINICASIM                                       [Volver al Inicio]|
+============================================================================+
|                                                                            |
|               ✓ Atención Finalizada Exitosamente                           |
|               Código de sesión: ABC-1234                                   |
|                                                                            |
|  +-- DATOS DEL PACIENTE ------------------------------------------------+ |
|  | Paciente: Juan Pérez  |  Edad: 45  |  Sexo: M  |  Triaje: Urgente   | |
|  | Motivo de consulta: Dolor torácico agudo                              | |
|  | Inicio: 08/03/2026 14:30  |  Fin: 08/03/2026 15:05                   | |
|  +----------------------------------------------------------------------+ |
|                                                                            |
|  +-- REGISTRO DE INTERACCIONES -----------------------------------------+ |
|  |                                                                      | |
|  | 00:15  Médico: ¿Tiene dolor de cabeza?                               | |
|  | 00:15  Paciente: No refiere cefalea                                  | |
|  | 00:32  Médico: ¿Tiene fiebre?                                        | |
|  | 00:32  Paciente: Temperatura normal                                  | |
|  | 01:05  Examen Físico: Auscultación cardíaca: Soplo sistólico II/VI   | |
|  | ...                                                                   | |
|  +----------------------------------------------------------------------+ |
|                                                                            |
|  +-- HISTORIA CLÍNICA --------------------------------------------------+ |
|  |                                                                      | |
|  | Resumen:                                                              | |
|  | Paciente masculino de 45 años con dolor torácico agudo...            | |
|  |                                                                      | |
|  | Diagnóstico Probable:                                                 | |
|  | Síndrome coronario agudo                                              | |
|  |                                                                      | |
|  | Diagnósticos Diferenciales:                                           | |
|  |   1. Infarto agudo de miocardio                                      | |
|  |   2. Angina inestable                                                | |
|  |   3. Pericarditis aguda                                              | |
|  |   4. Disección aórtica                                               | |
|  |   5. Tromboembolismo pulmonar                                        | |
|  |                                                                      | |
|  | Conducta:                                                             | |
|  | ECG de 12 derivaciones, troponinas seriadas, ecocardiograma...       | |
|  |                                                                      | |
|  +----------------------------------------------------------------------+ |
|                                                                            |
|  +---------------------------+   +---------------------------+             |
|  | [ GENERAR PDF ]           |   | [ VOLVER AL INICIO ]      |             |
|  +---------------------------+   +---------------------------+             |
|                                                                            |
+============================================================================+
```

### Comportamento
1. Ao carregar, faz 3 chamadas paralelas:
   - `GET /api/sessoes/{id}` (inclui dados do caso clínico)
   - `GET /api/sessoes/{id}/eventos`
   - `GET /api/sessoes/{id}/nota-clinica`
2. Exibe tudo em modo **somente leitura** (não editável)
3. Botão "Generar PDF": **placeholder** no MVP — pode exibir "Funcionalidad próximamente" ou gerar um PDF básico via browser (`window.print()`)
4. Botão "Volver al Inicio": navega para `/`
5. Eventos exibidos em ordem cronológica com timestamp `MM:SS`

**Labels**: "Atención Finalizada Exitosamente", "Código de sesión:", "Datos del Paciente", "Registro de Interacciones", "Historia Clínica", "Generar PDF", "Volver al Inicio"

---

## TELA 4: Admin Layout (Shell administrativo)

**Rota**: `/admin`

### Wireframe

```
+============================================================================+
|  [LOGO] CLINICASIM - Administración                     [Volver al Inicio] |
+============================================================================+
|                                                                            |
|  +-- SIDEBAR ----+  +-- CONTEÚDO PRINCIPAL ----------------------------+  |
|  |               |  |                                                  |  |
|  | Casos         |  |  (conteúdo da rota ativa)                        |  |
|  | Clínicos      |  |                                                  |  |
|  |               |  |                                                  |  |
|  | Preguntas     |  |                                                  |  |
|  |               |  |                                                  |  |
|  | Hallazgos     |  |                                                  |  |
|  | Físicos       |  |                                                  |  |
|  |               |  |                                                  |  |
|  | Usuarios      |  |                                                  |  |
|  |               |  |                                                  |  |
|  | Importación   |  |                                                  |  |
|  | YAML          |  |                                                  |  |
|  |               |  |                                                  |  |
|  | Configuración |  |                                                  |  |
|  |               |  |                                                  |  |
|  +---------------+  +--------------------------------------------------+  |
|                                                                            |
+============================================================================+
```

### Comportamento
- Sidebar fixa com links de navegação para cada seção admin
- Conteúdo principal renderiza via `<router-outlet>`
- Sidebar item ativo fica destacado visualmente
- Link "Volver al Inicio" volta para `/`

---

## TELA 5: Admin — Lista de Casos Clínicos

**Rota**: `/admin/casos`
**Endpoint**: `GET /api/casos-clinicos`

### Wireframe

```
+--------------------------------------------------+
|  Casos Clínicos                    [+ Nuevo Caso] |
+--------------------------------------------------+
|                                                    |
| Buscar: [________________________]                 |
|                                                    |
| +------------------------------------------------+|
| | Título        | Paciente    | Edad | Activo | ⚙ ||
| |---------------|-------------|------|--------|---||
| | Dolor torác.  | Juan Pérez  |  45  |  ✓     |✏🗑||
| | Cefalea pers. | María López |  32  |  ✓     |✏🗑||
| | Abdomen agudo | Pedro Ruiz  |  58  |  ✗     |✏🗑||
| +------------------------------------------------+|
|                                                    |
| Mostrando 3 de 3 casos                            |
+--------------------------------------------------+
```

### Comportamento
1. Tabela com colunas: Título, Paciente, Edad, Activo, Acciones
2. Busca/filtro por texto (client-side)
3. Botão "Nuevo Caso" → navega para `/admin/casos/novo`
4. Ícone editar → navega para `/admin/casos/{id}/editar`
5. Ícone deletar → confirmação "¿Está seguro de desactivar este caso?" → `DELETE /api/casos-clinicos/{id}`

---

## TELA 6: Admin — Formulário de Caso Clínico

**Rota**: `/admin/casos/novo` ou `/admin/casos/:id/editar`
**Endpoints**:
- `POST /api/casos-clinicos` (criar)
- `PUT /api/casos-clinicos/{id}` (atualizar)
- `GET /api/casos-clinicos/{id}` (carregar para edição)
- `GET /api/casos-clinicos/{id}/respostas` (respostas específicas)
- `POST /api/casos-clinicos/{id}/respostas` (adicionar resposta)
- `GET /api/casos-clinicos/{id}/achados-fisicos` (achados específicos)
- `POST /api/casos-clinicos/{id}/achados-fisicos` (adicionar achado)

### Wireframe

```
+--------------------------------------------------+
|  Nuevo Caso Clínico               [Volver a Lista]|
+--------------------------------------------------+
|                                                    |
|  Título: [____________________________________]    |
|  Nombre del Paciente: [_______________________]    |
|  Edad: [___]   Sexo: [Masculino ▼]                |
|  Motivo de consulta: [________________________]    |
|  Triaje: [____________________________________]    |
|  Resumen (interno): [_________________________]    |
|  [                                             ]   |
|                                                    |
|  [ GUARDAR CASO ]                                  |
|                                                    |
|  ================================================  |
|  (Seção abaixo só aparece em modo EDIÇÃO)           |
|  ================================================  |
|                                                    |
|  --- Respuestas Específicas del Caso ---           |
|  +----------------------------------------------+ |
|  | Pregunta              | Respuesta    | ✓Pat. | |
|  |-----------------------|--------------|-------| |
|  | ¿Tiene dolor de...?   | Sí, intenso  |  ✓    | |
|  | ¿Tiene fiebre?        | 38.5°C       |  ✓    | |
|  +----------------------------------------------+ |
|  [+ Agregar Respuesta Específica]                  |
|                                                    |
|  --- Hallazgos Físicos del Caso ---                |
|  +----------------------------------------------+ |
|  | Hallazgo              | Presente | Detalle   | |
|  |-----------------------|----------|-----------|  |
|  | Auscultación card.    |   Sí     | Soplo II  |  |
|  +----------------------------------------------+ |
|  [+ Agregar Hallazgo Específico]                   |
|                                                    |
+--------------------------------------------------+
```

### Comportamento
1. **Modo criação**: formulário vazio, sem seção de respostas/achados
2. **Modo edição**: carrega dados do caso + seções de respostas e achados específicos
3. "Agregar Respuesta Específica" abre modal com:
   - Dropdown de perguntas globais (buscar pergunta)
   - Campo "Respuesta específica"
   - Checkbox "¿Es patológica/destacada?"
   - Botão "Guardar" → `POST /api/casos-clinicos/{id}/respostas`
4. "Agregar Hallazgo Específico" abre modal com:
   - Dropdown de achados globais (buscar achado)
   - Checkbox "¿Está presente?"
   - Campo "Detalle específico"
   - Checkbox "¿Es destacado?"
   - Botão "Guardar" → `POST /api/casos-clinicos/{id}/achados-fisicos`

---

## TELA 7: Admin — Lista de Perguntas

**Rota**: `/admin/perguntas`
**Endpoint**: `GET /api/perguntas`

### Wireframe

```
+--------------------------------------------------+
|  Banco de Preguntas             [+ Nueva Pregunta] |
+--------------------------------------------------+
|                                                    |
| Buscar: [________________________]                 |
| Categoría: [Todas ▼]                              |
|                                                    |
| +------------------------------------------------+|
| | Texto             | Sección   | Categoría | ⚙  ||
| |-------------------|-----------|-----------|-----||
| | ¿Tiene dolor...?  | Anamnesis | dolor     | ✏🗑||
| | ¿Tiene fiebre?    | Anamnesis | fiebre    | ✏🗑||
| | ¿Antecedentes...? | Anamnesis | antec.    | ✏🗑||
| +------------------------------------------------+|
|                                                    |
+--------------------------------------------------+
```

---

## TELA 8: Admin — Formulário de Pergunta

**Rota**: `/admin/perguntas/nova` ou `/admin/perguntas/:id/editar`

### Wireframe

```
+--------------------------------------------------+
|  Nueva Pregunta                  [Volver a Lista]  |
+--------------------------------------------------+
|                                                    |
|  Texto de la Pregunta:                             |
|  [____________________________________________]    |
|                                                    |
|  Sección: [Anamnesis ▼]                            |
|  Categoría: [___________________________]          |
|                                                    |
|  Respuesta Predeterminada (paciente sano):         |
|  [____________________________________________]    |
|  [                                            ]    |
|                                                    |
|  Orden de exhibición: [___]                        |
|                                                    |
|  [ GUARDAR PREGUNTA ]                              |
|                                                    |
+--------------------------------------------------+
```

---

## TELA 9: Admin — Lista de Achados Físicos

**Rota**: `/admin/achados`
**Endpoint**: `GET /api/achados-fisicos`

### Wireframe

```
+--------------------------------------------------+
|  Banco de Hallazgos Físicos    [+ Nuevo Hallazgo]  |
+--------------------------------------------------+
|                                                    |
| Buscar: [________________________]                 |
| Sistema: [Todos ▼]                                 |
|                                                    |
| +------------------------------------------------+|
| | Nombre            | Sistema        | Activo | ⚙ ||
| |-------------------|----------------|--------|---||
| | Auscultación card.| Cardiovascular |   ✓    |✏🗑||
| | Murmullo vesic.   | Respiratorio   |   ✓    |✏🗑||
| | Peristaltismo     | Digestivo      |   ✓    |✏🗑||
| +------------------------------------------------+|
|                                                    |
+--------------------------------------------------+
```

---

## TELA 10: Admin — Formulário de Achado Físico

**Rota**: `/admin/achados/novo` ou `/admin/achados/:id/editar`

### Wireframe

```
+--------------------------------------------------+
|  Nuevo Hallazgo Físico           [Volver a Lista]  |
+--------------------------------------------------+
|                                                    |
|  Nombre del Hallazgo:                              |
|  [____________________________________________]    |
|                                                    |
|  Sistema/Categoría: [Cardiovascular ▼]             |
|  (opciones: Estado General, Cardiovascular,        |
|   Digestivo, Respiratorio, Nefrourológico,         |
|   Neurológico, Osteoartromuscular)                  |
|                                                    |
|  Descripción (opcional):                           |
|  [____________________________________________]    |
|                                                    |
|  Resultado Predeterminado (paciente sano):         |
|  [____________________________________________]    |
|                                                    |
|  [ GUARDAR HALLAZGO ]                              |
|                                                    |
+--------------------------------------------------+
```

---

## TELA 11: Admin — Lista de Usuarios

**Rota**: `/admin/usuarios`
**Endpoint**: `GET /api/usuarios`

### Wireframe

```
+--------------------------------------------------+
|  Usuarios del Sistema           [+ Nuevo Usuario]  |
+--------------------------------------------------+
|                                                    |
| +------------------------------------------------+|
| | Nombre         | Email           | Perfil | ⚙  ||
| |----------------|-----------------|--------|-----||
| | Dr. García     | garcia@med.com  | Prof.  | ✏🗑||
| | Ana Martínez   | ana@uni.edu     | Alumno | ✏🗑||
| | Admin Sistema  | admin@sys.com   | Admin  | ✏🗑||
| +------------------------------------------------+|
|                                                    |
+--------------------------------------------------+
```

---

## TELA 12: Admin — Formulário de Usuário

**Rota**: `/admin/usuarios/novo` ou `/admin/usuarios/:id/editar`

### Wireframe

```
+--------------------------------------------------+
|  Nuevo Usuario                   [Volver a Lista]  |
+--------------------------------------------------+
|                                                    |
|  Nombre Completo:                                  |
|  [____________________________________________]    |
|                                                    |
|  Email:                                            |
|  [____________________________________________]    |
|                                                    |
|  Perfil: [Alumno ▼]                                |
|  (opciones: Alumno, Profesor, Administrador)       |
|                                                    |
|  [ GUARDAR USUARIO ]                               |
|                                                    |
+--------------------------------------------------+
```

---

## TELA 13: Admin — Importação YAML

**Rota**: `/admin/importacao`
**Endpoint**: `POST /api/importacao/yaml`

### Wireframe

```
+--------------------------------------------------+
|  Importar Caso Clínico via YAML                    |
+--------------------------------------------------+
|                                                    |
|  Seleccionar archivo YAML:                         |
|  +----------------------------------------------+ |
|  |                                              | |
|  |     [  Arrastrar archivo aquí  ]             | |
|  |     o                                        | |
|  |     [ Seleccionar archivo ]                  | |
|  |                                              | |
|  +----------------------------------------------+ |
|                                                    |
|  -- O pegar contenido YAML directamente: --        |
|  +----------------------------------------------+ |
|  | [textarea grande para colar YAML]            | |
|  |                                              | |
|  |                                              | |
|  |                                              | |
|  +----------------------------------------------+ |
|                                                    |
|  [ IMPORTAR ]                                      |
|                                                    |
|  -- Resultado: --                                  |
|  +----------------------------------------------+ |
|  | ✓ Caso importado exitosamente (ID: xxx)      | |
|  | ✗ Error: campo 'titulo' es obligatorio        | |
|  +----------------------------------------------+ |
|                                                    |
+--------------------------------------------------+
```

### Comportamento
1. Aceita upload de arquivo `.yaml` ou `.yml` **OU** texto colado no textarea
2. Ao clicar "Importar": `POST /api/importacao/yaml` com o conteúdo
3. Exibe resultado: sucesso (com link para o caso criado) ou erro (com mensagem)

---

## TELA 14: Admin — Configurações do Sistema

**Rota**: `/admin/configuracoes`
**Endpoints**: `GET /api/configuracoes`, `PUT /api/configuracoes/{chave}`

### Wireframe

```
+--------------------------------------------------+
|  Configuraciones del Sistema                       |
+--------------------------------------------------+
|                                                    |
| +------------------------------------------------+|
| | Clave              | Valor          | Desc.  |⚙||
| |--------------------|----------------|--------|--||
| | max_diagnosticos   | 5              | Máx... |✏||
| | tempo_sessao_min   | 60             | Tempo  |✏||
| +------------------------------------------------+|
|                                                    |
+--------------------------------------------------+
```

### Comportamento
1. Tabela editável inline ou com modal
2. Ao editar: `PUT /api/configuracoes/{chave}` com body `{ valor: "...", descricao: "..." }`

---

## Services Angular (core/services/)

Cada service deve encapsular as chamadas HTTP para seu domínio. Exemplo de padrão:

```typescript
// caso-clinico.service.ts
@Injectable({ providedIn: 'root' })
export class CasoClinicoService {
  private readonly apiUrl = `${environment.apiUrl}/casos-clinicos`;

  constructor(private http: HttpClient) {}

  listarAtivos(): Observable<CasoClinicoResumo[]> {
    return this.http.get<CasoClinicoResumo[]>(`${this.apiUrl}?somenteAtivos=true`);
  }

  buscarPorId(id: string): Observable<CasoClinico> {
    return this.http.get<CasoClinico>(`${this.apiUrl}/${id}`);
  }

  criar(request: CriarCasoClinicoRequest): Observable<CasoClinico> {
    return this.http.post<CasoClinico>(this.apiUrl, request);
  }

  atualizar(id: string, request: AtualizarCasoClinicoRequest): Observable<CasoClinico> {
    return this.http.put<CasoClinico>(`${this.apiUrl}/${id}`, request);
  }

  desativar(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
```

Seguir este padrão para TODOS os services:
- `CasoClinicoService` → `/api/casos-clinicos`
- `PerguntaService` → `/api/perguntas`
- `AchadoFisicoService` → `/api/achados-fisicos`
- `SessaoService` → `/api/sessoes` (o mais complexo: iniciar, perguntar, selecionar achado, eventos, nota, finalizar)
- `UsuarioService` → `/api/usuarios`
- `ImportacaoService` → `/api/importacao`
- `ConfiguracaoService` → `/api/configuracoes`

---

## Models TypeScript (core/models/)

Criar interfaces TypeScript que espelham os DTOs do backend:

```typescript
// caso-clinico.model.ts
export interface CasoClinico {
  id: string;
  titulo: string;
  nomePaciente: string;
  idade: number;
  sexo: string;
  queixaPrincipal: string;
  triagem?: string;
  resumo?: string;
  ativo: boolean;
  criadoEm: string;
}

export interface CasoClinicoResumo {
  id: string;
  titulo: string;
  nomePaciente: string;
  idade: number;
  sexo: string;
  queixaPrincipal: string;
  triagem?: string;
  ativo: boolean;
}
```

Criar models para: CasoClinico, Pergunta, AchadoFisico, Sessao, EventoSessao, NotaClinica, Usuario, RespostaInteracao, ConfiguracaoSistema, ResultadoImportacao, etc.

---

## Interceptor de Erros HTTP

```typescript
// erro-http.interceptor.ts
- Interceptar todas as respostas HTTP
- Erros 400: exibir mensagem de validação
- Erros 404: exibir "Recurso no encontrado"
- Erros 500: exibir "Error interno del servidor. Intente más tarde."
- Usar um sistema de notificação/toast simples
```

---

## Estilo Visual

- **Design limpo e médico/profissional** — cores neutras (branco, cinza claro, azul marinho)
- **Paleta sugerida**:
  - Primária: `#1B4965` (azul marinho escuro)
  - Secundária: `#5FA8D3` (azul claro)
  - Sucesso: `#2D6A4F` (verde)
  - Alerta: `#E76F51` (laranja/vermelho)
  - Fundo: `#F8F9FA` (cinza muito claro)
  - Texto: `#212529` (quase preto)
- **Tipografia**: Inter, Roboto ou system fonts
- **Responsivo**: funcionar em desktop (1280px+) e tablet (768px+)
- **Não precisa** funcionar em celular neste MVP

---

## Critérios de Aceite

- [ ] Tela de inicio lista casos clínicos ativos
- [ ] Clicar "Iniciar Atención" cria sessão e navega para atendimento
- [ ] Tela de atendimento exibe info do paciente no topo
- [ ] Chat clínico com altura fixa e scroll
- [ ] Aba Anamnesis com dropdown pesquisável de perguntas
- [ ] Selecionar pergunta adiciona mensagem médico/paciente no chat
- [ ] Aba Examen Físico com accordion por sistema clínico
- [ ] Selecionar achado adiciona mensagem no chat
- [ ] Aba Historia Clínica com todos os campos obrigatórios
- [ ] Botão Finalizar só habilitado quando tudo preenchido
- [ ] Finalizar redireciona para tela de resultado
- [ ] Tela de resultado mostra resumo completo (read-only)
- [ ] Área admin com sidebar de navegação
- [ ] CRUD completo de casos clínicos (com respostas e achados específicos)
- [ ] CRUD completo de perguntas
- [ ] CRUD completo de achados físicos
- [ ] CRUD completo de usuários
- [ ] Tela de importação YAML funcional
- [ ] Tela de configurações do sistema
- [ ] Timestamps no chat no formato MM:SS relativo
- [ ] Interface toda em espanhol
- [ ] Loading spinners durante chamadas HTTP
- [ ] Mensagens de erro/sucesso via toasts
- [ ] Responsivo para desktop e tablet

---

## Referências

- Backend API: `http://localhost:5000/api` (40 endpoints implementados)
- Documentação completa: `docs/instructions/` (8 arquivos)
- Projeto inspiração: https://fullcodemedical.com/
- Angular 21 docs: https://angular.dev/
