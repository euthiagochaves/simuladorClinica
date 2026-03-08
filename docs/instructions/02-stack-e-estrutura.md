# 02 - Stack Tecnológico e Estrutura de Pastas

## Stack

| Camada   | Tecnologia                              |
|----------|-----------------------------------------|
| Backend  | .NET 8 Web API + Entity Framework Core  |
| Frontend | Angular SPA (TypeScript, SCSS)          |
| Banco    | PostgreSQL (Supabase)                   |
| ORM      | Entity Framework Core (Code-First)      |

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
│       ├── Program.cs              ← entry point
│       ├── appsettings.json        ← configurações (connection string, etc.)
│       ├── appsettings.Development.json
│       ├── Controllers/            ← endpoints da API REST
│       ├── Models/
│       │   └── Entities/           ← entidades do EF Core (mapeiam tabelas)
│       ├── Data/                   ← DbContext e configurações do EF
│       ├── Services/               ← lógica de negócio
│       └── DTOs/                   ← objetos de transferência (request/response)
└── frontend/
    └── clinica-sim/                ← projeto Angular
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
