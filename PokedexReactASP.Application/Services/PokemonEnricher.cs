using AutoMapper;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Services
{
    public class PokemonEnricher : IPokemonEnricherService
    {
        private readonly IPokemonCacheService _cacheService;
        private readonly IMapper _mapper;
        private readonly INatureGeneratorService _natureService;

        public PokemonEnricher(
            IPokemonCacheService cacheService,
            IMapper mapper,
            INatureGeneratorService natureService)
        {
            _cacheService = cacheService;
            _mapper = mapper;
            _natureService = natureService;
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

            var uniqueApiIds = pokemonList.Select(p => p.PokemonApiId).Distinct();
            var pokeApiDataMap = await _cacheService.GetPokemonBatchAsync(uniqueApiIds);

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
            var dto = _mapper.Map<UserPokemonDto>(userPokemon);

            // Enrich with server-determined display values
            EnrichServerDeterminedFields(dto, userPokemon);

            if (pokeApiData != null)
            {
                EnrichFromPokeApi(dto, userPokemon, pokeApiData);
            }

            CalculateDerivedFields(dto);

            return dto;
        }

        private void EnrichServerDeterminedFields(UserPokemonDto dto, UserPokemon userPokemon)
        {
            // Nature display
            dto.Nature = userPokemon.Nature;
            dto.NatureDisplay = _natureService.GetDisplayName(userPokemon.Nature);

            // Gender display
            dto.Gender = userPokemon.Gender;
            dto.GenderDisplay = userPokemon.Gender switch
            {
                PokemonGender.Male => "♂",
                PokemonGender.Female => "♀",
                _ => "⚲"
            };

            // Caught ball
            dto.CaughtBall = userPokemon.CaughtBall;

            // Calculate rank based on IVs
            int ivTotal = userPokemon.IvTotal;
            dto.Rank = CalculateRank(ivTotal);
            dto.RankDisplay = GetRankDisplay(dto.Rank);
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

            // Calculated stats (Pokemon formula with nature modifier)
            dto.CalculatedHp = CalculateStat(pokeApiData.Hp, dto.IvHp ?? 0, dto.EvHp, dto.CurrentLevel, isHp: true, 1.0);
            dto.CalculatedAttack = CalculateStatWithNature(pokeApiData.Attack, dto.IvAttack ?? 0, dto.EvAttack, dto.CurrentLevel, userPokemon.Nature, "Attack");
            dto.CalculatedDefense = CalculateStatWithNature(pokeApiData.Defense, dto.IvDefense ?? 0, dto.EvDefense, dto.CurrentLevel, userPokemon.Nature, "Defense");
            dto.CalculatedSpecialAttack = CalculateStatWithNature(pokeApiData.SpecialAttack, dto.IvSpecialAttack ?? 0, dto.EvSpecialAttack, dto.CurrentLevel, userPokemon.Nature, "SpAtk");
            dto.CalculatedSpecialDefense = CalculateStatWithNature(pokeApiData.SpecialDefense, dto.IvSpecialDefense ?? 0, dto.EvSpecialDefense, dto.CurrentLevel, userPokemon.Nature, "SpDef");
            dto.CalculatedSpeed = CalculateStatWithNature(pokeApiData.Speed, dto.IvSpeed ?? 0, dto.EvSpeed, dto.CurrentLevel, userPokemon.Nature, "Speed");
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
        /// Pokemon stat calculation formula (HP)
        /// </summary>
        private static int CalculateStat(int baseStat, int iv, int ev, int level, bool isHp, double natureMod)
        {
            if (isHp)
            {
                return ((2 * baseStat + iv + ev / 4) * level / 100) + level + 10;
            }
            return (int)(((2 * baseStat + iv + ev / 4) * level / 100 + 5) * natureMod);
        }

        /// <summary>
        /// Calculate stat with nature modifier
        /// </summary>
        private static int CalculateStatWithNature(int baseStat, int iv, int ev, int level, Nature nature, string statName)
        {
            double natureMod = GetNatureModifier(nature, statName);
            return CalculateStat(baseStat, iv, ev, level, false, natureMod);
        }

        private static double GetNatureModifier(Nature nature, string statName)
        {
            var (decreased, increased) = GetNatureEffects(nature);
            if (increased == statName) return 1.1;
            if (decreased == statName) return 0.9;
            return 1.0;
        }

        private static (string? Decreased, string? Increased) GetNatureEffects(Nature nature)
        {
            return nature switch
            {
                Nature.Lonely => ("Defense", "Attack"),
                Nature.Brave => ("Speed", "Attack"),
                Nature.Adamant => ("SpAtk", "Attack"),
                Nature.Naughty => ("SpDef", "Attack"),

                Nature.Bold => ("Attack", "Defense"),
                Nature.Relaxed => ("Speed", "Defense"),
                Nature.Impish => ("SpAtk", "Defense"),
                Nature.Lax => ("SpDef", "Defense"),

                Nature.Timid => ("Attack", "Speed"),
                Nature.Hasty => ("Defense", "Speed"),
                Nature.Jolly => ("SpAtk", "Speed"),
                Nature.Naive => ("SpDef", "Speed"),

                Nature.Modest => ("Attack", "SpAtk"),
                Nature.Mild => ("Defense", "SpAtk"),
                Nature.Quiet => ("Speed", "SpAtk"),
                Nature.Rash => ("SpDef", "SpAtk"),

                Nature.Calm => ("Attack", "SpDef"),
                Nature.Gentle => ("Defense", "SpDef"),
                Nature.Sassy => ("Speed", "SpDef"),
                Nature.Careful => ("SpAtk", "SpDef"),

                _ => (null, null)
            };
        }

        private static PokemonRank CalculateRank(int ivTotal)
        {
            double percent = ivTotal / 186.0 * 100;
            return percent switch
            {
                >= 95 => PokemonRank.SS,
                >= 90 => PokemonRank.S,
                >= 80 => PokemonRank.A,
                >= 65 => PokemonRank.B,
                >= 50 => PokemonRank.C,
                _ => PokemonRank.D
            };
        }

        private static string GetRankDisplay(PokemonRank rank) => rank switch
        {
            PokemonRank.SS => "✨ SS Rank! ✨",
            PokemonRank.S => "⭐ S Rank!",
            PokemonRank.A => "A Rank",
            PokemonRank.B => "B Rank",
            PokemonRank.C => "C Rank",
            _ => "D Rank"
        };

        private static string GetIvRating(int ivTotal) => ivTotal switch
        {
            >= 186 => "Perfect!",
            >= 170 => "Outstanding!",
            >= 150 => "Amazing",
            >= 120 => "Great",
            >= 90 => "Good",
            >= 60 => "Decent",
            _ => "Not bad"
        };

        private static int GetExpForNextLevel(int currentLevel) => 1000 + (currentLevel * 100);

        private static string CapitalizeFirst(string input) =>
            string.IsNullOrEmpty(input) ? input : char.ToUpper(input[0]) + input[1..];
    }
}
