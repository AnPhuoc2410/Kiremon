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
            // No need to check Pokemon table - it no longer exists
            // Pokemon data comes from PokeAPI

            // Check if user already has this pokemon
            var existingUserPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.PokemonApiId == catchPokemonDto.PokemonApiId);

            if (existingUserPokemon != null)
            {
                return false; // Already caught this specific Pokemon instance
            }

            // Generate random IVs if not provided
            var random = new Random();
            var userPokemon = _mapper.Map<UserPokemon>(catchPokemonDto);
            userPokemon.UserId = userId;
            userPokemon.IvHp ??= random.Next(32);
            userPokemon.IvAttack ??= random.Next(32);
            userPokemon.IvDefense ??= random.Next(32);
            userPokemon.IvSpecialAttack ??= random.Next(32);
            userPokemon.IvSpecialDefense ??= random.Next(32);
            userPokemon.IvSpeed ??= random.Next(32);

            await _unitOfWork.UserPokemon.AddAsync(userPokemon);

            // Update user's pokemon count and stats
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.PokemonCaught++;
                
                // Update unique Pokemon count
                var uniqueCount = await _unitOfWork.UserPokemon
                    .FindAsync(up => up.UserId == userId);
                user.UniquePokemonCaught = uniqueCount.Select(up => up.PokemonApiId).Distinct().Count();
                
                // Shiny count
                if (catchPokemonDto.IsShiny)
                {
                    user.ShinyPokemonCaught++;
                }
                
                // Add experience (you can adjust this based on Pokemon rarity)
                var baseExp = 100; // Default experience
                user.TotalExperience += baseExp;
                user.CurrentLevelExperience += baseExp;
                
                // Level up logic (every 1000 exp = 1 level)
                while (user.CurrentLevelExperience >= 1000)
                {
                    user.TrainerLevel++;
                    user.CurrentLevelExperience -= 1000;
                }
                
                await _userManager.UpdateAsync(user);
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ReleasePokemonAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

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
                
                // Update unique count
                var remainingPokemon = await _unitOfWork.UserPokemon
                    .FindAsync(up => up.UserId == userId && up.Id != userPokemonId);
                user.UniquePokemonCaught = remainingPokemon.Select(up => up.PokemonApiId).Distinct().Count();
                
                // Update shiny count
                if (userPokemon.IsShiny)
                {
                    user.ShinyPokemonCaught = Math.Max(0, user.ShinyPokemonCaught - 1);
                }
                
                await _userManager.UpdateAsync(user);
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePokemonNicknameAsync(string userId, int userPokemonId, string nickname)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null)
            {
                return false;
            }

            userPokemon.Nickname = nickname;
            userPokemon.LastInteractionDate = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleFavoritePokemonAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null)
            {
                return false;
            }

            userPokemon.IsFavorite = !userPokemon.IsFavorite;
            userPokemon.LastInteractionDate = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }
    }
}
