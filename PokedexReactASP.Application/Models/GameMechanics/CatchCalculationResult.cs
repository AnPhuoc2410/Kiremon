using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Models.GameMechanics
{
    /// <summary>
    /// Result of catch calculation
    /// </summary>
    public record CatchCalculationResult(
        CatchAttemptResult Result,
        int ShakeCount,          // 0-3 (3 = caught)
        double CatchRateUsed,
        string FailReason);
}
