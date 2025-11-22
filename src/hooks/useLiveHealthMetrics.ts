import { useState, useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import HealthDataCacheService, { HealthMetrics, DataFreshness } from '../services/HealthDataCacheService';
import HealthService from '../services/HealthService';
import { useAppSelector } from '../redux/store/hooks';

export interface LiveHealthMetricsState {
  data: HealthMetrics | null;
  freshness: DataFreshness;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  lastUpdated: Date | null;
  needsRefresh: boolean;
}

export interface LiveHealthMetricsActions {
  refreshData: () => Promise<void>;
  syncToDatabase: () => Promise<void>;
  clearCache: () => Promise<void>;
  forceRefresh: () => Promise<void>;
}

export interface UseLiveHealthMetricsReturn {
  state: LiveHealthMetricsState;
  actions: LiveHealthMetricsActions;
}

/**
 * Industry-standard live health metrics hook with cache-first architecture
 * Follows Apple Health, Google Fit, MyFitnessPal patterns for optimal performance
 */
export const useLiveHealthMetrics = (): UseLiveHealthMetricsReturn => {
  const [state, setState] = useState<LiveHealthMetricsState>({
    data: null,
    freshness: {
      isFresh: false,
      isStale: false,
      isOld: true,
      minutesOld: 999,
      status: 'old',
      color: '#EF4444'
    },
    isLoading: true,
    isRefreshing: false,
    error: null,
    lastUpdated: null,
    needsRefresh: true
  });

  const user = useAppSelector((state) => state.auth.user);
  const userId = user?.userId;
  const jwtToken = useAppSelector((state) => state.auth.token);

  // Refs for managing intervals and app state
  const backgroundSyncInterval = useRef<NodeJS.Timeout | null>(null);
  const foregroundRefreshTimeout = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastForegroundRefresh = useRef<number>(0);

  // Constants for sync behavior
  const BACKGROUND_SYNC_INTERVAL = 60 * 60 * 1000; // 1 hour
  const FOREGROUND_REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes
  const CACHE_STALE_THRESHOLD = 15 * 60 * 1000; // 15 minutes

  /**
   * Load cached data immediately for sub-100ms performance
   */
  const loadCachedData = async (): Promise<void> => {
    try {
      const today = HealthDataCacheService.getTodayDateString();
      const cachedResult = await HealthDataCacheService.getCachedHealthDataWithFreshness(today);
      
      setState(prev => ({
        ...prev,
        data: cachedResult.data,
        freshness: cachedResult.freshness,
        needsRefresh: cachedResult.needsRefresh,
        isLoading: false,
        lastUpdated: cachedResult.data ? new Date() : null
      }));

      console.log('📱 Loaded cached health data:', {
        hasData: !!cachedResult.data,
        freshness: cachedResult.freshness.status,
        needsRefresh: cachedResult.needsRefresh
      });
    } catch (error) {
      console.error('❌ Failed to load cached data:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: 'Failed to load cached data'
      }));
    }
  };

  /**
   * Fetch fresh health data from device (HealthKit/Google Fit)
   */
  const fetchFreshHealthData = async (): Promise<HealthMetrics | null> => {
    if (!userId || !jwtToken) {
      throw new Error('User not authenticated');
    }

    try {
      const today = new Date();
      const healthData = await HealthService.fetchHealthDataFromBackend(today, userId, jwtToken);
      
      if (healthData) {
        const metrics: HealthMetrics = {
          steps: healthData.steps || 0,
          calories: healthData.calories || 0,
          heartRate: healthData.heartRate || 0,
          activeMinutes: healthData.activeMinutes || 0,
          timestamp: new Date().toISOString(),
          date: HealthDataCacheService.getTodayDateString()
        };

        // Cache the fresh data
        await HealthDataCacheService.cacheHealthData(metrics.date, metrics);
        
        console.log('✅ Fetched health data from backend (database):', metrics);
        return metrics;
      }
      
      return null;
    } catch (error) {
      console.error('❌ Failed to fetch health data from backend:', error);
      throw error;
    }
  };

  /**
   * Refresh data from device if cache is stale
   */
  const refreshData = async (): Promise<void> => {
    if (state.isRefreshing) return;

    setState(prev => ({ ...prev, isRefreshing: true, error: null }));

    try {
      const freshData = await fetchFreshHealthData();
      
      if (freshData) {
        const freshness = HealthDataCacheService.calculateFreshness(Date.now());
        
        setState(prev => ({
          ...prev,
          data: freshData,
          freshness,
          needsRefresh: false,
          lastUpdated: new Date(),
          isRefreshing: false
        }));
      } else {
        setState(prev => ({ ...prev, isRefreshing: false }));
      }
    } catch (error) {
      console.error('❌ Failed to refresh health data:', error);
      setState(prev => ({
        ...prev,
        isRefreshing: false,
        error: error instanceof Error ? error.message : 'Failed to refresh data'
      }));
    }
  };

  /**
   * Sync cached data to database (less frequent operation)
   */
  const syncToDatabase = async (): Promise<void> => {
    if (!userId || !jwtToken || !state.data) return;

    try {
      console.log('🔄 Syncing health data to database...');
      
      await HealthService.syncHealthDataToBackend(state.data, userId, jwtToken);
      
      console.log('✅ Health data synced to database successfully');
    } catch (error) {
      console.error('❌ Failed to sync to database:', error);
    }
  };

  /**
   * Clear cache and force refresh
   */
  const clearCache = async (): Promise<void> => {
    try {
      const today = HealthDataCacheService.getTodayDateString();
      await HealthDataCacheService.clearCache(today);
      
      setState(prev => ({
        ...prev,
        data: null,
        needsRefresh: true,
        freshness: {
          isFresh: false,
          isStale: false,
          isOld: true,
          minutesOld: 999,
          status: 'old',
          color: '#EF4444'
        }
      }));
      
      await refreshData();
    } catch (error) {
      console.error('❌ Failed to clear cache:', error);
    }
  };

  /**
   * Force refresh regardless of cache status
   */
  const forceRefresh = async (): Promise<void> => {
    await refreshData();
  };

  /**
   * Smart refresh logic based on app state and cache freshness
   */
  const performSmartRefresh = async (): Promise<void> => {
    const now = Date.now();
    const timeSinceLastRefresh = now - lastForegroundRefresh.current;
    
    // Only refresh if enough time has passed and data is stale
    if (timeSinceLastRefresh > FOREGROUND_REFRESH_THRESHOLD && state.needsRefresh) {
      lastForegroundRefresh.current = now;
      await refreshData();
    }
  };

  /**
   * Handle app state changes for smart sync behavior
   */
  const handleAppStateChange = (nextAppState: AppStateStatus): void => {
    const previousAppState = appStateRef.current;
    appStateRef.current = nextAppState;

    console.log(`📱 App state changed: ${previousAppState} → ${nextAppState}`);

    if (nextAppState === 'active' && previousAppState.match(/inactive|background/)) {
      // App came to foreground - perform smart refresh
      performSmartRefresh();
    }
  };

  /**
   * Setup background sync interval (hourly updates)
   */
  const setupBackgroundSync = (): void => {
    if (backgroundSyncInterval.current) {
      clearInterval(backgroundSyncInterval.current);
    }

    backgroundSyncInterval.current = setInterval(async () => {
      if (AppState.currentState === 'active') {
        console.log('⏰ Performing hourly background sync...');
        await refreshData();
        await syncToDatabase();
      }
    }, BACKGROUND_SYNC_INTERVAL);

    console.log('⚙️ Background sync interval setup (1 hour)');
  };

  /**
   * Cleanup intervals and listeners
   */
  const cleanup = (): void => {
    if (backgroundSyncInterval.current) {
      clearInterval(backgroundSyncInterval.current);
      backgroundSyncInterval.current = null;
    }
    
    if (foregroundRefreshTimeout.current) {
      clearTimeout(foregroundRefreshTimeout.current);
      foregroundRefreshTimeout.current = null;
    }
  };

  // Initialize hook
  useEffect(() => {
    if (!userId || !jwtToken) return;

    console.log('🚀 Initializing useLiveHealthMetrics hook...');
    
    // Load cached data immediately for fast UI
    loadCachedData();
    
    // Setup app state listener
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Setup background sync
    setupBackgroundSync();
    
    // Cleanup on unmount
    return () => {
      cleanup();
      appStateSubscription?.remove();
    };
  }, [userId, jwtToken]);

  // Auto-refresh when cache becomes stale
  useEffect(() => {
    if (state.needsRefresh && !state.isLoading && !state.isRefreshing && AppState.currentState === 'active') {
      const timeout = setTimeout(() => {
        refreshData();
      }, 1000); // Small delay to avoid rapid refreshes
      
      return () => clearTimeout(timeout);
    }
  }, [state.needsRefresh, state.isLoading, state.isRefreshing]);

  return {
    state,
    actions: {
      refreshData,
      syncToDatabase,
      clearCache,
      forceRefresh
    }
  };
};
