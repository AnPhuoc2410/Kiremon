using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Domain.Entities
{
    public class UserTcgCard
    {
        public int Id { get; set; }

        public string UserId { get; set; } = string.Empty;
        public ApplicationUser User { get; set; } = null!;

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

        public int Quantity { get; set; } = 1;

        public CardRewardSource Source { get; set; } = CardRewardSource.WildAreaCatch;
        public DateTime ObtainedAt { get; set; } = DateTime.UtcNow;
    }
}
