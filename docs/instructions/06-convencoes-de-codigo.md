# 06 - Convenções de Código

## Backend (.NET 8)

### Naming
- **PascalCase** para classes, métodos, propriedades e constantes
- **camelCase** para variáveis locais e parâmetros
- Prefixo `I` para interfaces (ex: `ISessionService`)
- Sufixos por tipo: `Controller`, `Service`, `Repository`, `Dto`

### Estrutura
- Controllers retornam **DTOs**, nunca entidades diretamente
- Lógica de negócio nos **Services**, não nos Controllers
- Entity Framework: **Code-First** com Migrations
- Connection strings e configs sensíveis em `appsettings.json` (nunca hardcoded)

### Padrão de Response
- Endpoints REST padrão (GET, POST, PUT, DELETE)
- Retornar status codes HTTP apropriados (200, 201, 400, 404, 500)

---

## Frontend (Angular)

### Naming
- **kebab-case** para nomes de arquivos (ex: `clinical-case.component.ts`)
- **PascalCase** para classes e componentes (ex: `ClinicalCaseComponent`)
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

---

## Geral

### Idioma do Código
- Código em **inglês** (variáveis, classes, métodos, comentários técnicos)
- Interface do aluno em **espanhol** (labels, mensagens, textos visíveis)
- Documentação do projeto em **português**

### Git
- Commits em inglês ou português (consistente)
- Não subir: `node_modules/`, `bin/`, `obj/`, `.env`, secrets
- Branch principal: `main`
