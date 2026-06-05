using Microsoft.AspNetCore.Identity;
using PokedexReactASP.Application.Common.Helpers;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Services
{
    /// <summary>
    /// Server-authoritative Pokemon catch mechanics + all Pokemon management mutations
    /// (release, nickname, notes, favorite, daily interaction).
    /// </summary>
    public class PokemonCatchService : IPokemonCatchService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IPokemonCacheService _pokemonCache;
        private readonly IPokemonEnricherService _pokemonEnricher;
        private readonly IPokeApiService _pokeApiService;
        private readonly IPokemonFactoryService _pokemonFactory;
        private readonly ICatchRateCalculatorService _catchRateCalculator;
        private readonly IAchievementService _achievementService;

        public PokemonCatchService(
            IUnitOfWork unitOfWork,
            UserManager<ApplicationUser> userManager,
            IPokemonCacheService pokemonCache,
            IPokemonEnricherService pokemonEnricher,
            IPokeApiService pokeApiService,
            IPokemonFactoryService pokemonFactory,
            ICatchRateCalculatorService catchRateCalculator,
            IAchievementService achievementService)
        {
            _unitOfWork          = unitOfWork;
            _userManager         = userManager;
            _pokemonCache        = pokemonCache;
            _pokemonEnricher     = pokemonEnricher;
            _pokeApiService      = pokeApiService;
            _pokemonFactory      = pokemonFactory;
            _catchRateCalculator = catchRateCalculator;
            _achievementService  = achievementService;
        }

        // ── Catch Operations ──────────────────────────────────────────────────

        /// <inheritdoc/>
        public async Task<CatchAttemptResultDto> AttemptCatchPokemonAsync(string userId, CatchAttemptDto request)
        {
            var result = new CatchAttemptResultDto { PokeballUsed = request.PokeballType };

            // 1. Get trainer data
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
            {
                result.Result  = CatchAttemptResult.Escaped;
                result.Message = "Trainer not found";
                return result;
            }

            // 2. Fetch Pokemon data from PokeAPI
            var pokeApiData = await _pokemonCache.GetPokemonAsync(request.PokemonApiId);
            if (pokeApiData == null)
            {
                result.Result  = CatchAttemptResult.Escaped;
                result.Message = "Pokemon not found";
                return result;
            }

            // 3. Fetch species data for catch rate, legendary status, gender rate
            var speciesData  = await _pokeApiService.GetPokemonSpeciesAsync(request.PokemonApiId);
            var captureRate  = speciesData?.Capture_Rate ?? 45;
            var isLegendary  = speciesData?.Is_Legendary ?? false;
            var isMythical   = speciesData?.Is_Mythical  ?? false;
            var isBaby       = speciesData?.Is_Baby      ?? false;
            var genderRate   = speciesData?.Gender_Rate  ?? -1;

            // 4. Determine wild Pokemon level
            var wildPokemonLevel = _pokemonFactory.CalculateWildPokemonLevel(
                user.TrainerLevel, isLegendary, isMythical);

            // 5. Determine effective nickname (deduplicate if collision)
            string baseName        = PokemonNameHelper.CapitalizeFirst(pokeApiData.Name);
            string effectiveName   = string.IsNullOrEmpty(request.Nickname) ? baseName : request.Nickname;
            string finalNickname   = await GetUniqueNicknameAsync(userId, effectiveName);
            string? nicknameToSave = finalNickname.Equals(baseName, StringComparison.Ordinal) ? null : finalNickname;

            // 6. Check existing catch & calculate catch rate
            var existingCatch  = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.PokemonApiId == request.PokemonApiId, disableTracking: true);
            var hasCaughtBefore = existingCatch != null;

            var catchContext = new CatchCalculationContext(
                BaseCaptureRate:  captureRate,
                IsLegendary:      isLegendary,
                IsMythical:       isMythical,
                IsBaby:           isBaby,
                PokemonLevel:     wildPokemonLevel,
                CurrentHp:        100,
                MaxHp:            100,
                StatusCondition:  null,
                TrainerLevel:     user.TrainerLevel,
                PokeballUsed:     request.PokeballType,
                HasCaughtBefore:  hasCaughtBefore,
                TimeOfDay:        GetCurrentTimeOfDay(),
                LocationType:     LocationType.Grassland);

            var catchCalcResult      = _catchRateCalculator.CalculateCatch(catchContext);
            result.CatchRatePercent  = catchCalcResult.CatchRateUsed;
            result.ShakeCount        = catchCalcResult.ShakeCount;

            // 7. Award some EXP even on failure (encourages trying)
            int baseExpGain = Math.Max(20, pokeApiData.Base_Experience / 10);

            // 8. Handle catch failure — update EXP only
            if (catchCalcResult.Result != CatchAttemptResult.Success)
            {
                result.Result          = catchCalcResult.Result;
                result.Message         = catchCalcResult.FailReason;
                result.TrainerExpGained = baseExpGain;

                await UpdateTrainerExpAsync(user, baseExpGain, result);
                return result;
            }

            // 9. CATCH SUCCESS! Build and save Pokemon
            var isNewSpecies    = existingCatch == null;
            var creationContext = BuildCreationContext(
                userId, request.PokemonApiId, pokeApiData, nicknameToSave,
                request.CaughtLocation, request.PokeballType, user,
                captureRate, isLegendary, isMythical, isBaby, genderRate);

            var creationResult = await _pokemonFactory.CreateCaughtPokemonAsync(creationContext);
            var userPokemon    = creationResult.Pokemon;

            // 10. Persist Pokemon + trainer counters
            await _unitOfWork.UserPokemon.AddAsync(userPokemon);

            user.PokemonCaught++;
            if (isNewSpecies)         user.UniquePokemonCaught++;
            if (userPokemon.IsShiny)  user.ShinyPokemonCaught++;
            if (isLegendary)          user.LegendaryPokemonCaught++;

            int totalExpGain        = creationResult.ExpGained;
            result.TrainerExpGained = totalExpGain;
            result.IsNewSpecies     = isNewSpecies;

            await UpdateTrainerExpAsync(user, totalExpGain, result);

            await _unitOfWork.SaveChangesAsync();

            // Check for achievements
            await _achievementService.CheckAndUnlockAchievementsAsync(userId);

            // 11. Build success response
            result.Result  = CatchAttemptResult.Success;
            result.Message = userPokemon.IsShiny
                ? $"✨ Wow! A shiny {baseName} was caught!"
                : $"{baseName} was caught!";

            creationResult.DisplayDto.Id = userPokemon.Id;
            result.CaughtPokemon = creationResult.DisplayDto;

            return result;
        }

        /// <inheritdoc/>
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

            // 3. Fetch species data
            var speciesData = await _pokeApiService.GetPokemonSpeciesAsync(dto.PokemonApiId);
            var isLegendary = speciesData?.Is_Legendary ?? false;
            var isMythical  = speciesData?.Is_Mythical  ?? false;
            var isBaby      = speciesData?.Is_Baby      ?? false;
            var genderRate  = speciesData?.Gender_Rate  ?? -1;
            var captureRate = speciesData?.Capture_Rate ?? 45;

            // 4. Deduplicate nickname
            string baseName        = PokemonNameHelper.CapitalizeFirst(pokeApiData.Name);
            string effectiveName   = string.IsNullOrEmpty(dto.Nickname) ? baseName : dto.Nickname;
            string finalNickname   = await GetUniqueNicknameAsync(userId, effectiveName);
            string? nicknameToSave = finalNickname.Equals(baseName, StringComparison.Ordinal) ? null : finalNickname;

            // 5. Check if new species
            var existingOfSameSpecies = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.PokemonApiId == dto.PokemonApiId, disableTracking: true);
            var isNewSpecies = existingOfSameSpecies == null;

            // 6. Create Pokemon
            var creationContext = BuildCreationContext(
                userId, dto.PokemonApiId, pokeApiData, nicknameToSave,
                dto.CaughtLocation ?? "Wild", PokeballType.Pokeball, user,
                captureRate, isLegendary, isMythical, isBaby, genderRate);

            var creationResult = await _pokemonFactory.CreateCaughtPokemonAsync(creationContext);
            var userPokemon    = creationResult.Pokemon;

            // 7. Save Pokemon + trainer stats
            await _unitOfWork.UserPokemon.AddAsync(userPokemon);

            user.PokemonCaught++;
            if (isNewSpecies)        user.UniquePokemonCaught++;
            if (userPokemon.IsShiny) user.ShinyPokemonCaught++;
            if (isLegendary)         user.LegendaryPokemonCaught++;

            int expGain = creationResult.ExpGained;

            // 8. Update trainer level inline (legacy method — no result DTO with level info needed)
            user.TotalExperience        += expGain;
            user.CurrentLevelExperience += expGain;
            var oldLevel = user.TrainerLevel;

            while (user.CurrentLevelExperience >= TrainerLevelCalculator.GetExpForNextLevel(user.TrainerLevel))
            {
                user.CurrentLevelExperience -= TrainerLevelCalculator.GetExpForNextLevel(user.TrainerLevel);
                user.TrainerLevel++;
            }

            await _userManager.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            // Check for achievements
            await _achievementService.CheckAndUnlockAchievementsAsync(userId);

            // 9. Build response
            result.Success = true;
            result.Message = userPokemon.IsShiny
                ? $"✨ Wow! A shiny {baseName} was caught!"
                : $"{baseName} was caught!";

            creationResult.DisplayDto.Id   = userPokemon.Id;
            result.CaughtPokemon           = await _pokemonEnricher.EnrichAsync(userPokemon);
            result.IvTotal                 = creationResult.DisplayDto.IvTotal;
            result.IvRating                = creationResult.DisplayDto.IvVerdict;
            result.ExperienceGained        = expGain;
            result.IsNewSpecies            = isNewSpecies;
            result.TrainerLeveledUp        = user.TrainerLevel > oldLevel;
            result.NewTrainerLevel         = user.TrainerLevel;

            return result;
        }

        // ── Pokemon Management ────────────────────────────────────────────────

        /// <inheritdoc/>
        public async Task<bool> ReleasePokemonAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return false;

            // Recount unique species BEFORE removing (avoids double query after)
            var remaining     = await _unitOfWork.UserPokemon.FindAsync(
                up => up.UserId == userId && up.Id != userPokemonId, disableTracking: true);
            var newUniqueCount = remaining.Select(up => up.PokemonApiId).Distinct().Count();

            _unitOfWork.UserPokemon.Remove(userPokemon);

            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.PokemonCaught       = Math.Max(0, user.PokemonCaught - 1);
                user.UniquePokemonCaught = newUniqueCount;
                if (userPokemon.IsShiny)
                    user.ShinyPokemonCaught = Math.Max(0, user.ShinyPokemonCaught - 1);
                await _userManager.UpdateAsync(user);
            }

            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        /// <inheritdoc/>
        public async Task<(bool Success, string? ResultName)> UpdatePokemonNicknameAsync(
            string userId, int userPokemonId, string nickname)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return (false, null);

            // Fetch species name once — reused for both empty-nickname reset and uniqueness check
            var apiData    = await _pokemonCache.GetPokemonAsync(userPokemon.PokemonApiId);
            var speciesName = PokemonNameHelper.CapitalizeFirst(apiData!.Name);

            string targetName  = string.IsNullOrEmpty(nickname) ? speciesName : nickname;
            string uniqueName  = await GetUniqueNicknameAsync(userId, targetName, userPokemonId);

            // Store null when the name equals the default species name (avoids redundant data)
            userPokemon.Nickname              = uniqueName.Equals(speciesName, StringComparison.Ordinal) ? null : uniqueName;
            userPokemon.LastInteractionDate   = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();

            return (true, uniqueName);
        }

        /// <inheritdoc/>
        public async Task<bool> ToggleFavoritePokemonAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return false;

            userPokemon.IsFavorite            = !userPokemon.IsFavorite;
            userPokemon.LastInteractionDate   = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        /// <inheritdoc/>
        public async Task<bool> UpdatePokemonNotesAsync(string userId, int userPokemonId, string notes)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return false;

            userPokemon.Notes                 = notes;
            userPokemon.LastInteractionDate   = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        /// <inheritdoc/>
        public async Task<bool> InteractWithPokemonAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return false;

            // Only allow once per day
            if (userPokemon.LastInteractionDate.Date == DateTime.UtcNow.Date)
                return false;

            userPokemon.Friendship            = Math.Min(255, userPokemon.Friendship + 1);
            userPokemon.LastInteractionDate   = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        // ── Private Helpers ───────────────────────────────────────────────────

        /// <summary>
        /// Generates a nickname that is unique within the trainer's collection.
        /// If <paramref name="baseName"/> is already taken, appends _1, _2, … up to 1000 attempts.
        /// Pass <paramref name="excludePokemonId"/> when renaming to exclude the current Pokemon.
        /// </summary>
        private async Task<string> GetUniqueNicknameAsync(
            string userId, string baseName, int? excludePokemonId = null)
        {
            var baseNameLower = baseName.ToLower();
            var userPokemonQuery = await _unitOfWork.UserPokemon.FindAsync(up =>
                up.UserId == userId &&
                (
                    up.Nickname == null ||
                    up.Nickname.ToLower() == baseNameLower ||
                    up.Nickname.ToLower().StartsWith(baseNameLower + "_")
                ), disableTracking: true);

            var allUserPokemon = userPokemonQuery.ToList();
            var distinctApiIds = allUserPokemon.Where(p => p.Nickname == null).Select(p => p.PokemonApiId).Distinct();
            var apiDataMap     = await _pokemonCache.GetPokemonBatchAsync(distinctApiIds);

            var occupiedNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            foreach (var p in allUserPokemon.Where(p => excludePokemonId == null || p.Id != excludePokemonId))
            {
                if (!string.IsNullOrEmpty(p.Nickname))
                {
                    occupiedNames.Add(p.Nickname);
                }
                else if (apiDataMap.TryGetValue(p.PokemonApiId, out var data))
                {
                    occupiedNames.Add(PokemonNameHelper.CapitalizeFirst(data.Name));
                }
            }

            if (!occupiedNames.Contains(baseName)) return baseName;

            int maxSuffix = 0;
            foreach (var name in occupiedNames.Where(n => n.StartsWith(baseName + "_", StringComparison.OrdinalIgnoreCase)))
            {
                var suffixPart = name[(baseName.Length + 1)..];
                if (int.TryParse(suffixPart, out int suffix) && suffix > maxSuffix)
                    maxSuffix = suffix;
            }

            const int maxIterations = 1000;
            int counter = maxSuffix + 1;

            for (int i = 0; i < maxIterations; i++, counter++)
            {
                var candidate = $"{baseName}_{counter}";
                if (!occupiedNames.Contains(candidate)) return candidate;
            }

            throw new InvalidOperationException(
                $"Unable to generate unique nickname for '{baseName}' after {maxIterations} attempts. " +
                "This may indicate a data integrity issue.");
        }

        /// <summary>
        /// Builds a shared <see cref="PokemonCreationContext"/> from parameters common to both catch methods.
        /// </summary>
        private static PokemonCreationContext BuildCreationContext(
            string userId, int pokemonApiId, PokeApiPokemon pokeApiData,
            string? nickname, string caughtLocation, PokeballType caughtBall,
            ApplicationUser user, int captureRate, bool isLegendary,
            bool isMythical, bool isBaby, int genderRate)
        {
            return new PokemonCreationContext(
                UserId:            userId,
                PokemonApiId:      pokemonApiId,
                PokemonName:       pokeApiData.Name,
                Nickname:          nickname,
                CaughtLocation:    caughtLocation,
                CaughtBall:        caughtBall,
                TrainerLevel:      user.TrainerLevel,
                TotalPokemonCaught: user.PokemonCaught,
                CatchStreak:       0,
                HasShinyCharm:     false,
                IsLegendary:       isLegendary,
                IsMythical:        isMythical,
                IsBaby:            isBaby,
                BaseCaptureRate:   captureRate,
                BaseExperience:    pokeApiData.Base_Experience,
                Type1:             pokeApiData.Type1,
                Type2:             pokeApiData.Type2,
                SpriteUrl:         pokeApiData.Sprites?.Front_Default ?? "",
                ShinySpriteUrl:    pokeApiData.Sprites?.Front_Shiny,
                GenderRate:        genderRate);
        }

        /// <summary>
        /// Updates trainer EXP and handles level-up loop.
        /// Writes to <see cref="CatchAttemptResultDto"/> level-up fields.
        /// Does NOT call SaveChangesAsync — caller is responsible.
        /// </summary>
        private async Task UpdateTrainerExpAsync(ApplicationUser user, int expGain, CatchAttemptResultDto result)
        {
            user.TotalExperience        += expGain;
            user.CurrentLevelExperience += expGain;

            while (user.CurrentLevelExperience >= TrainerLevelCalculator.GetExpForNextLevel(user.TrainerLevel))
            {
                user.CurrentLevelExperience -= TrainerLevelCalculator.GetExpForNextLevel(user.TrainerLevel);
                user.TrainerLevel++;
                result.TrainerLeveledUp = true;
            }

            result.NewTrainerLevel = user.TrainerLevel;
            await _userManager.UpdateAsync(user);
        }

        /// <summary>Returns the current time-of-day bucket (UTC). See issue #19 for timezone support.</summary>
        private static TimeOfDay GetCurrentTimeOfDay()
        {
            var hour = DateTime.UtcNow.Hour;
            return hour switch
            {
                >= 6  and < 10 => TimeOfDay.Morning,
                >= 10 and < 17 => TimeOfDay.Day,
                >= 17 and < 20 => TimeOfDay.Evening,
                _              => TimeOfDay.Night
            };
        }
    }
}
