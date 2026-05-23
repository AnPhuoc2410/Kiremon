using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.DTOs.TcgCards
{
    public class TcgCardDto
    {
        public string TcgCardId { get; set; } = string.Empty;
        public int PokemonApiId { get; set; }

        public string Name { get; set; } = string.Empty;
        public string? Supertype { get; set; }
        public string? Rarity { get; set; }
        public TcgCardRarityTier RarityTier { get; set; } = TcgCardRarityTier.Unknown;

        public string? SetId { get; set; }
        public string? SetName { get; set; }

        public string? ImageSmall { get; set; }
        public string? ImageLarge { get; set; }
    }
}
