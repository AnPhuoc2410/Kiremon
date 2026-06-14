using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Options;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;
using PokedexReactASP.Infrastructure.Persistence;

namespace PokedexReactASP.Infrastructure.Services
{
    public class PokemonBiomeTagService : IPokemonBiomeTagService
    {
        private const string DefaultAreaCode = "viridian_field";

        private static readonly Dictionary<int, string[]> ManualTags = new()
        {
            [41] = ["cave", "night", "haunted", "haunted-woods-native"],
            [42] = ["cave", "night", "haunted", "haunted-woods-native"],
            [43] = ["forest", "night", "poisonous", "haunted-woods-native"],
            [44] = ["forest", "night", "poisonous", "haunted-woods-native"],
            [45] = ["forest", "poisonous"],
            [92] = ["haunted", "ghostly", "night", "cave", "haunted-woods-native"],
            [93] = ["haunted", "ghostly", "night", "cave", "haunted-woods-native"],
            [94] = ["haunted", "ghostly", "night", "haunted-woods-native"],
            [116] = ["aquatic", "sea"],
            [117] = ["aquatic", "sea"],
            [138] = ["fossil", "ancient", "ruins"],
            [139] = ["fossil", "ancient", "ruins"],
            [140] = ["fossil", "ancient", "ruins"],
            [141] = ["fossil", "ancient", "ruins"],
            [142] = ["fossil", "ancient", "ruins"],
            [198] = ["haunted", "night", "forest", "bird-like", "haunted-woods-native"],
            [200] = ["haunted", "ghostly", "night", "forest", "haunted-woods-native"],
            [230] = ["aquatic", "sea", "dragon-den"],
            [345] = ["fossil", "ancient", "ruins"],
            [346] = ["fossil", "ancient", "ruins"],
            [347] = ["fossil", "ancient", "ruins"],
            [348] = ["fossil", "ancient", "ruins"]
        };

        private readonly PokemonDbContext _context;
        private readonly ISystemConfigService _configService;
        private readonly BiomeSpawnCandidateService _candidateService;

        public PokemonBiomeTagService(
            PokemonDbContext context,
            ISystemConfigService configService,
            BiomeSpawnCandidateService candidateService)
        {
            _context = context;
            _configService = configService;
            _candidateService = candidateService;
        }

        public async Task<PokemonBiomeTagRegenerationResultDto> RegenerateTagsAsync(
            bool clearAuto = true,
            CancellationToken cancellationToken = default)
        {
            var result = new PokemonBiomeTagRegenerationResultDto();

            if (clearAuto)
            {
                var autoTags = await _context.PokemonBiomeTags
                    .Where(x => !x.IsManual)
                    .ToListAsync(cancellationToken);

                result.AutoTagsDeleted = autoTags.Count;
                _context.PokemonBiomeTags.RemoveRange(autoTags);
                await _context.SaveChangesAsync(cancellationToken);
            }

            var existingTags = await _context.PokemonBiomeTags
                .ToDictionaryAsync(x => new BiomeTagKey(x.PokemonApiId, Normalize(x.Tag)), cancellationToken);

            var pokemons = await _context.PokemonSpawnMetadata
                .AsNoTracking()
                .Where(x => x.IsDefaultForm)
                .OrderBy(x => x.PokemonApiId)
                .ToListAsync(cancellationToken);

            foreach (var pokemon in pokemons)
            {
                cancellationToken.ThrowIfCancellationRequested();
                result.PokemonScanned++;

                var generated = GenerateAutoTags(pokemon)
                    .GroupBy(x => Normalize(x.Tag))
                    .Select(x => new GeneratedTag(x.Key, Math.Min(x.Sum(t => t.Weight), 3.0)))
                    .ToList();

                if (generated.Count == 0)
                {
                    result.Skipped++;
                    continue;
                }

                foreach (var tag in generated)
                {
                    var key = new BiomeTagKey(pokemon.PokemonApiId, tag.Tag);
                    if (existingTags.ContainsKey(key))
                    {
                        continue;
                    }

                    var row = new PokemonBiomeTag
                    {
                        PokemonApiId = pokemon.PokemonApiId,
                        Tag = tag.Tag,
                        Weight = tag.Weight,
                        IsManual = false,
                        Source = "auto-generated",
                        CreatedAt = DateTime.UtcNow
                    };

                    await _context.PokemonBiomeTags.AddAsync(row, cancellationToken);
                    existingTags[key] = row;
                    result.AutoTagsInserted++;
                }
            }

            foreach (var overrideEntry in ManualTags)
            {
                foreach (var tag in overrideEntry.Value)
                {
                    var normalizedTag = Normalize(tag);
                    var key = new BiomeTagKey(overrideEntry.Key, normalizedTag);
                    if (!existingTags.TryGetValue(key, out var existing))
                    {
                        existing = new PokemonBiomeTag
                        {
                            PokemonApiId = overrideEntry.Key,
                            Tag = normalizedTag,
                            Weight = 1.0,
                            IsManual = true,
                            Source = "manual-override",
                            CreatedAt = DateTime.UtcNow
                        };

                        await _context.PokemonBiomeTags.AddAsync(existing, cancellationToken);
                        existingTags[key] = existing;
                    }
                    else
                    {
                        existing.Weight = Math.Max(existing.Weight, 1.0);
                        existing.IsManual = true;
                        existing.Source = "manual-override";
                    }

                    result.ManualTagsUpserted++;
                }
            }

            await _context.SaveChangesAsync(cancellationToken);

            return result;
        }

