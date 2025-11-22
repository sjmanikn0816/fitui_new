
import { Platform } from "react-native";
import HealthService from "./HealthService";
import { Config } from "@/constants/config";
import { SecureStorage } from "./secureStorage";

export interface HealthPermissionStatus {
  granted: boolean;
  platform: string;
  grantedAt?: string;
  source: "os" | "backend" | "cache";
}

export interface PermissionCheckResult {
  shouldPrompt: boolean;
  reason: string;
  backendStatus?: HealthPermissionStatus | null;
  osStatus?: HealthPermissionStatus | null;
  cacheStatus?: HealthPermissionStatus | null;
}

class HealthPermissionService {
  private readonly CACHE_KEY = "health_permission_status";
  private readonly BACKEND_URL =
    `${Config.API_BASE_URL}` || "http://localhost:8000";

  async checkPermissionStatus(
    userId: string,
    jwtToken?: string
  ): Promise<PermissionCheckResult> {
    console.log("🔍 Starting industry-standard permission check for user:", userId);

    try {
      const backendStatus = await this.getBackendPermissionStatus(userId, jwtToken);
      const osStatus = await this.getOSPermissionStatus();
      const cacheStatus = await this.getCachePermissionStatus();

      const result = this.determinePromptLogic(
        backendStatus,
        osStatus,
        cacheStatus
      );

      return result;
    } catch (error) {
      console.error("❌ Error in permission check:", error);
      return {
        shouldPrompt: true,
        reason: "Error checking permission status - defaulting to prompt",
      };
    }
  }

  // Get permission status from backend
  private async getBackendPermissionStatus(
    userId: string,
    jwtToken?: string
  ): Promise<HealthPermissionStatus | null> {
    try {
      const response = await fetch(
        `${this.BACKEND_URL}/health-permission/status/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Backend request failed: ${response.status}`);
      }

      const data = await response.json();

      if (data.success) {
        return {
          granted: data.healthPermissionGranted || false,
          platform:
            data.healthPermissionPlatform ||
            (Platform.OS === "ios" ? "ios_healthkit" : "android_googlefit"),
          grantedAt: data.healthPermissionGrantedAt,
          source: "backend",
        };
      }

      return null;
    } catch (error) {
      console.error("❌ Error getting backend permission status:", error);
      return null;
    }
  }

  private async getOSPermissionStatus(): Promise<HealthPermissionStatus | null> {
    try {
      const isAvailable = HealthService.isHealthServiceAvailable();

      return {
        granted: isAvailable,
        platform: Platform.OS === "ios" ? "ios_healthkit" : "android_googlefit",
        source: "os",
      };
    } catch (error) {
      console.error("❌ Error getting OS permission status:", error);
      return null;
    }
  }

  // ⬇⬇⬇ REPLACED AsyncStorage → SecureStorage
  private async getCachePermissionStatus(): Promise<HealthPermissionStatus | null> {
    try {
      const cached = await SecureStorage.getItem(this.CACHE_KEY);
      if (cached) {
        const status = JSON.parse(cached);
        return { ...status, source: "cache" };
      }
      return null;
    } catch (error) {
      console.error("❌ Error getting cache permission status:", error);
      return null;
    }
  }

  // Logic to decide prompt
  private determinePromptLogic(
    backendStatus: HealthPermissionStatus | null,
    osStatus: HealthPermissionStatus | null,
    cacheStatus: HealthPermissionStatus | null
  ): PermissionCheckResult {
    if (backendStatus && !backendStatus.granted) {
      return {
        shouldPrompt: true,
        reason: "Backend indicates permission not granted",
        backendStatus,
        osStatus,
        cacheStatus,
      };
    }

    if (backendStatus?.granted && osStatus && !osStatus.granted) {
      return {
        shouldPrompt: true,
        reason: "Permission revoked in system settings - needs re-grant",
        backendStatus,
        osStatus,
        cacheStatus,
      };
    }

    if (backendStatus?.granted) {
      return {
        shouldPrompt: false,
        reason: "Permission already granted and valid",
        backendStatus,
        osStatus,
        cacheStatus,
      };
    }

    if (!backendStatus && cacheStatus?.granted) {
      return {
        shouldPrompt: false,
        reason: "Using cached permission status (backend unavailable)",
        backendStatus,
        osStatus,
        cacheStatus,
      };
    }

    return {
      shouldPrompt: true,
      reason: "No valid permission found - first time or expired",
      backendStatus,
      osStatus,
      cacheStatus,
    };
  }

  async updatePermissionStatus(
    userId: string,
    granted: boolean,
    jwtToken?: string
  ): Promise<boolean> {
    console.log("📝 Updating permission status:", { userId, granted });

    try {
      const platform =
        Platform.OS === "ios" ? "ios_healthkit" : "android_googlefit";

      const backendUpdated = await this.updateBackendPermissionStatus(
        userId,
        granted,
        platform,
        jwtToken
      );

      const cacheUpdated = await this.updateCachePermissionStatus(
        granted,
        platform
      );

      console.log("✅ Permission status updated:", {
        backendUpdated,
        cacheUpdated,
      });

      return backendUpdated && cacheUpdated;
    } catch (error) {
      console.error("❌ Error updating permission status:", error);
      return false;
    }
  }

  private async updateBackendPermissionStatus(
    userId: string,
    granted: boolean,
    platform: string,
    jwtToken?: string
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${this.BACKEND_URL}/health-permission/update/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(jwtToken && { Authorization: `Bearer ${jwtToken}` }),
          },
          body: JSON.stringify({ granted, platform }),
        }
      );

      const data = await response.json();
      return response.ok && data.success;
    } catch (error) {
      console.error("❌ Error updating backend permission:", error);
      return false;
    }
  }

  // ⬇⬇⬇ REPLACED AsyncStorage → SecureStorage
  private async updateCachePermissionStatus(
    granted: boolean,
    platform: string
  ): Promise<boolean> {
    try {
      const status: HealthPermissionStatus = {
        granted,
        platform,
        grantedAt: granted ? new Date().toISOString() : undefined,
        source: "cache",
      };

      await SecureStorage.setItem(this.CACHE_KEY, JSON.stringify(status));
      return true;
    } catch (error) {
      console.error("❌ Error updating cache permission:", error);
      return false;
    }
  }

  // ⬇⬇⬇ REPLACED AsyncStorage → SecureStorage (with Promise.all removeItem)
  async clearPermissionData(): Promise<void> {
    try {
      await SecureStorage.removeItem(this.CACHE_KEY);

      console.log("🗑️ Permission data cleared");
    } catch (error) {
      console.error("❌ Error clearing permission data:", error);
    }
  }

  // ⬇⬇⬇ REPLACED getItem
  async quickCacheCheck(): Promise<boolean> {
    try {
      const cached = await SecureStorage.getItem(this.CACHE_KEY);

      if (cached) {
        const status = JSON.parse(cached);
        return status.granted || false;
      }

      return false;
    } catch (error) {
      console.error("❌ Error in quick cache check:", error);
      return false;
    }
  }
}

export default new HealthPermissionService();
