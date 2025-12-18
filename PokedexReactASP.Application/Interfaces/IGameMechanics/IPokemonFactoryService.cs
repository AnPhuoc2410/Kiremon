using PokedexReactASP.Application.Services.GameMechanics;

namespace PokedexReactASP.Application.Interfaces.IGameMechanics
{
    public interface IPokemonFactoryService
    {
        /// <summary>
        /// Create a new caught Pokemon with all server-determined values
        /// </summary>
        Task<PokemonCreationResult> CreateCaughtPokemonAsync(PokemonCreationContext context);

        /// <summary>
        /// Calculate what level a wild Pokemon should be
        /// </summary>
        int CalculateWildPokemonLevel(int trainerLevel, bool isLegendary, bool isMythical);
    }
}
