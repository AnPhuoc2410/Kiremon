using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Services;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Interfaces
{
    /// <summary>
    /// Responsible for enriching UserPokemon entities with PokeAPI data.
    /// Separated from UserService to follow Single Responsibility Principle.
    /// </summary>
    public interface IPokemonEnricherService
    {
        Task<UserPokemonDto> EnrichAsync(UserPokemon userPokemon);
        Task<IReadOnlyList<UserPokemonDto>> EnrichBatchAsync(IEnumerable<UserPokemon> userPokemonList);
        UserPokemonDto EnrichWithCachedData(UserPokemon userPokemon, PokeApiPokemon? pokeApiData);
    }
}
