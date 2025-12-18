using AutoMapper;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Services
{
    public class PokemonEnricher : IPokemonEnricher
    {
        private readonly IPokemonCacheService _cacheService;
        private readonly IMapper _mapper;

        public PokemonEnricher(IPokemonCacheService cacheService, IMapper mapper)
        {
            _cacheService = cacheService;
            _mapper = mapper;
        }

        public async Task<UserPokemonDto> EnrichAsync(UserPokemon userPokemon)
        {
            var pokeApiData = await _cacheService.GetPokemonAsync(userPokemon.PokemonApiId);
            return EnrichWithCachedData(userPokemon, pokeApiData!);
        }

        public async Task<IReadOnlyList<UserPokemonDto>> EnrichBatchAsync(IEnumerable<UserPokemon> userPokemonList)
        {
            var pokemonList = userPokemonList.ToList();
            if (pokemonList.Count == 0)
            {
                return Array.Empty<UserPokemonDto>();
            }

            // Batch fetch all unique Pokemon data
            var uniqueApiIds = pokemonList.Select(p => p.PokemonApiId).Distinct();
            var pokeApiDataMap = await _cacheService.GetPokemonBatchAsync(uniqueApiIds);

            // Map using cached data
            var result = new List<UserPokemonDto>(pokemonList.Count);
            foreach (var userPokemon in pokemonList)
            {
                pokeApiDataMap.TryGetValue(userPokemon.PokemonApiId, out var pokeApiData);
                result.Add(EnrichWithCachedData(userPokemon, pokeApiData!));
            }

            return result;
        }

        public UserPokemonDto EnrichWithCachedData(UserPokemon userPokemon, PokeApiPokemon? pokeApiData)
        {
            // Use AutoMapper for basic fields
            var dto = _mapper.Map<UserPokemonDto>(userPokemon);

            // Enrich with PokeAPI data (runtime data, can't be mapped statically)
            if (pokeApiData != null)
            {
                EnrichFromPokeApi(dto, userPokemon, pokeApiData);
            }

            // Calculate derived fields
            CalculateDerivedFields(dto);

            return dto;
        }

        private static void EnrichFromPokeApi(UserPokemonDto dto, UserPokemon userPokemon, PokeApiPokemon pokeApiData)
        {
            dto.Name = pokeApiData.Name;
            dto.DisplayName = !string.IsNullOrEmpty(userPokemon.Nickname)
                ? userPokemon.Nickname
                : CapitalizeFirst(pokeApiData.Name);
            dto.Type1 = pokeApiData.Type1;
            dto.Type2 = pokeApiData.Type2;
            dto.Height = pokeApiData.Height;
            dto.Weight = pokeApiData.Weight;

            // Sprite: shiny vs normal
            dto.SpriteUrl = userPokemon.IsShiny
                ? pokeApiData.Sprites?.Front_Shiny ?? pokeApiData.Sprites?.Front_Default ?? ""
                : pokeApiData.Sprites?.Front_Default ?? "";
            dto.OfficialArtworkUrl = pokeApiData.Sprites?.Other?.Official_Artwork?.Front_Default;

            dto.Abilities = pokeApiData.Abilities?.Select(a => a.Ability.Name).ToList() ?? [];

            // Base stats
            dto.BaseHp = pokeApiData.Hp;
            dto.BaseAttack = pokeApiData.Attack;
            dto.BaseDefense = pokeApiData.Defense;
            dto.BaseSpecialAttack = pokeApiData.SpecialAttack;
            dto.BaseSpecialDefense = pokeApiData.SpecialDefense;
            dto.BaseSpeed = pokeApiData.Speed;
            dto.BaseStatTotal = pokeApiData.Hp + pokeApiData.Attack + pokeApiData.Defense +
                               pokeApiData.SpecialAttack + pokeApiData.SpecialDefense + pokeApiData.Speed;

            // Calculated stats (Pokemon formula)
            dto.CalculatedHp = CalculateStat(pokeApiData.Hp, dto.IvHp ?? 0, dto.EvHp, dto.CurrentLevel, isHp: true);
            dto.CalculatedAttack = CalculateStat(pokeApiData.Attack, dto.IvAttack ?? 0, dto.EvAttack, dto.CurrentLevel, isHp: false);
            dto.CalculatedDefense = CalculateStat(pokeApiData.Defense, dto.IvDefense ?? 0, dto.EvDefense, dto.CurrentLevel, isHp: false);
            dto.CalculatedSpecialAttack = CalculateStat(pokeApiData.SpecialAttack, dto.IvSpecialAttack ?? 0, dto.EvSpecialAttack, dto.CurrentLevel, isHp: false);
            dto.CalculatedSpecialDefense = CalculateStat(pokeApiData.SpecialDefense, dto.IvSpecialDefense ?? 0, dto.EvSpecialDefense, dto.CurrentLevel, isHp: false);
            dto.CalculatedSpeed = CalculateStat(pokeApiData.Speed, dto.IvSpeed ?? 0, dto.EvSpeed, dto.CurrentLevel, isHp: false);
            dto.MaxHp = dto.CalculatedHp;
        }

        private static void CalculateDerivedFields(UserPokemonDto dto)
        {
            // IV calculations
            dto.IvTotal = (dto.IvHp ?? 0) + (dto.IvAttack ?? 0) + (dto.IvDefense ?? 0) +
                         (dto.IvSpecialAttack ?? 0) + (dto.IvSpecialDefense ?? 0) + (dto.IvSpeed ?? 0);
            dto.IvRating = GetIvRating(dto.IvTotal ?? 0);

            // EV calculations
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
        }

        /// <summary>
        /// Official Pokemon stat calculation formula
        /// </summary>
        private static int CalculateStat(int baseStat, int iv, int ev, int level, bool isHp)
        {
            if (isHp)
            {
                return ((2 * baseStat + iv + ev / 4) * level / 100) + level + 10;
            }
            // Neutral nature (1.0 multiplier)
            return (int)(((2 * baseStat + iv + ev / 4) * level / 100 + 5) * 1.0);
        }

        private static string GetIvRating(int ivTotal) => ivTotal switch
        {
            >= 186 => "Perfect",  // 31 * 6 = 186
            >= 150 => "Amazing",
            >= 120 => "Great",
            >= 90 => "Good",
            >= 60 => "Decent",
            _ => "Not great"
        };

        private static int GetExpForNextLevel(int currentLevel) => 1000 + (currentLevel * 100);

        private static string CapitalizeFirst(string input) =>
            string.IsNullOrEmpty(input) ? input : char.ToUpper(input[0]) + input[1..];
    }
}
