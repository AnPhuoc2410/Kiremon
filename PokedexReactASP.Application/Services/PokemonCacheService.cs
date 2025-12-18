using Microsoft.Extensions.Caching.Memory;
using PokedexReactASP.Application.Interfaces;

namespace PokedexReactASP.Application.Services
{

    public class PokemonCacheService : IPokemonCacheService
    {
        private readonly IPokeApiService _pokeApiService;
        private readonly IMemoryCache _cache;
        private readonly SemaphoreSlim _semaphore = new(1, 1);
        
        // Cache for 24 hours - Pokemon data is static
        private static readonly TimeSpan CacheDuration = TimeSpan.FromHours(24);
        
        public PokemonCacheService(IPokeApiService pokeApiService, IMemoryCache cache)
        {
            _pokeApiService = pokeApiService;
            _cache = cache;
        }

        public async Task<PokeApiPokemon?> GetPokemonAsync(int pokemonApiId)
        {
            var cacheKey = $"pokemon_{pokemonApiId}";
            
            if (_cache.TryGetValue(cacheKey, out PokeApiPokemon? cached))
            {
                return cached;
            }

            // Use semaphore to prevent thundering herd
            await _semaphore.WaitAsync();
            try
            {
                // Double-check after acquiring lock
                if (_cache.TryGetValue(cacheKey, out cached))
                {
                    return cached;
                }

                var pokemon = await _pokeApiService.GetPokemonAsync(pokemonApiId);
                if (pokemon != null)
                {
                    _cache.Set(cacheKey, pokemon, CacheDuration);
                }
                return pokemon;
            }
            finally
            {
                _semaphore.Release();
            }
        }

        public async Task<PokeApiPokemon?> GetPokemonAsync(string name)
        {
            var cacheKey = $"pokemon_name_{name.ToLower()}";
            
            if (_cache.TryGetValue(cacheKey, out PokeApiPokemon? cached))
            {
                return cached;
            }

            var pokemon = await _pokeApiService.GetPokemonAsync(name);
            if (pokemon != null)
            {
                // Cache by both name and id
                _cache.Set(cacheKey, pokemon, CacheDuration);
                _cache.Set($"pokemon_{pokemon.Id}", pokemon, CacheDuration);
            }
            return pokemon;
        }

        /// <summary>
        /// Batch load Pokemon data - fetches missing ones in parallel
        /// </summary>
        public async Task<Dictionary<int, PokeApiPokemon>> GetPokemonBatchAsync(IEnumerable<int> pokemonApiIds)
        {
            var uniqueIds = pokemonApiIds.Distinct().ToList();
            var result = new Dictionary<int, PokeApiPokemon>();
            var missingIds = new List<int>();

            // First pass: get from cache
            foreach (var id in uniqueIds)
            {
                var cacheKey = $"pokemon_{id}";
                if (_cache.TryGetValue(cacheKey, out PokeApiPokemon? cached) && cached != null)
                {
                    result[id] = cached;
                }
                else
                {
                    missingIds.Add(id);
                }
            }

            // Second pass: fetch missing ones in parallel (with rate limiting)
            if (missingIds.Count > 0)
            {
                // Limit concurrent requests to avoid overwhelming PokeAPI
                var semaphore = new SemaphoreSlim(5); // Max 5 concurrent requests
                var tasks = missingIds.Select(async id =>
                {
                    await semaphore.WaitAsync();
                    try
                    {
                        var pokemon = await _pokeApiService.GetPokemonAsync(id);
                        if (pokemon != null)
                        {
                            _cache.Set($"pokemon_{id}", pokemon, CacheDuration);
                            return (id, pokemon);
                        }
                        return (id, (PokeApiPokemon?)null);
                    }
                    finally
                    {
                        semaphore.Release();
                    }
                });

                var results = await Task.WhenAll(tasks);
                foreach (var (id, pokemon) in results)
                {
                    if (pokemon != null)
                    {
                        result[id] = pokemon;
                    }
                }
            }

            return result;
        }

        public void InvalidateCache(int pokemonApiId)
        {
            _cache.Remove($"pokemon_{pokemonApiId}");
        }
    }
}



