import { Platform, AppState, AppStateStatus } from "react-native";
import HealthService, { HealthData } from "./HealthService";
import DeviceIdentificationService from "./DeviceIdentificationService";
import DeviceRegistrationService from "./DeviceRegistrationService";

// ✅ SecureStorage
import * as SecureStorage from "react-native-encrypted-storage";

export interface SyncConfig {
  userId: string;
  jwtToken?: string;
  syncInterval: number;
  batchDays: number;
  retryAttempts: number;
}

export interface SyncResult {
  success: boolean;
  syncedDays: number;
  failedDays: number;
  lastSyncDate: string;
  errors?: string[];
}

class HealthDataSyncService {
  private syncConfig: SyncConfig | null = null;
  private isSyncing = false;
  private syncTimer: NodeJS.Timeout | null = null;
  private appStateSubscription: any = null;

  // Initialize the sync service with user configuration
  async initializeSync(config: SyncConfig): Promise<void> {
    console.log("🔄 Initializing Health Data Sync Service");

    this.syncConfig = config;

    // Store sync config securely
    await SecureStorage.setItem("healthSyncConfig", JSON.stringify(config));

    // Start periodic sync
    this.startPeriodicSync();

    console.log("✅ Health Data Sync Service initialized");
  }

  // Start initial sync
  async startInitialSync(userId: string, jwtToken?: string): Promise<SyncResult> {
    console.log("🚀 Starting initial health data sync for user:", userId);

    const config: SyncConfig = {
      userId,
      jwtToken,
      syncInterval: 60,
      batchDays: 7,
      retryAttempts: 3,
    };

    await this.initializeSync(config);

    return await this.performSmartSync();
  }

  // ----------------------------
  // SMART SYNC (industry standard)
  // ----------------------------
  async performSmartSync(): Promise<SyncResult> {
    if (!this.syncConfig) throw new Error("Sync service not initialized");

    if (this.isSyncing) {
      console.log("⏳ Sync already in progress, skipping...");
      return {
        success: false,
        syncedDays: 0,
        failedDays: 0,
        lastSyncDate: new Date().toISOString(),
        errors: ["Sync already in progress"],
      };
    }

    this.isSyncing = true;

    try {
      // Step 1: Validate device
      console.log("🔐 Validating device authorization…");
      const isAuthorized = await DeviceRegistrationService.validateDeviceRegistration(
        this.syncConfig.userId,
        this.syncConfig.jwtToken
      );

      if (!isAuthorized.isRegistered || !isAuthorized.isHealthDataEnabled) {
        throw new Error(`Device not authorized: ${isAuthorized.message}`);
      }

      // Step 2: Health Service availability
      if (!HealthService.isHealthServiceAvailable()) {
        throw new Error("Health service not available");
      }

      // Step 3: Determine sync strategy
      const syncStrategy = await this.determineSyncStrategy();
      console.log("📋 Sync Strategy:", syncStrategy);

      let results;

      if (syncStrategy.isFirstTime) {
        console.log("👤 First-time user → syncing 7 days history");
        results = await HealthService.batchSyncHealthData(
          this.syncConfig.userId,
          7,
          this.syncConfig.jwtToken
        );
      } else {
        console.log("🔄 Existing user → syncing today only");
        const today = new Date();
        const success = await HealthService.getAndSyncHealthData(
          this.syncConfig.userId,
          today,
          this.syncConfig.jwtToken
        );
        results = { success: success ? 1 : 0, failed: success ? 0 : 1 };
      }

      const syncResult: SyncResult = {
        success: results.success > 0,
        syncedDays: results.success,
        failedDays: results.failed,
        lastSyncDate: new Date().toISOString(),
      };

      // Store last sync result & timestamp
      const userKey = `lastSuccessfulSync_${this.syncConfig.userId}`;
      await SecureStorage.setItem("lastSyncResult", JSON.stringify(syncResult));
      await SecureStorage.setItem(userKey, new Date().toISOString());

      console.log("✅ Smart sync completed:", syncResult);
      return syncResult;
    } catch (error) {
      console.error("❌ Smart sync failed:", error);

      const result: SyncResult = {
        success: false,
        syncedDays: 0,
        failedDays: 1,
        lastSyncDate: new Date().toISOString(),
        errors: [error instanceof Error ? error.message : "Unknown error"],
      };

      await SecureStorage.setItem("lastSyncResult", JSON.stringify(result));
      return result;
    } finally {
      this.isSyncing = false;
    }
  }

  // ----------------------------
  // DAILY SYNC
  // ----------------------------
  async syncTodayData(): Promise<boolean> {
    if (!this.syncConfig) return false;

    try {
      console.log("📅 Syncing today's data");

      const success = await HealthService.getAndSyncHealthData(
        this.syncConfig.userId,
        new Date(),
        this.syncConfig.jwtToken
      );

      if (success) {
        await SecureStorage.setItem("lastDailySync", new Date().toISOString());
      }

      return success;
    } catch (error) {
      console.error("❌ Failed syncing today:", error);
      return false;
    }
  }

