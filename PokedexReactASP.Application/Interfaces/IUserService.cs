using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.DTOs.User;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IUserService
    {
        // Profile
        Task<UserProfileDto?> GetUserProfileAsync(string userId);
        Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileDto updateProfileDto);

        // Pokemon Collection - Read
        Task<IEnumerable<UserPokemonDto>> GetUserPokemonAsync(string userId);
        Task<UserPokemonDto?> GetUserPokemonByIdAsync(string userId, int userPokemonId);
        Task<CollectionStatsDto> GetCollectionStatsAsync(string userId);
        Task<PokeSummaryResponseDto> GetPokeSummaryAsync(string userId);

        Task<CatchAttemptResultDto> AttemptCatchPokemonAsync(string userId, CatchAttemptDto request);
        Task<CatchResultDto> CatchPokemonAsync(string userId, CatchPokemonDto catchPokemonDto);

        // Pokemon Management
        Task<bool> ReleasePokemonAsync(string userId, int userPokemonId);
        Task<(bool Success, string? ResultName)> UpdatePokemonNicknameAsync(string userId, int userPokemonId, string nickname);
        Task<bool> ToggleFavoritePokemonAsync(string userId, int userPokemonId);
        Task<bool> UpdatePokemonNotesAsync(string userId, int userPokemonId, string notes);
        Task<bool> InteractWithPokemonAsync(string userId, int userPokemonId);
    }
}
