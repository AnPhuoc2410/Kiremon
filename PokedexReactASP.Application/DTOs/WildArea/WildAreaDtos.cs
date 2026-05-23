namespace PokedexReactASP.Application.DTOs.WildArea
{
    public class WildAreaDto
    {
        public string AreaCode { get; set; } = string.Empty;
        public string AreaName { get; set; } = string.Empty;
        public DateTime ResetAt { get; set; }
        public int SecondsUntilReset { get; set; }
        public List<WildPokemonSpawnDto> Spawns { get; set; } = new();
    }

    public class WildPokemonSpawnDto
    {
        public int SpawnId { get; set; }
        public int PokemonApiId { get; set; }
        public string PokemonName { get; set; } = string.Empty;
        public string SpriteUrl { get; set; } = string.Empty;
        public int SlotIndex { get; set; }
        public string SpawnRarity { get; set; } = string.Empty;
        public int AttemptsLeft { get; set; }
        public bool IsCaught { get; set; }
        public bool IsConsumed { get; set; }
    }
}
