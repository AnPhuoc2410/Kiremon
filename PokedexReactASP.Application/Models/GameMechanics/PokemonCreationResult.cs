using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Models.GameMechanics
{
    /// <summary>
    /// Result of Pokemon creation
    /// </summary>
    public record PokemonCreationResult(
        UserPokemon Pokemon,
        CaughtPokemonDto DisplayDto,
        int ExpGained,
        bool IsNewSpecies);
}