        public async Task<IReadOnlyList<WildAreaCandidateDebugDto>> GetCandidateDebugAsync(
            string areaCode,
            WildSpawnRarity rarity,
            CancellationToken cancellationToken = default)
        {
            var settings = await _configService.GetWildAreaSettingsAsync();
            var area = ResolveArea(settings, areaCode);
            var candidates = await _candidateService.GetDebugCandidatesAsync(area, settings, rarity, cancellationToken);

            return candidates.Select(x => new WildAreaCandidateDebugDto
                {
                    PokemonApiId = x.Pokemon.PokemonApiId,
                    Name = x.Pokemon.Name,
                    Types = x.Types,
                    Tags = x.Tags.Select(t => Normalize(t.Tag)).Distinct(StringComparer.OrdinalIgnoreCase).OrderBy(t => t).ToList(),
                    Score = Math.Round(x.Score, 4),
                    Rejected = x.Rejected,
                    AcceptedReasons = x.AcceptedReasons,
                    RejectedReasons = x.RejectedReasons
                })
                .ToList();
        }

        private WildAreaConfig ResolveArea(WildAreaSettings settings, string? areaCode)
        {
            var areas = settings.WildAreas
                .Where(x => !string.IsNullOrWhiteSpace(x.Code))
                .ToList();

            if (areas.Count == 0)
            {
                areas.Add(new WildAreaConfig { Code = DefaultAreaCode, Name = "Viridian Field" });
            }

            var requestedCode = string.IsNullOrWhiteSpace(areaCode)
                ? DefaultAreaCode
                : Normalize(areaCode);

            var area = areas.FirstOrDefault(x => string.Equals(x.Code, requestedCode, StringComparison.OrdinalIgnoreCase));
            if (area != null)
            {
                return area;
            }

            throw new ArgumentException($"Unknown wild area code '{areaCode}'.", nameof(areaCode));
        }

        private static IEnumerable<GeneratedTag> GenerateAutoTags(PokemonSpawnMetadata pokemon)
        {
            foreach (var tag in GenerateTagsFromTypes(pokemon.PrimaryType, pokemon.SecondaryType))
            {
                yield return tag;
            }

            foreach (var tag in GenerateTagsFromHabitat(pokemon.Habitat))
            {
                yield return tag;
            }

            foreach (var tag in GenerateTagsFromFlags(pokemon))
            {
                yield return tag;
            }
        }

        private static IEnumerable<GeneratedTag> GenerateTagsFromTypes(string primaryType, string? secondaryType)
        {
            var types = new[] { primaryType, secondaryType }
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => Normalize(x!))
                .Distinct(StringComparer.OrdinalIgnoreCase);

            foreach (var type in types)
            {
                yield return new GeneratedTag(type, 0.8);

                foreach (var tag in TypeTags(type))
                {
                    yield return tag;
                }
            }
        }

