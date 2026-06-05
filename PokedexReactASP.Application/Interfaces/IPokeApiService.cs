namespace PokedexReactASP.Application.Services
{
    /// <summary>
    /// Service for interacting with the PokeAPI (https://pokeapi.co/).
    /// Provides access to Pokemon data, species info, moves, items and types.
    /// Consider adding caching (e.g. PokemonCacheService) to reduce external API calls.
    /// </summary>
    public interface IPokeApiService
    {
        /// <summary>Gets full Pokemon data by numeric ID.</summary>
        Task<PokeApiPokemon?> GetPokemonAsync(int id);

        /// <summary>Gets full Pokemon data by name (case-insensitive).</summary>
        Task<PokeApiPokemon?> GetPokemonAsync(string name);

        /// <summary>Gets species data (catch rate, legendary flag, gender rate, etc.) by numeric ID.</summary>
        Task<PokeApiSpeciesDetail?> GetPokemonSpeciesAsync(int id);

        /// <summary>Gets species data by name (case-insensitive).</summary>
        Task<PokeApiSpeciesDetail?> GetPokemonSpeciesAsync(string name);

        /// <summary>Gets move data by numeric ID.</summary>
        Task<PokeApiMove?> GetMoveAsync(int id);

        /// <summary>Gets item data by numeric ID.</summary>
        Task<PokeApiItem?> GetItemAsync(int id);

        /// <summary>Gets type data by type name (e.g. "fire").</summary>
        Task<PokeApiType?> GetTypeAsync(string typeName);

        /// <summary>Returns a paginated list of Pokemon entries.</summary>
        Task<List<PokeApiPokemonListItem>> GetPokemonListAsync(int limit = 151, int offset = 0);
    }
}
