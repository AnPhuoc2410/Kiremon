using System;
using System.Threading.Tasks;

namespace PokedexReactASP.Application.Interfaces
{
    /// <summary>
    /// Contract for a resilient cache service that handles Redis caching with In-Memory fallback.
    /// Encapsulates JSON serialization/deserialization and exception handling.
    /// </summary>
    public interface ICacheService
    {
        /// <summary>
        /// Retrieves a cached item and deserializes it from JSON.
        /// Falls back to In-Memory cache if Redis is down.
        /// </summary>
        Task<T?> GetAsync<T>(string key);

        /// <summary>
        /// Serializes the value to JSON and caches it.
        /// Falls back to In-Memory cache if Redis is down.
        /// </summary>
        Task SetAsync<T>(string key, T value, TimeSpan? expiration = null);

        /// <summary>
        /// Asynchronously removes a key from the cache (both Redis and local memory).
        /// </summary>
        Task RemoveAsync(string key);

        /// <summary>
        /// Synchronously removes a key from the cache (both Redis and local memory).
        /// </summary>
        void Remove(string key);
    }
}
