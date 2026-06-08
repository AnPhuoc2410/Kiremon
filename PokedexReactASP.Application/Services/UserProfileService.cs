using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PokedexReactASP.Application.DTOs.User;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Services
{
    /// <summary>
    /// Handles trainer profile CRUD.
    /// </summary>
    public class UserProfileService : IUserProfileService
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public UserProfileService(
            UserManager<ApplicationUser> userManager,
            IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        /// <inheritdoc/>
        public async Task<UserProfileDto?> GetUserProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user == null ? null : _mapper.Map<UserProfileDto>(user);
        }

        /// <inheritdoc/>
        public async Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileDto updateProfileDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            // Patch only provided fields — null means "keep existing"
            user.FirstName  = updateProfileDto.FirstName  ?? user.FirstName;
            user.LastName   = updateProfileDto.LastName   ?? user.LastName;
            user.AvatarUrl  = updateProfileDto.AvatarUrl  ?? user.AvatarUrl;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }
    }
}
