using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.DTOs.TcgCards
{
    public class MyTcgCardsQueryDto
    {
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 30;
        public int? PokemonApiId { get; set; }
        public TcgCardRarityTier? RarityTier { get; set; }
        public string? Sort { get; set; } = "obtained-desc";
    }

    public class MyTcgCardItemDto
    {
        public int UserCardId { get; set; }
        public string TcgCardId { get; set; } = string.Empty;
        public int PokemonApiId { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Rarity { get; set; }
        public string RarityTier { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string? ImageSmall { get; set; }
        public string? ImageLarge { get; set; }
    }

    public class PagedTcgCardsResponseDto
    {
        public List<MyTcgCardItemDto> Items { get; set; } = new();
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }
    }
}
