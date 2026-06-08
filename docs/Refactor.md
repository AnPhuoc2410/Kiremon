# 🔧 Refactor Analysis — Kiremon Backend

> **Phiên bản phân tích:** 2026-06-04  
> **Scope:** Domain · Application · Infrastructure · Server  
> **Skills áp dụng:** dotnet-best-practices · ef-core · dotnet-design-pattern-review

---

## Mục lục

1. [Domain Layer](#1-domain-layer)
2. [Application Layer](#2-application-layer)
3. [Infrastructure Layer](#3-infrastructure-layer)
4. [Server Layer (API)](#4-server-layer-api)
5. [Cross-Cutting Concerns](#5-cross-cutting-concerns)
6. [Database & EF Core](#6-database--ef-core)
7. [Bảng ưu tiên tổng hợp](#7-bảng-ưu-tiên-tổng-hợp)

---

## 1. Domain Layer

### 1.1 `Pokemon.cs` — Entity lỗi thời chưa dọn dẹp

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

**Vấn đề:** `Pokemon` entity được đánh dấu `[Obsolete]` nhưng vẫn nằm trong codebase, vẫn có navigation property `ICollection<UserPokemon>` trỏ vào nó. `PokemonDbContext` không có `DbSet<Pokemon>` → entity chết hoàn toàn.

```csharp
// PokedexReactASP.Domain/Entities/Pokemon.cs
[Obsolete("Pokemon entity is deprecated...")]
public class Pokemon
{
    public ICollection<UserPokemon> UserPokemons { get; set; } = new List<UserPokemon>();
    // UserPokemon không còn foreign key tới Pokemon nữa
}
```

**Refactor:** Xóa file `Pokemon.cs` hoàn toàn và loại bỏ dependency trong `UserPokemon` (nếu còn).

---

### 1.2 `ApplicationUser` — Quá nhiều denormalized counters

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

**Vấn đề:** `FriendsCount`, `PokemonCaught`, `UniquePokemonCaught`, `ShinyPokemonCaught`, `LegendaryPokemonCaught` là các counter được cập nhật thủ công (không atomic). Có thể gây **data inconsistency** khi:
- `FriendService.AcceptFriendRequestAsync` → `currentUser.FriendsCount++` (dùng UserManager, không atomic)
- `UserService.ReleasePokemonAsync` → cập nhật thủ công sau khi query count
- `DaysPlayed`, `HoursPlayed` không được cập nhật ở bất cứ đâu trong codebase → dead fields

```csharp
// Trainer.cs
public int FriendsCount { get; set; } = 0;     // Updated manually - race condition risk
public int DaysPlayed { get; set; } = 0;         // Never updated anywhere in codebase
public int HoursPlayed { get; set; } = 0;        // Never updated anywhere in codebase
```

**Refactor:**
- Thay counters bằng computed queries khi cần (`SELECT COUNT(*)`) hoặc dùng `Interlocked` + transaction.
- Xóa `DaysPlayed`, `HoursPlayed` hoặc implement logic thực sự.
- `Achievements` và `Badges` là `string?` (JSON encoded?) → cần define schema rõ ràng hoặc normalize ra bảng riêng.

---

### 1.3 `ApplicationUser.GenerateFriendCode()` — Duplicate logic

| Mức độ | `🔵 LOW` |
|--------|---------|

**Vấn đề:** Friend code generation tồn tại ở **2 nơi**:
1. `ApplicationUser.GenerateFriendCode()` (static method trong entity) — dùng `Random` với lock
2. `FriendService.GenerateFriendCode()` (static method trong service) — dùng `RandomNumberGenerator` (crypto-safe, tốt hơn)

Entity không nên chứa business logic. `Random` không thread-safe theo design (dù đã có lock).

**Refactor:**
- Xóa `GenerateFriendCode()` khỏi entity.
- Chỉ giữ trong `FriendService` với `RandomNumberGenerator.GetInt32()`.
- Entity chỉ lưu giá trị, không generate.

---

### 1.4 `UserPokemon.CustomMoveIds` — Anti-pattern: comma-separated values trong DB

| Mức độ | `🔴 HIGH` |
|--------|----------|

**Vấn đề:** Move IDs được lưu dưới dạng `"1,25,74,50"` trong một column string. Đây là anti-pattern nghiêm trọng:
- Không thể query/filter efficiently bằng SQL
- Violates 1NF (First Normal Form)
- Phải parse thủ công ở Application layer (MappingProfile đang làm `Split(',').Select(int.Parse)`)

```csharp
// UserPokemon.cs
public string? CustomMoveIds { get; set; } // "1,25,74,50" - ANTI-PATTERN
```

**Refactor:** Tạo bảng `UserPokemonMove (Id, UserPokemonId, MoveApiId, SlotIndex)` với FK cascade.

---

### 1.5 `UserBox` — Thiếu index và unique constraint

| Mức độ | `🔵 LOW` |
|--------|---------|

**Vấn đề:** `UserBox` không có index trên `UserId` trong DbContext config. `Order` không có unique constraint per user → 2 box có thể cùng Order.

---

## 2. Application Layer

### 2.1 `UserService` — God Service với quá nhiều trách nhiệm

| Mức độ | `🔴 HIGH` |
|--------|----------|

**Vấn đề:** `UserService` (647 dòng) đang làm quá nhiều việc:
- Profile management
- Pokemon collection (read + write)
- Catch mechanics (calling game mechanics services)
- EXP/Level calculation
- Nickname uniqueness logic

Violates **Single Responsibility Principle**. Constructor inject 7 dependencies.

**Refactor:** Tách thành:
- `UserProfileService` → profile CRUD
- `PokemonCollectionService` → read operations (GetAll, GetById, Stats, Summary)
- `PokemonCatchService` → catch logic + EXP update (hiện tại là `UserService.AttemptCatchPokemonAsync` + `CatchPokemonAsync`)

---

### 2.2 `UserService.CatchPokemonAsync` và `AttemptCatchPokemonAsync` — Duplicate catch logic

| Mức độ | `🔴 HIGH` |
|--------|----------|

**Vấn đề:** Có **2 catch methods** với gần như cùng business logic:
- `CatchPokemonAsync` — "legacy, always succeeds"
- `AttemptCatchPokemonAsync` — với catch rate calculation

Cả 2 đều:
1. Validate user
2. Fetch PokeAPI data
3. Fetch species data
4. Generate nickname unique
5. Check isNewSpecies
6. Build `PokemonCreationContext`
7. Call `_pokemonFactory.CreateCaughtPokemonAsync`
8. Save Pokemon
9. Update trainer stats

Chỉ khác nhau ở bước 6 (catch rate roll). Đây là **code duplication** nghiêm trọng (~100 dòng trùng).

**Refactor:** Extract shared logic vào private method `BuildAndSavePokemon(...)`, 2 public methods chỉ chứa delta logic.

---

### 2.3 `UserService.UpdatePokemonNicknameAsync` — Fetch API 2 lần không cần thiết

| Mức độ | `🔵 LOW` |
|--------|---------|

```csharp
// Lần 1: nếu nickname empty
var apiData = await _pokemonCache.GetPokemonAsync(userPokemon.PokemonApiId);
targetName = CapitalizeFirst(apiData.Name);

// Lần 2: lấy speciesName để so sánh
var apiData = await _pokemonCache.GetPokemonAsync(userPokemon.PokemonApiId); // DUPLICATE CALL
speciesName = CapitalizeFirst(apiData.Name);
```

Cache sẽ xử lý được (memory cache), nhưng code không rõ ý định. **Refactor:** Fetch 1 lần, reuse.

---

### 2.4 `CapitalizeFirst` — Static helper bị duplicate ở 3 nơi

| Mức độ | `🔵 LOW` |
|--------|---------|

`CapitalizeFirst` được định nghĩa trong:
- `UserService.cs` (line 526)
- `PokemonFactoryService.cs` (line 223)
- `PokemonEnricherService.cs` (line 161)

**Refactor:** Tạo `StringExtensions` hoặc `PokemonNameHelper` static class trong `Application.Common.Helpers`.

---

### 2.5 `GetExpForNextLevel` — Duplicate formula ở 2 nơi

| Mức độ | `🔵 LOW` |
|--------|---------|

```csharp
// UserService.cs line 524
private static int GetExpForNextLevel(int currentLevel) => 1000 + (currentLevel * 100);

// PokemonEnricherService.cs line 159
private static int GetExpForNextLevel(int currentLevel) => 1000 + (currentLevel * 100);
```

**Refactor:** Move vào `TrainerLevelCalculator` static class trong `Application.Common`.

---

### 2.6 `PokemonCacheService` — Semaphore chỉ protect single-item, không protect batch

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

**Vấn đề:** `GetPokemonAsync(int)` dùng global `SemaphoreSlim(1,1)` → bottleneck khi nhiều requests đồng thời cần Pokemon khác nhau (serialize toàn bộ). `GetPokemonBatchAsync` tạo local semaphore mỗi lần gọi → `SemaphoreSlim` bị GC mỗi request (không dispose).

```csharp
// GetPokemonBatchAsync — semaphore created but never disposed
var semaphore = new SemaphoreSlim(5); // NEW every call, never disposed
```

**Refactor:**
- Dùng `ConcurrentDictionary<int, SemaphoreSlim>` per-key semaphore (double-check locking per pokemon ID).
- Hoặc upgrade lên **IDistributedCache** (Redis) để scalable cache với `IMemoryCache` làm L1.

---

### 2.7 `PokeApiService` — Interface và Implementation trong cùng 1 file

| Mức độ | `🔵 LOW` |
|--------|---------|

**Vấn đề:** `IPokeApiService` interface được khai báo ngay trong file `PokeApiService.cs`. PokeAPI models (`PokeApiPokemon`, `PokeApiSpeciesDetail`, v.v.) cũng nằm trong cùng file này (450+ dòng).

**Refactor:**
- Tách `IPokeApiService` → `Application/Interfaces/IPokeApiService.cs`
- Tách models → `Application/Models/PokeApi/` folder

---

### 2.8 `PokemonEnricherService.CalculateStat` — Nature modifier bị hardcode 1.0

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

```csharp
// PokemonEnricherService.cs line 146
return (int)(((2 * baseStat + iv + ev / 4) * level / 100 + 5) * 1.0); // nature = 1.0 ALWAYS
```

Nature đã được lưu trong `UserPokemon.Nature` nhưng **không được áp dụng** vào stat calculation. `NatureModifiers` model đã tồn tại trong codebase nhưng không được dùng ở đây.

**Refactor:** Inject nature modifier vào `CalculateStat()` dựa trên `NatureGeneratorService.GetNatureModifiers(nature)`.

---

### 2.9 `AuthService` — Token lifetime hardcoded trong comment

| Mức độ | `🔵 LOW` |
|--------|---------|

```csharp
// AuthService.cs line 245
response.ExpiresAt = DateTime.UtcNow.AddDays(7); // Production nên cân nhắc Refresh Token
```

Giá trị 7 ngày bị hardcode. `TokenService` đã đọc `ExpirationDays` từ config nhưng `AuthService` không dùng giá trị đó để set `ExpiresAt`.

**Refactor:** Đọc `ExpirationDays` từ `JwtSettings` hoặc inject `IOptions<JwtSettings>`.

---

### 2.10 `MappingProfile` — Quá nhiều `.Ignore()` statements

| Mức độ | `🔵 LOW` |
|--------|---------|

`UserPokemon → UserPokemonDto` mapping có 20+ `.ForMember(..., opt => opt.Ignore())`. Đây là sign rằng AutoMapper không phải tool phù hợp cho enrichment pattern này.

**Refactor:** Xem xét bỏ AutoMapper cho `UserPokemon → UserPokemonDto` và dùng manual mapping trong `PokemonEnricherService` hoàn toàn (đã có `EnrichWithCachedData` anyway).

---

## 3. Infrastructure Layer

### 3.1 `FriendService` — Inject trực tiếp `PokemonDbContext` (bypass UnitOfWork)

| Mức độ | `🔴 HIGH` |
|--------|----------|

**Vấn đề:** `FriendService` inject cả `IUnitOfWork` lẫn `PokemonDbContext` trực tiếp. Điều này phá vỡ abstraction pattern:
- Một số operations dùng `_unitOfWork.Friendship` (qua repo)
- Một số operations dùng `_context.Friendships` trực tiếp (bypass repo)

```csharp
// FriendService.cs
public FriendService(
    IUnitOfWork unitOfWork,
    UserManager<ApplicationUser> userManager,
    PokemonDbContext context) // BYPASSES UnitOfWork abstraction
```

**Refactor:** 
- Thêm `IRepository<UserItem>`, `IRepository<UserBox>` vào `IUnitOfWork`
- Hoặc add specific repository methods cho complex queries (Include, etc.)
- Loại bỏ direct `PokemonDbContext` injection trong services

---

### 3.2 `FriendService.AcceptFriendRequestAsync` — Không update UserManager sau Friendship save

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

```csharp
// FriendService.cs line 283-289
if (currentUser != null) currentUser.FriendsCount++;
if (otherUser != null) otherUser.FriendsCount++;

await _unitOfWork.SaveChangesAsync(); // Saves Friendship via context
// MISSING: await _userManager.UpdateAsync(currentUser) và otherUser
```

`_userManager.UpdateAsync` không được gọi sau khi tăng `FriendsCount` → counter thay đổi bị lost.

---

### 3.3 `TokenService` — Đọc config mỗi lần generate token

| Mức độ | `🔵 LOW` |
|--------|---------|

```csharp
// TokenService.cs line 19-25
public string GenerateJwtToken(string userId, string username, string email)
{
    var jwtSettings = _configuration.GetSection("JwtSettings"); // Read config EVERY call
    var secretKey = jwtSettings["SecretKey"] ?? ...;
```

**Refactor:** Inject `IOptions<JwtSettings>` (strongly-typed) và cache `SymmetricSecurityKey` và `SigningCredentials` làm private fields.

---

### 3.4 `EmailService.cs` — File quá lớn (30KB, ~800+ lines implied)

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

30KB cho một service email là quá lớn. Likely chứa inline HTML templates. 

**Refactor:**
- Tách HTML templates ra file `.html` hoặc `.cshtml` riêng (embed as resources)
- Hoặc dùng thư viện templating như `Scriban` / `Fluid`

---

## 4. Server Layer (API)

### 4.1 `Program.cs` — 332 dòng, chứa toàn bộ service registration

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

**Vấn đề:** `Program.cs` (332 dòng) đăng ký tất cả services, JWT, CORS, Rate Limiting, Swagger, SignalR inline. Khó maintain.

```csharp
// Program.cs - tất cả trong 1 file
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddHttpClient<IPokeApiService, PokeApiService>();
// ... 20+ more registrations
```

**Refactor:** Tách thành extension methods:
- `ApplicationServiceExtensions.cs` → App services
- `IdentityServiceExtensions.cs` → Identity + JWT
- `InfrastructureExtensions.cs` → đã có nhưng incomplete (DependencyInjection.cs)

---

### 4.2 Controllers — Duplicate `GetCurrentUserId()` pattern

| Mức độ | `🔵 LOW` |
|--------|---------|

`GetCurrentUserId()` được định nghĩa in **mỗi controller** riêng biệt:

```csharp
// UserController.cs
private string GetCurrentUserId() => 
    User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;

// FriendController.cs  
private string GetCurrentUserId() => 
    User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? string.Empty;
```

**Refactor:** Tạo `ApiControllerBase : ControllerBase` base class với `protected string CurrentUserId`.

---

### 4.3 Controllers — Inconsistent error handling pattern

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

**Vấn đề:** Mỗi action method có `try-catch` riêng với pattern lặp đi lặp lại:

```csharp
// AuthController.cs - repeated ~10 times
try
{
    if (!ModelState.IsValid) return BadRequest(ModelState);
    var response = await _authService.XxxAsync(...);
    return Ok(response);
}
catch (UnauthorizedAccessException ex)
{
    return Unauthorized(new { message = ex.Message });
}
catch (Exception ex)
{
    return BadRequest(new { message = ex.Message });
}
```

**Refactor:** Implement **Global Exception Handler Middleware** (đã có `Middleware/` folder):
```csharp
// Middleware/ExceptionHandlingMiddleware.cs
// Map exceptions to HTTP status codes centrally
```
Loại bỏ try-catch khỏi tất cả controllers.

---

### 4.4 `UserController` — 2 catch endpoints song song (legacy + new)

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

```
POST /api/user/pokemon/catch         → CatchPokemonAsync (always succeeds, "legacy")
POST /api/user/pokemon/attempt-catch → AttemptCatchPokemonAsync (with catch rate)
```

Cả 2 endpoints tồn tại song song gây confusion. Legacy endpoint không nên expose ra production API.

**Refactor:** Deprecate và remove `/pokemon/catch`. Chỉ giữ `/pokemon/attempt-catch`.

---

### 4.5 `Program.cs` — Cookie SameSite config bị duplicate

| Mức độ | `🔵 LOW` |
|--------|---------|

```csharp
// Program.cs line 238-245
else
{
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
}
{
    // This block ALWAYS executes (missing 'else' keyword)
    options.Cookie.SameSite = SameSiteMode.None;
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
}
```

**Bug:** Có một dangling `{}` block sau else block → SameSite.None và SecurePolicy.Always sẽ **luôn luôn** được set kể cả trong Development. Đây là **logic bug**.

---

### 4.6 `AuthController.ExternalLogin` — Log token trong plain text

| Mức độ | `🔴 HIGH (SECURITY)` |
|--------|---------------------|

```csharp
// AuthController.cs line 120
_logger.LogInformation("Provider: {Provider} \nToken: {token} ", 
    externalLoginDto.Provider, externalLoginDto.Token); // ⚠️ SECURITY RISK
```

Access token của Google/Facebook bị log ra plain text. Serilog masking đã config cho "Token" property nhưng **structured logging parameter name phải khớp** với PropertyNames list.

**Fix:** Đổi parameter name sang `{Token}` (capital T) để Serilog masking hoạt động, hoặc remove log này.

---

## 5. Cross-Cutting Concerns

### 5.1 Không có Refresh Token

| Mức độ | `🔴 HIGH` |
|--------|----------|

JWT có thời hạn 7 ngày (`ExpirationDays`) và không có Refresh Token mechanism. Khi token hết hạn, user phải đăng nhập lại.

Comment trong code đã acknowledge: `// Production nên cân nhắc Refresh Token`

**Refactor:** Implement `RefreshToken` entity + `ITokenService.GenerateRefreshToken()` + `/api/auth/refresh` endpoint.

---

### 5.2 Không có Unit Tests

| Mức độ | `🔴 HIGH` |
|--------|----------|

Toàn bộ business logic (game mechanics, catch rate, EXP formula, nickname uniqueness) không có test coverage. Các pure services như `CatchRateCalculatorService`, `IVGeneratorService`, `ShinyRollerService` rất dễ unit test.

**Refactor:** Tạo `PokedexReactASP.Tests` project:
- Unit tests cho game mechanics services
- Integration tests cho repositories (InMemory)
- Test `GetUniqueNicknameAsync` edge cases

---

### 5.3 `TimeOfDay` dựa trên UTC time, không phải User timezone

| Mức độ | `🔵 LOW` |
|--------|---------|

```csharp
// UserService.cs line 512-521
private static TimeOfDay GetCurrentTimeOfDay()
{
    var hour = DateTime.UtcNow.Hour; // Always UTC
    return hour switch { ... };
}
```

User ở timezone +7 sẽ thấy "Night" từ 13:00-20:00 UTC (8PM-3AM local). **Refactor:** Accept timezone từ client hoặc store user's timezone preference.

---

### 5.4 `TODO` comments còn sót lại trong production code

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

```csharp
// UserService.cs line 328-329
CatchStreak: 0, // TODO: Track catch streak per species
HasShinyCharm: false, // TODO: Check inventory
```

```csharp
// PokemonFactoryService.cs line 137
IsUltraBeast = false // Would need to check species
```

```csharp
// CatchRateCalculatorService.cs line 129
PokeballType.NetBall => 3.5, // Would need type check
```

**Refactor:** Either implement hoặc track trong GitHub Issues, không để TODO trong code.

---

## 6. Database & EF Core

### 6.1 `IRepository.FindAsync` — N+1 risk với Expression predicate

| Mức độ | `🔴 HIGH` |
|--------|----------|

**Vấn đề:** `IRepository<T>.FindAsync(Expression<Func<T, bool>>)` trả về `IEnumerable<T>` (materialized). Không support `Include()` (eager loading). Kết quả là nhiều queries bị force sang client-side evaluation hoặc gây N+1.

Ví dụ: `FriendService.GetFriendsAsync` **phải** bypass repository và dùng `_context.Friendships.Include(...)` trực tiếp vì repo không support include.

**Refactor:**
- Thêm `FindAsync(Expression<Func<T, bool>> predicate, Func<IQueryable<T>, IQueryable<T>>? includes = null)` overload
- Hoặc implement **Specification Pattern** cho complex queries

---

### 6.2 `UnitOfWork` không include `UserItem` và `UserBox` repositories

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

`IUnitOfWork` chỉ expose 3 repositories: `UserPokemon`, `Friendship`, `FriendRequest`. `UserItem` và `UserBox` không có repository → phải access qua `DbContext` trực tiếp hoặc qua UserManager.

**Refactor:** Thêm:
```csharp
IRepository<UserItem> UserItem { get; }
IRepository<UserBox> UserBox { get; }
```

---

### 6.3 `PokemonDbContext` — Entity configurations inline, không dùng `IEntityTypeConfiguration`

| Mức độ | `🔵 LOW` |
|--------|---------|

Toàn bộ fluent API configuration nằm trong `OnModelCreating` (165 dòng). EF Core best practice là tách ra `IEntityTypeConfiguration<T>` riêng.

**Refactor:**
```
Infrastructure/Persistence/Configurations/
  ApplicationUserConfiguration.cs
  UserPokemonConfiguration.cs
  FriendshipConfiguration.cs
  FriendRequestConfiguration.cs
```
Rồi dùng `modelBuilder.ApplyConfigurationsFromAssembly(...)`.

---

### 6.4 Thiếu Index quan trọng

| Mức độ | `⚠️ MEDIUM` |
|--------|------------|

| Table | Column thiếu index | Impact |
|-------|-------------------|--------|
| `UserPokemon` | `IsShiny` | Filter shiny collection chậm |
| `UserPokemon` | `CaughtDate` | Sort by date chậm khi collection lớn |
| `UserBox` | `UserId` | Không có index |
| `UserItem` | `UserId` | Có index nhưng thiếu `Quantity > 0` partial |
| `AspNetUsers` | `LastActiveDate` | Online status check chậm |

---

### 6.5 Seeder dùng `.Wait()` (sync over async)

| Mức độ | `🔵 LOW` |
|--------|---------|

```csharp
// Program.cs line 276
IdentitySeeder.SeedAsync(app.Services, ...).Wait(); // Deadlock risk
```

**Refactor:** Dùng `app.RunWithSeedAsync()` pattern hoặc top-level await trong `Main`:
```csharp
await IdentitySeeder.SeedAsync(...);
```

---

## 7. Bảng ưu tiên tổng hợp

| # | Vấn đề | File | Mức độ | Effort |
|---|--------|------|--------|--------|
| 1 | Security: Log token plain text | `AuthController.cs:120` | 🔴 CRITICAL | Thấp |
| 2 | Bug: Cookie SameSite duplicate block | `Program.cs:238-245` | 🔴 HIGH | Thấp |
| 3 | FriendService bypass UnitOfWork abstraction | `FriendService.cs` | 🔴 HIGH | Trung bình |
| 4 | FriendService: Missing UserManager.UpdateAsync | `FriendService.cs:283` | 🔴 HIGH | Thấp |
| 5 | Duplicate catch logic (2 methods) | `UserService.cs` | 🔴 HIGH | Trung bình |
| 6 | `UserPokemon.CustomMoveIds` comma-separated | `UserPokemon.cs:132` | 🔴 HIGH | Cao |
| 7 | Nature modifier không được áp dụng vào stat calc | `PokemonEnricherService.cs:146` | ⚠️ MEDIUM | Thấp |
| 8 | `UserService` God Service vi phạm SRP | `UserService.cs` | ⚠️ MEDIUM | Cao |
| 9 | Global Exception Handler còn thiếu | `Controllers/` | ⚠️ MEDIUM | Trung bình |
| 10 | Repository không support Include/eager loading | `Repository.cs` | ⚠️ MEDIUM | Trung bình |
| 11 | PokemonCacheService SemaphoreSlim bottleneck | `PokemonCacheService.cs` | ⚠️ MEDIUM | Trung bình |
| 12 | `CapitalizeFirst` duplicate 3 nơi | Multiple files | 🔵 LOW | Thấp |
| 13 | `GetExpForNextLevel` duplicate 2 nơi | Multiple files | 🔵 LOW | Thấp |
| 14 | `IPokeApiService` trong cùng file implementation | `PokeApiService.cs` | 🔵 LOW | Thấp |
| 15 | `Program.cs` quá dài, thiếu extension methods | `Program.cs` | 🔵 LOW | Trung bình |
| 16 | EF Config inline thay vì `IEntityTypeConfiguration` | `PokemonDbContext.cs` | 🔵 LOW | Trung bình |
| 17 | `Pokemon.cs` obsolete entity chưa xóa | `Pokemon.cs` | 🔵 LOW | Thấp |
| 18 | `DaysPlayed`/`HoursPlayed` dead fields | `Trainer.cs` | 🔵 LOW | Thấp |
| 19 | TimeOfDay dùng UTC thay vì user timezone | `UserService.cs:512` | 🔵 LOW | Trung bình |
| 20 | TODO comments trong production code | Multiple files | 🔵 LOW | Thấp |
