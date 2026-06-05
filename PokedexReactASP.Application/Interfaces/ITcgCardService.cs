using PokedexReactASP.Application.DTOs.TcgCards;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Interfaces
{
    public interface ITcgCardService
    {
        Task<IReadOnlyList<TcgCardDto>> GetCardsByPokemonAsync(int pokemonApiId);
        Task<IReadOnlyList<TcgCardDto>> GetCardsByPokemonAndTierAsync(int pokemonApiId, TcgCardRarityTier tier);
    }
}
