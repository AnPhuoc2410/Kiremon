using PokedexReactASP.Application.DTOs.WildArea;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IWildAreaService
    {
        Task<WildAreaDto> GetCurrentWildAreaAsync(string userId);
        Task<WildAreaDto> RefreshWildAreaAsync(string userId);
        Task<WildCatchResultDto> AttemptCatchAsync(string userId, int spawnId, WildCatchAttemptDto dto);
    }
}
