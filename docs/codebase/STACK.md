# Technology Stack

## Core Sections (Required)

### 1) Runtime Summary

| Area | Value | Evidence |
|------|-------|----------|
| Primary language | C# 12 / TypeScript 5.9 | `PokedexReactASP.Server/PokedexReactASP.Server.csproj:4`, `pokedexreactasp.client/package.json:75` |
| Runtime + version | .NET 8 (net8.0) / Node.js (Vite 7.2) | `PokedexReactASP.Server/PokedexReactASP.Server.csproj:4`, `pokedexreactasp.client/package.json:77` |
| Package manager | NuGet / npm | `PokedexReactASP.sln`, `pokedexreactasp.client/package.json` |
| Module/build system | MSBuild (.NET SDK 8.0) / Vite 7.2.7 (ESM) | `PokedexReactASP.Server.csproj`, `pokedexreactasp.client/vite.config.ts` |

### 2) Production Frameworks and Dependencies

| Dependency | Version | Role in system | Evidence |
|------------|---------|----------------|----------|
| ASP.NET Core Web API | 8.0 | Web framework, REST controllers, SignalR hubs | `PokedexReactASP.Server.csproj:1` |
| Entity Framework Core | 9.0.17 | Object-relational mapper for PostgreSQL | `PokedexReactASP.Infrastructure.csproj:12` |
| Npgsql.EntityFrameworkCore.PostgreSQL | 9.0.4 | PostgreSQL database driver | `PokedexReactASP.Infrastructure.csproj:15` |
| Microsoft.AspNetCore.Identity.EntityFrameworkCore | 8.0.28 | Identity, user management, authentication | `PokedexReactASP.Application.csproj:15` |
| Microsoft.Extensions.Caching.StackExchangeRedis | 8.0.28 | L2 distributed cache client | `PokedexReactASP.Server.csproj:26` |
| AsyncKeyedLock | 8.0.2 | Concurrency control per-key for cache thundering-herd prevention | `PokedexReactASP.Application.csproj:10` |
| AutoMapper | 15.1.3 | Object-to-object DTO mapping | `PokedexReactASP.Application.csproj:11` |
| FluentValidation | 11.12.0 | Request DTO validation rules | `PokedexReactASP.Application.csproj:12` |
| OpenTelemetry | 1.16.0 | Distributed tracing, metrics, logs export (OTLP) | `PokedexReactASP.Server.csproj:28-34` |
| Serilog.AspNetCore | 10.0.0 | Structured logging with property masking | `PokedexReactASP.Server.csproj:36` |
| Masking.Serilog | 1.0.13 | PII/Token masking for Serilog | `PokedexReactASP.Server.csproj:18` |
| prometheus-net.AspNetCore | 8.2.1 | Prometheus metrics scraping endpoint | `PokedexReactASP.Server.csproj:35` |
| React | 19.2.1 | Frontend UI framework | `pokedexreactasp.client/package.json:39` |
| @tanstack/react-query | 5.90.16 | Frontend server state & caching | `pokedexreactasp.client/package.json:28` |
| TailwindCSS | 4.1.17 | Utility CSS framework | `pokedexreactasp.client/package.json:52` |

### 3) Development Toolchain

| Tool | Purpose | Evidence |
|------|---------|----------|
| xUnit | 2.5.3 | Unit test runner for .NET backend | `PokedexReactASP.Application.Tests.csproj:17` |
| Moq | 4.20.72 | Dependency mocking library for xUnit | `PokedexReactASP.Application.Tests.csproj:16` |
| FluentAssertions | 8.10.0 | Assertion framework for xUnit | `PokedexReactASP.Application.Tests.csproj:14` |
| Coverlet | 6.0.0 | Code coverage data collector | `PokedexReactASP.Application.Tests.csproj:13` |
| ESLint | 9.39.1 | Frontend TypeScript/React linting | `pokedexreactasp.client/package.json:67` |
| Prettier | 3.7.4 | Code formatter | `pokedexreactasp.client/package.json:73` |
| Husky + lint-staged | 9.1.7 / 16.2.7 | Git pre-commit formatting and linting hook | `pokedexreactasp.client/package.json:71-79` |

### 4) Key Commands

```bash
# Restore backend dependencies
dotnet restore

# Build backend solution
dotnet build

# Run backend unit tests
dotnet test

# Run backend server
cd PokedexReactASP.Server && dotnet run

# Install frontend dependencies
cd pokedexreactasp.client && npm install

# Build frontend production bundle
cd pokedexreactasp.client && npm run build

# Run frontend dev server
cd pokedexreactasp.client && npm run dev
```

### 5) Environment and Config

- Config sources: `PokedexReactASP.Server/appsettings.json`, `PokedexReactASP.Server/appsettings.Development.json`, `.env`, environment variables.
- Required env vars:
  - `ConnectionStrings__DefaultConnection` (PostgreSQL connection string)
  - `ConnectionStrings__Redis` (Redis connection string, e.g. `localhost:6379`)
  - `JwtSettings__SecretKey`, `JwtSettings__Issuer`, `JwtSettings__Audience`
  - `Email__SmtpServer`, `Email__Port`, `Email__SenderEmail`, `Email__Password`
  - `RecaptchaSettings__SecretKey`
  - `PokemonTcgApiSettings__ApiKey`
  - `OpenTelemetry__Enabled`, `OpenTelemetry__OtlpEndpoint`
- Deployment constraints: Docker containerized backend (`Dockerfile`), Vercel frontend hosting, VPS PostgreSQL/Supabase database.

### 6) Evidence

- `PokedexReactASP.sln`
- `PokedexReactASP.Server/PokedexReactASP.Server.csproj`
- `PokedexReactASP.Application/PokedexReactASP.Application.csproj`
- `PokedexReactASP.Infrastructure/PokedexReactASP.Infrastructure.csproj`
- `pokedexreactasp.client/package.json`
- `PokedexReactASP.Server/appsettings.json`
- `docker-compose.prod.yml`
