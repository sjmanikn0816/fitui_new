import * as SecureStorage from "expo-secure-store";

export interface HealthMetrics {
  steps: number;
  calories: number;
  heartRate: number;
  activeMinutes: number;
  timestamp: string;
  date: string;
  distance?: number;
  spo2?: number;
}

export interface CachedHealthData {
  data: HealthMetrics;
  cachedAt: number;
  freshness: 'fresh' | 'stale' | 'old';
}

export interface DataFreshness {
  isFresh: boolean;
  isStale: boolean;
  isOld: boolean;
  minutesOld: number;
  status: 'fresh' | 'stale' | 'old';
  color: string;
}

class HealthDataCacheService {
  private static instance: HealthDataCacheService;
  private readonly CACHE_PREFIX = "health_cache_";
  private readonly CACHE_RETENTION_DAYS = 30;

  private readonly FRESH_THRESHOLD = 5;
  private readonly STALE_THRESHOLD = 15;

  public static getInstance(): HealthDataCacheService {
    if (!HealthDataCacheService.instance) {
      HealthDataCacheService.instance = new HealthDataCacheService();
    }
    return HealthDataCacheService.instance;
  }

  // Save health data
  async cacheHealthData(date: string, data: HealthMetrics): Promise<void> {
    try {
      const cacheKey = this.getCacheKey(date);
      const payload: CachedHealthData = {
        data,
        cachedAt: Date.now(),
        freshness: "fresh",
      };

      await SecureStorage.setItemAsync(cacheKey, JSON.stringify(payload));
      console.log(`✅ Secure cache saved for ${date}`);
    } catch (error) {
      console.error("❌ Failed to cache securely:", error);
    }
  }

  // Get cached data
  async getCachedHealthData(date: string): Promise<CachedHealthData | null> {
    try {
      const cacheKey = this.getCacheKey(date);
      const raw = await SecureStorage.getItemAsync(cacheKey);

      if (!raw) return null;

      const parsed: CachedHealthData = JSON.parse(raw);
      parsed.freshness = this.calculateFreshness(parsed.cachedAt).status;

      return parsed;
    } catch (error) {
      console.error("❌ Secure cache read failed:", error);
      return null;
    }
  }

  async getCachedHealthDataWithFreshness(date: string) {
    const cachedData = await this.getCachedHealthData(date);

    if (!cachedData) {
      return {
        data: null,
        freshness: {
          isFresh: false,
          isStale: false,
          isOld: true,
          minutesOld: 999,
          status: "old",
          color: "#EF4444",
        },
        needsRefresh: true,
      };
    }

    const freshness = this.calculateFreshness(cachedData.cachedAt);
    const needsRefresh = freshness.isStale || freshness.isOld;

    return {
      data: cachedData.data,
      freshness,
      needsRefresh,
    };
  }

  calculateFreshness(cachedAt: number): DataFreshness {
    const now = Date.now();
    const age = Math.floor((now - cachedAt) / (1000 * 60));

    let status: "fresh" | "stale" | "old";
    let color: string;

    if (age <= this.FRESH_THRESHOLD) {
      status = "fresh";
      color = "#10B981";
    } else if (age <= this.STALE_THRESHOLD) {
      status = "stale";
      color = "#F59E0B";
    } else {
      status = "old";
      color = "#EF4444";
    }

    return {
      isFresh: status === "fresh",
      isStale: status === "stale",
      isOld: status === "old",
      minutesOld: age,
      status,
      color,
    };
  }

  async needsRefresh(date: string): Promise<boolean> {
    const cached = await this.getCachedHealthData(date);
    if (!cached) return true;
    const fresh = this.calculateFreshness(cached.cachedAt);
    return fresh.isStale || fresh.isOld;
  }

  async clearCache(date: string): Promise<void> {
    try {
      await SecureStorage.deleteItemAsync(this.getCacheKey(date));
      console.log(`🗑 Cleared secure cache for ${date}`);
    } catch (e) {
      console.error("❌ Failed secure cache delete:", e);
    }
  }

  // CLEAR ALL (SecureStorage does NOT have getAllKeys)
  async clearAllCache(): Promise<void> {
    console.warn("⚠ SecureStorage does not support listing all keys.");
    console.warn("❗ YOU MUST track keys manually in a secure key index.");

    // If you want, I can build:
    // - a secure index
    // - automatic key tracking
  }

  async getCacheStats() {
    console.warn("⚠ SecureStorage cannot list keys → Stats not available.");
    return {
      totalEntries: 0,
      freshEntries: 0,
      staleEntries: 0,
      oldEntries: 0,
    };
  }

  private getCacheKey(date: string): string {
    return `${this.CACHE_PREFIX}${date}`;
  }

  getTodayDateString(): string {
    return new Date().toISOString().split("T")[0];
  }

  async getMetricsForRange(days: number): Promise<HealthMetrics[]> {
    const results: HealthMetrics[] = [];
    const count = Math.max(1, days);

    for (let i = 0; i < count; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];

      const cached = await this.getCachedHealthData(key);
      if (cached?.data) results.push(cached.data);
    }

    return results;
  }
}

export default HealthDataCacheService.getInstance();
