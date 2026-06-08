using PokedexReactASP.Application.DTOs.User;

namespace PokedexReactASP.Application.Interfaces
{
    /// <summary>
    /// Handles trainer profile CRUD operations.
    /// </summary>
    public interface IUserProfileService
    {
        /// <summary>Gets the full trainer profile by user ID.</summary>
        Task<UserProfileDto?> GetUserProfileAsync(string userId);

        /// <summary>Updates mutable profile fields (FirstName, LastName, AvatarUrl).</summary>
        Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileDto updateProfileDto);
    }
}
