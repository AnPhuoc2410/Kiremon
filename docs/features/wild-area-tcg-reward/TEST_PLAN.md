# TEST PLAN - Wild Area + TCG Card Reward

## 1. Backend unit tests

### WildAreaService
- User has no spawn -> generate new spawn batch.
- User has valid spawn -> return existing batch.
- Spawn expired -> regenerate new batch.
- Spawn belongs to different user -> reject.
- Spawn consumed -> reject.
- AttemptsUsed >= MaxAttempts -> reject.

### CardRewardService
- Tier roll follows configured weights.
- If no card exists in rolled tier -> fallback to any tier.
- If external TCG API returns no cards -> catch still succeeds, `cardReward = null`.
- Duplicate card -> increase `Quantity`.
- New card -> insert `UserTcgCard`.

## 2. Integration tests
- `GET /api/wild-area/current`.
- `POST /api/wild-area/spawns/{spawnId}/attempt-catch`.
- `GET /api/tcg-cards/my-cards`.
- Verify auth + ownership + spawn expiry behavior.

## 3. Frontend manual QA
- Initial Wild Area load.
- Reset timer countdown is correct.
- Clicking sprite opens encounter modal.
- Catch failure shows shake count + attempts left.
- Catch success shows pokemon + card reward.
- Refreshing page does not reroll spawns before `resetAt`.
- New spawns appear after reset time.
- Unauthenticated users are redirected or blocked.

## 4. Security/abuse checks
- Client-forged `pokemonApiId` does not affect catch result.
- Client-forged `rarity` or `tcgCardId` is ignored.
- Catch spam is throttled by `WildCatchPolicy`.

## 5. Exit criteria
- All critical test cases pass.
- No free-catch bypass remains outside spawn flow (or hard validation enforces spawn-only catch).
- Post-catch pokemon/card data is consistent in DB.
