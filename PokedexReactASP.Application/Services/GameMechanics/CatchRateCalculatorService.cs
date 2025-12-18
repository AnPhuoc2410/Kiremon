using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Services.GameMechanics
{
    /// <summary>
    /// Server-authoritative catch rate calculation.
    /// Uses official Pokemon catch formula with MMO modifications.
    /// Leverages PokeAPI species data: capture_rate, is_legendary, is_mythical
    /// </summary>
    

    /// <summary>
    /// Context for catch calculation
    /// </summary>
    public record CatchCalculationContext(
        // From PokeAPI Species
        int BaseCaptureRate,    // capture_rate: 3-255
        bool IsLegendary,       // is_legendary
        bool IsMythical,        // is_mythical
        bool IsBaby,            // is_baby (easier to catch)
        
        // Pokemon state
        int PokemonLevel,
        int CurrentHp,          // Current HP
        int MaxHp,              // Max HP
        string? StatusCondition, // sleep, freeze, paralysis, etc.
        
        // Player factors
        int TrainerLevel,
        PokeballType PokeballUsed,
        bool HasCaughtBefore,   // For Repeat Ball
        
        // Environment
        TimeOfDay TimeOfDay,
        LocationType LocationType,
        int TurnCount = 1);      // For Timer Ball

    /// <summary>
    /// Result of catch calculation
    /// </summary>
    public record CatchCalculationResult(
        CatchAttemptResult Result,
        int ShakeCount,          // 0-3 (3 = caught)
        double CatchRateUsed,
        string FailReason);

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

            // HP modifier: lower HP = easier catch
            double hpModifier = (3.0 * ctx.MaxHp - 2.0 * ctx.CurrentHp) / (3.0 * ctx.MaxHp);
            rate *= Math.Max(0.5, hpModifier);

            // Ball modifier
            rate *= GetBallModifier(ctx);

            // Status condition modifier
            rate *= GetStatusModifier(ctx.StatusCondition);

            // Trainer level scaling (MMO feature)
            // Higher level trainers have slightly better catch rates
            double levelBonus = 1.0 + (ctx.TrainerLevel / 200.0); // Max +50% at level 100
            rate *= levelBonus;

            // Level difference penalty (can't easily catch higher level Pokemon)
            int levelDiff = ctx.PokemonLevel - ctx.TrainerLevel;
            if (levelDiff > 0)
            {
                rate *= Math.Max(0.3, 1.0 - (levelDiff * 0.05)); // -5% per level above trainer
            }

            // Legendary/Mythical are harder in MMO context
            if (ctx.IsLegendary || ctx.IsMythical)
            {
                rate *= 0.5; // Half the calculated rate
            }

            // Baby Pokemon are easier
            if (ctx.IsBaby)
            {
                rate *= 1.5;
            }

            // Convert to percentage (cap at 95% for non-Master Ball)
            return Math.Min(95, (rate / 255.0) * 100);
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
            // Each shake has independent probability
            // Need all 3 shakes to succeed = caught
            double shakeProb = catchRate / 100.0;
            
            int shakes = 0;
            for (int i = 0; i < 3; i++)
            {
                if (Random.Shared.NextDouble() < shakeProb)
                {
                    shakes++;
                }
                else
                {
                    break; // Failed this shake
                }
            }

            // Final shake (critical catch) - slightly higher threshold
            if (shakes == 3 && Random.Shared.NextDouble() < shakeProb)
            {
                return (CatchAttemptResult.Success, 3);
            }
            else if (shakes == 3)
            {
                // So close!
                return (CatchAttemptResult.Escaped, 2);
            }

            // Small chance Pokemon flees (5% on fail, higher for legendary)
            if (shakes == 0 && Random.Shared.NextDouble() < 0.05)
            {
                return (CatchAttemptResult.Fled, 0);
            }

            return (CatchAttemptResult.Escaped, shakes);
        }
    }
}

