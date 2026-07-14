# CONCERNS

## 1) Incomplete Automated Test Coverage
- Backend unit tests exist (`PokedexReactASP.Application.Tests`) for auth, catch, box, achievement, and user services.
- Frontend has no Vitest/RTL test runner configured in `package.json`.
- SonarQube/SonarCloud CI workflows exist but full coverage thresholds are [TODO].
- Impact: regressions still likely in UI, SignalR, and admin flows without frontend/integration tests.

## 2) High-Churn Frontend Areas
- `TcgTab.tsx` and `TcgTab.style.ts` are among the most frequently changed files recently.
- Impact: these files are likely to continue evolving and can break easily without test coverage.

## 3) Configuration Fragility at Startup
- Backend hard-fails when `DefaultConnection` is absent.
- Impact: local setup and deployment can fail early if environment config is incomplete.

## 4) Incomplete Feature Hooks / TODOs
- Explicit TODO markers remain in production code (e.g., catch streak tracking, shiny charm inventory check, friend gift/pokemon API placeholders).
- Impact: some features are partially implemented and may expose inconsistent UX.

## 5) Security Gaps vs README Claims
- README advertises "CSRF prevention" but no `Antiforgery`/`ValidateAntiForgeryToken` middleware was found; mitigation relies on `SameSite` cookies + Bearer tokens.
- `GlobalPolicy` rate limiter is registered but not applied via `[EnableRateLimiting]` on controllers (only `AuthPolicy` and `WildCatchPolicy` confirmed).
- `RequireHttpsMetadata = false` on JWT bearer options — acceptable for dev proxy but should be `true` in strict production.
- No HSTS, CSP, or security headers middleware detected in repo.
- Scan did not detect `SECURITY.md`, Dependabot, or Snyk configs.
- [ASK USER] Is there an external security baseline/runbook (secrets rotation, incident response, dependency scanning) maintained outside this repo?

## 7) Performance Risks
- Large static assets in `public/` (e.g. `monastiraki_square.gif` ~12MB) can hurt LCP on pages that load them.
- In-memory frontend cache (`cacheStore`) does not survive page refresh and is not shared across tabs.
- Redis fallback to per-instance memory cache can cause cache inconsistency in multi-instance deployments until Redis recovers.

## 6) Documentation Encoding Quality
- Existing root README shows mojibake/encoding issues in multiple sections.
- Impact: onboarding readability and trust can be reduced for new contributors.

## Evidence
- `docs/codebase/.codebase-scan.txt`
- `PokedexReactASP.Infrastructure/DependencyInjection.cs`
- `PokedexReactASP.Application/Services/UserService.cs`
- `pokedexreactasp.client/src/pages/Friends/index.tsx`
- `README.md`
