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

## Security Architecture (Defense in Depth)
| Layer | Technique | Where |
|-------|-----------|-------|
| Transport | HTTPS redirection | `Program.cs` → `UseHttpsRedirection()` |
| Edge | CORS allowlist | `AllowedOrigins` + localhost check |
| Edge | Rate limiting | `[EnableRateLimiting]` on auth + wild-catch |
| AuthN | JWT Bearer + refresh cookie | `AuthController`, `api-client.auth.ts` |
| AuthN | OAuth2 external login | `SocialVerifyService` |
| AuthN | 2FA TOTP | `AuthService`, `Login.tsx` |
| AuthZ | `[Authorize]` / role checks | Controllers, `ProtectedRoute`, `Role` enum |
| Bot defense | reCAPTCHA v3 | `ReCaptchaService`, login flow |
| Account | Lockout + password policy | Identity options in `Program.cs` |
| Data | EF Core parameterized queries | Repositories/services |
| Errors | Safe client messages | `ExceptionHandlingMiddleware` |
| Ops | Log secret masking | Serilog `ByMaskingProperties` |
| Ops | Swagger Basic Auth (prod) | `SwaggerAuthMiddleware` |

## Performance Architecture
| Layer | Technique | Where |
|-------|-----------|-------|
| External API | PokeAPI response cache (24h) | `PokemonCacheService` |
| External API | Thundering-herd lock per key | `AsyncKeyedLock` in cache service |
| External API | Batch concurrency cap (5) | `_batchSemaphore` in `PokemonCacheService` |
| Distributed cache | Redis + memory fallback | `ResilientCacheService` |
| Database reads | `AsNoTracking()` on read paths | `Repository.cs`, infra services |
| Frontend network | TanStack Query dedup + stale cache | `QueryProvider.tsx` |
| Frontend network | In-memory PokeAPI cache | `services/cache/cache.ts` |
| Frontend bundle | Lazy route chunks | `routes/index.tsx` |
| Observability | OTel + Prometheus | `OpenTelemetryExtensions.cs`, `/metrics` |

## Evidence
- `PokedexReactASP.Server/Program.cs`
- `PokedexReactASP.Application/Interfaces/`
- `PokedexReactASP.Application/Services/`
- `PokedexReactASP.Infrastructure/Persistence/PokemonDbContext.cs`
- `PokedexReactASP.Infrastructure/Repositories/`
- `pokedexreactasp.client/src/services/signalr/presence.hub.ts`
