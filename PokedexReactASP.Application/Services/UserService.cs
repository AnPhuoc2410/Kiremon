using AutoMapper;
using Microsoft.AspNetCore.Identity;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.DTOs.User;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPokemonCacheService _pokemonCache;
        private readonly IPokemonEnricherService _pokemonEnricher;
        private readonly IPokeApiService _pokeApiService;
        private readonly IPokemonFactoryService _pokemonFactory;
        private readonly ICatchRateCalculatorService _catchRateCalculator;
        private readonly IMapper _mapper;

        public UserService(
            IUnitOfWork unitOfWork,
            UserManager<ApplicationUser> userManager,
            IPokemonCacheService pokemonCache,
            IPokemonEnricherService pokemonEnricher,
            IPokeApiService pokeApiService,
            IPokemonFactoryService pokemonFactory,
            ICatchRateCalculatorService catchRateCalculator,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _pokemonCache = pokemonCache;
            _pokemonEnricher = pokemonEnricher;
            _pokeApiService = pokeApiService;
            _pokemonFactory = pokemonFactory;
            _catchRateCalculator = catchRateCalculator;
            _mapper = mapper;
        }

        private async Task<string> GetUniqueNicknameAsync(string userId, string baseName, int? excludePokemonId = null)
        {
            var baseNameLower = baseName.ToLower();
            var userPokemonQuery = await _unitOfWork.UserPokemon.FindAsync(up =>
                up.UserId == userId &&
                (
                    up.Nickname == null ||
                    up.Nickname.ToLower() == baseNameLower ||
                    up.Nickname.ToLower().StartsWith(baseNameLower + "_")
                ));

            var allUserPokemon = userPokemonQuery.ToList();
            var distinctApiIds = allUserPokemon.Where(p => p.Nickname == null).Select(p => p.PokemonApiId).Distinct();
            var apiDataMap = await _pokemonCache.GetPokemonBatchAsync(distinctApiIds);

            var occupiedNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            foreach (var p in allUserPokemon.Where(p => excludePokemonId == null || p.Id != excludePokemonId))
            {
                if (!string.IsNullOrEmpty(p.Nickname))
                {
                    occupiedNames.Add(p.Nickname);
                }
                else if (apiDataMap.TryGetValue(p.PokemonApiId, out var data))
                {
                    occupiedNames.Add(CapitalizeFirst(data.Name));
                }
            }

            if (!occupiedNames.Contains(baseName)) return baseName;

            int maxSuffix = 0;
            foreach (var name in occupiedNames.Where(name => name.StartsWith(baseName + "_", StringComparison.OrdinalIgnoreCase)))
            {
                var suffixPart = name.Substring(baseName.Length + 1);
                if (int.TryParse(suffixPart, out int suffix))
                {
                    if (suffix > maxSuffix) maxSuffix = suffix;
                }
            }

            // Start checking from maxSuffix + 1
            int counter = maxSuffix + 1;
            const int maxIterations = 1000;
            int iterations = 0;

            while (iterations < maxIterations)
            {
                var candidate = $"{baseName}_{counter}";
                if (!occupiedNames.Contains(candidate)) return candidate;
                counter++;
                iterations++;
            }

            throw new InvalidOperationException(
                $"Unable to generate unique nickname for '{baseName}' after {maxIterations} attempts. " +
                $"This may indicate a data integrity issue.");
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
                    typeCount[pokeApiData.Type1] = typeCount.GetValueOrDefault(pokeApiData.Type1) + 1;
                if (!string.IsNullOrEmpty(pokeApiData.Type2))
                    typeCount[pokeApiData.Type2] = typeCount.GetValueOrDefault(pokeApiData.Type2) + 1;
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

            var uniqueApiIds = pokemonList.Select(p => p.PokemonApiId).Distinct();
            var pokeApiDataMap = await _pokemonCache.GetPokemonBatchAsync(uniqueApiIds);

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

        #region Pokemon Catch - Server Authoritative

        public async Task<CatchAttemptResultDto> AttemptCatchPokemonAsync(string userId, CatchAttemptDto request)
        {
            var result = new CatchAttemptResultDto { PokeballUsed = request.PokeballType };

            // 1. Get trainer data
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                result.Result = CatchAttemptResult.Escaped;
                result.Message = "Trainer not found";
                return result;
            }

            // 2. Fetch Pokemon data from PokeAPI
            var pokeApiData = await _pokemonCache.GetPokemonAsync(request.PokemonApiId);
            if (pokeApiData == null)
            {
                result.Result = CatchAttemptResult.Escaped;
                result.Message = "Pokemon not found";
                return result;
            }

            // 3. Fetch species data for catch rate, legendary status, gender rate
            var speciesData = await _pokeApiService.GetPokemonSpeciesAsync(request.PokemonApiId);
            var captureRate = speciesData?.Capture_Rate ?? 45;
            var isLegendary = speciesData?.Is_Legendary ?? false;
            var isMythical = speciesData?.Is_Mythical ?? false;
            var isBaby = speciesData?.Is_Baby ?? false;
            var genderRate = speciesData?.Gender_Rate ?? -1;

            // 4. Determine wild Pokemon level
            var wildPokemonLevel = _pokemonFactory.CalculateWildPokemonLevel(
                user.TrainerLevel, isLegendary, isMythical);

            // 5. Determine effective nickname (handle duplicates)
            string effectiveNickname = request.Nickname;
            if (string.IsNullOrEmpty(effectiveNickname))
            {
                effectiveNickname = CapitalizeFirst(pokeApiData.Name);
            }

            string finalNickname = await GetUniqueNicknameAsync(userId, effectiveNickname);


            string? nicknameToSave = finalNickname.Equals(CapitalizeFirst(pokeApiData.Name), StringComparison.Ordinal)
                ? null
                : finalNickname;


            // 6. Calculate catch rate and attempt catch
            var existingCatch = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.PokemonApiId == request.PokemonApiId);
            var hasCaughtBefore = existingCatch != null;

            var catchContext = new CatchCalculationContext(
                BaseCaptureRate: captureRate,
                IsLegendary: isLegendary,
                IsMythical: isMythical,
                IsBaby: isBaby,
                PokemonLevel: wildPokemonLevel,
                CurrentHp: 100,
                MaxHp: 100,
                StatusCondition: null,
                TrainerLevel: user.TrainerLevel,
                PokeballUsed: request.PokeballType,
                HasCaughtBefore: hasCaughtBefore,
                TimeOfDay: GetCurrentTimeOfDay(),
                LocationType: LocationType.Grassland);

            var catchCalcResult = _catchRateCalculator.CalculateCatch(catchContext);
            result.CatchRatePercent = catchCalcResult.CatchRateUsed;
            result.ShakeCount = catchCalcResult.ShakeCount;

            // 7. Award some EXP even on failure (encourages trying)
            int baseExpGain = Math.Max(20, pokeApiData.Base_Experience / 10);

            // 8. Handle catch failure
            if (catchCalcResult.Result != CatchAttemptResult.Success)
            {
                result.Result = catchCalcResult.Result;
                result.Message = catchCalcResult.FailReason;
                result.TrainerExpGained = baseExpGain;

                // Update trainer EXP even on failure
                await UpdateTrainerExp(user, baseExpGain, result);
                return result;
            }

            // 9. CATCH SUCCESS! Create Pokemon using factory (all server-determined)
            var existingOfSameSpecies = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.PokemonApiId == request.PokemonApiId);
            var isNewSpecies = existingOfSameSpecies == null;

            var creationContext = new PokemonCreationContext(
                UserId: userId,
                PokemonApiId: request.PokemonApiId,
                PokemonName: pokeApiData.Name,
                Nickname: nicknameToSave,
                CaughtLocation: request.CaughtLocation,
                CaughtBall: request.PokeballType,
                TrainerLevel: user.TrainerLevel,
                TotalPokemonCaught: user.PokemonCaught,
                CatchStreak: 0, // TODO: Track catch streak per species
                HasShinyCharm: false, // TODO: Check inventory
                IsLegendary: isLegendary,
                IsMythical: isMythical,
                IsBaby: isBaby,
                BaseCaptureRate: captureRate,
                BaseExperience: pokeApiData.Base_Experience,
                Type1: pokeApiData.Type1,
                Type2: pokeApiData.Type2,
                SpriteUrl: pokeApiData.Sprites?.Front_Default ?? "",
                ShinySpriteUrl: pokeApiData.Sprites?.Front_Shiny,
                GenderRate: genderRate);

            var creationResult = await _pokemonFactory.CreateCaughtPokemonAsync(creationContext);
            var userPokemon = creationResult.Pokemon;

            // 10. Save Pokemon to database
            await _unitOfWork.UserPokemon.AddAsync(userPokemon);

            // 11. Update trainer stats
            user.PokemonCaught++;
            if (isNewSpecies) user.UniquePokemonCaught++;
            if (userPokemon.IsShiny) user.ShinyPokemonCaught++;

            int totalExpGain = creationResult.ExpGained;
            result.TrainerExpGained = totalExpGain;
            result.IsNewSpecies = isNewSpecies;

            await UpdateTrainerExp(user, totalExpGain, result);

            // 12. Save all changes
            await _unitOfWork.SaveChangesAsync();

            // 13. Build success response
            result.Result = CatchAttemptResult.Success;
            result.Message = userPokemon.IsShiny
                ? $"✨ Wow! A shiny {CapitalizeFirst(pokeApiData.Name)} was caught!"
                : $"{CapitalizeFirst(pokeApiData.Name)} was caught!";

            // Update ID after save
            creationResult.DisplayDto.Id = userPokemon.Id;
            result.CaughtPokemon = creationResult.DisplayDto;

            return result;
        }

        /// <summary>
        /// Use AttemptCatchPokemonAsync for battle system with catch rate roll.
        /// </summary>
        public async Task<CatchResultDto> CatchPokemonAsync(string userId, CatchPokemonDto dto)
        {
            var result = new CatchResultDto();

            // 1. Validate user
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                result.Success = false;
                result.Message = "Trainer not found";
                return result;
            }

            // 2. Fetch Pokemon data from PokeAPI
            var pokeApiData = await _pokemonCache.GetPokemonAsync(dto.PokemonApiId);
            if (pokeApiData == null)
            {
                result.Success = false;
                result.Message = "Pokemon not found in PokeAPI";
                return result;
            }

            // 3. Fetch species data for legendary status, gender rate, base happiness
            var speciesData = await _pokeApiService.GetPokemonSpeciesAsync(dto.PokemonApiId);
            var isLegendary = speciesData?.Is_Legendary ?? false;
            var isMythical = speciesData?.Is_Mythical ?? false;
            var isBaby = speciesData?.Is_Baby ?? false;
            var genderRate = speciesData?.Gender_Rate ?? -1;
            var captureRate = speciesData?.Capture_Rate ?? 45;

            // 4. Determine effective nickname (handle duplicates)
            string effectiveNickname = dto.Nickname;
            if (string.IsNullOrEmpty(effectiveNickname))
            {
                effectiveNickname = CapitalizeFirst(pokeApiData.Name);
            }

            // Calculate unique name
            string finalNickname = await GetUniqueNicknameAsync(userId, effectiveNickname);

            // Store NULL if it matches default, otherwise store the unique variant
            string? nicknameToSave = finalNickname.Equals(CapitalizeFirst(pokeApiData.Name), StringComparison.Ordinal)
                ? null
                : finalNickname;

            // 5. Check if this is a new species
            var existingOfSameSpecies = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.PokemonApiId == dto.PokemonApiId);
            var isNewSpecies = existingOfSameSpecies == null;

            // 6. Create Pokemon using factory (ALL VALUES SERVER-DETERMINED)
            var creationContext = new PokemonCreationContext(
                UserId: userId,
                PokemonApiId: dto.PokemonApiId,
                PokemonName: pokeApiData.Name,
                Nickname: nicknameToSave,
                CaughtLocation: dto.CaughtLocation ?? "Wild",
                CaughtBall: PokeballType.Pokeball,
                TrainerLevel: user.TrainerLevel,
                TotalPokemonCaught: user.PokemonCaught,
                CatchStreak: 0,
                HasShinyCharm: false, // TODO: Check inventory
                IsLegendary: isLegendary,
                IsMythical: isMythical,
                IsBaby: isBaby,
                BaseCaptureRate: captureRate,
                BaseExperience: pokeApiData.Base_Experience,
                Type1: pokeApiData.Type1,
                Type2: pokeApiData.Type2,
                SpriteUrl: pokeApiData.Sprites?.Front_Default ?? "",
                ShinySpriteUrl: pokeApiData.Sprites?.Front_Shiny,
                GenderRate: genderRate);

            var creationResult = await _pokemonFactory.CreateCaughtPokemonAsync(creationContext);
            var userPokemon = creationResult.Pokemon;

            // 7. Save Pokemon to database
            await _unitOfWork.UserPokemon.AddAsync(userPokemon);

            // 8. Update trainer stats
            user.PokemonCaught++;
            if (isNewSpecies) user.UniquePokemonCaught++;
            if (userPokemon.IsShiny) user.ShinyPokemonCaught++;

            int expGain = creationResult.ExpGained;

            // 9. Update trainer level
            user.TotalExperience += expGain;
            user.CurrentLevelExperience += expGain;
            var oldLevel = user.TrainerLevel;

            while (user.CurrentLevelExperience >= GetExpForNextLevel(user.TrainerLevel))
            {
                user.CurrentLevelExperience -= GetExpForNextLevel(user.TrainerLevel);
                user.TrainerLevel++;
            }

            await _userManager.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // 10. Build response
            result.Success = true;
            result.Message = userPokemon.IsShiny
                ? $"✨ Wow! A shiny {CapitalizeFirst(pokeApiData.Name)} was caught!"
                : $"{CapitalizeFirst(pokeApiData.Name)} was caught!";

            // Update ID after save
            creationResult.DisplayDto.Id = userPokemon.Id;
            result.CaughtPokemon = await _pokemonEnricher.EnrichAsync(userPokemon);
            result.IvTotal = creationResult.DisplayDto.IvTotal;
            result.IvRating = creationResult.DisplayDto.IvVerdict;
            result.ExperienceGained = expGain;
            result.IsNewSpecies = isNewSpecies;
            result.TrainerLeveledUp = user.TrainerLevel > oldLevel;
            result.NewTrainerLevel = user.TrainerLevel;

            return result;
        }

        private async Task UpdateTrainerExp(ApplicationUser user, int expGain, CatchAttemptResultDto result)
        {
            user.TotalExperience += expGain;
            user.CurrentLevelExperience += expGain;

            while (user.CurrentLevelExperience >= GetExpForNextLevel(user.TrainerLevel))
            {
                user.CurrentLevelExperience -= GetExpForNextLevel(user.TrainerLevel);
                user.TrainerLevel++;
                result.TrainerLeveledUp = true;
            }

            result.NewTrainerLevel = user.TrainerLevel;
            await _userManager.UpdateAsync(user);
        }

        private static TimeOfDay GetCurrentTimeOfDay()
        {
            var hour = DateTime.UtcNow.Hour;
            return hour switch
            {
                >= 6 and < 10 => TimeOfDay.Morning,
                >= 10 and < 17 => TimeOfDay.Day,
                >= 17 and < 20 => TimeOfDay.Evening,
                _ => TimeOfDay.Night
            };
        }

        private static int GetExpForNextLevel(int currentLevel) => 1000 + (currentLevel * 100);

        private static string CapitalizeFirst(string input) =>
            string.IsNullOrEmpty(input) ? input : char.ToUpper(input[0]) + input[1..];

        #endregion

        #region Pokemon Management

        public async Task<bool> ReleasePokemonAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return false;

            var remainingPokemon = await _unitOfWork.UserPokemon
                .FindAsync(up => up.UserId == userId && up.Id != userPokemonId);
            var newUniqueCount = remainingPokemon.Select(up => up.PokemonApiId).Distinct().Count();

            _unitOfWork.UserPokemon.Remove(userPokemon);

            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.PokemonCaught = Math.Max(0, user.PokemonCaught - 1);
                user.UniquePokemonCaught = newUniqueCount;
                if (userPokemon.IsShiny)
                    user.ShinyPokemonCaught = Math.Max(0, user.ShinyPokemonCaught - 1);
                await _userManager.UpdateAsync(user);
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<(bool Success, string? ResultName)> UpdatePokemonNicknameAsync(string userId, int userPokemonId, string nickname)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return (false, null);

            // If empty nickname, revert to default species name
            string targetName = nickname;
            if (string.IsNullOrEmpty(targetName))
            {
                // We need the species name
                var apiData = await _pokemonCache.GetPokemonAsync(userPokemon.PokemonApiId);
                targetName = CapitalizeFirst(apiData.Name);
            }

            // Calculate unique version
            string uniqueName = await GetUniqueNicknameAsync(userId, targetName, userPokemonId);

            // If uniqueName matches species name exactly, store null
            string speciesName = "";
            if (string.IsNullOrEmpty(nickname)) // optimization: we already fetched it if nickname was empty
            {
                speciesName = targetName;
            }
            else
            {
                var apiData = await _pokemonCache.GetPokemonAsync(userPokemon.PokemonApiId);
                speciesName = CapitalizeFirst(apiData.Name);
            }

            userPokemon.Nickname = uniqueName.Equals(speciesName, StringComparison.Ordinal) ? null : uniqueName;
            userPokemon.LastInteractionDate = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();

            return (true, uniqueName);
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

        /// <summary>
        /// Increase friendship through daily interaction
        /// </summary>
        public async Task<bool> InteractWithPokemonAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return false;

            // Only allow once per day
            if (userPokemon.LastInteractionDate.Date == DateTime.UtcNow.Date)
                return false;

            userPokemon.Friendship = Math.Min(255, userPokemon.Friendship + 1);
            userPokemon.LastInteractionDate = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        #endregion
    }
}
