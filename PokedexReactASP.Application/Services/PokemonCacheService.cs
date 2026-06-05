using Microsoft.Extensions.Caching.Distributed;
using PokedexReactASP.Application.Interfaces;
using System.Collections.Concurrent;
using System.Text.Json;

namespace PokedexReactASP.Application.Services
{
    public class PokemonCacheService : IPokemonCacheService, IDisposable
    {
        private readonly IPokeApiService _pokeApiService;
        private readonly IDistributedCache _cache;

        /// <summary>Per-key semaphores to prevent thundering-herd for single fetches.</summary>
        private readonly ConcurrentDictionary<int, SemaphoreSlim> _keyLocks = new();

        /// <summary>Semaphore pool for batch fetches — max 5 concurrent PokeAPI calls.</summary>
        private readonly SemaphoreSlim _batchSemaphore = new(5, 5);

        private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(24);
        private bool _disposed;

        public PokemonCacheService(IPokeApiService pokeApiService, IDistributedCache cache)
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

            // Check cache (fast path without locking)
            var cachedJson = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cachedJson))
            {
                try
                {
                    return JsonSerializer.Deserialize<PokeApiPokemon>(cachedJson);
                }
                catch (JsonException)
                {
                    // Fall through if serialization failed
                }
            }

            // Acquire the per-key lock for this specific Pokémon ID
            var keyLock = _keyLocks.GetOrAdd(pokemonApiId, _ => new SemaphoreSlim(1, 1));
            await keyLock.WaitAsync();
            try
            {
                // Double-check after acquiring lock
                cachedJson = await _cache.GetStringAsync(cacheKey);
                if (!string.IsNullOrEmpty(cachedJson))
                {
                    try
                    {
                        return JsonSerializer.Deserialize<PokeApiPokemon>(cachedJson);
                    }
                    catch (JsonException)
                    {
                        // Fall through
                    }
                }

                var pokemon = await _pokeApiService.GetPokemonAsync(pokemonApiId);
                if (pokemon != null)
                {
                    var options = new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = CacheDuration
                    };
                    var serialized = JsonSerializer.Serialize(pokemon);
                    await _cache.SetStringAsync(cacheKey, serialized, options);
                }

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

            var cachedJson = await _cache.GetStringAsync(cacheKey);
            if (!string.IsNullOrEmpty(cachedJson))
            {
                try
                {
                    return JsonSerializer.Deserialize<PokeApiPokemon>(cachedJson);
                }
                catch (JsonException)
                {
                    // Fall through
                }
            }

            var pokemon = await _pokeApiService.GetPokemonAsync(name);
            if (pokemon != null)
            {
                var options = new DistributedCacheEntryOptions
                {
                    AbsoluteExpirationRelativeToNow = CacheDuration
                };
                var serialized = JsonSerializer.Serialize(pokemon);

                // Cache by both name key and numeric ID key for future ID lookups
                await _cache.SetStringAsync(cacheKey, serialized, options);
                await _cache.SetStringAsync($"pokemon_{pokemon.Id}", serialized, options);
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
                var cachedJson = await _cache.GetStringAsync($"pokemon_{id}");
                if (!string.IsNullOrEmpty(cachedJson))
                {
                    try
                    {
                        var pokemon = JsonSerializer.Deserialize<PokeApiPokemon>(cachedJson);
                        if (pokemon != null)
                        {
                            result[id] = pokemon;
                        }
                        else
                        {
                            missingIds.Add(id);
                        }
                    }
                    catch (JsonException)
                    {
                        missingIds.Add(id);
                    }
                }
                else
                {
                    missingIds.Add(id);
                }
            }

            if (missingIds.Count == 0) return result;

            // Second pass: fetch cache misses with bounded concurrency
            var tasks = missingIds.Select(async id =>
            {
                await _batchSemaphore.WaitAsync();
                try
                {
                    // Check per-key cache one more time (another request may have populated it)
                    var cachedJson = await _cache.GetStringAsync($"pokemon_{id}");
                    if (!string.IsNullOrEmpty(cachedJson))
                    {
                        try
                        {
                            var cachedPokemon = JsonSerializer.Deserialize<PokeApiPokemon>(cachedJson);
                            if (cachedPokemon != null)
                                return (id, cachedPokemon);
                        }
                        catch (JsonException)
                        {
                            // Fall through
                        }
                    }

                    var pokemon = await _pokeApiService.GetPokemonAsync(id);
                    if (pokemon != null)
                    {
                        var options = new DistributedCacheEntryOptions
                        {
                            AbsoluteExpirationRelativeToNow = CacheDuration
                        };
                        var serialized = JsonSerializer.Serialize(pokemon);
                        await _cache.SetStringAsync($"pokemon_{id}", serialized, options);
                    }

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
