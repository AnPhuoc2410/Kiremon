# Codebase Structure

## Core Sections (Required)

### 1) Top-Level Map

| Path | Purpose | Evidence |
|------|---------|----------|
| `PokedexReactASP.Domain/` | Core enterprise entities, enums, value objects (zero external business dependencies) | `PokedexReactASP.Domain/Entities/` |
| `PokedexReactASP.Application/` | Application interfaces, DTOs, domain services, game mechanics calculation, mappings | `PokedexReactASP.Application/Services/` |
| `PokedexReactASP.Infrastructure/` | EF Core DbContext, PostgreSQL repositories, UnitOfWork, external API integrations, background workers | `PokedexReactASP.Infrastructure/Persistence/` |
| `PokedexReactASP.Server/` | ASP.NET Core presentation layer: REST controllers, SignalR hubs, middleware, program startup | `PokedexReactASP.Server/Controllers/`, `Program.cs` |
| `PokedexReactASP.Application.Tests/` | xUnit unit test suites for application logic and services | `PokedexReactASP.Application.Tests/Services/` |
| `pokedexreactasp.client/` | React 19 + TypeScript + Vite SPA frontend | `pokedexreactasp.client/src/` |
| `docs/` | Architectural design docs, feature specs, refactor analysis, LGTM monitoring configs | `docs/Refactor.md`, `docs/codebase/` |
| `deploy/` | Deployment and VPS configuration scripts | `deploy/deploy.sh`, `deploy/setup-vps.sh` |

### 2) Entry Points

- Main backend runtime entry: `PokedexReactASP.Server/Program.cs` (`Program.Main`)
- Background scheduled worker: `PokedexReactASP.Infrastructure/Services/NewsSyncBackgroundService.cs` (registered as `IHostedService`)
- SignalR real-time hubs: `PokemonHub` (`/hubs/pokemon`), `PresenceHub` (`/hubs/presence`) in `PokedexReactASP.Server/Hubs/`
- Frontend runtime entry: `pokedexreactasp.client/src/main.tsx` bootstrapping Vite React root into `index.html`

### 3) Module Boundaries

| Boundary | What belongs here | What must not be here |
|----------|-------------------|------------------------|
| `PokedexReactASP.Domain` | Pure domain entities (`ApplicationUser`, `UserPokemon`, `Trainer`, `UserBox`), enums | No EF Core DbContext, no HTTP/JSON references, no external API clients |
| `PokedexReactASP.Application` | Application logic, DTOs, interfaces (`I*Service`), game mechanics calculators | No direct database SQL/DbContext queries, no HTTP request/response headers |
| `PokedexReactASP.Infrastructure` | EF Core `PokemonDbContext`, Repositories, Redis cache, PokeAPI/TCG API clients, Email | No presentation UI components, no business rule bypasses |
| `PokedexReactASP.Server` | Controllers, SignalR Hubs, HTTP Middleware, Serilog and OTel bootstrapping | No raw database queries or direct entity mutations outside service layer |

### 4) Naming and Organization Rules

- File naming: PascalCase for C# files (`UserPokemon.cs`, `PokemonCatchService.cs`, `UserController.cs`).
- Directory pattern: Layer-first with sub-feature grouping (`Application/Services/GameMechanics/`, `Domain/Entities/`, `Infrastructure/Persistence/`).
- Namespace pattern: Matches folder hierarchy (`PokedexReactASP.Application.Services`, `PokedexReactASP.Infrastructure.Repositories`).
- Interface pattern: Prefixed with `I` (`IPokemonCacheService`, `IUnitOfWork`, `IRepository<T>`).

### 5) Evidence

- `PokedexReactASP.sln`
- `PokedexReactASP.Server/Program.cs`
- `PokedexReactASP.Server/Controllers/`
- `PokedexReactASP.Application/Interfaces/`
- `PokedexReactASP.Infrastructure/Persistence/PokemonDbContext.cs`
- `pokedexreactasp.client/src/main.tsx`
