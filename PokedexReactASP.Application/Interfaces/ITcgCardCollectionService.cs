using PokedexReactASP.Application.DTOs.TcgCards;

namespace PokedexReactASP.Application.Interfaces
{
    public interface ITcgCardCollectionService
    {
        Task<PagedTcgCardsResponseDto> GetMyCardsAsync(string userId, MyTcgCardsQueryDto query);
        Task<IReadOnlyList<TcgCardDto>> GetCardsByPokemonPreviewAsync(int pokemonApiId);
    }
}
