# TESTING

## Current State
- Backend: `PokedexReactASP.Application.Tests` (xUnit) with service-level unit tests for auth, pokemon catch/box, achievements, and user flows.
- Frontend: no dedicated test runner script in `package.json` (no Vitest/Jest detected).
- CI: GitHub Actions workflows exist (`build.yml`, `build-image.yml`, `deploy.yml`); SonarQube analysis workflows added in recent commits.

## What Exists Instead
- Build/lint oriented validation:
  - Frontend: `npm run build`, `npm run lint`, `npm run format:check`.
  - Backend: `dotnet build` at solution/project level.
- API manual exploration is supported via Swagger UI.

## Risks from Current Testing Posture
- Regression risk is higher around high-churn UI files (notably TCG tab and tour-guide components).
- Auth/security-sensitive flows (2FA, reset password, external login) rely heavily on manual verification.
- Friend workflow and game mechanics correctness are not protected by repeatable automated tests.

## Recommended Baseline (next step)
- Backend: add unit tests for application services and integration tests for controllers.
- Frontend: add component/integration tests for route-level pages and critical hooks.
- CI: add mandatory test job before deploy.

## Evidence
- `PokedexReactASP.sln`
- `pokedexreactasp.client/package.json`
- `docs/codebase/.codebase-scan.txt`
- `.github/workflows/build-image.yml`
- `.github/workflows/deploy.yml`
