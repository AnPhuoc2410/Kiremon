using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Interfaces.IGameMechanics
{
    public interface IIVGeneratorService
    {
        /// <summary>
        /// Generate a complete IV set for a Pokemon
        /// </summary>
        IVSet GenerateIVs(IVGenerationContext context);

        /// <summary>
        /// Calculate Pokemon rank based on IVs and Nature
        /// </summary>
        PokemonRank CalculateRank(IVSet ivs, Nature nature);
    }
}
