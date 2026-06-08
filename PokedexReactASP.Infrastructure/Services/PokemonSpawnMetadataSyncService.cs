using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    public class PokemonSpawnMetadataSyncService : IPokemonSpawnMetadataSyncService
    {
        private readonly PokemonDbContext _context;
        private readonly IPokeApiService _pokeApiService;
        private readonly ILogger<PokemonSpawnMetadataSyncService> _logger;

        public PokemonSpawnMetadataSyncService(
            PokemonDbContext context,
            IPokeApiService pokeApiService,
            ILogger<PokemonSpawnMetadataSyncService> logger)
        {
            _context = context;
            _pokeApiService = pokeApiService;
            _logger = logger;
        }

        public async Task<PokemonSpawnMetadataSyncResultDto> SyncAsync(bool force = false, CancellationToken cancellationToken = default)
        {
            var result = new PokemonSpawnMetadataSyncResultDto();
            var now = DateTime.UtcNow;

            var existing = await _context.PokemonSpawnMetadata
                .AsNoTracking()
                .ToDictionaryAsync(x => x.PokemonApiId, cancellationToken);

            const int pageSize = 200;
            var offset = 0;

            while (true)
            {
                cancellationToken.ThrowIfCancellationRequested();
                var page = await _pokeApiService.GetPokemonListAsync(pageSize, offset);
                if (page.Count == 0)
                {
                    break;
                }

                foreach (var listItem in page)
                {
                    result.Scanned++;

                    var pokemonId = ExtractPokemonId(listItem.Url);
                    if (pokemonId <= 0)
                    {
                        result.Skipped++;
                        continue;
                    }

                    if (!force && existing.TryGetValue(pokemonId, out var existingRow) && (now - existingRow.SyncedAt).TotalDays < 7)
                    {
                        result.Skipped++;
                        continue;
                    }

                    try
                    {
                        var pokemon = await _pokeApiService.GetPokemonAsync(pokemonId);
                        if (pokemon == null)
                        {
                            result.Failed++;
                            continue;
                        }

                        var species = await _pokeApiService.GetPokemonSpeciesAsync(pokemonId);
                        if (species == null)
                        {
                            result.Failed++;
                            continue;
                        }

                        var isDefault = pokemon.Is_Default;
                        if (!isDefault)
                        {
                            result.Skipped++;
                            continue;
                        }

                        var primaryType = pokemon.Type1?.ToLowerInvariant() ?? string.Empty;
                        var secondaryType = pokemon.Type2?.ToLowerInvariant();
                        var baseStatTotal = CalculateBaseStatTotal(pokemon);
                        var generation = ParseGeneration(species.Generation?.Name);
                        var captureRate = species.Capture_Rate;
                        var baseExperience = pokemon.Base_Experience;
                        var habitat = species.Habitat?.Name?.ToLowerInvariant();

                        var model = new PokemonSpawnMetadata
                        {
                            PokemonApiId = pokemon.Id,
                            Name = pokemon.Name,
                            Generation = generation,
                            PrimaryType = primaryType,
                            SecondaryType = secondaryType,
                            CaptureRate = captureRate,
                            BaseExperience = baseExperience,
                            BaseStatTotal = baseStatTotal,
                            IsBaby = species.Is_Baby,
                            IsLegendary = species.Is_Legendary,
                            IsMythical = species.Is_Mythical,
                            IsDefaultForm = isDefault,
                            Habitat = habitat,
                            EvolvesFromSpecies = species.Evolves_From_Species != null,
                            SpawnRarity = CalculateSpawnRarity(species.Is_Mythical, species.Is_Legendary, baseStatTotal, baseExperience, captureRate),
                            SpawnWeight = CalculateSpawnWeight(species.Is_Baby, species.Is_Mythical, species.Is_Legendary, baseStatTotal, captureRate),
                            SyncedAt = now
                        };

                        var tracked = await _context.PokemonSpawnMetadata.FirstOrDefaultAsync(x => x.PokemonApiId == pokemonId, cancellationToken);
                        if (tracked == null)
                        {
                            await _context.PokemonSpawnMetadata.AddAsync(model, cancellationToken);
                            result.Inserted++;
                        }
                        else
                        {
                            tracked.Name = model.Name;
                            tracked.Generation = model.Generation;
                            tracked.PrimaryType = model.PrimaryType;
                            tracked.SecondaryType = model.SecondaryType;
                            tracked.CaptureRate = model.CaptureRate;
                            tracked.BaseExperience = model.BaseExperience;
                            tracked.BaseStatTotal = model.BaseStatTotal;
                            tracked.IsBaby = model.IsBaby;
                            tracked.IsLegendary = model.IsLegendary;
                            tracked.IsMythical = model.IsMythical;
                            tracked.IsDefaultForm = model.IsDefaultForm;
                            tracked.Habitat = model.Habitat;
                            tracked.EvolvesFromSpecies = model.EvolvesFromSpecies;
                            tracked.SpawnRarity = model.SpawnRarity;
                            tracked.SpawnWeight = model.SpawnWeight;
                            tracked.SyncedAt = now;
                            result.Updated++;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning(ex, "Failed to sync PokemonSpawnMetadata for PokemonApiId {PokemonApiId}", pokemonId);
                        result.Failed++;
                    }
                }

                await _context.SaveChangesAsync(cancellationToken);
                offset += pageSize;
            }

            _logger.LogInformation(
                "Pokemon spawn metadata sync finished. Scanned={Scanned}, Inserted={Inserted}, Updated={Updated}, Skipped={Skipped}, Failed={Failed}",
                result.Scanned, result.Inserted, result.Updated, result.Skipped, result.Failed);

            return result;
        }

        private static int CalculateBaseStatTotal(PokeApiPokemon pokemon)
        {
            return pokemon.Stats.Sum(s => s.Base_Stat);
        }

        private static int ParseGeneration(string? generationName)
        {
            if (string.IsNullOrWhiteSpace(generationName))
            {
                return 9;
            }

            return generationName.ToLowerInvariant() switch
            {
                "generation-i" => 1,
                "generation-ii" => 2,
                "generation-iii" => 3,
                "generation-iv" => 4,
                "generation-v" => 5,
                "generation-vi" => 6,
                "generation-vii" => 7,
                "generation-viii" => 8,
                "generation-ix" => 9,
                _ => 9
            };
        }

        private static WildSpawnRarity CalculateSpawnRarity(
            bool isMythical,
            bool isLegendary,
            int baseStatTotal,
            int baseExperience,
            int captureRate)
        {
            if (isMythical || isLegendary || baseStatTotal >= 600)
            {
                return WildSpawnRarity.Legendary;
            }

            if (baseStatTotal >= 520 || baseExperience >= 220 || captureRate <= 15)
            {
                return WildSpawnRarity.Epic;
            }

            if (baseStatTotal >= 450 || baseExperience >= 160 || captureRate <= 45)
            {
                return WildSpawnRarity.Rare;
            }

            if (baseStatTotal >= 330 || baseExperience >= 90 || captureRate <= 120)
            {
                return WildSpawnRarity.Uncommon;
            }

            return WildSpawnRarity.Common;
        }

        private static double CalculateSpawnWeight(bool isBaby, bool isMythical, bool isLegendary, int baseStatTotal, int captureRate)
        {
            var weight = 1.0;
            weight += (captureRate / 255.0) * 3.0;

            if (baseStatTotal < 300) weight += 2.0;
            if (baseStatTotal > 500) weight -= 0.7;
            if (isLegendary || isMythical) weight *= 0.01;
            if (isBaby) weight *= 0.5;

            return Math.Max(weight, 0.01);
        }

        private static int ExtractPokemonId(string? url)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                return 0;
            }

            var parts = url.TrimEnd('/').Split('/');
            return int.TryParse(parts.LastOrDefault(), out var id) ? id : 0;
        }
    }
}
