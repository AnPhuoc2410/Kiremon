using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Services.GameMechanics
{
    /// <summary>
    /// Server-authoritative IV generation with MMO-friendly distribution.
    /// IVs are NEVER sent from client - always generated server-side.
    /// </summary>
    

    /// <summary>
    /// Complete IV set for a Pokemon (0-31 each)
    /// </summary>
    public record IVSet(
        int Hp,
        int Attack,
        int Defense,
        int SpecialAttack,
        int SpecialDefense,
        int Speed)
    {
        public int Total => Hp + Attack + Defense + SpecialAttack + SpecialDefense + Speed;
        public double Percentage => Total / 186.0 * 100;

        public (string Name, int Value) GetBestStat()
        {
            var stats = new[] 
            { 
                ("HP", Hp), 
                ("Attack", Attack), 
                ("Defense", Defense),
                ("Sp. Attack", SpecialAttack),
                ("Sp. Defense", SpecialDefense),
                ("Speed", Speed)
            };
            return stats.MaxBy(s => s.Item2);
        }

        public string GetVerdict() => Total switch
        {
            >= 186 => "Perfect!",
            >= 170 => "Outstanding!",
            >= 150 => "Amazing",
            >= 120 => "Great",
            >= 90 => "Good",
            >= 60 => "Decent",
            _ => "Not bad"
        };
    }

    /// <summary>
    /// Context for IV generation - affects distribution
    /// </summary>
    public record IVGenerationContext(
        int TrainerLevel,
        bool IsLegendary,
        bool IsMythical,
        bool IsShiny,
        bool HasShinyCharm,
        int CatchStreak);  // Consecutive catches of same species

    public class IVGeneratorService : IIVGeneratorService
    {
        /// <summary>
        /// MMO-friendly IV distribution:
        /// - 3% chance for perfect 31
        /// - 17% chance for 25-30 (excellent)
        /// - 40% chance for 15-24 (good)
        /// - 40% chance for 0-14 (common)
        /// 
        /// Bonuses:
        /// - Legendary/Mythical: guaranteed 3 IVs at 25+
        /// - Shiny: +5 to lowest IV
        /// - High trainer level: slight boost to distribution
        /// - Catch streak: cumulative bonus
        /// </summary>
        public IVSet GenerateIVs(IVGenerationContext context)
        {
            var ivs = new int[6];

            // Generate base IVs
            for (int i = 0; i < 6; i++)
            {
                ivs[i] = RollSingleIV(context.TrainerLevel, context.CatchStreak);
            }

            // Legendary/Mythical guarantee: 3 perfect IVs minimum
            if (context.IsLegendary || context.IsMythical)
            {
                var indices = Enumerable.Range(0, 6).OrderBy(_ => Random.Shared.Next()).Take(3);
                foreach (var idx in indices)
                {
                    ivs[idx] = Math.Max(ivs[idx], Random.Shared.Next(25, 32));
                }
            }

            // Shiny bonus: boost lowest IV
            if (context.IsShiny)
            {
                var minIndex = Array.IndexOf(ivs, ivs.Min());
                ivs[minIndex] = Math.Min(31, ivs[minIndex] + 5);
            }

            return new IVSet(ivs[0], ivs[1], ivs[2], ivs[3], ivs[4], ivs[5]);
        }

        /// <summary>
        /// Roll a single IV with MMO-friendly distribution
        /// </summary>
        private static int RollSingleIV(int trainerLevel, int catchStreak)
        {
            // Trainer level bonus (max +5% to excellent tier)
            double levelBonus = Math.Min(trainerLevel / 100.0 * 0.05, 0.05);
            
            // Catch streak bonus (each streak adds 0.5% to excellent, max 5%)
            double streakBonus = Math.Min(catchStreak * 0.005, 0.05);

            double roll = Random.Shared.NextDouble();
            
            // Adjust thresholds based on bonuses
            double perfectThreshold = 0.03 + levelBonus + streakBonus;
            double excellentThreshold = 0.20 + levelBonus + streakBonus;
            double goodThreshold = 0.60;

            if (roll < perfectThreshold)
            {
                return 31; // Perfect!
            }
            if (roll < excellentThreshold)
            {
                return Random.Shared.Next(25, 31); // Excellent (25-30)
            }
            if (roll < goodThreshold)
            {
                return Random.Shared.Next(15, 25); // Good (15-24)
            }
            return Random.Shared.Next(0, 15); // Common (0-14)
        }

        /// <summary>
        /// Calculate Pokemon rank based on IVs and Nature synergy
        /// </summary>
        public PokemonRank CalculateRank(IVSet ivs, Nature nature)
        {
            double ivPercent = ivs.Percentage;
            
            // Nature synergy bonus: +5% if nature boosts Pokemon's best stat
            double natureBonus = GetNatureSynergyBonus(ivs, nature);
            double totalPercent = Math.Min(100, ivPercent + natureBonus);

            return totalPercent switch
            {
                >= 95 => PokemonRank.SS,
                >= 90 => PokemonRank.S,
                >= 80 => PokemonRank.A,
                >= 65 => PokemonRank.B,
                >= 50 => PokemonRank.C,
                _ => PokemonRank.D
            };
        }

        private static double GetNatureSynergyBonus(IVSet ivs, Nature nature)
        {
            var (_, boostedStat) = GetNatureEffects(nature);
            if (boostedStat == null) return 0;

            var bestStat = ivs.GetBestStat().Name;
            
            // If nature boosts the Pokemon's best IV stat, bonus!
            return boostedStat == bestStat ? 5.0 : 0;
        }

        private static (string? Decreased, string? Increased) GetNatureEffects(Nature nature)
        {
            return nature switch
            {
                Nature.Lonely => ("Defense", "Attack"),
                Nature.Brave => ("Speed", "Attack"),
                Nature.Adamant => ("Sp. Attack", "Attack"),
                Nature.Naughty => ("Sp. Defense", "Attack"),
                
                Nature.Bold => ("Attack", "Defense"),
                Nature.Relaxed => ("Speed", "Defense"),
                Nature.Impish => ("Sp. Attack", "Defense"),
                Nature.Lax => ("Sp. Defense", "Defense"),
                
                Nature.Timid => ("Attack", "Speed"),
                Nature.Hasty => ("Defense", "Speed"),
                Nature.Jolly => ("Sp. Attack", "Speed"),
                Nature.Naive => ("Sp. Defense", "Speed"),
                
                Nature.Modest => ("Attack", "Sp. Attack"),
                Nature.Mild => ("Defense", "Sp. Attack"),
                Nature.Quiet => ("Speed", "Sp. Attack"),
                Nature.Rash => ("Sp. Defense", "Sp. Attack"),
                
                Nature.Calm => ("Attack", "Sp. Defense"),
                Nature.Gentle => ("Defense", "Sp. Defense"),
                Nature.Sassy => ("Speed", "Sp. Defense"),
                Nature.Careful => ("Sp. Attack", "Sp. Defense"),
                
                _ => (null, null) // Neutral natures
            };
        }
    }
}

