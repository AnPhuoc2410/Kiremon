using Microsoft.Extensions.Caching.Memory;
using PokedexReactASP.Application.Interfaces;
using System.Collections.Concurrent;

namespace PokedexReactASP.Application.Services
{
    public class PokemonCacheService : IPokemonCacheService, IDisposable
    {
        private readonly IPokeApiService _pokeApiService;
        private readonly IMemoryCache _cache;

        /// <summary>Per-key semaphores to prevent thundering-herd for single fetches.</summary>
        private readonly ConcurrentDictionary<int, SemaphoreSlim> _keyLocks = new();

        /// <summary>Semaphore pool for batch fetches — max 5 concurrent PokeAPI calls.</summary>
        private readonly SemaphoreSlim _batchSemaphore = new(5, 5);

        private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(24);
        private bool _disposed;

        public PokemonCacheService(IPokeApiService pokeApiService, IMemoryCache cache)
        {
            _pokeApiService = pokeApiService;
            _cache = cache;
        }

        /// <summary>
        /// Returns Pokémon by numeric API ID, using a per-key semaphore to prevent
        /// thundering-herd on the same Pokémon ID.
        /// </summary>
        public async Task<PokeApiPokemon?> GetPokemonAsync(int pokemonApiId)
        {
            var cacheKey = $"pokemon_{pokemonApiId}";

            // L1 — fast path without locking
            if (_cache.TryGetValue(cacheKey, out PokeApiPokemon? cached))
                return cached;

            // Acquire the per-key lock for this specific Pokémon ID
            var keyLock = _keyLocks.GetOrAdd(pokemonApiId, _ => new SemaphoreSlim(1, 1));
            await keyLock.WaitAsync();
            try
            {
                // Double-check after acquiring lock
                if (_cache.TryGetValue(cacheKey, out cached))
                    return cached;

                var pokemon = await _pokeApiService.GetPokemonAsync(pokemonApiId);
                if (pokemon != null)
                    _cache.Set(cacheKey, pokemon, CacheDuration);

                return pokemon;
            }
            finally
            {
                keyLock.Release();
            }
        }

        /// <summary>Returns Pokémon by name (no per-key lock needed — name-based lookups are rare).</summary>
        public async Task<PokeApiPokemon?> GetPokemonAsync(string name)
        {
            var cacheKey = $"pokemon_name_{name.ToLower()}";

            if (_cache.TryGetValue(cacheKey, out PokeApiPokemon? cached))
                return cached;

            var pokemon = await _pokeApiService.GetPokemonAsync(name);
            if (pokemon != null)
            {
                // Cache by both name key and numeric ID key for future ID lookups
                _cache.Set(cacheKey, pokemon, CacheDuration);
                _cache.Set($"pokemon_{pokemon.Id}", pokemon, CacheDuration);
            }

            return pokemon;
        }

        /// <summary>
        /// Batch-loads multiple Pokémon, fetching only cache misses — up to 5 concurrent PokeAPI calls.
        /// Uses the shared <see cref="_batchSemaphore"/> instead of creating a new semaphore per call.
        /// </summary>
        public async Task<Dictionary<int, PokeApiPokemon>> GetPokemonBatchAsync(IEnumerable<int> pokemonApiIds)
        {
            var uniqueIds = pokemonApiIds.Distinct().ToList();
            var result = new Dictionary<int, PokeApiPokemon>();
            var missingIds = new List<int>();

            // First pass: cache hits
            foreach (var id in uniqueIds)
            {
                if (_cache.TryGetValue($"pokemon_{id}", out PokeApiPokemon? cached) && cached != null)
                    result[id] = cached;
                else
                    missingIds.Add(id);
            }

            if (missingIds.Count == 0) return result;

            // Second pass: fetch cache misses with bounded concurrency
            var tasks = missingIds.Select(async id =>
            {
                await _batchSemaphore.WaitAsync();
                try
                {
                    // Check per-key cache one more time (another request may have populated it)
                    if (_cache.TryGetValue($"pokemon_{id}", out PokeApiPokemon? cached) && cached != null)
                        return (id, cached);

                    var pokemon = await _pokeApiService.GetPokemonAsync(id);
                    if (pokemon != null)
                        _cache.Set($"pokemon_{id}", pokemon, CacheDuration);

                    return (id, pokemon);
                }
                finally
                {
                    _batchSemaphore.Release();
                }
            });

            var fetchResults = await Task.WhenAll(tasks);
            foreach (var (id, pokemon) in fetchResults)
            {
                if (pokemon != null)
                    result[id] = pokemon;
            }

            return result;
        }

        /// <summary>Removes a Pokémon from cache (e.g., after data source update).</summary>
        public void InvalidateCache(int pokemonApiId)
        {
            _cache.Remove($"pokemon_{pokemonApiId}");
        }

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;

            // Dispose all per-key semaphores
            foreach (var semaphore in _keyLocks.Values)
                semaphore.Dispose();

            _batchSemaphore.Dispose();
        }
    }
}
