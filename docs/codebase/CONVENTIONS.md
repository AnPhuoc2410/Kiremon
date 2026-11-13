# Codebase Conventions

## Core Sections (Required)

### 1) Language & C# Conventions

- **C# Language Version**: C# 12 on .NET 8 runtime.
- **Nullable Reference Types**: Strictly enabled across all projects (`<Nullable>enable</Nullable>`).
- **Dependency Injection**: Constructor injection with `private readonly` fields prefixed with an underscore (`_unitOfWork`, `_logger`).
- **Async Programming**: Async methods must return `Task` or `Task<T>`, accept `CancellationToken` for cancellation support where applicable, and never use blocking calls like `.Wait()` or `.Result`.
- **String Handling & Helpers**: Shared logic isolated in `PokedexReactASP.Application.Common.Helpers` (`PokemonNameHelper`, `FriendCodeHelper`, `TrainerLevelCalculator`).

### 2) Error Handling & Response Conventions

- **Controller Base**: All controllers inherit from `ApiControllerBase` to standardize `CurrentUserId` retrieval and HTTP responses.
- **Global Middleware**: Uncaught exceptions are intercepted by `ExceptionHandlingMiddleware`, converting them to uniform JSON error structures with appropriate HTTP status codes.
- **Safe Returns**: Always return specific HTTP codes:
  - `200 OK` for successful queries.
  - `401 Unauthorized` when identity claims are missing.
  - `404 Not Found` when entities do not exist.
  - `400 Bad Request` for validation failures.

### 3) Database & EF Core Conventions

- **Query Tracking**: Read-only queries must specify `disableTracking: true` (`AsNoTracking()`) to prevent change tracking overhead.
- **Fluent Configurations**: Relationships, indexes, cascading behaviors, and property limits are defined in `PokemonDbContext.OnModelCreating`.
- **Eager Loading**: Controlled eager loading via `includes` delegate (`Func<IQueryable<T>, IQueryable<T>>? includes`) in repository methods.

### 4) Imports & Formatting

- Explicit namespace declarations: `namespace PokedexReactASP.Application.Services { ... }`.
- System usings placed first, followed by third-party packages, then project namespaces.
- AutoMapper mappings centralized in `PokedexReactASP.Application.Mappings.MappingProfile`.

### 5) Evidence

- `PokedexReactASP.Domain/PokedexReactASP.Domain.csproj`
- `PokedexReactASP.Server/Controllers/ApiControllerBase.cs`
- `PokedexReactASP.Server/Middleware/ExceptionHandlingMiddleware.cs`
- `PokedexReactASP.Infrastructure/Repositories/Repository.cs`
- `PokedexReactASP.Application/Common/Helpers/PokemonNameHelper.cs`
