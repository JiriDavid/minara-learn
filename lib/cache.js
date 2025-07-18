// Simple in-memory cache for API responses
class APICache {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.defaultTTL = 5 * 60 * 1000; // 5 minutes
  }

  set(key, data, ttl = this.defaultTTL) {
    this.cache.set(key, data);
    this.timestamps.set(key, Date.now() + ttl);
  }

  get(key) {
    const timestamp = this.timestamps.get(key);
    if (!timestamp || Date.now() > timestamp) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return null;
    }
    return this.cache.get(key);
  }

  has(key) {
    return this.get(key) !== null;
  }

  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  // Clear expired entries
  cleanup() {
    const now = Date.now();
    for (const [key, timestamp] of this.timestamps.entries()) {
      if (now > timestamp) {
        this.cache.delete(key);
        this.timestamps.delete(key);
      }
    }
  }
}

// Create a global cache instance
const apiCache = new APICache();

// Cleanup expired entries every 5 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    apiCache.cleanup();
  }, 5 * 60 * 1000);
}

// Enhanced fetch function with caching
export async function cachedFetch(url, options = {}, cacheTTL) {
  const cacheKey = `${url}_${JSON.stringify(options)}`;
  
  // Return cached data if available
  if (options.method === 'GET' || !options.method) {
    const cached = apiCache.get(cacheKey);
    if (cached) {
      console.log(`Cache hit for ${url}`);
      return cached;
    }
  }

  console.log(`Cache miss for ${url}, fetching...`);
  
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    // Cache successful GET requests
    if (response.ok && (options.method === 'GET' || !options.method)) {
      apiCache.set(cacheKey, data, cacheTTL);
    }
    
    return data;
  } catch (error) {
    console.error(`Fetch error for ${url}:`, error);
    throw error;
  }
}

// Invalidate cache patterns
export function invalidateCache(pattern) {
  for (const key of apiCache.cache.keys()) {
    if (key.includes(pattern)) {
      apiCache.delete(key);
    }
  }
}

// Clear all cache
export function clearCache() {
  apiCache.clear();
}

export default apiCache;
