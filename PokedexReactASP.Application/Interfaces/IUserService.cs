using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.DTOs.User;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto?> GetUserProfileAsync(string userId);
        Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileDto updateProfileDto);
        
        // Pokemon Collection
        Task<IEnumerable<UserPokemonDto>> GetUserPokemonAsync(string userId);
        Task<UserPokemonDto?> GetUserPokemonByIdAsync(string userId, int userPokemonId);
        Task<CollectionStatsDto> GetCollectionStatsAsync(string userId);
        Task<CatchResultDto> CatchPokemonAsync(string userId, CatchPokemonDto catchPokemonDto);
        Task<bool> ReleasePokemonAsync(string userId, int userPokemonId);
        Task<bool> UpdatePokemonNicknameAsync(string userId, int userPokemonId, string nickname);
        Task<bool> ToggleFavoritePokemonAsync(string userId, int userPokemonId);
        Task<bool> UpdatePokemonNotesAsync(string userId, int userPokemonId, string notes);
        Task<int> SyncFromLocalStorageAsync(string userId, IEnumerable<LocalPokemonDto> localPokemon);
    }
}
