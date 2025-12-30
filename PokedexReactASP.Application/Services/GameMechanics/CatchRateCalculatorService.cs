using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Services.GameMechanics
{
    /// <summary>
    /// Server-authoritative catch rate calculation.
    /// Uses official Pokemon catch formula with MMO modifications.
    /// Leverages PokeAPI species data: capture_rate, is_legendary, is_mythical
    /// </summary>
    public class CatchRateCalculatorService : ICatchRateCalculatorService
    {
        /// <summary>
        /// Calculate catch using modified Gen 3+ formula
        /// 
        /// Formula: a = ((3*MaxHP - 2*CurrentHP) * BaseCatchRate * BallMod * StatusMod) / (3*MaxHP)
        /// Then: ShakeProb = 1048560 / sqrt(sqrt(16711680/a))
        /// 
        /// For MMO: We simplify and add trainer level scaling
        /// </summary>
        public CatchCalculationResult CalculateCatch(CatchCalculationContext ctx)
        {
            // Master Ball: instant catch
            if (ctx.PokeballUsed == PokeballType.MasterBall)
            {
                return new CatchCalculationResult(
                    CatchAttemptResult.Success, 
                    ShakeCount: 3,
                    CatchRateUsed: 100,
                    FailReason: string.Empty);
            }

            // Calculate modified catch rate
            double catchRate = CalculateModifiedCatchRate(ctx);
            
            // Roll for catch
            var (result, shakes) = PerformCatchRoll(catchRate);

            string failReason = result switch
            {
                CatchAttemptResult.Escaped => shakes switch
                {
                    0 => "The Pokémon broke free immediately!",
                    1 => "Aww! It appeared to be caught!",
                    2 => "Aargh! Almost had it!",
                    _ => "So close!"
                },
                CatchAttemptResult.Fled => "The wild Pokémon fled!",
                _ => string.Empty
            };

            return new CatchCalculationResult(result, shakes, catchRate, failReason);
        }

        public double GetCatchRatePercent(CatchCalculationContext ctx)
        {
            if (ctx.PokeballUsed == PokeballType.MasterBall) return 100;
            return Math.Min(100, CalculateModifiedCatchRate(ctx));
        }

        private double CalculateModifiedCatchRate(CatchCalculationContext ctx)
        {
            // Base catch rate (0-255 from PokeAPI)
            double rate = ctx.BaseCaptureRate;

            // HP modifier: lower HP = easier catch (but we're at full HP in wild encounters)
            // At full HP: modifier = 1/3, which is harsh. Let's be more generous for casual play.
            double hpModifier = (3.0 * ctx.MaxHp - 2.0 * ctx.CurrentHp) / (3.0 * ctx.MaxHp);
            // Boost the HP modifier to make full HP catches more viable
            hpModifier = Math.Max(0.6, hpModifier * 1.5); 
            rate *= hpModifier;

            // Ball modifier
            rate *= GetBallModifier(ctx);

            // Status condition modifier
            rate *= GetStatusModifier(ctx.StatusCondition);

            // Trainer level scaling (MMO feature)
            // Higher level trainers have better catch rates
            double levelBonus = 1.0 + (ctx.TrainerLevel / 100.0); // Max +100% at level 100
            rate *= levelBonus;

            // Level difference penalty (can't easily catch higher level Pokemon)
            int levelDiff = ctx.PokemonLevel - ctx.TrainerLevel;
            if (levelDiff > 0)
            {
                rate *= Math.Max(0.5, 1.0 - (levelDiff * 0.03)); // -3% per level above trainer
            }
            else if (levelDiff < -10)
            {
                // Bonus for catching much lower level Pokemon
                rate *= 1.2;
            }

            // Legendary/Mythical are harder
            if (ctx.IsLegendary || ctx.IsMythical)
            {
                rate *= 0.6; // 40% reduction
            }

            // Baby Pokemon are easier
            if (ctx.IsBaby)
            {
                rate *= 1.5;
            }

            // Convert to percentage
            // Base formula: (rate / 255) * 100, but boost it for better UX
            double catchPercent = (rate / 255.0) * 100 * 1.3; // 30% boost for casual play
            
            // Cap at 95% for non-Master Ball, minimum 5%
            return Math.Clamp(catchPercent, 5, 95);
        }

        private double GetBallModifier(CatchCalculationContext ctx)
        {
            return ctx.PokeballUsed switch
            {
                PokeballType.Pokeball => 1.0,
                PokeballType.GreatBall => 1.5,
                PokeballType.UltraBall => 2.0,
                
                PokeballType.QuickBall => ctx.TurnCount == 1 ? 5.0 : 1.0,
                PokeballType.TimerBall => Math.Min(4.0, 1.0 + ctx.TurnCount * 0.3),
                PokeballType.DuskBall => ctx.TimeOfDay == TimeOfDay.Night || 
                                         ctx.LocationType == LocationType.Cave ? 3.0 : 1.0,
                PokeballType.NetBall => 3.5, // Would need type check
                PokeballType.NestBall => Math.Max(1.0, (41 - ctx.PokemonLevel) / 10.0),
                PokeballType.RepeatBall => ctx.HasCaughtBefore ? 3.5 : 1.0,
                PokeballType.LuxuryBall => 1.0,
                PokeballType.PremierBall => 1.0,
                PokeballType.HealBall => 1.0,
                
                _ => 1.0
            };
        }

        private static double GetStatusModifier(string? status)
        {
            return status?.ToLower() switch
            {
                "sleep" => 2.5,
                "freeze" => 2.5,
                "paralysis" => 1.5,
                "poison" => 1.5,
                "burn" => 1.5,
                _ => 1.0
            };
        }

        private static (CatchAttemptResult Result, int Shakes) PerformCatchRoll(double catchRate)
        {
            // Simplified catch formula for better UX
            // catchRate is already a percentage (0-95%)
            
            // Single roll to determine if caught
            double roll = Random.Shared.NextDouble() * 100;
            bool isCaught = roll < catchRate;
            
            if (isCaught)
            {
                // Caught! Show 3 shakes
                return (CatchAttemptResult.Success, 3);
            }
            
            // Failed - determine how many shakes based on how close we were
            // The closer the roll to catch rate, the more shakes
            double closeness = roll / Math.Max(1, catchRate); // How close was the roll?
            
            int shakes;
            if (closeness < 1.2) // Very close (within 20% of catch rate)
            {
                shakes = 2; // Almost had it!
            }
            else if (closeness < 1.8) // Somewhat close
            {
                shakes = 1; // Appeared to be caught
            }
            else
            {
                shakes = 0; // Broke free immediately
            }
            
            // Small chance Pokemon flees (3% base, higher for legendary at low catch rates)
            double fleeChance = catchRate < 20 ? 0.08 : 0.03;
            if (shakes == 0 && Random.Shared.NextDouble() < fleeChance)
            {
                return (CatchAttemptResult.Fled, 0);
            }

            return (CatchAttemptResult.Escaped, shakes);
        }
    }
}

