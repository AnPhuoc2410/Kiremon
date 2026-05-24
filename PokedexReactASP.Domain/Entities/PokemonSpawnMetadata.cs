using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Domain.Entities
{
    public class PokemonSpawnMetadata
    {
        public int Id { get; set; }

        public int PokemonApiId { get; set; }
        public string Name { get; set; } = string.Empty;

        public int Generation { get; set; }
        public string PrimaryType { get; set; } = string.Empty;
        public string? SecondaryType { get; set; }

        public int CaptureRate { get; set; }
        public int BaseExperience { get; set; }
        public int BaseStatTotal { get; set; }

        public bool IsBaby { get; set; }
        public bool IsLegendary { get; set; }
        public bool IsMythical { get; set; }
        public bool IsDefaultForm { get; set; }

        public string? Habitat { get; set; }
        public bool EvolvesFromSpecies { get; set; }

        public WildSpawnRarity SpawnRarity { get; set; } = WildSpawnRarity.Common;
        public double SpawnWeight { get; set; } = 1.0;

        public DateTime SyncedAt { get; set; } = DateTime.UtcNow;
    }
}
