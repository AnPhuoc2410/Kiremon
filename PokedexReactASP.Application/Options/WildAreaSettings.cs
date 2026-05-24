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
        public WildAreaPools Pools { get; set; } = new();
    }

    public class WildAreaPools
    {
        public List<int> Common { get; set; } = new();
        public List<int> Uncommon { get; set; } = new();
        public List<int> Rare { get; set; } = new();
        public List<int> Epic { get; set; } = new();
        public List<int> Legendary { get; set; } = new();

        public List<int> GetByRarity(WildSpawnRarity rarity)
        {
            return rarity switch
            {
                WildSpawnRarity.Common => Common,
                WildSpawnRarity.Uncommon => Uncommon,
                WildSpawnRarity.Rare => Rare,
                WildSpawnRarity.Epic => Epic,
                WildSpawnRarity.Legendary => Legendary,
                _ => Common
            };
        }
    }
}
