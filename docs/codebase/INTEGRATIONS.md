# INTEGRATIONS

## Database
- PostgreSQL via Npgsql connection string `DefaultConnection`.
- Startup fails fast when `DefaultConnection` is missing.

## Authentication and Security Integrations
- JWT bearer auth (`JwtSettings` section in config).
- ASP.NET Identity for user management and token providers.
- OAuth2/social auth settings wired through `OAuth2Settings` + social verify service.
- Google reCAPTCHA verification via HTTP client to `https://www.google.com/recaptcha/api/`.
- Rate limiting policies (`AuthPolicy`, `GlobalPolicy`).

## Realtime
- SignalR hubs:
  - `/hubs/pokemon`
  - `/hubs/presence`
- Frontend uses `@microsoft/signalr` client and token-based hub connection.

## External Data/APIs
- PokeAPI-related endpoints are configured in frontend `api.config.ts`.
- Pokemon TCG API integration exists in frontend `tcg.service.ts` with optional API key header.

## Email
- Email service is registered in infrastructure and driven by `EmailSettings`.
- [TODO] provider transport specifics (SMTP/provider SDK) should be verified from runtime config/deployment setup.

## Observability and API Docs
- Serilog configured for console + rolling file logs with sensitive-field masking.
- Swagger UI enabled, protected by middleware outside development.

## Deployment/Infra
- Docker and Docker Compose are available for local/prod-style execution.
- Frontend has separate production and dev Dockerfiles.
- GitHub Actions workflows exist for image build/deploy.

## Evidence
- `PokedexReactASP.Infrastructure/DependencyInjection.cs`
- `PokedexReactASP.Server/Program.cs`
- `PokedexReactASP.Application/Options/*.cs`
- `pokedexreactasp.client/src/config/api.config.ts`
- `pokedexreactasp.client/src/services/tcg/tcg.service.ts`
- `Dockerfile`, `docker-compose.*.yml`, `pokedexreactasp.client/Dockerfile*`, `.github/workflows/*.yml`
