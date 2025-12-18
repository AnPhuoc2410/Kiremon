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
        private readonly IPokemonCacheService _pokemonCache;
        private readonly IPokemonEnricherService _pokemonEnricher;
        private readonly IMapper _mapper;

        // Thread-safe random for IV generation
        private static readonly Random SharedRandom = new();
        private static readonly object RandomLock = new();

        public UserService(
            IUnitOfWork unitOfWork,
            UserManager<ApplicationUser> userManager,
            IPokemonCacheService pokemonCache,
            IPokemonEnricherService pokemonEnricher,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _pokemonCache = pokemonCache;
            _pokemonEnricher = pokemonEnricher;
            _mapper = mapper;
        }

        #region Profile Methods

        public async Task<UserProfileDto?> GetUserProfileAsync(string userId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            return user == null ? null : _mapper.Map<UserProfileDto>(user);
        }

        public async Task<bool> UpdateUserProfileAsync(string userId, UpdateProfileDto updateProfileDto)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null) return false;

            user.FirstName = updateProfileDto.FirstName ?? user.FirstName;
            user.LastName = updateProfileDto.LastName ?? user.LastName;
            user.AvatarUrl = updateProfileDto.AvatarUrl ?? user.AvatarUrl;

            var result = await _userManager.UpdateAsync(user);
            return result.Succeeded;
        }

        #endregion

        #region Pokemon Collection - Read Operations

        public async Task<IEnumerable<UserPokemonDto>> GetUserPokemonAsync(string userId)
        {
            var userPokemonList = await _unitOfWork.UserPokemon.FindAsync(up => up.UserId == userId);
            
            // Batch enrich - single batch API call instead of N calls
            var enrichedList = await _pokemonEnricher.EnrichBatchAsync(userPokemonList);
            
            return enrichedList.OrderByDescending(p => p.CaughtDate);
        }

        public async Task<UserPokemonDto?> GetUserPokemonByIdAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return null;

            return await _pokemonEnricher.EnrichAsync(userPokemon);
        }

        public async Task<CollectionStatsDto> GetCollectionStatsAsync(string userId)
        {
            var allPokemon = await _unitOfWork.UserPokemon.FindAsync(up => up.UserId == userId);
            var pokemonList = allPokemon.ToList();

            // Calculate type distribution using batch cache
            var typeDistribution = await GetTypeDistributionBatchAsync(pokemonList);

            return new CollectionStatsDto
            {
                TotalCaught = pokemonList.Count,
                UniqueCaught = pokemonList.Select(p => p.PokemonApiId).Distinct().Count(),
                ShinyCount = pokemonList.Count(p => p.IsShiny),
                FavoriteCount = pokemonList.Count(p => p.IsFavorite),
                TotalBattles = pokemonList.Sum(p => p.TotalBattles),
                TotalBattlesWon = pokemonList.Sum(p => p.BattlesWon),
                HighestLevel = pokemonList.Any() ? pokemonList.Max(p => p.CurrentLevel) : 0,
                AverageLevel = pokemonList.Any() ? (int)pokemonList.Average(p => p.CurrentLevel) : 0,
                TypeDistribution = typeDistribution
            };
        }

        /// <summary>
        /// Optimized: Batch fetch Pokemon data for type distribution
        /// </summary>
        private async Task<Dictionary<string, int>> GetTypeDistributionBatchAsync(List<UserPokemon> pokemonList)
        {
            if (pokemonList.Count == 0) return new Dictionary<string, int>();

            var uniqueApiIds = pokemonList.Select(p => p.PokemonApiId).Distinct();
            var pokeApiDataMap = await _pokemonCache.GetPokemonBatchAsync(uniqueApiIds);

            var typeCount = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);
            
            foreach (var pokemon in pokemonList)
            {
                if (!pokeApiDataMap.TryGetValue(pokemon.PokemonApiId, out var pokeApiData)) continue;
                
                if (!string.IsNullOrEmpty(pokeApiData.Type1))
                {
                    typeCount[pokeApiData.Type1] = typeCount.GetValueOrDefault(pokeApiData.Type1) + 1;
                }
                if (!string.IsNullOrEmpty(pokeApiData.Type2))
                {
                    typeCount[pokeApiData.Type2] = typeCount.GetValueOrDefault(pokeApiData.Type2) + 1;
                }
            }
            
            return typeCount;
        }

        public async Task<PokeSummaryResponseDto> GetPokeSummaryAsync(string userId)
        {
            var allPokemon = await _unitOfWork.UserPokemon.FindAsync(up => up.UserId == userId);
            var pokemonList = allPokemon.ToList();

            if (pokemonList.Count == 0)
            {
                return new PokeSummaryResponseDto
                {
                    Summary = new List<PokeSummaryDto>(),
                    TotalCaptured = 0,
                    UniqueSpecies = 0
                };
            }

            // Batch fetch all unique Pokemon names
            var uniqueApiIds = pokemonList.Select(p => p.PokemonApiId).Distinct();
            var pokeApiDataMap = await _pokemonCache.GetPokemonBatchAsync(uniqueApiIds);

            // Group by PokemonApiId and count
            var grouped = pokemonList
                .GroupBy(p => p.PokemonApiId)
                .Select(g =>
                {
                    var name = pokeApiDataMap.TryGetValue(g.Key, out var data)
                        ? data.Name.ToUpper()
                        : $"POKEMON_{g.Key}";
                    return new PokeSummaryDto { Name = name, Captured = g.Count() };
                })
                .ToList();

            return new PokeSummaryResponseDto
            {
                Summary = grouped,
                TotalCaptured = pokemonList.Count,
                UniqueSpecies = grouped.Count
            };
        }

        #endregion

        #region Pokemon Collection - Write Operations

        public async Task<CatchResultDto> CatchPokemonAsync(string userId, CatchPokemonDto catchPokemonDto)
        {
            var result = new CatchResultDto();

            // 1. Validate Pokemon exists in PokeAPI (cached)
            var pokeApiData = await _pokemonCache.GetPokemonAsync(catchPokemonDto.PokemonApiId);
            if (pokeApiData == null)
            {
                result.Success = false;
                result.Message = "Pokemon not found";
                return result;
            }

            // 2. Check for duplicate nickname (if provided)
            if (!string.IsNullOrEmpty(catchPokemonDto.Nickname))
            {
                var existingWithNickname = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                    up => up.UserId == userId && up.Nickname == catchPokemonDto.Nickname);

                if (existingWithNickname != null)
                {
                    result.Success = false;
                    result.Message = "You already have a Pokemon with this nickname";
                    return result;
                }
            }

            // 3. Check if this is a new species BEFORE adding
            var existingOfSameSpecies = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.PokemonApiId == catchPokemonDto.PokemonApiId);
            var isNewSpecies = existingOfSameSpecies == null;

            // 4. Generate IVs (thread-safe)
            var ivs = GenerateRandomIVs(catchPokemonDto);

            // 5. Create UserPokemon entity
            var userPokemon = _mapper.Map<UserPokemon>(catchPokemonDto);
            userPokemon.UserId = userId;
            userPokemon.IvHp = ivs.Hp;
            userPokemon.IvAttack = ivs.Attack;
            userPokemon.IvDefense = ivs.Defense;
            userPokemon.IvSpecialAttack = ivs.SpecialAttack;
            userPokemon.IvSpecialDefense = ivs.SpecialDefense;
            userPokemon.IvSpeed = ivs.Speed;

            // 6. Calculate experience gain
            var expGained = CalculateCatchExperience(pokeApiData.Base_Experience);

            // 7. Add Pokemon and update user in single transaction
            await _unitOfWork.UserPokemon.AddAsync(userPokemon);
            
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.PokemonCaught++;
                if (isNewSpecies) user.UniquePokemonCaught++;
                if (catchPokemonDto.IsShiny) user.ShinyPokemonCaught++;

                user.TotalExperience += expGained;
                user.CurrentLevelExperience += expGained;

                // Level up logic
                var leveledUp = false;
                while (user.CurrentLevelExperience >= GetExpForNextLevel(user.TrainerLevel))
                {
                    user.CurrentLevelExperience -= GetExpForNextLevel(user.TrainerLevel);
                    user.TrainerLevel++;
                    leveledUp = true;
                }

                result.TrainerLeveledUp = leveledUp;
                result.NewTrainerLevel = user.TrainerLevel;
                
                await _userManager.UpdateAsync(user);
            }

            // 8. Save all changes in single transaction
            await _unitOfWork.SaveChangesAsync();

            // 9. Build result
            result.Success = true;
            result.Message = $"{CapitalizeFirst(pokeApiData.Name)} was caught successfully!";
            result.IsNewSpecies = isNewSpecies;
            result.ExperienceGained = expGained;
            result.IvTotal = ivs.Hp + ivs.Attack + ivs.Defense + ivs.SpecialAttack + ivs.SpecialDefense + ivs.Speed;
            result.IvRating = GetIvRating(result.IvTotal);
            result.CaughtPokemon = _pokemonEnricher.EnrichWithCachedData(userPokemon, pokeApiData);

            return result;
        }

        public async Task<bool> ReleasePokemonAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return false;

            // Calculate new unique count BEFORE removing
            var remainingPokemon = await _unitOfWork.UserPokemon
                .FindAsync(up => up.UserId == userId && up.Id != userPokemonId);
            var newUniqueCount = remainingPokemon.Select(up => up.PokemonApiId).Distinct().Count();

            // Remove Pokemon
            _unitOfWork.UserPokemon.Remove(userPokemon);

            // Update user stats
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.PokemonCaught = Math.Max(0, user.PokemonCaught - 1);
                user.UniquePokemonCaught = newUniqueCount;
                if (userPokemon.IsShiny)
                {
                    user.ShinyPokemonCaught = Math.Max(0, user.ShinyPokemonCaught - 1);
                }
                await _userManager.UpdateAsync(user);
            }

            // Single save
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePokemonNicknameAsync(string userId, int userPokemonId, string nickname)
        {
            // Check for duplicate nickname
            if (!string.IsNullOrEmpty(nickname))
            {
                var existingWithNickname = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                    up => up.UserId == userId && up.Nickname == nickname && up.Id != userPokemonId);
                if (existingWithNickname != null) return false;
            }

            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return false;

            userPokemon.Nickname = nickname;
            userPokemon.LastInteractionDate = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleFavoritePokemonAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return false;

            userPokemon.IsFavorite = !userPokemon.IsFavorite;
            userPokemon.LastInteractionDate = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdatePokemonNotesAsync(string userId, int userPokemonId, string notes)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return false;

            userPokemon.Notes = notes;
            userPokemon.LastInteractionDate = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        #endregion

        #region Helper Methods

        private record IVSet(int Hp, int Attack, int Defense, int SpecialAttack, int SpecialDefense, int Speed);

        /// <summary>
        /// Thread-safe IV generation
        /// </summary>
        private static IVSet GenerateRandomIVs(CatchPokemonDto? dto)
        {
            lock (RandomLock)
            {
                return new IVSet(
                    dto?.IvHp ?? SharedRandom.Next(32),
                    dto?.IvAttack ?? SharedRandom.Next(32),
                    dto?.IvDefense ?? SharedRandom.Next(32),
                    dto?.IvSpecialAttack ?? SharedRandom.Next(32),
                    dto?.IvSpecialDefense ?? SharedRandom.Next(32),
                    dto?.IvSpeed ?? SharedRandom.Next(32)
                );
            }
        }

        private static int CalculateCatchExperience(int baseExperience)
        {
            return Math.Max(50, baseExperience / 2);
        }

        private static int GetExpForNextLevel(int currentLevel)
        {
            return 1000 + (currentLevel * 100);
        }

        private static string GetIvRating(int ivTotal)
        {
            return ivTotal switch
            {
                >= 186 => "Perfect",
                >= 150 => "Amazing",
                >= 120 => "Great",
                >= 90 => "Good",
                >= 60 => "Decent",
                _ => "Not great"
            };
        }

        private static string CapitalizeFirst(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;
            return char.ToUpper(input[0]) + input[1..];
        }

        #endregion
    }
}
