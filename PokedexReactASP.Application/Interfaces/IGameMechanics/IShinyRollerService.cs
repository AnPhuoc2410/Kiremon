using PokedexReactASP.Application.Models.GameMechanics;

namespace PokedexReactASP.Application.Interfaces.IGameMechanics
{
    public interface IShinyRollerService
    {
        /// <summary>
        /// Roll for shiny status
        /// </summary>
        bool RollShiny(ShinyRollContext context);

        /// <summary>
        /// Get current shiny odds for display purposes
        /// </summary>
        double GetShinyOdds(ShinyRollContext context);
    }
}
