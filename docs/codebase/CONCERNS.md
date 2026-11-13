# Codebase Concerns

## Core Sections (Required)

### 1) Top Risks & Performance Bottlenecks (Prioritized)

| Severity | Concern | Evidence | Impact | Suggested Action |
|----------|---------|----------|--------|------------------|
| `🔴 HIGH` | **Multi-tier Caching Inverted**: `ResilientCacheService` checks Redis on every read and never checks L1 `MemoryCache` first when Redis is up. Deserializes JSON on every single read. | `PokedexReactASP.Infrastructure/Services/ResilientCacheService.cs:125-148` | High latency (1-5ms per key over network vs 0.001ms in memory), heavy JSON CPU overhead, especially when enriching batches of Pokémon. | Implement true L1/L2 HybridCache: check MemoryCache first; on miss, check Redis and populate MemoryCache with short TTL; write/delete to both. |
| `🔴 HIGH` | **LOH Allocations in PokeApiService**: `ReadAsStringAsync()` allocates large string buffers in Large Object Heap (LOH), and instantiates a new `JsonSerializerOptions` on every HTTP call. | `PokedexReactASP.Application/Services/PokeApiService.cs:34-38` | High GC Gen 2 pressure, potential memory fragmentation, unnecessary CPU serialization overhead. | Stream JSON with `ReadFromJsonAsync<T>` or `DeserializeAsync` using a `static readonly JsonSerializerOptions`. |
| `🔴 HIGH` | **N+1 Queries in News Sync**: `PokemonNewsSyncService` executes `_context.PokemonNews.FirstOrDefaultAsync(n => n.SourceUrl == ...)` inside a loop over all RSS items. | `PokedexReactASP.Infrastructure/Services/PokemonNewsSyncService.cs:183` | N separate roundtrips to PostgreSQL on every sync execution. | Batch-query existing URLs in one query: `.Where(n => urls.Contains(n.SourceUrl)).ToDictionaryAsync(...)`. |
| `⚠️ MEDIUM` | **Thread Safety Risk with `new Random()`**: `WildAreaService` and `CardRewardService` use `new Random()` instance fields; `PokemonNewsSyncService` creates `new Random()` in loops. | `WildAreaService.cs:38`, `CardRewardService.cs:18`, `PokemonNewsSyncService.cs:132` | `Random` is not thread-safe. Concurrent requests can corrupt internal seed state and return 0. Extra object allocations. | Replace with `Random.Shared` (thread-safe, zero allocation in .NET 8). |
| `⚠️ MEDIUM` | **Missing HTTP Response Compression**: ASP.NET Core has no `AddResponseCompression()` configured in `Program.cs`. | `PokedexReactASP.Server/Program.cs` | Large JSON payloads (rich Pokémon lists, card inventories) are sent uncompressed over the wire, wasting bandwidth and increasing transfer times. | Add `builder.Services.AddResponseCompression()` with Brotli/Gzip and `app.UseResponseCompression()`. |
| `⚠️ MEDIUM` | **Sync-over-Async in Application Startup**: `IdentitySeeder.SeedAsync(...).Wait()` and `WildAreaSeeder.SeedAsync(...).Wait()` block the main thread. | `PokedexReactASP.Server/Program.cs:336-337` | Risk of thread pool exhaustion or startup deadlock. | Change `Main` to `async Task Main` and `await` seeders. |
| `⚠️ MEDIUM` | **Dead Code & Architectural Redundancy**: `UserService.cs` (641 lines) and `IUserService.cs` are completely unused by `Program.cs` or controllers, superseded by `UserProfileService`, `PokemonCollectionService`, and `PokemonCatchService`. | `PokedexReactASP.Application/Services/UserService.cs` | Developer confusion, redundant build overhead, stale unit tests. | Safely delete `UserService.cs` and `IUserService.cs`; redirect tests to `UserProfileService`. |
| `🔵 LOW` | **Repeated String Splitting & Parsing**: `UserPokemon.CustomMoveIds` is split and parsed (`Split(',').Select(int.Parse)`) on every mapping. | `PokedexReactASP.Application/Mappings/MappingProfile.cs:42` | Memory allocations during batch collection enrichment. | Implement efficient span-based parser or cache parsed list in helper. |

### 2) Technical Debt

| Debt Item | Why it exists | Where | Risk if ignored | Suggested Fix |
|-----------|---------------|-------|-----------------|---------------|
| `FriendService` direct `DbContext` usage | Bypasses `IUnitOfWork` repository abstraction | `Infrastructure/Services/FriendService.cs:19` | Inconsistent architecture, harder to mock and maintain | Refactor to utilize `IUnitOfWork` repositories |
| Monolithic `Program.cs` | Service registrations and pipeline configurations in single 408-line file | `Server/Program.cs` | Harder to maintain as new features are added | Split into extension methods (`AddApplicationServices`, `AddAuthServices`) |
| AutoMapper `.Ignore()` explosion | 45 lines of ignore rules on `UserPokemonDto` | `Application/Mappings/MappingProfile.cs:47-85` | Fragile mapping, slow reflection runtime setup | Optimize mapping profile or extract explicit mapper |

### 3) Security Concerns

| Risk | OWASP Category | Evidence | Current Mitigation | Gap |
|------|----------------|----------|--------------------|-----|
| Token Exposure in Logs | A09: Security Logging Failures | `Server/Program.cs:43` | `Masking.Serilog` masks `Token`, `Password`, `SecretKey` | Parameter names in logs must strictly match masked property names |
| Brute Force on Auth | A07: Identification Failures | `Server/Program.cs:306` | RateLimiter `AuthPolicy` (5 req/min) | Effective, but need to monitor lockout durations |

### 4) `[ASK USER]` Questions

1. [ASK USER] Should we remove the legacy `UserService.cs` (641 lines) and `IUserService.cs` entirely, redirecting `UserServiceTests` to `UserProfileService`?
2. [ASK USER] For `ResilientCacheService`, should we enable true L1+L2 hybrid caching (checking In-Memory cache first before Redis, and populating In-Memory cache on Redis hits with a 10-minute sliding window)?
3. [ASK USER] Should we enable ASP.NET Core `ResponseCompression` (Brotli + Gzip) for all API JSON responses?

### 5) Evidence

- `PokedexReactASP.Infrastructure/Services/ResilientCacheService.cs`
- `PokedexReactASP.Application/Services/PokeApiService.cs`
- `PokedexReactASP.Infrastructure/Services/PokemonNewsSyncService.cs`
- `PokedexReactASP.Server/Program.cs`
- `PokedexReactASP.Application/Services/UserService.cs`
- `docs/Refactor.md`
