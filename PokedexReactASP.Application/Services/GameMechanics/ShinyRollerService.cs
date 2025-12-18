using PokedexReactASP.Application.Interfaces.IGameMechanics;

namespace PokedexReactASP.Application.Services.GameMechanics
{
    /// <summary>
    /// Server-authoritative Shiny determination.
    /// Shiny status is NEVER trusted from client.
    /// </summary>
    

    /// <summary>
    /// Context for shiny roll - all factors that affect odds
    /// </summary>
    public record ShinyRollContext(
        int TrainerLevel,
        bool HasShinyCharm,
        int CatchStreak,        // Consecutive catches of same species
        int TotalCaught,        // Total Pokemon caught by trainer
        bool IsEventPokemon,    // Special event bonus
        int ChainFishing = 0);  // Chain fishing bonus

    public class ShinyRollerService : IShinyRollerService
    {
        // Base shiny rate: 1/4096 (Gen 6+ standard)
        private const int BaseShinyRate = 4096;
        
        // Shiny Charm: +2 rolls (effectively ~1/1365)
        private const int ShinyCharmBonus = 2;
        
        // Max bonus reduction from trainer level (caps at level 100)
        private const int MaxLevelBonus = 1000;
        
        // Catch streak bonus (per consecutive catch, max 31)
        private const int MaxStreakBonus = 31;

        /// <summary>
        /// MMO-friendly shiny roll:
        /// - Base rate: 1/4096
        /// - Trainer level bonus: up to 1/3096 at max level
        /// - Shiny Charm: roughly triples odds
        /// - Catch streak: up to +31 bonus rolls
        /// - Events: can double odds
        /// 
        /// This creates progression and excitement without breaking economy.
        /// </summary>
        public bool RollShiny(ShinyRollContext context)
        {
            int effectiveRate = CalculateEffectiveRate(context);
            int rolls = CalculateTotalRolls(context);

            // Roll multiple times (each roll is independent)
            for (int i = 0; i < rolls; i++)
            {
                if (Random.Shared.Next(effectiveRate) == 0)
                {
                    return true;
                }
            }

            return false;
        }

        /// <summary>
        /// Calculate actual shiny odds as percentage (for UI display)
        /// </summary>
        public double GetShinyOdds(ShinyRollContext context)
        {
            int effectiveRate = CalculateEffectiveRate(context);
            int rolls = CalculateTotalRolls(context);

            // Probability of at least one success = 1 - P(all failures)
            double failChance = Math.Pow(1.0 - (1.0 / effectiveRate), rolls);
            return (1.0 - failChance) * 100;
        }

        private int CalculateEffectiveRate(ShinyRollContext context)
        {
            // Base rate modified by trainer level
            // Level 1: 4096, Level 50: 3596, Level 100: 3096
            int levelReduction = (int)(context.TrainerLevel / 100.0 * MaxLevelBonus);
            return Math.Max(1000, BaseShinyRate - levelReduction);
        }

        private int CalculateTotalRolls(ShinyRollContext context)
        {
            int rolls = 1;

            // Shiny Charm: +2 rolls
            if (context.HasShinyCharm)
            {
                rolls += ShinyCharmBonus;
            }

            // Catch streak: +1 roll per consecutive catch (max 31)
            rolls += Math.Min(context.CatchStreak, MaxStreakBonus);

            // Chain fishing bonus
            if (context.ChainFishing > 0)
            {
                rolls += Math.Min(context.ChainFishing, 20);
            }

            // Event bonus: double all rolls
            if (context.IsEventPokemon)
            {
                rolls *= 2;
            }

            // Milestone bonuses
            rolls += GetMilestoneBonus(context.TotalCaught);

            return rolls;
        }

        /// <summary>
        /// Milestone bonuses to reward long-term players
        /// </summary>
        private static int GetMilestoneBonus(int totalCaught)
        {
            return totalCaught switch
            {
                >= 10000 => 5,  // Veteran trainer
                >= 5000 => 4,
                >= 1000 => 3,
                >= 500 => 2,
                >= 100 => 1,
                _ => 0
            };
        }
    }
}

