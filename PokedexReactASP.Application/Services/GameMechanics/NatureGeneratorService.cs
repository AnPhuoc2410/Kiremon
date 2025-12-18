using PokedexReactASP.Application.Interfaces.IGameMechanics;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Services.GameMechanics
{
    /// <summary>
    /// Server-authoritative Nature generation.
    /// Nature is NEVER trusted from client.
    /// </summary>
    

    /// <summary>
    /// Context for nature generation (for future features like Synchronize)
    /// </summary>
    public record NatureGenerationContext(
        Nature? SynchronizeNature = null,  // Ability that passes nature
        bool HasEverstone = false);         // Item that locks nature

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

    public class NatureGeneratorService : INatureGeneratorService
    {
        private static readonly Nature[] AllNatures = Enum.GetValues<Nature>();

        /// <summary>
        /// Generate a random nature
        /// Synchronize ability: 50% chance to pass nature
        /// </summary>
        public Nature GenerateNature(NatureGenerationContext? context = null)
        {
            // Synchronize ability effect
            if (context?.SynchronizeNature != null && Random.Shared.NextDouble() < 0.5)
            {
                return context.SynchronizeNature.Value;
            }

            // Pure random from all 25 natures
            return AllNatures[Random.Shared.Next(AllNatures.Length)];
        }

        /// <summary>
        /// Get stat modifiers for a nature
        /// </summary>
        public NatureModifiers GetModifiers(Nature nature)
        {
            var (decreased, increased) = GetNatureEffects(nature);

            return new NatureModifiers(
                IncreasedStat: increased,
                DecreasedStat: decreased,
                AttackMod: GetMod(increased, decreased, "Attack"),
                DefenseMod: GetMod(increased, decreased, "Defense"),
                SpAttackMod: GetMod(increased, decreased, "Sp. Attack"),
                SpDefenseMod: GetMod(increased, decreased, "Sp. Defense"),
                SpeedMod: GetMod(increased, decreased, "Speed")
            );
        }

        public string GetDisplayName(Nature nature)
        {
            var mods = GetModifiers(nature);
            if (mods.IncreasedStat == null)
            {
                return $"{nature} (Neutral)";
            }
            return $"{nature} (+{mods.IncreasedStat}, -{mods.DecreasedStat})";
        }

        private static double GetMod(string? increased, string? decreased, string stat)
        {
            if (increased == stat) return 1.1;
            if (decreased == stat) return 0.9;
            return 1.0;
        }

        private static (string? Decreased, string? Increased) GetNatureEffects(Nature nature)
        {
            return nature switch
            {
                // Attack+ natures
                Nature.Lonely => ("Defense", "Attack"),
                Nature.Brave => ("Speed", "Attack"),
                Nature.Adamant => ("Sp. Attack", "Attack"),
                Nature.Naughty => ("Sp. Defense", "Attack"),

                // Defense+ natures
                Nature.Bold => ("Attack", "Defense"),
                Nature.Relaxed => ("Speed", "Defense"),
                Nature.Impish => ("Sp. Attack", "Defense"),
                Nature.Lax => ("Sp. Defense", "Defense"),

                // Speed+ natures
                Nature.Timid => ("Attack", "Speed"),
                Nature.Hasty => ("Defense", "Speed"),
                Nature.Jolly => ("Sp. Attack", "Speed"),
                Nature.Naive => ("Sp. Defense", "Speed"),

                // Sp. Attack+ natures
                Nature.Modest => ("Attack", "Sp. Attack"),
                Nature.Mild => ("Defense", "Sp. Attack"),
                Nature.Quiet => ("Speed", "Sp. Attack"),
                Nature.Rash => ("Sp. Defense", "Sp. Attack"),

                // Sp. Defense+ natures
                Nature.Calm => ("Attack", "Sp. Defense"),
                Nature.Gentle => ("Defense", "Sp. Defense"),
                Nature.Sassy => ("Speed", "Sp. Defense"),
                Nature.Careful => ("Sp. Attack", "Sp. Defense"),

                // Neutral natures
                _ => (null, null)
            };
        }
    }
}