  // ----------------------------
  // PERIODIC SYNC
  // ----------------------------
  private startPeriodicSync(): void {
    if (!this.syncConfig) return;

    if (this.syncTimer) clearInterval(this.syncTimer);

    const intervalMs = this.syncConfig.syncInterval * 60 * 1000;

    console.log(`⏰ Running periodic sync every ${this.syncConfig.syncInterval} minutes`);

    this.syncTimer = setInterval(async () => {
      console.log("🔄 Periodic sync firing → today's data");
      await this.syncTodayData();
    }, intervalMs);

    this.setupBackgroundSync();
  }

  // ----------------------------
  // APP STATE SYNC HANDLING
  // ----------------------------
  private handleAppStateChange = async (nextState: AppStateStatus) => {
    console.log("📱 App state:", nextState);

    if (nextState === "active") {
      const lastSyncStr = await SecureStorage.getItem("lastDailySync");
      if (!lastSyncStr) {
        await this.syncTodayData();
        return;
      }

      const lastSync = new Date(lastSyncStr);
      const diffHours = (Date.now() - lastSync.getTime()) / (1000 * 60 * 60);

      if (diffHours >= (this.syncConfig?.syncInterval ?? 60) / 60) {
        await this.syncTodayData();
      }
    }
  };

  private setupBackgroundSync(): void {
    console.log("📱 Setting background sync listener");
    this.appStateSubscription = AppState.addEventListener("change", this.handleAppStateChange);
  }

  // ----------------------------
  // STATUS FETCH
  // ----------------------------
  async getSyncStatus() {
    const lastStr = await SecureStorage.getItem("lastSyncResult");
    const lastSyncResult = lastStr ? JSON.parse(lastStr) : null;

    let nextSyncTime = null;

    if (this.syncConfig && this.syncTimer) {
      const next = new Date();
      next.setMinutes(next.getMinutes() + this.syncConfig.syncInterval);
      nextSyncTime = next.toISOString();
    }

    return {
      isActive: this.syncTimer !== null,
      lastSyncResult,
      nextSyncTime,
      config: this.syncConfig,
    };
  }

  // ----------------------------
  // SYNC STRATEGY
  // ----------------------------
  private async determineSyncStrategy() {
    try {
      const key = `lastSuccessfulSync_${this.syncConfig?.userId}`;
      const last = await SecureStorage.getItem(key);

      if (!last) {
        return { isFirstTime: true, daysSinceLastSync: 0, shouldBackfill: false };
      }

      const lastDate = new Date(last);
      const diff = Math.floor((Date.now() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

      return {
        isFirstTime: false,
        daysSinceLastSync: diff,
        shouldBackfill: diff > 1,
      };
    } catch (error) {
      console.error("❌ Error determining strategy:", error);
      return { isFirstTime: true, daysSinceLastSync: 0, shouldBackfill: false };
    }
  }

  // ----------------------------
  // CONFIG UPDATE
  // ----------------------------
  async updateSyncConfig(newConfig: Partial<SyncConfig>) {
    if (!this.syncConfig) throw new Error("Sync not initialized");

    this.syncConfig = { ...this.syncConfig, ...newConfig };
    await SecureStorage.setItem("healthSyncConfig", JSON.stringify(this.syncConfig));
    this.startPeriodicSync();

    console.log("⚙️ Sync config updated");
  }

  // ----------------------------
  // CLEAR ALL SYNC DATA
  // ----------------------------
  async clearSyncData() {
    console.log("🗑️ Clearing sync data");

    this.stopPeriodicSync();

    const keys = [
      "healthSyncConfig",
      "lastSyncResult",
      "lastDailySync",
      "lastSuccessfulSync",
    ];

    await Promise.all(keys.map((k) => SecureStorage.removeItem(k).catch(() => {})));

    if (this.syncConfig?.userId) {
      await SecureStorage.removeItem(`lastSuccessfulSync_${this.syncConfig.userId}`);
    }

    this.syncConfig = null;

    console.log("✅ Sync data cleared");
  }

  stopPeriodicSync() {
    if (this.syncTimer) clearInterval(this.syncTimer);
    if (this.appStateSubscription) this.appStateSubscription.remove();
    this.syncTimer = null;
    this.appStateSubscription = null;
  }

  // ----------------------------
  // RESTORE SYNC FROM STORAGE
  // ----------------------------
  async restoreFromStorage(): Promise<boolean> {
    try {
      const configStr = await SecureStorage.getItem("healthSyncConfig");

      if (configStr) {
        const config: SyncConfig = JSON.parse(configStr);
        await this.initializeSync(config);
        console.log("🔄 Restored sync service");
        return true;
      }

      return false;
    } catch (error) {
      console.error("❌ Restore failed:", error);
      return false;
    }
  }
}

export default new HealthDataSyncService();
