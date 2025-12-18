namespace PokedexReactASP.Application.Models.GameMechanics
{
    /// <summary>
    /// Context for IV generation - affects distribution
    /// </summary>
    public record IVGenerationContext(
        int TrainerLevel,
        bool IsLegendary,
        bool IsMythical,
        bool IsShiny,
        bool HasShinyCharm,
        int CatchStreak);
}
