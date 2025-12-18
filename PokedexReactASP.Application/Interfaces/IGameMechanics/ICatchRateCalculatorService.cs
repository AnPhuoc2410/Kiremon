using PokedexReactASP.Application.Services.GameMechanics;

namespace PokedexReactASP.Application.Interfaces.IGameMechanics
{
    public interface ICatchRateCalculatorService
    {
        /// <summary>
        /// Calculate catch attempt result
        /// </summary>
        CatchCalculationResult CalculateCatch(CatchCalculationContext context);

        /// <summary>
        /// Get catch rate percentage for display
        /// </summary>
        double GetCatchRatePercent(CatchCalculationContext context);
    }
}
