using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.DTOs.User;

namespace PokedexReactASP.Application.Interfaces
{
    public interface IUserService
    {
        Task<UserProfileDto?> GetUserProfileAsync(string userId);
        Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileDto updateProfileDto);
        Task<IEnumerable<UserPokemonDto>> GetUserPokemonAsync(string userId);
        Task<bool> CatchPokemonAsync(string userId, CatchPokemonDto catchPokemonDto);
        Task<bool> ReleasePokemonAsync(string userId, int userPokemonId); // Changed from pokemonId to userPokemonId
        Task<bool> UpdatePokemonNicknameAsync(string userId, int userPokemonId, string nickname); // Changed parameter name
        Task<bool> ToggleFavoritePokemonAsync(string userId, int userPokemonId); // Changed parameter name
    }
}
