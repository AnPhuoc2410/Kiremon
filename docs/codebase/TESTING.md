# Testing Strategy

## Core Sections (Required)

### 1) Test Suites & Execution

- **Test Framework**: xUnit 2.5.3 with FluentAssertions 8.10.0 and Moq 4.20.72.
- **Test Project**: `PokedexReactASP.Application.Tests/PokedexReactASP.Application.Tests.csproj` (Target .NET 8).
- **Execution Command**:
  ```bash
  dotnet test
  ```
- **Current Status**: 38 tests total, 38 passing, 0 failing, 0 skipped (~190ms execution duration).

### 2) Test Inventory

| Test Class | Focus | Test Count | Evidence |
|------------|-------|------------|----------|
| `AchievementServiceTests` | User achievement progress, unlocks, notifications | 8 | `Application.Tests/Services/AchievementServiceTests.cs` |
| `AuthServiceTests` | Login, registration, 2FA, JWT token generation | 13 | `Application.Tests/Services/AuthServiceTests.cs` |
| `PokemonBoxServiceTests` | PC storage boxes, box reordering, capacity | 4 | `Application.Tests/Services/PokemonBoxServiceTests.cs` |
| `PokemonCatchServiceTests` | Catch rate calculation, shake count, catch success/failure | 5 | `Application.Tests/Services/PokemonCatchServiceTests.cs` |
| `UserServiceTests` | Legacy profile & collection tests (pending migration to `UserProfileService`) | 8 | `Application.Tests/Services/UserServiceTests.cs` |

### 3) Mocking Strategy

- `Mock<IUnitOfWork>`: Mocks repository calls without requiring an in-memory database.
- `MockIdentityHelpers.MockUserManager<T>()`: Helper simulating ASP.NET Identity `UserManager<ApplicationUser>` behavior.
- `Mock<IPokemonCacheService>`: Simulates PokeAPI data retrieval to avoid live HTTP network calls in unit tests.
- `Mock<IPokemonFactoryService>`: Controls RNG generation of stats, shiny flags, and natures for deterministic tests.

### 4) Testing Gaps & Recommendations

- **Coverage Gaps**:
  - `PokemonCollectionService`: Read-only queries and aggregation stats lack targeted unit tests.
  - `UserProfileService`: Relies on legacy `UserServiceTests` rather than dedicated tests.
  - `ResilientCacheService`: L1/L2 failover and circuit breaker logic lack automated unit/integration tests.
  - `PokemonNewsSyncService`: RSS parsing and batch upsert logic have no unit tests.
- **Nullable Warnings**: Several tests contain CS8600/CS8625 warnings due to null arguments in mock setup methods.

### 5) Evidence

- `PokedexReactASP.Application.Tests/PokedexReactASP.Application.Tests.csproj`
- `PokedexReactASP.Application.Tests/Services/`
- Test run terminal output: `Passed! - Failed: 0, Passed: 38, Skipped: 0, Total: 38`
