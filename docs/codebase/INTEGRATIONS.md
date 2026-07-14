# INTEGRATIONS

## Database
- PostgreSQL via Npgsql connection string `DefaultConnection`.
- Startup fails fast when `DefaultConnection` is missing.

## Authentication and Security Integrations
- JWT bearer auth (`JwtSettings` section in config) with issuer/audience/lifetime validation and `ClockSkew = Zero`.
- ASP.NET Identity for user management, password policy, and account lockout (5 failed attempts → 5 min lockout).
- Refresh tokens stored in `HttpOnly` cookies (`/api/auth` path) with `Secure` + `SameSite` policy per environment.
- OAuth2/social auth settings wired through `OAuth2Settings` + `SocialVerifyService` (Google token validation confirmed in code).
- Google reCAPTCHA verification via HTTP client to `https://www.google.com/recaptcha/api/`.
- Two-Factor Authentication (TOTP) with trusted-device flow in `AuthService`.
- Rate limiting policies in `Program.cs`:
  - `AuthPolicy`: 5 req/min per IP (login/register/forgot-password endpoints).
  - `WildCatchPolicy`: 20 req/min per IP (wild-area catch endpoint).
  - `GlobalPolicy`: 100 req/min per IP (defined; [TODO] verify controller-level application).
- CORS allowlist via `AllowedOrigins` config + localhost auto-allow.
- Swagger protected by Basic Auth middleware in non-development environments.
- Global `ExceptionHandlingMiddleware` maps exceptions to safe HTTP responses (no stack traces to clients).
- Serilog sensitive-field masking (`Password`, `Token`, `Secret`, `ClientSecret`, `SecretKey`).
- Role-based authorization on admin controllers (`[Authorize(Roles = "Admin")]`).
- SQL injection mitigation via EF Core parameterized queries (no raw SQL detected in hot paths).
- [TODO] No explicit CSRF antiforgery token middleware found; SPA mitigates refresh-cookie risk via `SameSite` + `HttpOnly`. README claims "CSRF prevention" but implementation is cookie-hardening, not classic antiforgery tokens.

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

## Caching and Performance Integrations
- Redis distributed cache (`StackExchangeRedisCache`) with 1s connect/sync timeouts and `AbortOnConnectFail = false`.
- `ResilientCacheService`: Redis primary + in-memory fallback + 1-minute circuit-breaker cooldown on Redis failures.
- `PokemonCacheService`: 24h PokeAPI cache, per-key `AsyncKeyedLock` (thundering-herd prevention), batch semaphore (max 5 concurrent external calls).
- `TcgCardCache` table + `CacheDurationHours` config for Pokemon TCG API responses.
- Frontend TanStack Query defaults: `staleTime` 5 min, `gcTime` 30 min, `refetchOnWindowFocus: false`.
- Frontend in-memory PokeAPI cache (`cacheUtils.getOrSet`) with 30-minute default TTL.
- Route-level code splitting via `React.lazy()` + `Suspense` in `routes/index.tsx`.
- Prometheus metrics at `/metrics`; health check at `/health`.
- OpenTelemetry (traces/metrics/logs) via `AddKiremonObservability` when `OpenTelemetry:Enabled=true`.

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
