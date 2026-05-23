# ARCHITECTURE

## Architectural Style
- Layered/Clean Architecture in backend:
  - `Domain` (core entities/enums)
  - `Application` (use-case services + contracts)
  - `Infrastructure` (persistence + external implementations)
  - `Server` (presentation/transport)
- Frontend follows feature/page-oriented modular structure with shared hooks/services/components.

## Backend Request Flow
1. HTTP request enters controller in `PokedexReactASP.Server/Controllers`.
2. Controller delegates to application service interfaces (`IAuthService`, `IUserService`, `IFriendService`, `IPokemonService`, etc.).
3. Application services use repositories/UoW and infra services (token/email/social/recaptcha).
4. Persistence handled through `PokemonDbContext` with EF Core.

## Persistence Model
- `PokemonDbContext` extends `IdentityDbContext<ApplicationUser>`.
- Core domain tables include user pokemon, boxes, items, friendships, friend requests.
- Migrations are tracked in `PokedexReactASP.Infrastructure/Migrations`.

## Realtime Architecture
- SignalR hubs mapped in `Program.cs`.
- Presence tracking implemented server-side and consumed from frontend `presence.hub.ts`.

## Game Mechanics Design
- Dedicated interfaces + services for IV generation, nature generation, shiny roll, catch-rate calculation, pokemon factory.
- These are wired in DI and used by user/pokemon flows.

## Evidence
- `PokedexReactASP.Server/Program.cs`
- `PokedexReactASP.Application/Interfaces/`
- `PokedexReactASP.Application/Services/`
- `PokedexReactASP.Infrastructure/Persistence/PokemonDbContext.cs`
- `PokedexReactASP.Infrastructure/Repositories/`
- `pokedexreactasp.client/src/services/signalr/presence.hub.ts`
