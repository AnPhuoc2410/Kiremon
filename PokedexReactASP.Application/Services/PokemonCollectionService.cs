using PokedexReactASP.Application.DTOs.Pokemon;
using PokedexReactASP.Application.Interfaces;
using PokedexReactASP.Domain.Entities;

namespace PokedexReactASP.Application.Services
{
    /// <summary>
    /// Read-only operations for a trainer's Pokemon collection.
    /// Query-side service: no mutations, no UserManager interaction.
    /// </summary>
    public class PokemonCollectionService : IPokemonCollectionService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IPokemonCacheService _pokemonCache;
        private readonly IPokemonEnricherService _pokemonEnricher;

        public PokemonCollectionService(
            IUnitOfWork unitOfWork,
            IPokemonCacheService pokemonCache,
            IPokemonEnricherService pokemonEnricher)
        {
            _unitOfWork = unitOfWork;
            _pokemonCache = pokemonCache;
            _pokemonEnricher = pokemonEnricher;
        }

        /// <inheritdoc/>
        public async Task<IEnumerable<UserPokemonDto>> GetUserPokemonAsync(string userId)
        {
            var userPokemonList = await _unitOfWork.UserPokemon.FindAsync(
                up => up.UserId == userId, disableTracking: true);

            var enrichedList = await _pokemonEnricher.EnrichBatchAsync(userPokemonList);
            return enrichedList.OrderByDescending(p => p.CaughtDate);
        }

        /// <inheritdoc/>
        public async Task<UserPokemonDto?> GetUserPokemonByIdAsync(string userId, int userPokemonId)
        {
            var userPokemon = await _unitOfWork.UserPokemon.FirstOrDefaultAsync(
                up => up.UserId == userId && up.Id == userPokemonId, disableTracking: true);

            if (userPokemon == null) return null;
            return await _pokemonEnricher.EnrichAsync(userPokemon);
        }

        /// <inheritdoc/>
        public async Task<CollectionStatsDto> GetCollectionStatsAsync(string userId)
        {
            var allPokemon = await _unitOfWork.UserPokemon.FindAsync(
                up => up.UserId == userId, disableTracking: true);
            var pokemonList = allPokemon.ToList();
            var typeDistribution = await GetTypeDistributionBatchAsync(pokemonList);

            return new CollectionStatsDto
            {
                TotalCaught      = pokemonList.Count,
                UniqueCaught     = pokemonList.Select(p => p.PokemonApiId).Distinct().Count(),
                ShinyCount       = pokemonList.Count(p => p.IsShiny),
                FavoriteCount    = pokemonList.Count(p => p.IsFavorite),
                TotalBattles     = pokemonList.Sum(p => p.TotalBattles),
                TotalBattlesWon  = pokemonList.Sum(p => p.BattlesWon),
                HighestLevel     = pokemonList.Any() ? pokemonList.Max(p => p.CurrentLevel) : 0,
                AverageLevel     = pokemonList.Any() ? (int)pokemonList.Average(p => p.CurrentLevel) : 0,
                TypeDistribution = typeDistribution
            };
        }

        /// <inheritdoc/>
        public async Task<PokeSummaryResponseDto> GetPokeSummaryAsync(string userId)
        {
            var allPokemon = await _unitOfWork.UserPokemon.FindAsync(
                up => up.UserId == userId, disableTracking: true);
            var pokemonList = allPokemon.ToList();

            if (pokemonList.Count == 0)
            {
                return new PokeSummaryResponseDto
                {
                    Summary       = new List<PokeSummaryDto>(),
                    TotalCaptured = 0,
                    UniqueSpecies = 0
                };
            }

            var uniqueApiIds = pokemonList.Select(p => p.PokemonApiId).Distinct();
            var pokeApiDataMap = await _pokemonCache.GetPokemonBatchAsync(uniqueApiIds);

            var grouped = pokemonList
                .GroupBy(p => p.PokemonApiId)
                .Select(g =>
                {
                    var name = pokeApiDataMap.TryGetValue(g.Key, out var data)
                        ? data.Name.ToUpper()
                        : $"POKEMON_{g.Key}";
                    return new PokeSummaryDto { Name = name, Captured = g.Count() };
                })
                .ToList();

            return new PokeSummaryResponseDto
            {
                Summary       = grouped,
                TotalCaptured = pokemonList.Count,
                UniqueSpecies = grouped.Count
            };
        }

        // ── Private helpers ──────────────────────────────────────────────────

        private async Task<Dictionary<string, int>> GetTypeDistributionBatchAsync(List<UserPokemon> pokemonList)
        {
            if (pokemonList.Count == 0) return [];

            var uniqueApiIds   = pokemonList.Select(p => p.PokemonApiId).Distinct();
            var pokeApiDataMap = await _pokemonCache.GetPokemonBatchAsync(uniqueApiIds);
            var typeCount      = new Dictionary<string, int>(StringComparer.OrdinalIgnoreCase);

            foreach (var pokemon in pokemonList)
            {
                if (!pokeApiDataMap.TryGetValue(pokemon.PokemonApiId, out var pokeApiData)) continue;

                if (!string.IsNullOrEmpty(pokeApiData.Type1))
                    typeCount[pokeApiData.Type1] = typeCount.GetValueOrDefault(pokeApiData.Type1) + 1;
                if (!string.IsNullOrEmpty(pokeApiData.Type2))
                    typeCount[pokeApiData.Type2] = typeCount.GetValueOrDefault(pokeApiData.Type2) + 1;
            }

            return typeCount;
        }
    }
}
