using PokedexReactASP.Application.Common.Helpers;
using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Domain.Entities;
using PokedexReactASP.Domain.Enums;
using PokedexReactASP.Application.Services;

namespace PokedexReactASP.Application.Services.GameMechanics
{
    /// <summary>
    /// This is the ONLY place where UserPokemon entities are created.
    /// </summary>
    public class PokemonFactoryService : IPokemonFactoryService
    {
        private readonly IIVGeneratorService _ivGenerator;
        private readonly IShinyRollerService _shinyRoller;
        private readonly INatureGeneratorService _natureGenerator;

        public PokemonFactoryService(
            IIVGeneratorService ivGenerator,
            IShinyRollerService shinyRoller,
            INatureGeneratorService natureGenerator)
        {
            _ivGenerator = ivGenerator;
            _shinyRoller = shinyRoller;
            _natureGenerator = natureGenerator;
        }

        public async Task<PokemonCreationResult> CreateCaughtPokemonAsync(PokemonCreationContext ctx)
        {
            // 1. Determine level
            int level = CalculateWildPokemonLevel(ctx.TrainerLevel, ctx.IsLegendary, ctx.IsMythical);

            // 2. Roll for shiny
            var shinyContext = new ShinyRollContext(
                TrainerLevel: ctx.TrainerLevel,
                HasShinyCharm: ctx.HasShinyCharm,
                CatchStreak: ctx.CatchStreak,
                TotalCaught: ctx.TotalPokemonCaught,
                IsEventPokemon: false);
            bool isShiny = _shinyRoller.RollShiny(shinyContext);

            // 3. Generate IVs
            var ivContext = new IVGenerationContext(
                TrainerLevel: ctx.TrainerLevel,
                IsLegendary: ctx.IsLegendary,
                IsMythical: ctx.IsMythical,
                IsShiny: isShiny,
                HasShinyCharm: ctx.HasShinyCharm,
                CatchStreak: ctx.CatchStreak);
            var ivs = _ivGenerator.GenerateIVs(ivContext);

            // 4. Generate Nature
            var nature = _natureGenerator.GenerateNature();

            // 5. Determine Gender
            var gender = RollGender(ctx.GenderRate);

            // 6. Calculate rank
            var rank = _ivGenerator.CalculateRank(ivs, nature);

            // 7. Calculate EXP gained
            int expGained = CalculateCatchExp(ctx.BaseExperience, level, isShiny, ctx.IsLegendary, ctx.IsMythical);

            // 7.5 Roll Ability
            string chosenAbility = RollAbility(ctx.Abilities);

            // 8. Create entity
            var pokemon = new UserPokemon
            {
                UserId = ctx.UserId,
                PokemonApiId = ctx.PokemonApiId,
                Nickname = ctx.Nickname,
                CaughtLocation = ctx.CaughtLocation,
                CaughtLevel = level,
                CurrentLevel = level,
                IsShiny = isShiny,
                CaughtDate = DateTime.UtcNow,
                LastInteractionDate = DateTime.UtcNow,
                Ability = chosenAbility,

                // Server-generated IVs
                IvHp = ivs.Hp,
                IvAttack = ivs.Attack,
                IvDefense = ivs.Defense,
                IvSpecialAttack = ivs.SpecialAttack,
                IvSpecialDefense = ivs.SpecialDefense,
                IvSpeed = ivs.Speed,

                // EVs start at 0
                EvHp = 0,
                EvAttack = 0,
                EvDefense = 0,
                EvSpecialAttack = 0,
                EvSpecialDefense = 0,
                EvSpeed = 0,

                // Initial stats
                Friendship = ctx.IsBaby ? 140 : 70,
                CurrentHp = 100,
                CurrentExperience = 0,
                
                Notes = $"Nature: {nature}",
                Nature = nature,
            };

            // 9. Create display DTO
            var displayDto = new CaughtPokemonDto
            {
                Id = pokemon.Id, // Will be set after save
                PokemonApiId = ctx.PokemonApiId,
                Name = ctx.PokemonName,
                DisplayName = ctx.Nickname ?? PokemonNameHelper.CapitalizeFirst(ctx.PokemonName),
                Nickname = ctx.Nickname,
                SpriteUrl = isShiny ? (ctx.ShinySpriteUrl ?? ctx.SpriteUrl) : ctx.SpriteUrl,
                Type1 = ctx.Type1,
                Type2 = ctx.Type2,

                // The exciting reveal!
                IsShiny = isShiny,
                Level = level,
                Nature = nature,
                Gender = gender,

                // IV Summary
                Rank = rank,
                RankDisplay = GetRankDisplay(rank),
                IvTotal = ivs.Total,
                IvPercent = Math.Round(ivs.Percentage, 1),
                IvVerdict = ivs.GetVerdict(),
                BestStatName = ivs.GetBestStat().Name,
                BestStatIv = ivs.GetBestStat().Value,

                // Catch details
                CaughtDate = pokemon.CaughtDate,
                CaughtLocation = ctx.CaughtLocation,
                CaughtBall = ctx.CaughtBall,

                // Rarity
                IsLegendary = ctx.IsLegendary,
                IsMythical = ctx.IsMythical,
                IsUltraBeast = false, // Would need to check species
                Ability = chosenAbility
            };

            return await Task.FromResult(new PokemonCreationResult(
                Pokemon: pokemon,
                DisplayDto: displayDto,
                ExpGained: expGained,
                IsNewSpecies: false));
        }

