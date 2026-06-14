using System.Threading.Tasks;
using PokedexReactASP.Application.Options;

namespace PokedexReactASP.Application.Interfaces
{
    public interface ISystemConfigService
    {
        Task<WildAreaSettings> GetWildAreaSettingsAsync();
        Task<CardRewardSettings> GetCardRewardSettingsAsync();
        Task SaveWildAreaSettingsAsync(WildAreaSettings settings);
        Task SaveCardRewardSettingsAsync(CardRewardSettings settings);
        Task InitializeSeedAsync();
    }
}
