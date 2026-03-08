# 06 - Convenções de Código

## Backend (.NET 10)

### Naming
- **PascalCase** para classes, métodos, propriedades e constantes
- **camelCase** para variáveis locais e parâmetros
- Prefixo `I` para interfaces (ex: `ISessaoService`)
- Sufixos por tipo: `Controller`, `Service`, `Request`, `Response`
- Nomes de classes, propriedades e métodos em **português brasileiro (PT-BR)** com nomes claros e intuitivos
- Exemplos: `CasoClinico`, `Pergunta`, `AchadoFisico`, `SessaoService`, `NotaClinicaResponse`

### Estrutura
- Controllers retornam **DTOs** (records), nunca entidades diretamente
- Lógica de negócio nos **Services**, não nos Controllers
- Entity Framework: **Code-First** com Fluent API (configuração no DbContext)
- DTOs organizados por feature em subpastas (ex: `DTOs/Sessoes/`, `DTOs/Perguntas/`)
- DTOs usam **record types** para imutabilidade
- Connection strings e configs sensíveis em `appsettings.json` (nunca hardcoded)
- Snake_case para nomes de tabelas/colunas no PostgreSQL

### Padrão de Response
- Endpoints REST padrão (GET, POST, PUT, DELETE)
- Retornar status codes HTTP apropriados (200, 201, 400, 404, 500)
- Rotas em kebab-case: `api/casos-clinicos`, `api/achados-fisicos`, `api/sessoes`

### Injeção de Dependência
- Todas as services registradas como **Scoped** no Program.cs
- Interface → Implementação: `IXxxService` → `XxxService`
- 8 services: Usuario, CasoClinico, Pergunta, AchadoFisico, Sessao, NotaClinica, Importacao, ConfiguracaoSistema

---

## Frontend (Angular 21)

### Naming
- **kebab-case** para nomes de arquivos (ex: `caso-clinico.component.ts`)
- **PascalCase** para classes e componentes (ex: `CasoClinicoComponent`)
- **camelCase** para variáveis, propriedades e métodos

### Estrutura
- Componentes em `components/`
- Serviços em `services/`
- Models/interfaces em `models/`
- SCSS para estilos
- Routing com **lazy loading** por módulo/feature

### Comunicação com API
- Serviços Angular fazem chamadas HTTP para a API .NET
- Usar `HttpClient` com interceptors para tratamento de erros
- URLs da API configuradas em `environment.ts`
- CORS configurado no backend para `http://localhost:4200`

---

## Geral

### Idioma do Código
- Código (classes, variáveis, métodos) em **português brasileiro (PT-BR)**
- Comentários técnicos em **português**
- Interface do aluno em **espanhol** (labels, mensagens, textos visíveis)
- Documentação do projeto em **português**

### Git
- Commits em inglês ou português (consistente)
- Não subir: `node_modules/`, `bin/`, `obj/`, `.env`, secrets
- Branch principal: `main`
