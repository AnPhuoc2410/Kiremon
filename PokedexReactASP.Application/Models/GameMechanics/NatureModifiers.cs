namespace PokedexReactASP.Application.Models.GameMechanics
{
    /// <summary>
    /// Stat modifiers for a nature (+10%/-10%)
    /// </summary>
    public record NatureModifiers(
        string? IncreasedStat,
        string? DecreasedStat,
        double AttackMod,
        double DefenseMod,
        double SpAttackMod,
        double SpDefenseMod,
        double SpeedMod);
}