        private static IEnumerable<GeneratedTag> TypeTags(string type)
        {
            return type switch
            {
                "water" => [new("aquatic", 1.0), new("water-creature", 0.8)],
                "ghost" => [new("haunted", 1.0), new("ghostly", 1.0), new("night", 0.8)],
                "dark" => [new("night", 0.8), new("haunted", 0.5)],
                "grass" => [new("plant-like", 1.0), new("forest", 0.7), new("grassland", 0.4)],
                "bug" => [new("bug-like", 1.0), new("forest", 0.5), new("early-game", 0.5)],
                "electric" => [new("electric", 1.0), new("power-plant", 0.8)],
                "fire" => [new("fiery", 1.0), new("volcano", 0.8)],
                "ice" => [new("icy", 1.0), new("frost", 1.0)],
                "rock" => [new("cave", 0.5), new("mountain", 0.7), new("earthy", 1.0), new("ruins", 0.3)],
                "ground" => [new("cave", 0.5), new("mountain", 0.7), new("earthy", 1.0), new("rough-terrain", 0.5)],
                "steel" => [new("robotic", 0.6), new("urban", 0.4), new("power-plant", 0.3)],
                "psychic" => [new("mystic", 0.8), new("ancient", 0.3)],
                "dragon" => [new("dragon-den", 1.0)],
                "poison" => [new("poisonous", 1.0), new("haunted", 0.3)],
                "flying" => [new("bird-like", 0.6), new("grassland", 0.3)],
                "normal" => [new("beast-like", 0.5), new("early-game", 0.4)],
                "fairy" => [new("fairy-grove", 1.0), new("mystic", 0.5), new("cute", 0.5)],
                _ => []
            };
        }

        private static IEnumerable<GeneratedTag> GenerateTagsFromHabitat(string? habitat)
        {
            if (string.IsNullOrWhiteSpace(habitat))
            {
                yield break;
            }

            var normalized = Normalize(habitat);
            yield return new GeneratedTag(normalized, 1.0);

            foreach (var tag in HabitatTags(normalized))
            {
                yield return tag;
            }
        }

        private static IEnumerable<GeneratedTag> HabitatTags(string habitat)
        {
            return habitat switch
            {
                "sea" => [new("aquatic", 1.0), new("sea", 1.0)],
                "waters-edge" => [new("aquatic", 0.8), new("lake", 0.8), new("waters-edge", 1.0)],
                "forest" => [new("forest", 1.0)],
                "grassland" => [new("grassland", 1.0), new("early-game", 0.3)],
                "cave" => [new("cave", 1.0), new("night", 0.4)],
                "mountain" => [new("mountain", 1.0)],
                "rough-terrain" => [new("rough-terrain", 1.0), new("ruins", 0.3)],
                "urban" => [new("urban", 1.0)],
                "rare" => [new("rare-spawn", 1.0), new("mystic", 0.3)],
                _ => []
            };
        }

        private static IEnumerable<GeneratedTag> GenerateTagsFromFlags(PokemonSpawnMetadata pokemon)
        {
            if (pokemon.IsBaby)
            {
                yield return new GeneratedTag("baby", 1.0);
                yield return new GeneratedTag("cute", 0.8);
            }

            if (pokemon.IsLegendary)
            {
                yield return new GeneratedTag("legendary-only", 1.0);
            }

            if (pokemon.IsMythical)
            {
                yield return new GeneratedTag("event-only", 1.0);
            }

            if (!pokemon.EvolvesFromSpecies)
            {
                yield return new GeneratedTag("base-form", 1.0);
            }

            if (pokemon.Generation <= 3 && pokemon.BaseStatTotal <= 420 && pokemon.CaptureRate >= 120)
            {
                yield return new GeneratedTag("early-game", 1.0);
            }

            if (pokemon.BaseStatTotal >= 500)
            {
                yield return new GeneratedTag("strong", 0.8);
            }

            if (pokemon.BaseStatTotal >= 600)
            {
                yield return new GeneratedTag("pseudo-or-legendary-power", 1.0);
            }

            if (pokemon.CaptureRate <= 45)
            {
                yield return new GeneratedTag("hard-to-catch", 0.7);
            }
        }

        private static string Normalize(string value)
        {
            return value.Trim().ToLowerInvariant();
        }

        private readonly record struct GeneratedTag(string Tag, double Weight);

        private readonly record struct BiomeTagKey(int PokemonApiId, string Tag);
    }
}
