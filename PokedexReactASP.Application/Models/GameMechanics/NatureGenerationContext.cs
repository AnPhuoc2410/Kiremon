using PokedexReactASP.Domain.Enums;

namespace PokedexReactASP.Application.Models.GameMechanics
{
    /// <summary>
    /// Context for nature generation (for future features like Synchronize)
    /// </summary>
    public record NatureGenerationContext(
        Nature? SynchronizeNature = null,  // Ability that passes nature
        bool HasEverstone = false);
}
