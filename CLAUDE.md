## Purpose
Guidance for using Claude on this production-ready Pokémon project. Keep all outputs actionable, concise, and immediately usable by the engineering team.

## Project Snapshot
- Stack: .NET 8 (API, SignalR), React + Vite (TS), Postgres (per docker-compose), PokeAPI ingestion via `PokeApiService`.
- Domain: Trainers, Pokémon, UserPokémon ownership, authentication/authorization with JWT and roles.
- Deploy: Docker-first; honor `appsettings` and env-based configuration. Production posture by default.

## Guardrails (Must Follow)
- Security: Never output secrets, tokens, connection strings, or example keys. Assume all data is sensitive. Prefer env vars over literals.
- Privacy/IP: Do not emit copyrighted Pokémon art/sprites/music; reference only by public PokeAPI URLs or existing repo assets.
- Safety: Validate inputs; avoid dangerous shell commands. No schema-destructive SQL without explicit request.
- Compliance: Keep responses in English unless explicitly asked otherwise. Avoid hallucinating APIs or endpoints; ask to confirm if unsure.

## Coding Expectations
- Quality: Production-ready, SOLID/KISS/DRY, clean architecture; .NET 8 idioms, async/await, cancellation tokens where applicable.
- C#: Use nullable enable, dependency injection, guard clauses, domain validation, and fluent mappings. Prefer `IReadOnlyCollection` for outputs, avoid static mutable state.
- React/TS: Strong typing, hooks over classes, no `any`, lean components, lifted state where necessary, and error boundaries for async views.
- Testing: Prefer xUnit + FluentAssertions for backend; React Testing Library + Vitest for frontend. Provide test stubs when changing behavior.
- Errors: Return precise HTTP status codes; never swallow exceptions—log with context and map to safe responses.

## API & Data Notes
- PokeAPI usage: respect rate limits; cache where sensible; validate payloads before persisting.
- Auth: JWT from `TokenService`; keep refresh logic explicit; secure cookies or Authorization header per server config. Require role checks for trainer mutations.
- Data integrity: Preserve referential links between `Trainer`, `Pokemon`, and `UserPokemon`. No mass deletions without confirming cascading effects.

## Documentation Style
- Responses: short, direct, bullet-first. Include file paths for any code changes. Use fenced code blocks with language tags when proposing new snippets.
- If information is missing, ask 1–2 targeted questions before assuming.
- Summaries should end with next steps (tests to run, configs to set, rollout notes).

## Common Tasks (Templates)
- Add endpoint: outline route, request/response DTOs, validation, service method, repo touchpoints, and tests (happy path + auth/validation failure).
- Frontend feature: describe state shape, data-fetch hook, component responsibilities, loading/error UX, and test plan.
- Bug triage: state root cause, fix, regression test, and migration/backfill needs.

