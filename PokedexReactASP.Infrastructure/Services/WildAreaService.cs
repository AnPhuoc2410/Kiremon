using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.DTOs.WildArea;
using PokedexReactASP.Application.Exceptions;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    public class WildAreaService : IWildAreaService
    {
        private const string DefaultAreaCode = "viridian_field";

        private static readonly WildSpawnRarity[] RarityOrder =
        [
            WildSpawnRarity.Common,
            WildSpawnRarity.Uncommon,
            WildSpawnRarity.Rare,
            WildSpawnRarity.Epic,
            WildSpawnRarity.Legendary
        ];

        private readonly PokemonDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPokemonCacheService _pokemonCacheService;
        private readonly IUserService _userService;
        private readonly ICardRewardService _cardRewardService;
        private readonly WildAreaSettings _settings;
        private readonly ILogger<WildAreaService> _logger;
        private readonly Random _random = new();

        public WildAreaService(
            PokemonDbContext context,
            UserManager<ApplicationUser> userManager,
            IPokemonCacheService pokemonCacheService,
            IUserService userService,
            ICardRewardService cardRewardService,
            IOptions<WildAreaSettings> settings,
            ILogger<WildAreaService> logger)
        {
            _context = context;
            _userManager = userManager;
            _pokemonCacheService = pokemonCacheService;
            _userService = userService;
            _cardRewardService = cardRewardService;
            _settings = settings.Value;
            _logger = logger;
        }

        public async Task<WildAreaDto> GetCurrentWildAreaAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            var hasMetadata = await _context.PokemonSpawnMetadata.AnyAsync(x => x.IsDefaultForm);
            if (!hasMetadata)
            {
                throw new InvalidOperationException("Spawn metadata is empty. Run /api/admin/wild-area/sync-spawn-metadata first.");
            }

            var now = DateTime.UtcNow;
            var spawns = await _context.WildAreaSpawns
                .Where(x => x.UserId == userId && x.IsActive && !x.IsConsumed && x.ExpiresAt > now)
                .OrderBy(x => x.SlotIndex)
                .ToListAsync();

            if (spawns.Count == 0)
            {
                spawns = await GenerateSpawnsAsync(userId, now);
            }

            return await MapToWildAreaDto(spawns, now);
        }

        public async Task<WildAreaDto> RefreshWildAreaAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            var now = DateTime.UtcNow;

            var activeSpawns = await _context.WildAreaSpawns
                .Where(x => x.UserId == userId && x.IsActive && !x.IsConsumed)
                .ToListAsync();

            if (activeSpawns.Count > 0)
            {
                foreach (var spawn in activeSpawns)
                {
                    spawn.IsActive = false;
                    spawn.IsConsumed = true;
                }

                await _context.SaveChangesAsync();
            }

            var newSpawns = await GenerateSpawnsAsync(userId, now);
            _logger.LogInformation("Force refreshed Wild Area for user {UserId}", userId);
            return await MapToWildAreaDto(newSpawns, now);
        }

        public async Task<WildCatchResultDto> AttemptCatchAsync(string userId, int spawnId, WildCatchAttemptDto dto)
        {
            var spawn = await _context.WildAreaSpawns.FirstOrDefaultAsync(x => x.Id == spawnId);
            if (spawn == null)
            {
                throw new WildAreaCatchException(StatusCodes.Status404NotFound, "Spawn not found.");
            }

            if (!string.Equals(spawn.UserId, userId, StringComparison.Ordinal))
            {
                throw new WildAreaCatchException(StatusCodes.Status403Forbidden, "Spawn does not belong to current user.");
            }

            ValidateSpawnState(spawn, DateTime.UtcNow);

            var catchAttempt = new CatchAttemptDto
            {
                PokemonApiId = spawn.PokemonApiId,
                PokeballType = dto.PokeballType,
                CaughtLocation = spawn.AreaCode,
                Nickname = dto.Nickname
            };

            var catchResult = await _userService.AttemptCatchPokemonAsync(userId, catchAttempt);
            var success = catchResult.Result == CatchAttemptResult.Success;
            var attemptsUsedAfter = Math.Min(spawn.MaxAttempts, spawn.AttemptsUsed + 1);
            spawn.AttemptsUsed = attemptsUsedAfter;

            if (!success)
            {
                var exhausted = spawn.AttemptsUsed >= spawn.MaxAttempts;
                if (exhausted)
                {
                    spawn.IsConsumed = true;
                    spawn.IsActive = false;
                }

                await _context.SaveChangesAsync();
                return new WildCatchResultDto
                {
                    Success = false,
                    PokemonCaught = false,
                    ShakeCount = catchResult.ShakeCount,
                    Message = catchResult.Message,
                    AttemptsLeft = Math.Max(0, spawn.MaxAttempts - spawn.AttemptsUsed),
                    SpawnConsumed = spawn.IsConsumed,
                    CardReward = null
                };
            }

            spawn.IsCaught = true;
            spawn.IsConsumed = true;
            spawn.IsActive = false;

            var reward = await _cardRewardService.RollAndGrantCardAsync(userId, spawn.PokemonApiId, CardRewardSource.WildAreaCatch);
            await _context.SaveChangesAsync();

            return new WildCatchResultDto
            {
                Success = true,
                PokemonCaught = true,
                ShakeCount = catchResult.ShakeCount,
                Message = catchResult.Message,
                AttemptsLeft = Math.Max(0, spawn.MaxAttempts - spawn.AttemptsUsed),
                SpawnConsumed = true,
                UserPokemon = catchResult.CaughtPokemon == null
                    ? null
                    : new WildCaughtPokemonDto
                    {
                        Id = catchResult.CaughtPokemon.Id,
                        PokemonApiId = catchResult.CaughtPokemon.PokemonApiId,
                        Nickname = catchResult.CaughtPokemon.Nickname,
                        IsShiny = catchResult.CaughtPokemon.IsShiny,
                        Nature = catchResult.CaughtPokemon.Nature.ToString(),
                        CaughtLevel = catchResult.CaughtPokemon.Level
                    },
                CardReward = reward
            };
        }

        private async Task<List<WildAreaSpawn>> GenerateSpawnsAsync(string userId, DateTime now)
        {
            var interval = Math.Max(1, _settings.ResetIntervalMinutes);
            var spawnCount = Math.Max(1, _settings.SpawnCount);
            var maxAttempts = Math.Max(1, _settings.MaxAttemptsPerSpawn);
            var expiresAt = now.AddMinutes(interval);
            var weights = _settings.BuildWeights();

            var created = new List<WildAreaSpawn>(spawnCount);

            for (var i = 0; i < spawnCount; i++)
            {
                var rarity = RollRarity(weights);

                if (rarity == WildSpawnRarity.Legendary && !_settings.AllowLegendarySpawn)
                {
                    rarity = WildSpawnRarity.Epic;
                }

                var selectedMetadata = await PickCandidateAsync(rarity);
                var pokemonApiId = selectedMetadata.PokemonApiId;

                var spawn = new WildAreaSpawn
                {
                    UserId = userId,
                    PokemonApiId = pokemonApiId,
                    AreaCode = DefaultAreaCode,
                    SlotIndex = i,
                    SpawnRarity = selectedMetadata.SpawnRarity,
                    SpawnedAt = now,
                    ExpiresAt = expiresAt,
                    MaxAttempts = maxAttempts,
                    AttemptsUsed = 0,
                    IsCaught = false,
                    IsConsumed = false,
                    IsActive = true
                };

                created.Add(spawn);
            }

            await _context.WildAreaSpawns.AddRangeAsync(created);
            await _context.SaveChangesAsync();
            _logger.LogInformation("Generated {SpawnCount} wild area spawns for user {UserId} in area {AreaCode}", created.Count, userId, DefaultAreaCode);

            return created.OrderBy(x => x.SlotIndex).ToList();
        }

        private async Task<WildAreaDto> MapToWildAreaDto(IReadOnlyCollection<WildAreaSpawn> spawns, DateTime now)
        {
            var areaCode = spawns.FirstOrDefault()?.AreaCode ?? DefaultAreaCode;
            var resetAt = spawns.Min(x => x.ExpiresAt);
            var secondsUntilReset = Math.Max(0, (int)Math.Ceiling((resetAt - now).TotalSeconds));
            var areaName = ResolveAreaName(areaCode);

            var pokemonIds = spawns.Select(x => x.PokemonApiId).Distinct().ToList();
            var pokemonData = await _pokemonCacheService.GetPokemonBatchAsync(pokemonIds);

            return new WildAreaDto
            {
                AreaCode = areaCode,
                AreaName = areaName,
                ResetAt = resetAt,
                SecondsUntilReset = secondsUntilReset,
                Spawns = spawns
                    .OrderBy(x => x.SlotIndex)
                    .Select(spawn =>
                    {
                        var found = pokemonData.TryGetValue(spawn.PokemonApiId, out var poke);
                        var displayName = found && !string.IsNullOrWhiteSpace(poke?.Name)
                            ? CapitalizeFirst(poke!.Name)
                            : $"Pokemon-{spawn.PokemonApiId}";
                        var spriteUrl = poke?.Sprites?.Front_Default ?? string.Empty;

                        return new WildPokemonSpawnDto
                        {
                            SpawnId = spawn.Id,
                            PokemonApiId = spawn.PokemonApiId,
                            PokemonName = displayName,
                            SpriteUrl = spriteUrl,
                            SlotIndex = spawn.SlotIndex,
                            SpawnRarity = spawn.SpawnRarity.ToString(),
                            AttemptsLeft = Math.Max(0, spawn.MaxAttempts - spawn.AttemptsUsed),
                            IsCaught = spawn.IsCaught,
                            IsConsumed = spawn.IsConsumed
                        };
                    })
                    .ToList()
            };
        }

        private string ResolveAreaName(string areaCode)
        {
            var configured = _settings.WildAreas
                .FirstOrDefault(x => string.Equals(x.Code, areaCode, StringComparison.OrdinalIgnoreCase))
                ?? _settings.WildAreas.FirstOrDefault();

            if (configured == null || string.IsNullOrWhiteSpace(configured.Name))
            {
                return "Viridian Field";
            }

            return configured.Name;
        }

        private WildSpawnRarity RollRarity(IReadOnlyDictionary<WildSpawnRarity, double> weights)
        {
            var totalWeight = weights.Values.Where(x => x > 0).Sum();
            if (totalWeight <= 0)
            {
                return WildSpawnRarity.Common;
            }

            var roll = _random.NextDouble() * totalWeight;
            var running = 0d;

            foreach (var rarity in RarityOrder)
            {
                if (!weights.TryGetValue(rarity, out var weight) || weight <= 0)
                {
                    continue;
                }

                running += weight;
                if (roll <= running)
                {
                    return rarity;
                }
            }

            return WildSpawnRarity.Common;
        }

        private async Task<PokemonSpawnMetadata> PickCandidateAsync(WildSpawnRarity rolledRarity)
        {
            var ordered = GetFallbackOrder(rolledRarity);

            foreach (var rarity in ordered)
            {
                if (rarity == WildSpawnRarity.Legendary && !_settings.AllowLegendarySpawn)
                {
                    continue;
                }

                var candidates = await _context.PokemonSpawnMetadata
                    .Where(p => p.IsDefaultForm)
                    .Where(p => p.Generation <= Math.Max(1, _settings.MaxGeneration))
                    .Where(p => p.SpawnRarity == rarity)
                    .ToListAsync();

                if (candidates.Count == 0)
                {
                    continue;
                }

                return WeightedPick(candidates);
            }

            var fallback = await _context.PokemonSpawnMetadata
                .Where(p => p.IsDefaultForm)
                .Where(p => p.Generation <= Math.Max(1, _settings.MaxGeneration))
                .Where(p => _settings.AllowLegendarySpawn || (!p.IsLegendary && !p.IsMythical))
                .ToListAsync();

            if (fallback.Count == 0)
            {
                throw new InvalidOperationException("No eligible spawn metadata found. Please run sync and verify settings.");
            }

            return WeightedPick(fallback);
        }

        private PokemonSpawnMetadata WeightedPick(IReadOnlyList<PokemonSpawnMetadata> candidates)
        {
            var totalWeight = candidates.Sum(x => x.SpawnWeight > 0 ? x.SpawnWeight : 0.01);
            if (totalWeight <= 0)
            {
                return candidates[_random.Next(candidates.Count)];
            }

            var roll = _random.NextDouble() * totalWeight;
            var running = 0d;
            foreach (var candidate in candidates)
            {
                running += candidate.SpawnWeight > 0 ? candidate.SpawnWeight : 0.01;
                if (roll <= running)
                {
                    return candidate;
                }
            }

            return candidates[^1];
        }

        private static List<WildSpawnRarity> GetFallbackOrder(WildSpawnRarity rarity)
        {
            var index = Array.IndexOf(RarityOrder, rarity);
            if (index < 0)
            {
                return RarityOrder.ToList();
            }

            var order = new List<WildSpawnRarity> { rarity };

            for (var i = index - 1; i >= 0; i--)
            {
                order.Add(RarityOrder[i]);
            }

            for (var i = index + 1; i < RarityOrder.Length; i++)
            {
                order.Add(RarityOrder[i]);
            }

            return order;
        }

        private static string CapitalizeFirst(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return input;
            }

            return char.ToUpperInvariant(input[0]) + input[1..];
        }

        private static void ValidateSpawnState(WildAreaSpawn spawn, DateTime now)
        {
            if (!spawn.IsActive)
            {
                throw new WildAreaCatchException(StatusCodes.Status409Conflict, "Spawn is not active.");
            }

            if (spawn.IsConsumed)
            {
                throw new WildAreaCatchException(StatusCodes.Status409Conflict, "Spawn is already consumed.");
            }

            if (spawn.ExpiresAt <= now)
            {
                throw new WildAreaCatchException(StatusCodes.Status409Conflict, "Spawn has expired.");
            }

            if (spawn.AttemptsUsed >= spawn.MaxAttempts)
            {
                throw new WildAreaCatchException(StatusCodes.Status409Conflict, "Spawn has no attempts left.");
            }
        }
    }
}
