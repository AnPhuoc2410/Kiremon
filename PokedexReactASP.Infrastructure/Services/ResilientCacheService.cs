using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using PokedexReactASP.Application.Interfaces;
using System.Collections.Concurrent;
using System.Text.Json;

namespace PokedexReactASP.Infrastructure.Services
{
    /// <summary>
    /// Implements ICacheService with a primary Redis distributed cache and an auto-fallback to 
    /// local memory cache if Redis is down. Includes a cooldown circuit-breaker to prevent
    /// repeated connection attempt hangs when Redis is offline.
    /// </summary>
    public class ResilientCacheService : ICacheService
    {
        private readonly IDistributedCache _distributedCache;
        private readonly IMemoryCache _memoryCache;
        private readonly ILogger<ResilientCacheService> _logger;

        private static readonly TimeSpan RedisRetryDelay = TimeSpan.FromMinutes(1);
        private long _redisErrorTicks = 0;
        private int _isCheckingConnection = 0;

        // Tracks keys that failed to delete or write to Redis during connection outages
        private readonly ConcurrentDictionary<string, byte> _pendingRemovals = new();
        public ResilientCacheService(
            IDistributedCache distributedCache,
            IMemoryCache memoryCache,
            ILogger<ResilientCacheService> logger)
        {
            _distributedCache = distributedCache ?? throw new ArgumentNullException(nameof(distributedCache));
            _memoryCache = memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        private void RecordFailedRedisRemoval(string key)
        {
            _pendingRemovals[key] = 0;
            _logger.LogDebug("Recorded failed Redis operation for key '{Key}'. Will retry deletion later.", key);
        }

        private async Task RetryFailedRemovalsAsync()
        {
            if (_pendingRemovals.IsEmpty) return;

            _logger.LogInformation("Retrying {Count} failed Redis cache removals...", _pendingRemovals.Count);

            var keys = _pendingRemovals.Keys.ToList();
            foreach (var key in keys)
            {
                try
                {
                    await _distributedCache.RemoveAsync(key);
                    _pendingRemovals.TryRemove(key, out _);
                }
                catch (Exception ex)
                {
                    _logger.LogWarning(ex, "Failed to remove key '{Key}' from Redis during retry. Retries will resume next recovery.", key);
                    break; // Abort this batch as Redis might be down again
                }
            }
        }

        private bool IsRedisAvailable()
        {
            var errorTicks = Interlocked.Read(ref _redisErrorTicks);
            var nowTicks = DateTime.UtcNow.Ticks;

            if (nowTicks > errorTicks)
            {
                if (errorTicks != 0)
                {
                    // Redis was down and the cooldown has expired.
                    // Start checking the connection in the background without blocking the request.
                    if (Interlocked.CompareExchange(ref _isCheckingConnection, 1, 0) == 0)
                    {
                        _ = CheckRedisConnectionAsync();
                    }
                }
                else
                {
                    return true;
                }
            }

            return false;
        }

        private async Task CheckRedisConnectionAsync()
        {
            try
            {
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(1));
                await _distributedCache.GetStringAsync("redis_health_ping", cts.Token);

                Interlocked.Exchange(ref _redisErrorTicks, 0);
                _logger.LogInformation("Redis distributed cache connection recovered successfully.");

                // Trigger background retry of failed removals
                _ = RetryFailedRemovalsAsync();
            }
            catch (Exception ex)
            {
                var resumeTicks = DateTime.UtcNow.Add(RedisRetryDelay).Ticks;
                Interlocked.Exchange(ref _redisErrorTicks, resumeTicks);
                _logger.LogWarning("Redis distributed cache connection check failed. Cooldown extended for {DelaySeconds} seconds. Error: {ErrorMessage}", RedisRetryDelay.TotalSeconds, ex.Message);
            }
            finally
            {
                Interlocked.Exchange(ref _isCheckingConnection, 0);
            }
        }

        private void HandleRedisException(Exception ex, string operation)
        {
            var resumeTicks = DateTime.UtcNow.Add(RedisRetryDelay).Ticks;
            Interlocked.Exchange(ref _redisErrorTicks, resumeTicks);
            _logger.LogWarning(ex, "Redis distributed cache failed during {Operation}. Falling back to memory cache for {DelaySeconds} seconds.", operation, RedisRetryDelay.TotalSeconds);
        }

        /// <inheritdoc />
        public async Task<T?> GetAsync<T>(string key)
        {
            if (IsRedisAvailable())
            {
                try
                {
                    var cachedJson = await _distributedCache.GetStringAsync(key);
                    if (!string.IsNullOrEmpty(cachedJson))
                    {
                        return JsonSerializer.Deserialize<T>(cachedJson);
                    }
                }
                catch (Exception ex)
                {
                    HandleRedisException(ex, $"GetStringAsync for key {key}");
                }
            }

            // Fallback to Memory Cache
            if (_memoryCache.TryGetValue(key, out T? value))
            {
                return value;
            }

            return default;
        }

        /// <inheritdoc />
        public async Task SetAsync<T>(string key, T value, TimeSpan? expiration = null)
        {
            if (value == null) return;

            var serialized = JsonSerializer.Serialize(value);

            if (IsRedisAvailable())
            {
                try
                {
                    var options = new DistributedCacheEntryOptions();
                    if (expiration.HasValue)
                    {
                        options.AbsoluteExpirationRelativeToNow = expiration.Value;
                    }
                    await _distributedCache.SetStringAsync(key, serialized, options);
                    _pendingRemovals.TryRemove(key, out _); // Successfully set, remove from pending invalidation
                    return;
                }
                catch (Exception ex)
                {
                    HandleRedisException(ex, $"SetStringAsync for key {key}");
                    RecordFailedRedisRemoval(key); // Mark as pending retry deletion because Redis contains old/stale data
                }
            }
            else
            {
                RecordFailedRedisRemoval(key); // Mark as pending retry deletion because Redis contains old/stale data
            }

            // Fallback to Memory Cache
            var memoryOptions = new MemoryCacheEntryOptions();
            if (expiration.HasValue)
            {
                memoryOptions.AbsoluteExpirationRelativeToNow = expiration.Value;
            }
            _memoryCache.Set(key, value, memoryOptions);
        }

        /// <inheritdoc />
        public async Task RemoveAsync(string key)
        {
            if (IsRedisAvailable())
            {
                try
                {
                    await _distributedCache.RemoveAsync(key);
                    _pendingRemovals.TryRemove(key, out _);
                }
                catch (Exception ex)
                {
                    HandleRedisException(ex, $"RemoveAsync for key {key}");
                    RecordFailedRedisRemoval(key);
                }
            }
            else
            {
                RecordFailedRedisRemoval(key);
            }

            // Always clear from local memory cache too
            _memoryCache.Remove(key);
        }

        /// <inheritdoc />
        public void Remove(string key)
        {
            if (IsRedisAvailable())
            {
                try
                {
                    _distributedCache.Remove(key);
                    _pendingRemovals.TryRemove(key, out _);
                }
                catch (Exception ex)
                {
                    HandleRedisException(ex, $"Remove for key {key}");
                    RecordFailedRedisRemoval(key);
                }
            }
            else
            {
                RecordFailedRedisRemoval(key);
            }

            // Always clear from local memory cache too
            _memoryCache.Remove(key);
        }
    }
}
