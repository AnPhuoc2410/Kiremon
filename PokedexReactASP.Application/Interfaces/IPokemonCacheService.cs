using PokedexReactASP.Application.Services;

namespace PokedexReactASP.Application.Interfaces
{
    /// <summary>
    /// Caches PokeAPI data to avoid repeated API calls.
    /// Pokemon data is static (Pikachu's stats never change), so we cache aggressively.
    /// </summary>
    public interface IPokemonCacheService
    {
        Task<PokeApiPokemon?> GetPokemonAsync(int pokemonApiId);
        Task<PokeApiPokemon?> GetPokemonAsync(string name);
        Task<Dictionary<int, PokeApiPokemon>> GetPokemonBatchAsync(IEnumerable<int> pokemonApiIds);
        void InvalidateCache(int pokemonApiId);
    }
}
