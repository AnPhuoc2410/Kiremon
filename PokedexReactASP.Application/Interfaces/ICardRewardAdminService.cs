using PokedexReactASP.Application.Options;

namespace PokedexReactASP.Application.Interfaces
{
    public interface ICardRewardAdminService
    {
        Task<CardRewardSettings> GetSettingsAsync();

        Task UpdateSettingsAsync(CardRewardSettings settings);
    }
}
