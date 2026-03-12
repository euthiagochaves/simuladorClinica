# 02 - Stack Tecnológico e Estrutura de Pastas

## Stack

| Camada   | Tecnologia                                        |
|----------|---------------------------------------------------|
| Backend  | .NET 10 Web API + Entity Framework Core 9.0.3     |
| Frontend | Angular 21 SPA (TypeScript, SCSS)                 |
| Banco    | PostgreSQL (Supabase) via Npgsql 9.0.4            |
| ORM      | Entity Framework Core (Code-First, Fluent API)    |

---

## Estrutura de Pastas

```
simuladorClinica/
├── .gitignore
├── INSTRUCTIONS.md                 ← índice da documentação
├── .claude/
│   └── launch.json                 ← config de dev servers
├── docs/
│   ├── instructions/               ← documentação separada por tema
│   └── fluxograma.html             ← diagramas visuais
├── backend/
│   ├── ClinicaSim.sln
│   └── ClinicaSim.API/
│       ├── ClinicaSim.API.csproj
│       ├── Program.cs              ← entry point + DI + CORS + Swagger
│       ├── appsettings.json        ← configurações (connection string, etc.)
│       ├── appsettings.Development.json
│       ├── Controllers/            ← 7 controllers REST
│       │   ├── UsuariosController.cs
│       │   ├── CasosClinicosController.cs
│       │   ├── PerguntasController.cs
│       │   ├── AchadosFisicosController.cs
│       │   ├── SessoesController.cs
│       │   ├── ImportacaoController.cs
│       │   └── ConfiguracoesSistemaController.cs
│       ├── Models/
│       │   ├── Entities/           ← 16 entidades EF Core (PT-BR)
│       │   └── Enums/              ← 5 enums (PerfilUsuario, StatusSessao, etc.)
│       ├── Data/
│       │   └── ClinicaSimDbContext.cs  ← DbContext com Fluent API + snake_case
│       ├── Services/               ← 8 services com lógica de negócio
│       │   └── Interfaces/         ← 8 interfaces (IXxxService)
│       └── DTOs/                   ← 29 DTOs organizados por feature
│           ├── Usuarios/
│           ├── CasosClinicos/
│           ├── Perguntas/
│           ├── AchadosFisicos/
│           ├── AchadosFisicosCasos/
│           ├── RespostasCasos/
│           ├── Sessoes/
│           ├── NotasClinicas/
│           ├── Importacao/
│           └── ConfiguracoesSistema/
└── frontend/
    └── clinica-sim/                ← projeto Angular 21
        ├── angular.json
        ├── package.json
        ├── src/
        │   ├── app/                ← componentes, serviços, módulos
        │   ├── assets/             ← imagens, ícones
        │   └── environments/       ← configs por ambiente
        └── ...
```

---

## Como Rodar

### Backend
```bash
cd backend
dotnet restore
dotnet build
dotnet run --project ClinicaSim.API
# API disponível em http://localhost:5000
```

### Frontend
```bash
cd frontend/clinica-sim
npm install
ng serve
# App disponível em http://localhost:4200
```

---

## Configuração

- Connection strings e variáveis sensíveis ficam em `appsettings.json` (nunca hardcoded)
- Para desenvolvimento local, usar `appsettings.Development.json`
- Arquivos `appsettings.*.local.json` estão no `.gitignore` para secrets locais

