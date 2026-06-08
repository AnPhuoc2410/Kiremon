using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;
using PokedexReactASP.Application.Interfaces;
using System;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

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

        public ResilientCacheService(
            IDistributedCache distributedCache,
            IMemoryCache memoryCache,
            ILogger<ResilientCacheService> logger)
        {
            _distributedCache = distributedCache ?? throw new ArgumentNullException(nameof(distributedCache));
            _memoryCache = memoryCache ?? throw new ArgumentNullException(nameof(memoryCache));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
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
                    return;
                }
                catch (Exception ex)
                {
                    HandleRedisException(ex, $"SetStringAsync for key {key}");
                }
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
                }
                catch (Exception ex)
                {
                    HandleRedisException(ex, $"RemoveAsync for key {key}");
                }
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
                }
                catch (Exception ex)
                {
                    HandleRedisException(ex, $"Remove for key {key}");
                }
            }

            // Always clear from local memory cache too
            _memoryCache.Remove(key);
        }
    }
}
