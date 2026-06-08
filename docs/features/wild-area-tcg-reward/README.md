# Wild Area + TCG Card Reward (MVP)

## Documents in this package
- `PRD.md`: product goals, MVP scope, and DoD.
- `TECHNICAL_DESIGN.md`: backend/frontend architecture, data model, anti-abuse rules.
- `API_SPEC.md`: detailed API contracts for MVP.
- `IMPLEMENTATION_PLAN.md`: implementation phases, execution order, team split.
- `TEST_PLAN.md`: backend/frontend/integration test checklist.

## Status
- Version: `v1.0-mvp`
- Source of truth: consolidated from the agreed Wild Area + TCG Reward conversation.

## Locked MVP scope
- 1 area: `viridian_field`
- 6 spawns per user
- reset every 60 minutes
- each spawn has 3 attempts
- on catch success: add to `UserPokemon` + roll 1 server-side card reward + add/increase `UserTcgCard`
- Wild Area UI with GBA/pixel style (static map, click sprite)
