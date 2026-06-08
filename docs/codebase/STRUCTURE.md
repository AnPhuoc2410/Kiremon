# STRUCTURE

## Repository Layout
- `PokedexReactASP.Server/`: API host, controllers, hubs, middleware, startup.
- `PokedexReactASP.Application/`: business services, DTOs, interfaces, options, mappings.
- `PokedexReactASP.Infrastructure/`: EF Core context/migrations, repository/UoW, infra services.
- `PokedexReactASP.Domain/`: entities and enums.
- `pokedexreactasp.client/`: React app (pages, routes, hooks, services, contexts, styles).
- `docs/`: functional docs (feature notes, API notes).

## Entry Points
- Backend entry point: `PokedexReactASP.Server/Program.cs`.
- Frontend entry points: `pokedexreactasp.client/src/main.tsx` -> `src/App.tsx` -> `src/routes/index.tsx`.

## API Surface (high-level)
- `api/auth`: authentication, OAuth/external login, 2FA, password flows.
- `api/user`: profile and user pokemon management.
- `api/friend`: friend code + friend request + friend list.
- `api/pokemon`: pokemon CRUD/search endpoints.
- Hubs: `/hubs/pokemon`, `/hubs/presence`.

## Frontend Functional Areas
- Auth pages: login/register/forgot/reset/confirm email.
- Core pokemon flows: explore/search/detail/my-pokemon.
- Social: friends, profile, settings.
- Game/minigames: who's that pokemon, combat team, type matchup, catch challenge.
- Market: poke-mart page and related components.
- Detail tab extensions: evolution, stats, moves, training, sprites, TCG cards.

## Evidence
- `PokedexReactASP.sln`
- `PokedexReactASP.Server/Controllers/*.cs`
- `PokedexReactASP.Server/Hubs/*.cs`
- `pokedexreactasp.client/src/routes/index.tsx`
- `pokedexreactasp.client/src/pages/`
