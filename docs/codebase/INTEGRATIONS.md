# External Integrations

## Core Sections (Required)

### 1) External APIs & Ingestion Services

| Service | Protocol / Base URL | Purpose | Integration Class | Evidence |
|---------|---------------------|---------|-------------------|----------|
| **PokéAPI** | HTTPS (`https://pokeapi.co/api/v2/`) | Ingest Pokémon stats, moves, types, sprites | `PokeApiService.cs` | `Application/Services/PokeApiService.cs:14` |
| **Pokémon TCG API** | HTTPS (`https://api.pokemontcg.io/v2/`) | Ingest TCG cards, rarities, artwork | `PokemonTcgApiClient.cs` | `Infrastructure/ExternalApis/PokemonTcgApiClient.cs` |
| **PokéJungle RSS** | HTTPS (`https://pokejungle.net/feed/`) | Fetch latest Pokémon news and articles | `PokemonNewsSyncService.cs` | `Infrastructure/Services/PokemonNewsSyncService.cs` |
| **Google reCAPTCHA v3** | HTTPS (`https://www.google.com/recaptcha/api/`) | Bot protection for login & registration | `ReCaptchaService.cs` | `Infrastructure/Services/ReCaptchaService.cs` |
| **OAuth Providers** | HTTPS (Google / Facebook / Microsoft) | Social authentication & single sign-on | `SocialVerifyService.cs` | `Infrastructure/Services/SocialVerifyService.cs` |
| **IndexNow** | HTTPS (`https://api.indexnow.org/`) | Instant SEO indexation pings for search engines | `IndexNowService.cs` | `Infrastructure/Services/IndexNowService.cs` |

### 2) Databases & Infrastructure

| System | Role | Configuration / Connection | Evidence |
|--------|------|----------------------------|----------|
| **PostgreSQL** | Primary relational database (Supabase / local) | `ConnectionStrings:DefaultConnection`, pooled `Npgsql.EntityFrameworkCore.PostgreSQL` | `Infrastructure/DependencyInjection.cs:24` |
| **Redis** | Distributed L2 cache | `ConnectionStrings:Redis`, `Microsoft.Extensions.Caching.StackExchangeRedis` | `Server/Program.cs:130` |
| **OpenTelemetry OTLP** | Tracing, Metrics, Logs collector (Grafana Alloy) | `OpenTelemetry:OtlpEndpoint` (`http://global_alloy:4317`) | `Server/Extensions/OpenTelemetryExtensions.cs` |
| **SMTP Server** | Email verification & password resets | `Email:SmtpServer`, `Email:Port` via MailKit | `Infrastructure/Services/EmailService.cs` |

### 3) Authentication & Identity Flow

- **ASP.NET Core Identity**: User store backed by PostgreSQL (`ApplicationUser` entity inheriting `IdentityUser`).
- **JWT Bearer Token**: Generated via `TokenService.GenerateJwtToken()` using `HmacSha256`, configured in `Program.cs`.
- **SignalR Token Authentication**: Extracts `access_token` query parameter on connection handshakes targeting `/hubs` endpoints.
- **Refresh Token**: Stored in `RefreshTokens` table with expiration tracking and device info.

### 4) Evidence

- `PokedexReactASP.Infrastructure/DependencyInjection.cs`
- `PokedexReactASP.Infrastructure/Services/TokenService.cs`
- `PokedexReactASP.Infrastructure/Services/PokemonNewsSyncService.cs`
- `PokedexReactASP.Infrastructure/ExternalApis/PokemonTcgApiClient.cs`
- `PokedexReactASP.Server/Program.cs`
- `PokedexReactASP.Server/Extensions/OpenTelemetryExtensions.cs`
