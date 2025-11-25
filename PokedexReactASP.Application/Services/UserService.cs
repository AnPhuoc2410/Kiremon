using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.DTOs.User;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IMapper _mapper;

        public UserService(
            IUnitOfWork unitOfWork,
            UserManager<ApplicationUser> userManager,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<UserProfileDto?> GetUserProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user == null ? null : _mapper.Map<UserProfileDto>(user);
        }

        public async Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileDto updateProfileDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                return false;
            }

            user.FirstName = updateProfileDto.FirstName ?? user.FirstName;
            user.LastName = updateProfileDto.LastName ?? user.LastName;
            user.AvatarUrl = updateProfileDto.AvatarUrl ?? user.AvatarUrl;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        public async Task<IEnumerable<UserPokemonDto>> GetUserPokemonAsync(string userId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FindAsync(up => up.UserId == userId);
            return _mapper.Map<IEnumerable<UserPokemonDto>>(userPokemon);
        }

        public async Task<bool> CatchPokemonAsync(string userId, CatchPokemonDto catchPokemonDto)
        {
            var pokemon = await _unitOfWork.Pokemon.GetByIdAsync(catchPokemonDto.PokemonId);
            if (pokemon == null)
            {
                return false;
            }

            // Check if user already has this pokemon
            var existingUserPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.PokemonId == catchPokemonDto.PokemonId);

            if (existingUserPokemon != null)
            {
                return false; // Already caught
            }

            var userPokemon = new UserPokemon
            {
                UserId = userId,
                PokemonId = catchPokemonDto.PokemonId,
                Nickname = catchPokemonDto.Nickname,
                CaughtDate = DateTime.UtcNow,
                Level = 5,
                Experience = 0,
                IsFavorite = false
            };

            await _unitOfWork.UserPokemon.AddAsync(userPokemon);

            // Update user's pokemon count
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.PokemonCaught++;
                user.Experience += pokemon.BaseExperience;
                
                // Level up logic (simple: every 1000 exp = 1 level)
                user.Level = 1 + (user.Experience / 1000);
                
                await _userManager.UpdateAsync(user);
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ReleasePokemonAsync(string userId, int pokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.PokemonId == pokemonId);

            if (userPokemon == null)
            {
                return false;
            }

            _unitOfWork.UserPokemon.Remove(userPokemon);

            // Update user's pokemon count
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.PokemonCaught = Math.Max(0, user.PokemonCaught - 1);
                await _userManager.UpdateAsync(user);
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePokemonNicknameAsync(string userId, int pokemonId, string nickname)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.PokemonId == pokemonId);

            if (userPokemon == null)
            {
                return false;
            }

            userPokemon.Nickname = nickname;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleFavoritePokemonAsync(string userId, int pokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.PokemonId == pokemonId);

            if (userPokemon == null)
            {
                return false;
            }

            userPokemon.IsFavorite = !userPokemon.IsFavorite;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
