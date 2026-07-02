using PokedexReactASP.Application.Options;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IWildAreaAdminService
    {
        Task<WildAreaSettings> GetSettingsAsync();
        Task UpdateSettingsAsync(WildAreaSettings settings);
    }
}
