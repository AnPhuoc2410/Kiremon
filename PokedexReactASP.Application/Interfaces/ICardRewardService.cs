using PokedexReactASP.Application.DTOs.WildArea;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Interfaces
{
    public interface ICardRewardService
    {
        Task<WildCardRewardDto?> RollAndGrantCardAsync(string userId, int pokemonApiId, CardRewardSource source);
    }
}
