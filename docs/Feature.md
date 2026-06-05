# 🚀 Feature Roadmap — Kiremon Backend

> **Phiên bản:** 2026-06-04  
> **Scope:** Tính năng mới + mở rộng tính năng hiện có  
> **Priority:** ⭐ Critical → 🔵 Nice-to-have

---

## Mục lục

1. [Auth & Security](#1-auth--security)
2. [Game Mechanics — Mở rộng](#2-game-mechanics--mở-rộng)
3. [Pokemon System — Nâng cấp](#3-pokemon-system--nâng-cấp)
4. [Social System — Mở rộng](#4-social-system--mở-rộng)
5. [Item & Shop System](#5-item--shop-system)
6. [Battle System](#6-battle-system)
7. [Achievement & Progression](#7-achievement--progression)
8. [Notification & Real-time](#8-notification--real-time)
9. [API & Developer Experience](#9-api--developer-experience)
10. [Database & Performance](#10-database--performance)

---

## 1. Auth & Security

### 1.1 ⭐ Refresh Token System

**Hiện trạng:** JWT 7 ngày, không có refresh. User phải đăng nhập lại sau khi hết hạn.

**Tính năng cần thêm:**
- `RefreshToken` entity: `(Id, UserId, Token, ExpiresAt, IsRevoked, CreatedAt, DeviceInfo)`
- `POST /api/auth/refresh` — exchange refresh token lấy access token mới
- `POST /api/auth/revoke` — logout và revoke token
- Rotation: mỗi lần refresh phải generate refresh token mới (1-time use)
- Lưu refresh token trong `HttpOnly cookie`, access token trong memory (frontend)

**Impact:** Critical cho UX production — user không bị logout giữa chừng.

---

### 1.2 ⭐ Device/Session Management

**Tính năng:**
- `UserSession` entity: `(Id, UserId, RefreshToken, DeviceName, DeviceType, IPAddress, LastUsedAt, IsActive)`
- `GET /api/auth/sessions` — xem tất cả phiên đăng nhập
- `DELETE /api/auth/sessions/{sessionId}` — revoke session từ xa
- Thông báo qua email khi đăng nhập từ thiết bị mới

---

### 1.3 🔶 OAuth2 — Thêm Discord/Apple Login

**Hiện trạng:** Đã có Google + Facebook. Cần thêm:
- Discord OAuth2 (gaming audience phù hợp với Pokemon game)
- Apple Sign In (mandatory cho iOS apps)

**Infrastructure đã sẵn:** `ISocialAuthService` + `SocialVerifyService` — chỉ cần thêm provider mới.

---

### 1.4 🔵 Account Security Score

- Hiển thị security score cho user dựa trên: có 2FA, email verified, password strength, v.v.
- `GET /api/auth/security-status` → `{ score: 85, tips: ["Enable 2FA", ...] }`

---

## 2. Game Mechanics — Mở rộng

### 2.1 ⭐ Catch Streak System (Shiny Chaining)

**Hiện trạng:** `CatchStreak: 0` được hardcode vào `PokemonCreationContext`. `ShinyRollerService` đã có parameter `CatchStreak` nhưng luôn nhận 0.

**Tính năng:**
- Track catch streak per Pokemon species (số lần bắt liên tiếp cùng loài)
- Lưu trong `ApplicationUser.CatchStreakData` hoặc bảng riêng `UserCatchStreak(UserId, PokemonApiId, Streak, LastUpdated)`
- Streak tăng shiny rate và IV quality (đã implement trong `ShinyRollerService` và `IVGeneratorService`)
- Reset streak nếu bắt loài khác (mechanics thật của game)

**API:**
```
GET  /api/user/pokemon/streak/{pokemonApiId}   → { streak: 15, shinyBonus: "+2.5%" }
POST /api/user/pokemon/catch                    → streak updated in response
```

---

### 2.2 ⭐ Inventory Check cho HasShinyCharm

**Hiện trạng:** `HasShinyCharm: false` hardcoded vào cả `CatchPokemonAsync` và `AttemptCatchPokemonAsync`.

**Tính năng:**
- `UserItem` table đã tồn tại với `ItemApiId`
- Shiny Charm có `ItemApiId = 580` từ PokeAPI
- `PokemonFactoryService` cần check inventory: `await _unitOfWork.UserItem.ExistsAsync(i => i.UserId == userId && i.ItemApiId == 580 && i.Quantity > 0)`

**Impact:** Shiny Charm đã được design vào game mechanics nhưng chưa functional.

---

### 2.3 ⭐ Wild Pokemon Level Scaling by Region

**Hiện trạng:** Level chỉ scale theo trainer level. Không có concept "vùng" ảnh hưởng encounter.

**Tính năng:**
- `CatchAttemptDto` đã có `CaughtLocation` field
- Map location → region → level range
- Kanto Route 1: Level 2-5 | Safari Zone: Level 20-30 | Victory Road: Level 45-55
- Lưu location data trong `LocationType` enum (đã có) + thêm `RegionSettings` config

---

### 2.4 🔶 Evolution System

**Hiện trạng:** `UserPokemon.CanEvolve`, `EvolvedFromApiId` đã có sẵn nhưng chưa có logic.

**Tính năng:**
- `POST /api/user/pokemon/{id}/evolve` — trigger evolution
- Check evolution conditions từ PokeAPI evolution chain
- Evolution types: level-based, item-based, trade-based, friendship-based
- Sau khi evolve: `PokemonApiId` thay đổi, thống kê được re-enriched

**API:**
```
GET  /api/user/pokemon/{id}/evolution-chain  → { canEvolve: true, nextEvolution: {...}, condition: "Level 36" }
POST /api/user/pokemon/{id}/evolve           → { newPokemonApiId: 6, success: true }
```

---

### 2.5 🔶 NetBall Type Check — Hoàn thiện ball mechanics

**Hiện trạng:**
```csharp
PokeballType.NetBall => 3.5, // Would need type check
PokeballType.DiveBall => ???  // Missing from switch
```

**Tính năng:**
- NetBall: 3.5x chỉ cho Water/Bug types — cần check `Type1`/`Type2` từ `CatchCalculationContext`
- DiveBall: 3.5x underwater (LocationType.Water)
- BeastBall: 5x cho Ultra Beasts (cần flag trong species data)
- Thêm `Type1`, `Type2` vào `CatchCalculationContext`

---

### 2.6 🔶 Pokemon Training / EV Training

**Hiện trạng:** `EvHp`, `EvAttack`, v.v. đã có trong `UserPokemon` nhưng không có endpoint nào update EVs.

**Tính năng:**
- `POST /api/user/pokemon/{id}/train` — tăng EV cho stat cụ thể (dùng training items)
- Validate: EV per stat max 252, total max 510
- Deduct item từ inventory sau khi train
- `GET /api/user/pokemon/{id}/training-summary` → EV breakdown với visual

---

### 2.7 🔵 Egg Hatching System

**Hiện trạng:** `PokeApiSpeciesDetail.Hatch_Counter` đã fetch nhưng không được dùng.

**Tính năng:**
- User có thể đặt egg (tương tự breeding)
- Egg hatch sau N steps/interactions
- Hatch ra Pokemon baby với bonus friendship/IVs
- Endpoint: `POST /api/user/eggs/hatch/{eggId}`

---

## 3. Pokemon System — Nâng cấp

### 3.1 ⭐ Box Management API

**Hiện trạng:** `UserBox` entity tồn tại trong DB nhưng không có API endpoint nào để manage boxes.

**Tính năng:**
- `GET  /api/user/boxes` — list tất cả boxes với Pokemon slots
- `POST /api/user/boxes` — tạo box mới (max 30 boxes như game thật)
- `PUT  /api/user/boxes/{boxId}` — rename, change background
- `DELETE /api/user/boxes/{boxId}` — xóa box (Pokemon trở về box 1)
- `POST /api/user/pokemon/{id}/move` — di chuyển Pokemon giữa box/party

**API:**
```
PUT /api/user/pokemon/{id}/move
Body: { targetBoxId: 3, slotIndex: 15 }  // or { toParty: true, partySlot: 2 }
```

---

### 3.2 ⭐ Party Management

**Hiện trạng:** `UserPokemon.IsInParty`, `SlotIndex` tồn tại nhưng không có endpoint để manage party.

**Tính năng:**
- `GET  /api/user/party` — 6 Pokemon trong party
- `PUT  /api/user/party` — set party (thay đổi đội hình)
- Validate: party size 1-6, không trùng slot
- Return party với enriched PokeAPI data + calculated stats

---

### 3.3 ⭐ Pokemon Search & Filter

**Hiện trạng:** `GET /api/user/pokemon` trả về toàn bộ collection, không có filter/sort/pagination.

**Tính năng:**
```
GET /api/user/pokemon?type=fire&isShiny=true&sortBy=ivTotal&order=desc&page=1&pageSize=20
```

Query params:
- `type` — filter by Pokemon type
- `isShiny` — true/false
- `isFavorite` — true/false
- `isInParty` — true/false
- `boxId` — Pokemon trong box cụ thể
- `minIvPercent` — filter by IV quality
- `nature` — filter by nature
- `sortBy` — level, ivTotal, caughtDate, friendship, currentHp
- Pagination: `page`, `pageSize`

**Impact:** Critical khi collection có 100+ Pokemon.

---

### 3.4 🔶 Pokemon Notes/Tags Enhancement

**Hiện trạng:** `UserPokemon.Notes` là free-text string.

**Tính năng:**
- Tags system: `["competitive", "trade-bait", "breeder", "favorite"]`
- Predefined tags + custom tags
- Filter by tag: `GET /api/user/pokemon?tags=competitive`

---

### 3.5 🔵 Pokemon Comparison Tool

```
GET /api/user/pokemon/compare?ids=1,2,3
```
So sánh stats, IVs, EVs của nhiều Pokemon cùng lúc. Useful cho competitive players.

---

## 4. Social System — Mở rộng

### 4.1 ⭐ Public Trainer Profile

**Hiện trạng:** Không có public profile endpoint. Chỉ có `GET /api/user/profile` cho chính mình.

**Tính năng:**
- `GET /api/trainers/{username}` — public profile (tôn trọng privacy settings)
- Hiển thị: trainer level, pokemon caught, badges, top Pokemon, friend code
- Privacy control: `ShowOnlineStatus` đã có, thêm `PublicProfile: bool`

---

### 4.2 ⭐ Trading System

**Hiện trạng:** `UserPokemon.IsTraded`, `OriginalTrainerId`, `OriginalTrainerName` đã có. `ApplicationUser.TradesCompleted`, `Friendship.TradesCompleted` cũng đã có. Nhưng không có Trade API nào.

**Tính năng:**
- `TradeRequest` entity: `(Id, InitiatorId, ReceiverId, OfferedPokemonId, RequestedPokemonId, Status, ExpiresAt)`
- `POST /api/trades/offer` — gửi trade offer
- `POST /api/trades/{id}/accept` — chấp nhận trade
- `POST /api/trades/{id}/decline` — từ chối
- Khi trade thành công: swap `UserId`, set `IsTraded=true`, update `OriginalTrainerId`
- Bonus EXP cho Pokémon traded (game mechanic)
- Real-time notification qua SignalR

**API:**
```
POST /api/trades/offer
Body: { targetUserId, offeredPokemonId, requestedPokemonId, message }

GET  /api/trades/pending   → pending trade requests
POST /api/trades/{id}/accept
```

---

### 4.3 🔶 Friend Activity Feed

**Tính năng:**
- `GET /api/friends/activity` — recent activities của friends
- Events: "Ash caught a shiny Charizard!", "Misty reached level 25!", "Brock caught 3 new species!"
- Cần `UserActivity` table: `(Id, UserId, ActivityType, Data, CreatedAt)`
- Trigger activities từ: catch, level-up, evolution, trade

---

### 4.4 🔶 Friendship Level Progression

**Hiện trạng:** `Friendship.FriendshipLevel` tồn tại nhưng không tăng theo bất kỳ mechanic nào.

**Tính năng:**
- Level up friendship khi: trade với nhau, battle với nhau (khi có battle system), gửi gifts
- Friendship levels: Acquaintance (1) → Friends (5) → Good Friends (10) → Best Friends (20)
- Bonus rewards ở mỗi milestone: special items, shiny rate boost khi trade

---

### 4.5 🔵 Gift System

- `POST /api/friends/{friendId}/gift` — gửi daily gift (items, pokeballs)
- Max 1 gift/ngày/friend
- Gift pool based on friendship level (higher = better gifts)

---

## 5. Item & Shop System

### 5.1 ⭐ Item Shop

**Hiện trạng:** `ApplicationUser.Coins` đã có. `UserItem` entity có sẵn. Không có Shop API.

**Tính năng:**
- `GET /api/shop` — danh sách items có thể mua (theo region/trainer level)
- `POST /api/shop/buy` — mua item, trừ Coins
- `POST /api/shop/sell` — bán item, nhận Coins
- Shop rotation: một số items chỉ available ở thời điểm nhất định
- `ItemShopSettings` đã có trong Options

**API:**
```
GET  /api/shop?category=pokeballs
POST /api/shop/buy
Body: { itemApiId: 4, quantity: 5 }

POST /api/shop/sell  
Body: { userItemId: 123, quantity: 2 }
```

---

### 5.2 ⭐ Pokeball Inventory Sync

**Hiện trạng:** `ApplicationUser` có `PokeBalls`, `GreatBalls`, `UltraBalls`, `MasterBalls` as separate int fields. `UserItem` table cũng track balls. Đây là **inconsistency**.

**Tính năng:**
- Chọn 1 trong 2: hoặc dùng `UserItem` (flexible), hoặc giữ fields trên `ApplicationUser` (simple)
- Recommend: dùng `UserItem` cho tất cả, remove ball fields từ `ApplicationUser`
- Update `AttemptCatchPokemonAsync` để deduct ball từ `UserItem` inventory sau catch attempt

---

### 5.3 🔶 Item Usage API

**Tính năng:**
- `POST /api/user/items/{userItemId}/use` — dùng item (heal, ev boost, etc.)
- `POST /api/user/pokemon/{pokemonId}/hold-item/{itemApiId}` — cho Pokemon cầm item
- `DELETE /api/user/pokemon/{pokemonId}/held-item` — lấy item từ Pokemon
- `UserPokemon.HeldItemId` và `HeldItemApiId` đã có sẵn

---

### 5.4 🔵 Daily Rewards

- `POST /api/user/daily-claim` — nhận phần thưởng hàng ngày
- Streak multiplier: ngày liên tiếp login → rewards tốt hơn
- Track trong `ApplicationUser.LastActiveDate` (đã có) + thêm `DailyStreakDays`

---

## 6. Battle System

### 6.1 ⭐ PvE Wild Battle (Turn-based)

**Hiện trạng:** `UserPokemon.BattlesWon/Lost/Total`, `ApplicationUser.BattlesWon/Lost/WinStreak/BestWinStreak` đã sẵn sàng. `CurrentHp` đã có. Không có Battle API.

**Tính năng:**
- `POST /api/battles/wild/start` — start wild encounter session
- Battle session: chọn Pokemon từ party, turn-based actions
- Actions: Attack (move từ `CustomMoveIds`), Ball, Flee
- Damage calculation dùng stats đã có (`CalculatedAttack`, `CalculatedDefense`, etc.)
- Rewards: EXP, EV points, chance catch pokemon

**Real-time:** Dùng SignalR `PokemonHub` (đã có) cho battle events

---

### 6.2 🔶 PvP Battle (1v1 Friend Battle)

**Tính năng:**
- Challenge friend qua `BattleRequest` (tương tự `FriendRequest` pattern)
- `ApplicationUser.AllowBattleRequests` đã có
- 6v6 battle sử dụng party Pokemon
- Update `Friendship.BattlesTogether` sau mỗi battle
- ELO rating system: `ApplicationUser.WinStreak` đã có, thêm `EloRating`

---

### 6.3 🔵 Gym/Raid System

- Daily/weekly gym challenges với powerful NPC trainers
- Party damage persists (CurrentHp), phải heal giữa các battle
- Raid Pokemon: legendaries mạnh, nhiều người tham gia cùng lúc
- Drops: rare items, medals, special pokemon

---

## 7. Achievement & Progression

### 7.1 ⭐ Achievement System

**Hiện trạng:** `ApplicationUser.Achievements` là `string?` (JSON). Không có Achievement engine.

**Tính năng:**
- `Achievement` định nghĩa: `(Id, Name, Description, Condition, Reward)`
- Trigger checks sau các events: catch, level-up, trade, battle win
- Achievement types:
  - Collection: "Catch 10 Pokemon", "Catch all Kanto starters"
  - Shiny: "First Shiny", "10 Shinies", "Shiny Master"
  - Social: "Make 5 Friends", "Complete 10 Trades"
  - Battle: "Win 100 Battles", "Win Streak 10"
- `GET /api/user/achievements` → list với progress tracking
- `UserAchievement(UserId, AchievementId, UnlockedAt, Progress)` table

---

### 7.2 ⭐ Pokedex Completion Tracking

**Hiện trạng:** Không có National Pokedex tracking. `UniquePokemonCaught` chỉ là count, không biết species nào đã có.

**Tính năng:**
- `GET /api/user/pokedex` → 898 pokemon với status: Seen/Caught/Not seen
- "Seen" khi encounter nhưng không catch
- Completion percentage by generation
- Filter: `?generation=1&status=missing`

---

### 7.3 🔶 Trainer Badges

**Hiện trạng:** `ApplicationUser.Badges` là `string?`. Không có Badge engine.

**Tính năng:**
- 8 gym badges per region
- Earn badges từ: defeating gym trainers (battle system), events, special challenges
- Badges display trên public profile
- Badge requirement cho trading legendary Pokemon (game mechanic)

---

### 7.4 🔵 Leaderboards

**Tính năng:**
- `GET /api/leaderboards/top-trainers` — by level
- `GET /api/leaderboards/top-collectors` — by unique pokemon count
- `GET /api/leaderboards/friends` — rank trong friend circle
- Cache aggressively (update mỗi 1 giờ)

---

## 8. Notification & Real-time

### 8.1 ⭐ SignalR Notifications

**Hiện trạng:** `PokemonHub` và `PresenceHub` đã có. Chưa tận dụng đầy đủ.

**Tính năng:**
- Friend request received → real-time notification
- Trade offer received → popup
- Friend comes online → notification (nếu user muốn)
- Achievement unlocked → toast notification
- Battle challenge received → real-time alert

**Implementation:** Inject `IHubContext<PresenceHub>` vào services, gửi notification khi events xảy ra.

---

### 8.2 🔶 Email Notifications

**Hiện trạng:** `EmailService` đã có với template system.

**Tính năng:**
- Weekly trainer summary: "This week: 15 Pokemon caught, 2 new species!"
- Trade completed confirmation email
- Friend request email (optional, configurable)
- Opt-in/opt-out per notification type

---

### 8.3 🔵 Push Notifications

- Web Push Notifications cho browser
- `UserPushSubscription(UserId, Endpoint, P256dh, Auth)` table
- Service Worker subscription flow
- Notify: daily rewards available, egg hatched, friend online

---

## 9. API & Developer Experience

### 9.1 ⭐ API Versioning

**Tính năng:**
- Route versioning: `/api/v1/auth/login`, `/api/v2/auth/login`
- `Microsoft.AspNetCore.Mvc.Versioning` package
- Deprecated endpoint warnings via `Deprecation` response header

---

### 9.2 ⭐ Pagination cho tất cả collection endpoints

**Hiện trạng:** `GET /api/user/pokemon` trả về toàn bộ collection. Chậm khi có 500+ pokemon.

**Tính năng:**
- `PagedResult<T>` wrapper: `{ items: [...], totalCount, page, pageSize, totalPages }`
- Apply cho: `/api/user/pokemon`, `/api/friends`, `/api/trades`, `/api/leaderboards`
- Cursor-based pagination cho feeds (activity, notifications)

---

### 9.3 🔶 Webhook Support

- Admin có thể register webhook URL
- Events: user registered, rare pokemon caught, trade completed
- Signed payload (HMAC-SHA256)
- `POST /api/admin/webhooks` để register

---

### 9.4 🔵 GraphQL Layer

- Cho phép frontend request chỉ những fields cần thiết
- Đặc biệt hữu ích cho `UserPokemonDto` (50+ fields) — client chỉ cần 5 field
- Hot Chocolate / Strawberry Shake

---

## 10. Database & Performance

### 10.1 ⭐ Redis Distributed Cache

**Hiện trạng:** `IMemoryCache` (in-process) → không scale khi deploy nhiều instances.

**Tính năng:**
- Replace `IMemoryCache` với `IDistributedCache` (Redis)
- Cache layers: L1 (memory, 5 min) → L2 (Redis, 24h) → PokeAPI
- Cache invalidation: khi admin force-refresh Pokemon data
- Session storage trong Redis thay vì in-memory

---

### 10.2 ⭐ Background Jobs

**Tính năng:**
- `Hangfire` hoặc `Quartz.NET` cho scheduled jobs:
  - Daily: Reset daily rewards, activity digest emails
  - Hourly: Update leaderboards cache
  - Weekly: Cleanup expired sessions/friend requests
  - On-demand: Seed new Pokemon from PokeAPI
- Hiện tại seeder dùng `.Wait()` — migrate sang background job

---

### 10.3 🔶 Read Replicas / CQRS

**Khi scale lớn:**
- CQRS: tách Read operations sang `IQueryService` dùng raw SQL/Dapper cho reports
- Write operations giữ nguyên EF Core
- Read replica database cho reporting queries

---

### 10.4 🔵 Full-text Search cho Pokemon

**Tính năng:**
- `GET /api/pokemon/search?q=pikachu` — tìm Pokemon từ PokeAPI
- Cache kết quả search popular (fire, water, pikachu, etc.)
- Fuzzy search: "pikachoo" → "pikachu"
- PostgreSQL `pg_trgm` extension for trigram similarity

---

## Bảng Roadmap ưu tiên

| Phase | Features | Effort | Impact |
|-------|----------|--------|--------|
| **Phase 1** (Ngay bây giờ) | Refresh Token, Box API, Party API, Pokemon Filter/Pagination, Item Shop, Pokeball sync | 2-3 tuần | 🔥 Critical UX |
| **Phase 2** (Tháng 2) | Catch Streak, Evolution System, Trading System, Achievement Engine, Pokedex completion | 1 tháng | 🎮 Core gameplay |
| **Phase 3** (Tháng 3-4) | PvE Battle System, Friendship Level Progression, Activity Feed, Notifications, Leaderboards | 6 tuần | 🌟 Social engagement |
| **Phase 4** (Tháng 5+) | PvP Battle, Raid System, GraphQL, Webhooks, Redis, Background Jobs | Ongoing | 🚀 Scale & Polish |

---

## Ghi chú thiết kế

> **Nguyên tắc:** Tất cả game mechanics phải **server-authoritative**. Client không được tự tính toán outcome.
>
> **Existing foundation tốt:**
> - Catch mechanics system hoàn chỉnh (CatchRate, ShinyRoller, IVGenerator, NatureGenerator, PokemonFactory)
> - Auth đầy đủ (JWT, 2FA, Social Login, reCAPTCHA)
> - Friend system hoàn chỉnh
> - SignalR hubs sẵn sàng
> - Entity model đã thiết kế cho battle, trade, EV training
>
> **Tận dụng những gì đã có:** Rất nhiều fields trong entities (`CanEvolve`, `IsTraded`, `CustomMoveIds`, `EvHp/Atk/...`, `AllowBattleRequests`, `AllowTradeRequests`) đã được design sẵn chờ implementation.