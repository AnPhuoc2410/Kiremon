using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Options
{
    public class WildAreaSettings
    {
        public const string SectionName = "WildArea";

        public int ResetIntervalMinutes { get; set; } = 60;
        public int SpawnCount { get; set; } = 6;
        public int MaxAttemptsPerSpawn { get; set; } = 3;
        public int MaxGeneration { get; set; } = 9;
        public bool AllowLegendarySpawn { get; set; } = false;
        public Dictionary<string, double> SpawnWeights { get; set; } = new();
        public List<WildAreaConfig> WildAreas { get; set; } = new();

        public Dictionary<WildSpawnRarity, double> BuildWeights()
        {
            var result = new Dictionary<WildSpawnRarity, double>();

            foreach (var kv in SpawnWeights)
            {
                if (Enum.TryParse<WildSpawnRarity>(kv.Key, true, out var rarity) && kv.Value > 0)
                {
                    result[rarity] = kv.Value;
                }
            }

            if (result.Count == 0)
            {
                result[WildSpawnRarity.Common] = 1;
            }

            return result;
        }
    }

    public class WildAreaConfig
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public int? SpawnCount { get; set; }
        public int? ResetIntervalMinutes { get; set; }
        public List<string> AllowedTypes { get; set; } = new();
        public List<string> PreferredTypes { get; set; } = new();
        public List<string> BannedTypes { get; set; } = new();
        public List<string> AllowedHabitats { get; set; } = new();
        public List<string> PreferredHabitats { get; set; } = new();
        public List<string> RequiredAnyTags { get; set; } = new();
        public List<string> PreferredTags { get; set; } = new();
        public List<string> AllowedTags { get; set; } = new();
        public List<string> BannedTags { get; set; } = new();
        public List<string> RequiredAnyTypes { get; set; } = new();
        public List<string> SecondaryAllowedTypes { get; set; } = new();
        public List<int> SafeFallbackPokemonIds { get; set; } = new();
        public int? MinGeneration { get; set; }
        public int? MaxGeneration { get; set; }
        public bool? AllowLegendary { get; set; }
        public bool? AllowMythical { get; set; }
        public bool? AllowBaby { get; set; }
        public Dictionary<string, double> RarityWeights { get; set; } = new();

        public Dictionary<WildSpawnRarity, double> BuildWeights(Dictionary<WildSpawnRarity, double> fallback)
        {
            var result = new Dictionary<WildSpawnRarity, double>();

            foreach (var kv in RarityWeights)
            {
                if (Enum.TryParse<WildSpawnRarity>(kv.Key, true, out var rarity) && kv.Value > 0)
                {
                    result[rarity] = kv.Value;
                }
            }

            return result.Count > 0
                ? result
                : new Dictionary<WildSpawnRarity, double>(fallback);
        }

        public int ResolveSpawnCount(WildAreaSettings settings)
        {
            return Math.Max(1, SpawnCount ?? settings.SpawnCount);
        }

        public int ResolveResetIntervalMinutes(WildAreaSettings settings)
        {
            return Math.Max(1, ResetIntervalMinutes ?? settings.ResetIntervalMinutes);
        }

        public int ResolveMinGeneration()
        {
            return Math.Max(1, MinGeneration ?? 1);
        }

        public int ResolveMaxGeneration(WildAreaSettings settings)
        {
            return Math.Max(ResolveMinGeneration(), MaxGeneration ?? settings.MaxGeneration);
        }

        public bool ResolveAllowLegendary(WildAreaSettings settings)
        {
            return AllowLegendary ?? settings.AllowLegendarySpawn;
        }

        public bool ResolveAllowMythical()
        {
            return AllowMythical ?? false;
        }

        public bool ResolveAllowBaby()
        {
            return AllowBaby ?? true;
        }

        public string ResolveName()
        {
            return string.IsNullOrWhiteSpace(Name)
                ? Code switch
                {
                    "viridian_field" => "Viridian Field",
                    _ => Code
                }
                : Name;
        }

        public List<string> NormalizedAllowedTypes => Normalize(AllowedTypes);
        public List<string> NormalizedPreferredTypes => Normalize(PreferredTypes);
        public List<string> NormalizedBannedTypes => Normalize(BannedTypes);
        public List<string> NormalizedAllowedHabitats => Normalize(AllowedHabitats);
        public List<string> NormalizedPreferredHabitats => Normalize(PreferredHabitats);
        public List<string> NormalizedRequiredAnyTags => Normalize(RequiredAnyTags);
        public List<string> NormalizedPreferredTags => Normalize(PreferredTags);
        public List<string> NormalizedAllowedTags => Normalize(AllowedTags);
        public List<string> NormalizedBannedTags => Normalize(BannedTags);
        public List<string> NormalizedRequiredAnyTypes => Normalize(RequiredAnyTypes);
        public List<string> NormalizedSecondaryAllowedTypes => Normalize(SecondaryAllowedTypes);

        private static List<string> Normalize(IEnumerable<string> values)
        {
            return values
                .Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => x.Trim().ToLowerInvariant())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToList();
        }
    }

}
