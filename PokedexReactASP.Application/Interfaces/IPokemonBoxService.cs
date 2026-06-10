using PokedexReactASP.Application.DTOs.Pokemon;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IPokemonBoxService
    {
        Task<IEnumerable<UserBoxDto>> GetBoxesAsync(string userId, CancellationToken cancellationToken = default);
        Task<UserBoxDto> UpdateBoxAsync(string userId, int boxId, UpdateBoxDto dto, CancellationToken cancellationToken = default);
        Task<MovePokemonResultDto> MovePokemonAsync(string userId, int userPokemonId, MovePokemonDto dto, CancellationToken cancellationToken = default);
        Task<bool> MovePokemonBatchAsync(string userId, BatchMovePokemonDto dto, CancellationToken cancellationToken = default);
        Task<bool> ReorderBoxesAsync(string userId, ReorderBoxesDto dto, CancellationToken cancellationToken = default);
    }
}
