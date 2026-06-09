# Coding Conventions

## Core Sections (Required)

### 1) Naming Rules

| Item | Rule | Example | Evidence |
|------|------|---------|----------|
| Files | PascalCase for C# backend files; PascalCase for TSX components and camelCase/kebab-case for utility/hook TS files on frontend. | `UserController.cs`, `ItemDescriptionBox.tsx`, `usePokemonCore.ts` | `PokedexReactASP.Server/Controllers/UserController.cs`, `pokedexreactasp.client/src/pages/Market/components/ItemDescriptionBox.tsx` |
| Functions/methods | PascalCase for C# backend methods; camelCase for React/JS/TS frontend functions. | `RegisterAsync`, `getBoxes` | `PokedexReactASP.Application/Services/AuthService.cs`, `pokedexreactasp.client/src/services/collection/box.service.ts` |
| Types/interfaces | PascalCase with 'I' prefix for C# interfaces; PascalCase for C# DTOs and TS types/interfaces. | `IPokemonBoxService`, `UserPokemonDto`, `MovePokemonDto` | `PokedexReactASP.Application/Interfaces/IPokemonBoxService.cs`, `pokedexreactasp.client/src/types/box.types.ts` |
| Constants/env vars | UPPER_SNAKE_CASE for backend settings/environment keys and frontend settings. | `JWT_SECRET`, `VITE_API_URL` | `PokedexReactASP.Server/Program.cs`, `pokedexreactasp.client/.env` |

### 2) Formatting and Linting

- Formatter: Prettier on frontend using `.prettierrc.json` and standard C# formatter on backend via `.editorconfig`.
- Linter: ESLint on frontend using `eslint.config.js` and Roslyn analyzers on backend.
- Most relevant enforced rules: Nullable enable for C#, no `any` types for TypeScript, and Prettier auto-formatting on commit via Husky.
- Run commands: `npm run lint` and `npm run format` for frontend.

### 3) Import and Module Conventions

- Import grouping/order: React core imports first, third-party libraries second, internal components/hooks using absolute paths (`@/*`) third, and relative styles/assets last.
- Alias vs relative import policy: Preference for absolute path alias `@/` mapped to `src/` in TS/Vite configurations.
- Public exports/barrel policy: Barrel exports (`index.ts`) are used in folders like `components/ui/` or `pages/` to simplify clean grouping.

### 4) Error and Logging Conventions

- Error strategy by layer:
  - Backend controllers return precise HTTP status codes using standard C# exceptions mapped to safe client responses via `ExceptionHandlingMiddleware.cs`. Exceptions are never swallowed.
  - Frontend uses try/catch blocks wrapped inside service queries, displaying safe notifications via `react-hot-toast` to the user.
- Logging style and required context fields: Serilog and Microsoft.Extensions.Logging with structured context fields (e.g. `UserId`, `ClientIP`).
- Sensitive-data redaction rules: Redaction of password, connection string, and tokens from log messages.

### 5) Testing Conventions

- Test file naming/location rule: Backend stubs/tests are named with `Tests.cs` suffix; frontend tests are placed inside Vitest files.
- Mocking strategy norm: Moq for backend mock dependencies; Vitest stubs/mock queries for frontend hooks.
- Coverage expectation: High test coverage for core domain validation, catch rate calculations, and authentication guards.

### 6) Evidence

- `pokedexreactasp.client/eslint.config.js`
- `pokedexreactasp.client/.prettierrc.json`
- `pokedexreactasp.client/tsconfig.app.json`
- `PokedexReactASP.Server/Middleware/ExceptionHandlingMiddleware.cs`
- `CLAUDE.md`

## Extended Sections (Optional)

- C# 12 and .NET 8 conventions:
  - Prefer using Primary Constructors for Dependency Injection (e.g., `public class MyClass(IDependency dependency)`).
  - Prefer using CancellationToken in all async operations.
  - Prefer using ConfigureAwait(false) in libraries like Application/Infrastructure to optimize CPU threads.
