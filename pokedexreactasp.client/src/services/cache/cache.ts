// Cache implementation for API responses
export interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiresIn: number;
}

interface Cache {
  [key: string]: CacheItem<any>;
}

// In-memory cache store
const cacheStore: Cache = {};

// Default cache duration (30 minutes)
export const DEFAULT_CACHE_DURATION = 30 * 60 * 1000;

// Cache utility functions
export const cacheUtils = {
  /**
   * Gets or sets a cache entry
   */
  getOrSet: async <T>(
    key: string,
    fetchFn: () => Promise<T>,
    expiresIn: number = DEFAULT_CACHE_DURATION
  ): Promise<T> => {
    const now = Date.now();

    // Check if cache exists and is still valid
    if (cacheStore[key] && now < cacheStore[key].timestamp + cacheStore[key].expiresIn) {
      return cacheStore[key].data;
    }

    const data = await fetchFn();

    // Store in cache
    cacheStore[key] = {
      data,
      timestamp: now,
      expiresIn
    };

    return data;
  },

  /**
   * Clears all or specific cache entries
   */
  clear: (keyPattern?: string): void => {
    if (keyPattern) {
      // Clear specific cache entries matching the pattern
      Object.keys(cacheStore).forEach(key => {
        if (key.includes(keyPattern)) {
          delete cacheStore[key];
        }
      });
    } else {
      // Clear all cache
      Object.keys(cacheStore).forEach(key => {
        delete cacheStore[key];
      });
    }
  },

  /**
   * Invalidates specific cache entries that have expired
   */
  invalidateExpired: (): void => {
    const now = Date.now();
    Object.keys(cacheStore).forEach(key => {
      if (now >= cacheStore[key].timestamp + cacheStore[key].expiresIn) {
        delete cacheStore[key];
      }
    });
  }
};
