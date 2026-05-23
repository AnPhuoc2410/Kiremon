# IMPLEMENTATION PLAN - Wild Area + TCG Card Reward

## 1. Phase roadmap

### Phase 1: DB + migration
1. Add entities: `WildAreaSpawn`, `UserTcgCard`, `TcgCardCache`.
2. Update `PokemonDbContext` + relationships.
3. Add agreed indexes.
4. Create migration and update database.

### Phase 2: TCG API client + cache
1. Add `PokemonTcgApi` settings.
2. Register typed `HttpClient`.
3. Implement search by `nationalPokedexNumbers` + `supertype:Pokémon`.
4. Use `select` fields to reduce payload.
5. Persist cache in DB + fallback when API fails.

### Phase 3: Wild Area read flow
1. Implement `GetCurrentWildAreaAsync`.
2. Return existing active spawns when valid.
3. Generate new batch when expired/missing.
4. Enrich response (name/sprite).

### Phase 4: Wild catch flow
1. Validate spawn ownership + state.
2. Call existing catch mechanic.
3. Success: add UserPokemon + update spawn + roll/grant card.
4. Failure: increase attempts, consume if attempts exhausted.
5. Return combined catch result.

### Phase 5: Card collection API
1. `GET /api/tcg-cards/my-cards`.
2. Filter/paging/sort.
3. Optional endpoint by `pokemonApiId`.

### Phase 6: Frontend integration
1. Add Home Wild Area tab.
2. Add services + React Query hooks.
3. Build encounter + result modals.
4. Build card collection tab/page.
5. Limit/remove free catch from Pokemon detail.

## 2. Suggested low-risk execution order
1. Backend entity + migration (`WildAreaSpawn`).
2. `GET /api/wild-area/current`.
3. Frontend basic Wild Area rendering.
4. TCG API client + cache.
5. `UserTcgCard` entity + migration.
6. `POST /attempt-catch`.
7. Frontend catch flow UI.
8. `GET /my-cards`.
9. Frontend card collection UI.
10. GBA visual polish.
11. Remove/limit free catch from Pokemon detail.

## 3. Team split (2 developers)

### Developer A - Backend
- Sprint 1:
- Entities + migration.
- WildArea/CardReward config.
- WildAreaController + GetCurrent.
- Spawn generation per user/hour.
- Sprint 2:
- PokemonTcgApiClient + cache.
- CardRewardService.
- AttemptCatch endpoint.
- MyCards API.
- Automated tests.

### Developer B - Frontend
- Sprint 1:
- Wild Area tab in Home.
- wild-area service + useWildArea hook.
- WildAreaMap with sprites + reset timer.
- Sprint 2:
- EncounterModal + catch mutation.
- CatchResultModal + reward UI.
- Cards tab/page.
- GBA style polish.

## 4. Delivery checkpoints
- Checkpoint A: spawn generation and stable display.
- Checkpoint B: backend catch flow end-to-end.
- Checkpoint C: card reward + collection complete.
- Checkpoint D: anti-abuse + rate-limit + tests passing.

## 5. Detailed plan - Phase 6: Frontend integration

### Summary
Integrate Wild Area and My Cards into the existing frontend architecture without introducing a new Home shell.
Chosen direction: attach Wild Area to current navigation (`Explore` flow), keep dedicated services/hooks, and migrate catch UX from free-catch in `Detail` to spawn-authoritative catch.

### Key implementation changes
1. Routing and entry points
- Add lazy routes:
- `/wild-area` -> Wild Area page/tab container.
- `/my-cards` -> My TCG cards collection page.
- Keep existing routes unchanged to reduce regression risk.
- Add navigation entry in the current top-level UI path (where users already move from `Explore` / main navigation), not in a brand-new Home module.

2. Types and API contracts
- Add `src/types/wild-area.types.ts`:
- `WildAreaResponse`, `WildPokemonSpawn`, `WildCatchAttemptRequest`, `WildCatchResult`, `WildCardReward`.
- Add `src/types/tcg-card-collection.types.ts`:
- `MyTcgCardsQuery`, `MyTcgCardItem`, `PagedTcgCardsResponse`, `PokemonTcgPreviewCard`.
- Keep naming aligned with backend Phase 3-5 DTO fields (`camelCase` in FE layer).

