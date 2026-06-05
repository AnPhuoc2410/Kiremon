# PRD - Wild Area + TCG Card Reward

## 1. Feature objective

### Feature name
- Wild Area + TCG Card Reward

### Core loop
1. User enters Home -> Wild Area tab.
2. Backend returns current spawn list.
3. User selects one spawn and attempts catch.
4. If catch succeeds:
- Add Pokemon to UserPokemon collection.
- Roll a random TCG card for that same Pokemon.
- Add card to user card collection (duplicates increase quantity).
- Return catch result + card reward.
5. Spawn is consumed or attempts are reduced on failure.

### Problem this feature solves
- Removes free-catch behavior from any Pokemon detail page.
- Adds scarcity through limited spawn availability.
- Improves retention with hourly resets.
- Adds progression via card rewards.

## 2. Scope

### MVP in-scope
- Home has a Wild Area tab.
- Each user gets 6 spawns.
- Spawns reset every hour.
- Catching is only allowed from valid spawns.
- Catch success grants 1 random card with rarity-based probability.
- A Card Collection tab/page shows obtained cards.
- Wild Area UI uses GBA/pixel style with simple logic.

### Out of scope (MVP)
- Tile collision engine.
- Map editor.
- Real-time multiplayer movement.
- NPC/dialogue.
- Battle encounters.
- Card trading.
- Marketplace/economy.
- Complex animation systems.

## 3. Product rules (MVP)
- Single area: `viridian_field`.
- Spawn count: `6`.
- Reset interval: `60` minutes.
- Attempts per spawn: `3`.
- Success => consume spawn.
- Failure => reduce attempts, optionally consume when attempts are exhausted.
- Card reward is always rolled server-side.

## 4. Definition of Done
- Logged-in user sees Wild Area tab on Home.
- Spawn set remains stable on page refresh before expiration.
- New spawn set is generated after expiration.
- Catch is valid only when spawn belongs to current user and is active.
- Catch success creates UserPokemon.
- Catch success grants a card and persists it to UserTcgCard.
- User can view card collection.
- Pokemon detail no longer allows free catch, or catch is forced through spawn flow.
- Backend does not trust `pokemonApiId`, `rarity`, or `tcgCardId` from client in catch flow.
