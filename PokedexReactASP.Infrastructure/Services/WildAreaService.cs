using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.DTOs.WildArea;
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
        private readonly WildAreaSettings _settings;
        private readonly ILogger<WildAreaService> _logger;
        private readonly Random _random = new();

        public WildAreaService(
            PokemonDbContext context,
            UserManager<ApplicationUser> userManager,
            IPokemonCacheService pokemonCacheService,
            IOptions<WildAreaSettings> settings,
            ILogger<WildAreaService> logger)
        {
            _context = context;
            _userManager = userManager;
            _pokemonCacheService = pokemonCacheService;
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

        private async Task<List<WildAreaSpawn>> GenerateSpawnsAsync(string userId, DateTime now)
        {
            var area = ResolveAreaConfig(DefaultAreaCode);
            var interval = Math.Max(1, _settings.ResetIntervalMinutes);
            var spawnCount = Math.Max(1, _settings.SpawnCount);
            var maxAttempts = Math.Max(1, _settings.MaxAttemptsPerSpawn);
            var expiresAt = now.AddMinutes(interval);
            var weights = _settings.BuildWeights();

            var created = new List<WildAreaSpawn>(spawnCount);

            for (var i = 0; i < spawnCount; i++)
            {
                var rarity = RollRarity(weights);
                var pokemonApiId = PickPokemonFromArea(area, rarity);

                var spawn = new WildAreaSpawn
                {
                    UserId = userId,
                    PokemonApiId = pokemonApiId,
                    AreaCode = area.Code,
                    SlotIndex = i,
                    SpawnRarity = rarity,
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

        private async Task<WildAreaDto> MapToWildAreaDto(IReadOnlyCollection<WildAreaSpawn> spawns, DateTime now)
        {
            var areaCode = spawns.FirstOrDefault()?.AreaCode ?? DefaultAreaCode;
            var area = ResolveAreaConfig(areaCode);
            var resetAt = spawns.Min(x => x.ExpiresAt);
            var secondsUntilReset = Math.Max(0, (int)Math.Ceiling((resetAt - now).TotalSeconds));

            var pokemonIds = spawns.Select(x => x.PokemonApiId).Distinct().ToList();
            var pokemonData = await _pokemonCacheService.GetPokemonBatchAsync(pokemonIds);

            return new WildAreaDto
            {
                AreaCode = area.Code,
                AreaName = area.Name,
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

        private WildAreaConfig ResolveAreaConfig(string areaCode)
        {
            var configured = _settings.WildAreas
                .FirstOrDefault(x => string.Equals(x.Code, areaCode, StringComparison.OrdinalIgnoreCase))
                ?? _settings.WildAreas.FirstOrDefault();

            if (configured == null)
            {
                throw new InvalidOperationException("WildArea configuration is missing");
            }

            if (string.IsNullOrWhiteSpace(configured.Code))
            {
                configured.Code = DefaultAreaCode;
            }

            if (string.IsNullOrWhiteSpace(configured.Name))
            {
                configured.Name = "Viridian Field";
            }

            configured.Pools ??= new WildAreaPools();
            return configured;
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

        private int PickPokemonFromArea(WildAreaConfig area, WildSpawnRarity rolledRarity)
        {
            var ordered = GetFallbackOrder(rolledRarity);

            foreach (var rarity in ordered)
            {
                var pool = area.Pools.GetByRarity(rarity);
                if (pool.Count == 0)
                {
                    continue;
                }

                var index = _random.Next(pool.Count);
                return pool[index];
            }

            throw new InvalidOperationException($"WildArea '{area.Code}' has no configured pokemon pool.");
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
    }
}