3. Service layer
- Add `src/services/wild-area/wild-area.service.ts` using `AuthenticatedApiService`:
- `getCurrent() -> GET /wild-area/current`
- `attemptCatch(spawnId, payload) -> POST /wild-area/spawns/{spawnId}/attempt-catch`
- Add `src/services/tcg-card-collection/tcg-card-collection.service.ts`:
- `getMyCards(query) -> GET /tcg-cards/my-cards`
- `getPokemonPreviewCards(pokemonApiId) -> GET /tcg-cards/pokemon/{pokemonApiId}`
- Export new services in `src/services/index.ts`.

4. React Query hooks
- Add `src/hooks/queries/useWildArea.ts`:
- query key: `['wild-area', 'current']`, stale time around 30s.
- Add `src/hooks/mutations/useAttemptWildCatch.ts`:
- mutation calls wild-area catch endpoint.
- on success/invalidate:
- `['wild-area', 'current']`
- `['collection']` (existing MyPokemon-related data if used)
- `['tcg-cards', 'my-cards']`
- Add `src/hooks/queries/useMyTcgCards.ts` with query key containing pagination/filter/sort.
- Add `src/hooks/queries/usePokemonTcgPreview.ts` for optional detail tab preview endpoint.

5. UI integration (MVP scope)
- Add `src/pages/WildArea/index.tsx` + `index.style.ts`:
- Load current wild area.
- Render 6 fixed spawn slots by `slotIndex`.
- Show reset countdown from `secondsUntilReset`.
- Click spawn opens encounter modal.
- Add `EncounterModal`:
- choose pokeball type (default Pokeball),
- submit catch attempt,
- loading lock during mutation.
- Add `CatchResultModal`:
- show catch result message, shake count, attempts left, consumed state,
- show card reward block if present.
- Add `src/pages/MyCards/index.tsx` + styles:
- list + pagination + filter (`pokemonApiId`, `rarityTier`) + sort options (`obtained-*`, `rarity-*`).

6. Existing Detail page migration (free-catch limitation)
- In `src/pages/Detail/index.tsx`:
- remove direct use of `collectionService.attemptCatch` for main CTA in this phase.
- Replace catch CTA with:
- `Find in Wild Area` button (navigate to `/wild-area`), or
- disabled informational state when not authenticated.
- Keep existing Pokemon info tabs unchanged.
- Optional: keep legacy flow behind feature flag for rollback (`VITE_ENABLE_LEGACY_FREE_CATCH=false` default).

7. Styling and UX constraints
- Reuse existing typography/theme tokens; do not introduce global font override.
- Wild Area visual style:
- pixelated sprites,
- fixed map panel,
- lightweight idle animation,
- responsive fallback for small screens (stacked layout, scrollable card list).
- Preserve current toast pattern for feedback and consistent error messaging.

### Test plan (frontend phase)
1. Unit/component checks
- Wild Area page renders loading/empty/error/success states.
- Spawn click opens modal with correct spawn data.
- Catch result modal handles both success and failure payloads.
- My Cards list handles pagination and filter/sort state transitions.

2. Integration checks with backend
- `GET /wild-area/current` populates slots and timer.
- Re-open Wild Area before reset returns same spawn IDs.
- Catch mutation updates attempts/consumed state after refetch.
- Card reward (if returned) appears and My Cards reflects update.
- `GET /tcg-cards/pokemon/{pokemonApiId}` preview is displayed where wired.

3. Regression checks
- Existing routes (`/pokemons`, `/pokemon/:name`, `/my-pokemon`, `/poke-mart`) still work.
- Detail page no longer performs free-catch API call in default path.
- Unauthorized users are redirected or shown login-required messaging for protected actions.

### Suggested execution order (Phase 6)
1. Add FE types and service files.
2. Add query/mutation hooks and query keys.
3. Add `/wild-area` page with read flow only.
4. Add catch mutation flow + result modal.
5. Add `/my-cards` page with filter/pagination/sort.
6. Wire optional pokemon preview endpoint.
7. Replace Detail free-catch CTA with Wild Area redirect.
8. Polish visuals and run manual QA checklist.

### Assumptions
- Backend Phases 3, 4, and 5 endpoints are available and secured.
- Existing auth cookie/token flow in `AuthenticatedApiService` remains unchanged.
- Phase 6 focuses on frontend integration; no backend contract changes are introduced here.
