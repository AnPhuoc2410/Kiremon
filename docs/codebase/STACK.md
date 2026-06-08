# STACK

## Runtime and Languages
- Backend: .NET 8 (`net8.0`) with C#.
- Frontend: React 19 + TypeScript on Vite 7.
- Database: PostgreSQL via Entity Framework Core + Npgsql.

## Backend Libraries
- ASP.NET Core Web API + Identity.
- JWT authentication (`Microsoft.AspNetCore.Authentication.JwtBearer`).
- SignalR for realtime hubs.
- Serilog (+ async/file sinks, masking).
- Swagger / OpenAPI via Swashbuckle.

## Frontend Libraries
- Routing: `react-router-dom`.
- Server state: `@tanstack/react-query`.
- HTTP: `axios` and native `fetch` (in some services).
- UI/styling: Emotion, Tailwind 4, Radix UI.
- Realtime: `@microsoft/signalr`.
- Optional integrations: Supabase client, OAuth SDKs.

## Tooling and Dev Workflow
- Frontend scripts: `dev`, `build`, `lint`, `format`.
- Lint/format: ESLint + Prettier + lint-staged + Husky.
- Containerization: root Dockerfile + compose files, plus dedicated client Dockerfiles.
- CI/CD: GitHub Actions workflows under `.github/workflows`.

## Evidence
- `PokedexReactASP.Server/PokedexReactASP.Server.csproj`
- `pokedexreactasp.client/package.json`
- `PokedexReactASP.Infrastructure/DependencyInjection.cs`
- `PokedexReactASP.Server/Program.cs`
- `Dockerfile`, `docker-compose.dev.yml`, `.github/workflows/build-image.yml`, `.github/workflows/deploy.yml`
