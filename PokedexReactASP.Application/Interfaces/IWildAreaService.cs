using PokedexReactASP.Application.DTOs.WildArea;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IWildAreaService
    {
        Task<IReadOnlyList<WildAreaOptionDto>> GetAvailableAreasAsync();
        Task<WildAreaDto> GetCurrentWildAreaAsync(string userId, string? areaCode = null);
        Task<WildAreaDto> RefreshWildAreaAsync(string userId, string? areaCode = null);
        Task<WildCatchResultDto> AttemptCatchAsync(string userId, int spawnId, WildCatchAttemptDto dto);
    }
}
