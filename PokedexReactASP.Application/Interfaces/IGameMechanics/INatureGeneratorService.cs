using PokedexReactASP.Application.Models.GameMechanics;
using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Interfaces.IGameMechanics
{
    public interface INatureGeneratorService
    {
        /// <summary>
        /// Generate a random nature
        /// </summary>
        Nature GenerateNature(NatureGenerationContext? context = null);

        /// <summary>
        /// Get nature stat modifiers
        /// </summary>
        NatureModifiers GetModifiers(Nature nature);

        /// <summary>
        /// Get nature display name
        /// </summary>
        string GetDisplayName(Nature nature);
    }
}
