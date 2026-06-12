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
        private readonly IPokemonCatchService _pokemonCatchService;
        private readonly ICardRewardService _cardRewardService;
        private readonly BiomeSpawnCandidateService _candidateService;
        private readonly WildAreaSettings _settings;
        private readonly ILogger<WildAreaService> _logger;
        private readonly Random _random = new();

        public WildAreaService(
            PokemonDbContext context,
            UserManager<ApplicationUser> userManager,
            IPokemonCacheService pokemonCacheService,
            IPokemonCatchService pokemonCatchService,
            ICardRewardService cardRewardService,
            BiomeSpawnCandidateService candidateService,
            IOptions<WildAreaSettings> settings,
            ILogger<WildAreaService> logger)
        {
            _context = context;
            _userManager = userManager;
            _pokemonCacheService = pokemonCacheService;
            _pokemonCatchService = pokemonCatchService;
            _cardRewardService = cardRewardService;
            _candidateService = candidateService;
            _settings = settings.Value;
            _logger = logger;
        }

        public Task<IReadOnlyList<WildAreaOptionDto>> GetAvailableAreasAsync()
        {
            var areas = GetConfiguredAreas()
                .Select(x => new WildAreaOptionDto
                {
                    Code = x.Code,
                    Name = x.ResolveName()
                })
                .ToList()
                .AsReadOnly();

            return Task.FromResult<IReadOnlyList<WildAreaOptionDto>>(areas);
        }

        public async Task<WildAreaDto> GetCurrentWildAreaAsync(string userId, string? areaCode = null)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            await EnsureSpawnMetadataAvailableAsync();

            var now = DateTime.UtcNow;
            var area = ResolveArea(areaCode);
            var spawns = await _context.WildAreaSpawns
                .Where(x => x.UserId == userId &&
                            x.AreaCode == area.Code &&
                            x.IsActive &&
                            !x.IsConsumed &&
                            x.ExpiresAt > now)
                .OrderBy(x => x.SlotIndex)
                .ToListAsync();

            if (spawns.Count == 0)
            {
                spawns = await GenerateSpawnsAsync(userId, area, now);
            }

            return await MapToWildAreaDto(spawns, area, now);
        }

        public async Task<WildAreaDto> RefreshWildAreaAsync(string userId, string? areaCode = null)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                throw new InvalidOperationException("User not found");
            }

            await EnsureSpawnMetadataAvailableAsync();

            var now = DateTime.UtcNow;
            var area = ResolveArea(areaCode);

            var activeSpawns = await _context.WildAreaSpawns
                .Where(x => x.UserId == userId &&
                            x.AreaCode == area.Code &&
                            x.IsActive &&
                            !x.IsConsumed)
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

            var newSpawns = await GenerateSpawnsAsync(userId, area, now);
            _logger.LogInformation("Force refreshed Wild Area for user {UserId} in area {AreaCode}", userId, area.Code);
            return await MapToWildAreaDto(newSpawns, area, now);
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

            var catchResult = await _pokemonCatchService.AttemptCatchPokemonAsync(userId, catchAttempt);
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
                        CaughtLevel = catchResult.CaughtPokemon.Level,
                        Ability = catchResult.CaughtPokemon.Ability
                    },
                CardReward = reward
            };
        }

        private async Task<List<WildAreaSpawn>> GenerateSpawnsAsync(string userId, WildAreaConfig area, DateTime now)
        {
            var interval = area.ResolveResetIntervalMinutes(_settings);
            var spawnCount = area.ResolveSpawnCount(_settings);
            var maxAttempts = Math.Max(1, _settings.MaxAttemptsPerSpawn);
            var expiresAt = now.AddMinutes(interval);
            var weights = area.BuildWeights(_settings.BuildWeights());

            var created = new List<WildAreaSpawn>(spawnCount);

            for (var i = 0; i < spawnCount; i++)
            {
                var rarity = RollRarity(weights);

                if (rarity == WildSpawnRarity.Legendary && !area.ResolveAllowLegendary(_settings))
                {
                    rarity = WildSpawnRarity.Epic;
                }

                var selectedMetadata = await PickCandidateAsync(area, rarity);
                var pokemonApiId = selectedMetadata.PokemonApiId;

                var spawn = new WildAreaSpawn
                {
                    UserId = userId,
                    PokemonApiId = pokemonApiId,
                    AreaCode = area.Code,
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
            _logger.LogInformation("Generated {SpawnCount} wild area spawns for user {UserId} in area {AreaCode}", created.Count, userId, area.Code);

            return created.OrderBy(x => x.SlotIndex).ToList();
        }

        private async Task<WildAreaDto> MapToWildAreaDto(IReadOnlyCollection<WildAreaSpawn> spawns, WildAreaConfig area, DateTime now)
        {
            var areaCode = spawns.FirstOrDefault()?.AreaCode ?? area.Code;
            var resetAt = spawns.Min(x => x.ExpiresAt);
            var secondsUntilReset = Math.Max(0, (int)Math.Ceiling((resetAt - now).TotalSeconds));
            var areaName = area.ResolveName();

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

        private async Task<PokemonSpawnMetadata> PickCandidateAsync(WildAreaConfig area, WildSpawnRarity rolledRarity)
        {
            var candidates = await _candidateService.GetCandidatesWithFallbackAsync(area, _settings, rolledRarity);
            if (candidates.Count == 0)
            {
                throw new InvalidOperationException("No eligible spawn metadata found. Please run sync and verify settings.");
            }

            return WeightedPick(candidates).Pokemon;
        }

        private BiomeSpawnCandidate WeightedPick(IReadOnlyList<BiomeSpawnCandidate> candidates)
        {
            var totalWeight = candidates.Sum(x => x.Score > 0 ? x.Score : 0.01);
            if (totalWeight <= 0)
            {
                return candidates[_random.Next(candidates.Count)];
            }

            var roll = _random.NextDouble() * totalWeight;
            var running = 0d;
            foreach (var candidate in candidates)
            {
                running += candidate.Score > 0 ? candidate.Score : 0.01;
                if (roll <= running)
                {
                    return candidate;
                }
            }

            return candidates[^1];
        }

        private async Task EnsureSpawnMetadataAvailableAsync()
        {
            var hasMetadata = await _context.PokemonSpawnMetadata.AnyAsync(x => x.IsDefaultForm);
            if (!hasMetadata)
            {
                throw new InvalidOperationException("Spawn metadata is empty. Run /api/admin/wild-area/sync-spawn-metadata first.");
            }
        }

        private List<WildAreaConfig> GetConfiguredAreas()
        {
            var areas = _settings.WildAreas
                .Where(x => !string.IsNullOrWhiteSpace(x.Code))
                .Select(x =>
                {
                    x.Code = x.Code.Trim().ToLowerInvariant();
                    return x;
                })
                .ToList();

            if (areas.Count > 0)
            {
                return areas;
            }

            return
            [
                new WildAreaConfig
                {
                    Code = DefaultAreaCode,
                    Name = "Viridian Field"
                }
            ];
        }

        private WildAreaConfig ResolveArea(string? areaCode)
        {
            var areas = GetConfiguredAreas();
            var requestedCode = string.IsNullOrWhiteSpace(areaCode)
                ? DefaultAreaCode
                : areaCode.Trim().ToLowerInvariant();

            var area = areas.FirstOrDefault(x => string.Equals(x.Code, requestedCode, StringComparison.OrdinalIgnoreCase));
            if (area != null)
            {
                return area;
            }

            if (string.IsNullOrWhiteSpace(areaCode))
            {
                return areas[0];
            }

            throw new ArgumentException($"Unknown wild area code '{areaCode}'.", nameof(areaCode));
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
