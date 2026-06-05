using PokedexReactASP.Application.DTOs.Pokemon;

namespace PokedexReactASP.Application.Interfaces
{
    /// <summary>
    /// Read-only operations for a trainer's Pokemon collection.
    /// </summary>
    public interface IPokemonCollectionService
    {
        /// <summary>Returns all Pokemon in the trainer's collection, enriched with PokeAPI data, sorted by caught date desc.</summary>
        Task<IEnumerable<UserPokemonDto>> GetUserPokemonAsync(string userId);

        /// <summary>Returns a single Pokemon by its UserPokemon ID, or null if not found / not owned.</summary>
        Task<UserPokemonDto?> GetUserPokemonByIdAsync(string userId, int userPokemonId);

        /// <summary>Aggregate statistics for the trainer's collection (counts, type distribution, etc.).</summary>
        Task<CollectionStatsDto> GetCollectionStatsAsync(string userId);

        /// <summary>Returns a grouped summary of species counts for the Pokédex summary view.</summary>
        Task<PokeSummaryResponseDto> GetPokeSummaryAsync(string userId);
    }
}
