namespace PokedexReactASP.Application.Models.GameMechanics
{
    /// <summary>
    /// Context for shiny roll - all factors that affect odds
    /// </summary>
    public record ShinyRollContext(
        int TrainerLevel,
        bool HasShinyCharm,
        int CatchStreak,        // Consecutive catches of same species
        int TotalCaught,        // Total Pokemon caught by trainer
        bool IsEventPokemon,    // Special event bonus
        int ChainFishing = 0);
}
