# API SPEC - Wild Area + TCG Card Reward (MVP)

## Auth
- All endpoints require JWT Bearer token.

## 1) GET `/api/wild-area/current`

### Behavior
- Read `userId` from JWT.
- Return active, unexpired spawns.
- If missing or expired -> generate a new spawn batch.

### Response 200
```json
{
  "areaCode": "viridian_field",
  "areaName": "Viridian Field",
  "resetAt": "2026-05-23T13:00:00Z",
  "secondsUntilReset": 1820,
  "spawns": [
    {
      "spawnId": 101,
      "pokemonApiId": 16,
      "pokemonName": "Pidgey",
      "spriteUrl": "https://...",
      "slotIndex": 0,
      "spawnRarity": "Common",
      "attemptsLeft": 3,
      "isCaught": false,
      "isConsumed": false
    }
  ]
}
```

## 2) POST `/api/wild-area/spawns/{spawnId}/attempt-catch`

### Request
```json
{
  "pokeballType": "Pokeball"
}
```

### Failure response 200
```json
{
  "success": false,
  "pokemonCaught": false,
  "shakeCount": 2,
  "message": "Oh no! The Pokemon broke free!",
  "attemptsLeft": 2,
  "spawnConsumed": false,
  "cardReward": null
}
```

### Success response 200
```json
{
  "success": true,
  "pokemonCaught": true,
  "shakeCount": 4,
  "message": "Gotcha! Pidgey was caught!",
  "userPokemon": {
    "id": 555,
    "pokemonApiId": 16,
    "nickname": null,
    "isShiny": false,
    "nature": "Hardy",
    "caughtLevel": 5
  },
  "cardReward": {
    "userCardId": 88,
    "tcgCardId": "base1-57",
    "name": "Pidgey",
    "rarity": "Common",
    "rarityTier": "Common",
    "imageSmall": "https://...",
    "imageLarge": "https://..."
  },
  "spawnConsumed": true
}
```

### Validation rules
- Spawn must belong to current user.
- Spawn must not be expired.
- Spawn must not be consumed.
- `AttemptsUsed < MaxAttempts`.
- `pokemonApiId` must be read from spawn in DB, never from client.

## 3) GET `/api/tcg-cards/my-cards`

### Query params
- `page`, `pageSize`
- `pokemonApiId`
- `rarityTier`
- `sort` (e.g. `obtained-desc`)

### Response 200
```json
{
  "items": [
    {
      "userCardId": 1,
      "tcgCardId": "xy1-42",
      "pokemonApiId": 25,
      "name": "Pikachu",
      "rarity": "Rare",
      "rarityTier": "Rare",
      "quantity": 2,
      "imageSmall": "https://...",
      "imageLarge": "https://..."
    }
  ],
  "page": 1,
  "pageSize": 30,
  "totalCount": 100
}
```

## 4) Optional endpoint
- `GET /api/tcg-cards/pokemon/{pokemonApiId}`
- Purpose: preview card pool by Pokemon in detail/tab views.

## Error model (recommended)
- `400` invalid request payload.
- `401` unauthorized.
- `403` spawn does not belong to user.
- `404` spawn not found.
- `409` spawn expired or attempts exhausted.
- `429` rate limit exceeded (`WildCatchPolicy`).
