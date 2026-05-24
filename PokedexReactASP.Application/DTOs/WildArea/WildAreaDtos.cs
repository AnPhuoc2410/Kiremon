using System.ComponentModel.DataAnnotations;
using PokedexReactASP.Domain.Enums;

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

    public class WildAreaOptionDto
    {
        public string Code { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
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

    public class WildCatchAttemptDto
    {
        public PokeballType PokeballType { get; set; } = PokeballType.Pokeball;

        [StringLength(50)]
        public string? Nickname { get; set; }
    }

    public class WildCatchResultDto
    {
        public bool Success { get; set; }
        public bool PokemonCaught { get; set; }
        public int ShakeCount { get; set; }
        public string Message { get; set; } = string.Empty;
        public int AttemptsLeft { get; set; }
        public bool SpawnConsumed { get; set; }
        public WildCaughtPokemonDto? UserPokemon { get; set; }
        public WildCardRewardDto? CardReward { get; set; }
    }

    public class WildCaughtPokemonDto
    {
        public int Id { get; set; }
        public int PokemonApiId { get; set; }
        public string? Nickname { get; set; }
        public bool IsShiny { get; set; }
        public string Nature { get; set; } = string.Empty;
        public int CaughtLevel { get; set; }
    }

    public class WildCardRewardDto
    {
        public int UserCardId { get; set; }
        public string TcgCardId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string? Rarity { get; set; }
        public string RarityTier { get; set; } = string.Empty;
        public string? ImageSmall { get; set; }
        public string? ImageLarge { get; set; }
    }
}