        /// <summary>
        /// Wild Pokemon level scales with trainer level
        /// - Can be up to trainer level + 5
        /// - Minimum is max(1, trainer level - 10)
        /// - Legendary/Mythical: always trainer level + 5
        /// </summary>
        public int CalculateWildPokemonLevel(int trainerLevel, bool isLegendary, bool isMythical)
        {
            if (isLegendary || isMythical)
            {
                // Legendary/Mythical are always challenging
                return Math.Min(100, trainerLevel + 5);
            }

            int minLevel = Math.Max(1, trainerLevel - 10);
            int maxLevel = Math.Min(100, trainerLevel + 5);

            // Weighted toward trainer level (bell curve)
            int baseLevel = trainerLevel;
            int variance = Random.Shared.Next(-5, 6); // -5 to +5
            
            return Math.Clamp(baseLevel + variance, minLevel, maxLevel);
        }

        /// <summary>
        /// Calculate EXP gained from catch
        /// Scales with level, rarity, and shiny status
        /// </summary>
        private static int CalculateCatchExp(int baseExp, int level, bool isShiny, bool isLegendary, bool isMythical)
        {
            double exp = baseExp;
            
            // Level scaling: higher level = more exp
            exp *= 1 + (level / 50.0);
            
            // Rarity multipliers
            if (isMythical) exp *= 3.0;
            else if (isLegendary) exp *= 2.0;
            
            // Shiny bonus
            if (isShiny) exp *= 1.5;

            return (int)Math.Round(Math.Max(50, exp));
        }

        /// <summary>
        /// Roll gender based on PokeAPI gender_rate
        /// -1 = genderless
        /// 0 = always male
        /// 8 = always female
        /// 1-7 = female probability in eighths
        /// </summary>
        private static PokemonGender RollGender(int genderRate)
        {
            if (genderRate == -1) return PokemonGender.Genderless;
            if (genderRate == 0) return PokemonGender.Male;
            if (genderRate == 8) return PokemonGender.Female;

            // genderRate is female probability in eighths
            // e.g., genderRate = 1 means 1/8 (12.5%) female
            double femaleProbability = genderRate / 8.0;
            return Random.Shared.NextDouble() < femaleProbability 
                ? PokemonGender.Female 
                : PokemonGender.Male;
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

        private static string CapitalizeFirst(string input) => PokemonNameHelper.CapitalizeFirst(input);

        private static string RollAbility(List<PokeApiAbility> abilities)
        {
            if (abilities == null || abilities.Count == 0)
            {
                return "Unknown";
            }

            var hiddenAbilities = abilities.Where(a => a.Is_Hidden).ToList();
            var normalAbilities = abilities.Where(a => !a.Is_Hidden).ToList();

            // If there are only hidden or only normal, just roll uniformly
            if (hiddenAbilities.Count == 0)
            {
                var rolled = normalAbilities[Random.Shared.Next(normalAbilities.Count)];
                return rolled.Ability.Name;
            }
            if (normalAbilities.Count == 0)
            {
                var rolled = hiddenAbilities[Random.Shared.Next(hiddenAbilities.Count)];
                return rolled.Ability.Name;
            }

            // Standard: 10% chance for Hidden Ability
            bool getHidden = Random.Shared.NextDouble() < 0.10;
            if (getHidden)
            {
                var rolled = hiddenAbilities[Random.Shared.Next(hiddenAbilities.Count)];
                return rolled.Ability.Name;
            }
            else
            {
                var rolled = normalAbilities[Random.Shared.Next(normalAbilities.Count)];
                return rolled.Ability.Name;
            }
        }
    }
}

