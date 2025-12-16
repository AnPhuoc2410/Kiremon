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
        private readonly IPokeApiService _pokeApiService;
        private readonly IMapper _mapper;

        public UserService(
            IUnitOfWork unitOfWork,
            UserManager<ApplicationUser> userManager,
            IPokeApiService pokeApiService,
            IMapper mapper)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
            _pokeApiService = pokeApiService;
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
            var userPokemonList = await _unitOfWork.UserPokemon.FindAsync(up => up.UserId == userId);
            var result = new List<UserPokemonDto>();

            foreach (var userPokemon in userPokemonList)
            {
                var dto = await EnrichUserPokemonDtoAsync(userPokemon);
                result.Add(dto);
            }

            return result.OrderByDescending(p => p.CaughtDate);
        }

        public async Task<UserPokemonDto?> GetUserPokemonByIdAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null) return null;

            return await EnrichUserPokemonDtoAsync(userPokemon);
        }

        public async Task<CollectionStatsDto> GetCollectionStatsAsync(string userId)
        {
            var allPokemon = await _unitOfWork.UserPokemon.FindAsync(up => up.UserId == userId);
            var pokemonList = allPokemon.ToList();

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
                TypeDistribution = await GetTypeDistributionAsync(pokemonList)
            };
        }

        private async Task<Dictionary<string, int>> GetTypeDistributionAsync(List<UserPokemon> pokemonList)
        {
            var typeCount = new Dictionary<string, int>();
            foreach (var pokemon in pokemonList)
            {
                var pokeApiData = await _pokeApiService.GetPokemonAsync(pokemon.PokemonApiId);
                if (pokeApiData != null)
                {
                    if (!string.IsNullOrEmpty(pokeApiData.Type1))
                    {
                        typeCount[pokeApiData.Type1] = typeCount.GetValueOrDefault(pokeApiData.Type1) + 1;
                    }
                    if (!string.IsNullOrEmpty(pokeApiData.Type2))
                    {
                        typeCount[pokeApiData.Type2] = typeCount.GetValueOrDefault(pokeApiData.Type2) + 1;
                    }
                }
            }
            return typeCount;
        }

        public async Task<CatchResultDto> CatchPokemonAsync(string userId, CatchPokemonDto catchPokemonDto)
        {
            var result = new CatchResultDto();

            // Validate Pokemon exists in PokeAPI
            var pokeApiData = await _pokeApiService.GetPokemonAsync(catchPokemonDto.PokemonApiId);
            if (pokeApiData == null)
            {
                result.Success = false;
                result.Message = "Pokemon not found in PokeAPI";
                return result;
            }

            // Check for duplicate nickname if provided
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

            // Generate random IVs if not provided (0-31 range)
            var random = new Random();
            var userPokemon = new UserPokemon
            {
                UserId = userId,
                PokemonApiId = catchPokemonDto.PokemonApiId,
                Nickname = catchPokemonDto.Nickname,
                CaughtLocation = catchPokemonDto.CaughtLocation,
                CaughtLevel = catchPokemonDto.CaughtLevel,
                CurrentLevel = catchPokemonDto.CaughtLevel,
                IsShiny = catchPokemonDto.IsShiny,
                CaughtDate = DateTime.UtcNow,
                IvHp = catchPokemonDto.IvHp ?? random.Next(32),
                IvAttack = catchPokemonDto.IvAttack ?? random.Next(32),
                IvDefense = catchPokemonDto.IvDefense ?? random.Next(32),
                IvSpecialAttack = catchPokemonDto.IvSpecialAttack ?? random.Next(32),
                IvSpecialDefense = catchPokemonDto.IvSpecialDefense ?? random.Next(32),
                IvSpeed = catchPokemonDto.IvSpeed ?? random.Next(32),
                Friendship = 70,
                CurrentHp = 100
            };

            await _unitOfWork.UserPokemon.AddAsync(userPokemon);

            // Update user's pokemon count and stats
            var user = await _userManager.FindByIdAsync(userId);
            if (user != null)
            {
                user.PokemonCaught++;
                
                // Check if this is a new unique Pokemon
                var existingOfSameType = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                    up => up.UserId == userId && up.PokemonApiId == catchPokemonDto.PokemonApiId);
                
                if (existingOfSameType == null)
                {
                    user.UniquePokemonCaught++;
                    result.IsNewSpecies = true;
                }
                
                // Shiny count
                if (catchPokemonDto.IsShiny)
                {
                    user.ShinyPokemonCaught++;
                }
                
                // Add experience based on rarity
                var baseExp = CalculateCatchExperience(pokeApiData.Base_Experience);
                user.TotalExperience += baseExp;
                user.CurrentLevelExperience += baseExp;
                result.ExperienceGained = baseExp;
                
                // Level up logic
                while (user.CurrentLevelExperience >= GetExpForNextLevel(user.TrainerLevel))
                {
                    user.CurrentLevelExperience -= GetExpForNextLevel(user.TrainerLevel);
                    user.TrainerLevel++;
                    result.TrainerLeveledUp = true;
                }
                
                result.NewTrainerLevel = user.TrainerLevel;
                await _userManager.UpdateAsync(user);
            }

            await _unitOfWork.SaveChangesAsync();
            
            result.Success = true;
            result.Message = $"{pokeApiData.Name} was caught successfully!";
            result.CaughtPokemon = await EnrichUserPokemonDtoAsync(userPokemon);
            result.IvTotal = (userPokemon.IvHp ?? 0) + (userPokemon.IvAttack ?? 0) + 
                            (userPokemon.IvDefense ?? 0) + (userPokemon.IvSpecialAttack ?? 0) + 
                            (userPokemon.IvSpecialDefense ?? 0) + (userPokemon.IvSpeed ?? 0);
            result.IvRating = GetIvRating(result.IvTotal);
            
            return result;
        }

        private int CalculateCatchExperience(int baseExperience)
        {
            // Scale experience based on Pokemon's base experience
            return Math.Max(50, baseExperience / 2);
        }

        private int GetExpForNextLevel(int currentLevel)
        {
            // Progressive exp requirement
            return 1000 + (currentLevel * 100);
        }

        private string GetIvRating(int ivTotal)
        {
            return ivTotal switch
            {
                >= 186 => "Perfect", // 31*6 = 186
                >= 150 => "Amazing",
                >= 120 => "Great",
                >= 90 => "Good",
                >= 60 => "Decent",
                _ => "Not great"
            };
        }

        private async Task<UserPokemonDto> EnrichUserPokemonDtoAsync(UserPokemon userPokemon)
        {
            var pokeApiData = await _pokeApiService.GetPokemonAsync(userPokemon.PokemonApiId);
            
            var dto = new UserPokemonDto
            {
                Id = userPokemon.Id,
                UserId = userPokemon.UserId,
                PokemonApiId = userPokemon.PokemonApiId,
                Nickname = userPokemon.Nickname,
                IsFavorite = userPokemon.IsFavorite,
                IsShiny = userPokemon.IsShiny,
                CaughtDate = userPokemon.CaughtDate,
                CaughtLocation = userPokemon.CaughtLocation,
                CaughtLevel = userPokemon.CaughtLevel,
                CurrentLevel = userPokemon.CurrentLevel,
                CurrentExperience = userPokemon.CurrentExperience,
                CurrentHp = userPokemon.CurrentHp,
                IvHp = userPokemon.IvHp,
                IvAttack = userPokemon.IvAttack,
                IvDefense = userPokemon.IvDefense,
                IvSpecialAttack = userPokemon.IvSpecialAttack,
                IvSpecialDefense = userPokemon.IvSpecialDefense,
                IvSpeed = userPokemon.IvSpeed,
                EvHp = userPokemon.EvHp,
                EvAttack = userPokemon.EvAttack,
                EvDefense = userPokemon.EvDefense,
                EvSpecialAttack = userPokemon.EvSpecialAttack,
                EvSpecialDefense = userPokemon.EvSpecialDefense,
                EvSpeed = userPokemon.EvSpeed,
                BattlesWon = userPokemon.BattlesWon,
                BattlesLost = userPokemon.BattlesLost,
                TotalBattles = userPokemon.TotalBattles,
                Friendship = userPokemon.Friendship,
                CanEvolve = userPokemon.CanEvolve,
                EvolvedFromApiId = userPokemon.EvolvedFromApiId,
                IsTraded = userPokemon.IsTraded,
                OriginalTrainerName = userPokemon.OriginalTrainerName,
                Notes = userPokemon.Notes,
                LastInteractionDate = userPokemon.LastInteractionDate
            };

            // Enrich with PokeAPI data
            if (pokeApiData != null)
            {
                dto.Name = pokeApiData.Name;
                dto.DisplayName = !string.IsNullOrEmpty(userPokemon.Nickname) 
                    ? userPokemon.Nickname 
                    : CapitalizeFirst(pokeApiData.Name);
                dto.Type1 = pokeApiData.Type1;
                dto.Type2 = pokeApiData.Type2;
                dto.Height = pokeApiData.Height;
                dto.Weight = pokeApiData.Weight;
                dto.SpriteUrl = userPokemon.IsShiny 
                    ? pokeApiData.Sprites?.Front_Shiny ?? pokeApiData.Sprites?.Front_Default ?? ""
                    : pokeApiData.Sprites?.Front_Default ?? "";
                dto.OfficialArtworkUrl = pokeApiData.Sprites?.Other?.Official_Artwork?.Front_Default;
                dto.Abilities = pokeApiData.Abilities.Select(a => a.Ability.Name).ToList();
                dto.BaseHp = pokeApiData.Hp;
                dto.BaseAttack = pokeApiData.Attack;
                dto.BaseDefense = pokeApiData.Defense;
                dto.BaseSpecialAttack = pokeApiData.SpecialAttack;
                dto.BaseSpecialDefense = pokeApiData.SpecialDefense;
                dto.BaseSpeed = pokeApiData.Speed;
                dto.BaseStatTotal = pokeApiData.Hp + pokeApiData.Attack + pokeApiData.Defense + 
                                   pokeApiData.SpecialAttack + pokeApiData.SpecialDefense + pokeApiData.Speed;

                // Calculate actual stats based on level, IVs, EVs
                dto.CalculatedHp = CalculateStat(pokeApiData.Hp, dto.IvHp ?? 0, dto.EvHp, dto.CurrentLevel, true);
                dto.CalculatedAttack = CalculateStat(pokeApiData.Attack, dto.IvAttack ?? 0, dto.EvAttack, dto.CurrentLevel, false);
                dto.CalculatedDefense = CalculateStat(pokeApiData.Defense, dto.IvDefense ?? 0, dto.EvDefense, dto.CurrentLevel, false);
                dto.CalculatedSpecialAttack = CalculateStat(pokeApiData.SpecialAttack, dto.IvSpecialAttack ?? 0, dto.EvSpecialAttack, dto.CurrentLevel, false);
                dto.CalculatedSpecialDefense = CalculateStat(pokeApiData.SpecialDefense, dto.IvSpecialDefense ?? 0, dto.EvSpecialDefense, dto.CurrentLevel, false);
                dto.CalculatedSpeed = CalculateStat(pokeApiData.Speed, dto.IvSpeed ?? 0, dto.EvSpeed, dto.CurrentLevel, false);
                dto.MaxHp = dto.CalculatedHp;
            }

            // Calculate IV total and rating
            dto.IvTotal = (dto.IvHp ?? 0) + (dto.IvAttack ?? 0) + (dto.IvDefense ?? 0) + 
                         (dto.IvSpecialAttack ?? 0) + (dto.IvSpecialDefense ?? 0) + (dto.IvSpeed ?? 0);
            dto.IvRating = GetIvRating(dto.IvTotal ?? 0);
            dto.EvTotal = dto.EvHp + dto.EvAttack + dto.EvDefense + 
                         dto.EvSpecialAttack + dto.EvSpecialDefense + dto.EvSpeed;
            
            // Win rate
            dto.WinRate = dto.TotalBattles > 0 
                ? Math.Round((decimal)dto.BattlesWon / dto.TotalBattles * 100, 1) 
                : 0;
            
            // Friendship level
            dto.FriendshipLevel = dto.Friendship switch
            {
                >= 220 => "Max",
                >= 160 => "High",
                >= 100 => "Medium",
                _ => "Low"
            };

            // Experience to next level
            dto.ExperienceToNextLevel = GetExpForNextLevel(dto.CurrentLevel) - dto.CurrentExperience;
            
            // Time since caught
            dto.TimeSinceCaught = DateTime.UtcNow - dto.CaughtDate;

            return dto;
        }

        private int CalculateStat(int baseStat, int iv, int ev, int level, bool isHp)
        {
            // Pokemon stat formula
            if (isHp)
            {
                return ((2 * baseStat + iv + ev / 4) * level / 100) + level + 10;
            }
            return (int)(((2 * baseStat + iv + ev / 4) * level / 100 + 5) * 1.0); // Neutral nature
        }

        private string CapitalizeFirst(string input)
        {
            if (string.IsNullOrEmpty(input)) return input;
            return char.ToUpper(input[0]) + input.Substring(1);
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

        public async Task<bool> UpdatePokemonNotesAsync(string userId, int userPokemonId, string notes)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId);

            if (userPokemon == null)
            {
                return false;
            }

            userPokemon.Notes = notes;
            userPokemon.LastInteractionDate = DateTime.UtcNow;
            await _unitOfWork.SaveChangesAsync();
            return true;
        }

        public async Task<int> SyncFromLocalStorageAsync(string userId, IEnumerable<LocalPokemonDto> localPokemon)
        {
            int syncedCount = 0;
            
            foreach (var local in localPokemon)
            {
                // Try to find Pokemon by name in PokeAPI
                var pokemonName = local.Name.ToLower().Trim();
                var pokeApiData = await _pokeApiService.GetPokemonAsync(pokemonName);
                
                if (pokeApiData == null) continue;

                // Check if user already has a Pokemon with this nickname
                var existingWithNickname = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                    up => up.UserId == userId && up.Nickname == local.Nickname);
                
                if (existingWithNickname != null) continue;

                // Create new UserPokemon
                var random = new Random();
                var userPokemon = new UserPokemon
                {
                    UserId = userId,
                    PokemonApiId = pokeApiData.Id,
                    Nickname = local.Nickname,
                    CaughtDate = DateTime.UtcNow,
                    CaughtLevel = 5,
                    CurrentLevel = 5,
                    IvHp = random.Next(32),
                    IvAttack = random.Next(32),
                    IvDefense = random.Next(32),
                    IvSpecialAttack = random.Next(32),
                    IvSpecialDefense = random.Next(32),
                    IvSpeed = random.Next(32),
                    Friendship = 70,
                    CurrentHp = 100
                };

                await _unitOfWork.UserPokemon.AddAsync(userPokemon);
                syncedCount++;
            }

            if (syncedCount > 0)
            {
                // Update user stats
                var user = await _userManager.FindByIdAsync(userId);
                if (user != null)
                {
                    user.PokemonCaught += syncedCount;
                    var allPokemon = await _unitOfWork.UserPokemon.FindAsync(up => up.UserId == userId);
                    user.UniquePokemonCaught = allPokemon.Select(up => up.PokemonApiId).Distinct().Count();
                    await _userManager.UpdateAsync(user);
                }
                
                await _unitOfWork.SaveChangesAsync();
            }

            return syncedCount;
        }
    }
}
