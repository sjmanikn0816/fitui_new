
import { Platform } from 'react-native';
import { SecureStorage } from './secureStorage';

// Conditional imports with fallbacks
let Application: any = null;
let Device: any = null;
let Crypto: any = null;

try {
  Application = require('expo-application');
} catch (error) {
  console.warn('expo-application not available, using fallbacks');
}

try {
  Device = require('expo-device');
} catch (error) {
  console.warn('expo-device not available, using fallbacks');
}

try {
  Crypto = require('expo-crypto');
} catch (error) {
  console.warn('expo-crypto not available, using fallbacks');
}

export interface DeviceInfo {
  deviceId: string;
  deviceName: string;
  platform: string;
  osVersion: string;
  appVersion: string;
  installationId: string;
  deviceModel: string;
  manufacturer: string;
  isPhysicalDevice: boolean;
}

export interface DeviceFingerprint {
  deviceId: string;
  fingerprint: string;
  deviceInfo: DeviceInfo;
  createdAt: string;
}

class DeviceIdentificationService {
  private static readonly DEVICE_ID_KEY = 'device_identification_id';
  private static readonly INSTALLATION_ID_KEY = 'installation_id';
  private static readonly DEVICE_FINGERPRINT_KEY = 'device_fingerprint';

  // Getter methods to ensure keys are always available
  private get deviceIdKey(): string {
    return DeviceIdentificationService.DEVICE_ID_KEY;
  }

  private get installationIdKey(): string {
    return DeviceIdentificationService.INSTALLATION_ID_KEY;
  }

  private get deviceFingerprintKey(): string {
    return DeviceIdentificationService.DEVICE_FINGERPRINT_KEY;
  }

  /**
   * Fallback crypto hash function when expo-crypto is not available
   */
  private async createSimpleHash(data: string): Promise<string> {
    // Simple hash function for fallback
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36) + Date.now().toString(36);
  }

  /**
   * Generate UUID fallback when expo-crypto is not available
   */
  private generateFallbackUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Get or generate a unique device identifier
   * This combines device hardware info with a persistent installation ID
   */
  async getDeviceId(): Promise<string> {
    try {
      // Check if we already have a stored device ID
      const storedDeviceId = await SecureStorage.getItem(this.deviceIdKey);
      if (storedDeviceId) {
        console.log('📱 Retrieved existing device ID:', storedDeviceId.substring(0, 8) + '...');
        return storedDeviceId;
      }

      // Generate new device ID
      const deviceId = await this.generateDeviceId();
      await SecureStorage.setItem(this.deviceIdKey, deviceId);
      
      console.log('📱 Generated new device ID:', deviceId.substring(0, 8) + '...');
      return deviceId;
    } catch (error) {
      console.error('❌ Error getting device ID:', error);
      // Fallback to a simple UUID if all else fails
      const fallbackId = Crypto ? await Crypto.randomUUID() : this.generateFallbackUUID();
      await SecureStorage.setItem(this.deviceIdKey, fallbackId);
      return fallbackId;
    }
  }

  /**
   * Generate a unique installation ID that persists across app launches
   * but changes if app is reinstalled
   */
  async getInstallationId(): Promise<string> {
    try {
      let installationId = await SecureStorage.getItem(this.installationIdKey);
      
      if (!installationId) {
        const newInstallationId = Crypto ? await Crypto.randomUUID() : this.generateFallbackUUID();
        await SecureStorage.setItem(this.installationIdKey, newInstallationId);
        console.log('📱 Generated new installation ID');
        return newInstallationId;
      }
      
      return installationId;
    } catch (error) {
      console.error('❌ Error getting installation ID:', error);
      return Crypto ? await Crypto.randomUUID() : this.generateFallbackUUID();
    }
  }

  /**
   * Generate a comprehensive device identifier
   */
  private async generateDeviceId(): Promise<string> {
    try {
      const installationId = await this.getInstallationId();
      
      // Collect device information with fallbacks
      const deviceInfo = {
        platform: Platform.OS,
        osVersion: Platform.Version.toString(),
        deviceName: Device?.deviceName || 'Unknown Device',
        deviceModel: Device?.modelName || 'Unknown Model',
        manufacturer: Device?.manufacturer || 'Unknown Manufacturer',
        isPhysicalDevice: Device?.isDevice || true,
        installationId: installationId,
      };

      // Create a fingerprint from device characteristics
      const fingerprintData = JSON.stringify(deviceInfo);
      const fingerprint = Crypto 
        ? await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, fingerprintData)
        : await this.createSimpleHash(fingerprintData);

      // Combine installation ID with device fingerprint for uniqueness
      const combinedData = `${installationId}_${fingerprint}`;
      const deviceId = Crypto
        ? await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, combinedData)
        : await this.createSimpleHash(combinedData);

      return deviceId;
    } catch (error) {
      console.error('❌ Error generating device ID:', error);
      // Fallback to installation ID + timestamp
      const installationId = await this.getInstallationId();
      const timestamp = Date.now().toString();
      const fallbackData = `${installationId}_${timestamp}`;
      return Crypto
        ? await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, fallbackData)
        : await this.createSimpleHash(fallbackData);
    }
  }

  /**
   * Get comprehensive device information
   */
  async getDeviceInfo(): Promise<DeviceInfo> {
    try {
      const deviceId = await this.getDeviceId();
      const installationId = await this.getInstallationId();
      
      const deviceInfo: DeviceInfo = {
        deviceId,
        deviceName: Device?.deviceName || `${Platform.OS} Device`,
        platform: Platform.OS,
        osVersion: Platform.Version.toString(),
        appVersion: Application?.nativeApplicationVersion || '1.0.0',
        installationId,
        deviceModel: Device?.modelName || 'Unknown Model',
        manufacturer: Device?.manufacturer || 'Unknown Manufacturer',
        isPhysicalDevice: Device?.isDevice || false,
      };

      return deviceInfo;
    } catch (error) {
      console.error('❌ Error getting device info:', error);
      
      // Return minimal fallback device info
      const fallbackDeviceId = Crypto ? await Crypto.randomUUID() : this.generateFallbackUUID();
      const fallbackInstallationId = Crypto ? await Crypto.randomUUID() : this.generateFallbackUUID();
      
      return {
        deviceId: fallbackDeviceId,
        deviceName: `${Platform.OS} Device`,
        platform: Platform.OS,
        osVersion: Platform.Version.toString(),
        appVersion: '1.0.0',
        installationId: fallbackInstallationId,
        deviceModel: 'Unknown Model',
        manufacturer: 'Unknown Manufacturer',
        isPhysicalDevice: false,
      };
    }
  }

  /**
   * Generate a complete device fingerprint with metadata
   */
  async getDeviceFingerprint(): Promise<DeviceFingerprint> {
    try {
      // Check if we have a cached fingerprint
      const cachedFingerprint = await SecureStorage.getItem(this.deviceFingerprintKey);
      if (cachedFingerprint) {
        const parsed = JSON.parse(cachedFingerprint);
        console.log('📱 Retrieved cached device fingerprint');
        return parsed;
      }

      // Generate new fingerprint
      const deviceInfo = await this.getDeviceInfo();
      
      // Create fingerprint hash from device characteristics (excluding timestamps)
      const fingerprintData = {
        platform: deviceInfo.platform,
        deviceModel: deviceInfo.deviceModel,
        manufacturer: deviceInfo.manufacturer,
        installationId: deviceInfo.installationId,
      };
      
      const fingerprint = Crypto
        ? await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, JSON.stringify(fingerprintData))
        : await this.createSimpleHash(JSON.stringify(fingerprintData));

      const deviceFingerprint: DeviceFingerprint = {
        deviceId: deviceInfo.deviceId,
        fingerprint,
        deviceInfo,
        createdAt: new Date().toISOString(),
      };

      // Cache the fingerprint
      await SecureStorage.setItem(this.deviceFingerprintKey, JSON.stringify(deviceFingerprint));
      
      console.log('📱 Generated new device fingerprint:', fingerprint.substring(0, 8) + '...');
      return deviceFingerprint;
    } catch (error) {
      console.error('❌ Error generating device fingerprint:', error);
      throw error;
    }
  }

  /**
   * Check if this is a new device installation
   */
  async isNewDeviceInstallation(): Promise<boolean> {
    try {
      const storedDeviceId = await SecureStorage.getItem(this.deviceIdKey);
      const storedFingerprint = await SecureStorage.getItem(this.deviceFingerprintKey);
      
      return !storedDeviceId || !storedFingerprint;
    } catch (error) {
      console.error('❌ Error checking device installation status:', error);
      return true; // Assume new installation on error for safety
    }
  }

  /**
   * Clear all device identification data (for testing or reset)
   */
  async clearDeviceIdentification(): Promise<void> {
    try {
     await Promise.all([
  SecureStorage.removeItem(this.deviceIdKey),
  SecureStorage.removeItem(this.installationIdKey),
  SecureStorage.removeItem(this.deviceFingerprintKey),
]);
      console.log('🗑️ Cleared all device identification data');
    } catch (error) {
      console.error('❌ Error clearing device identification:', error);
    }
  }

  /**
   * Get a human-readable device description
   */
  async getDeviceDescription(): Promise<string> {
    try {
      const deviceInfo = await this.getDeviceInfo();
      
      if (deviceInfo.isPhysicalDevice) {
        return `${deviceInfo.manufacturer} ${deviceInfo.deviceModel} (${deviceInfo.platform} ${deviceInfo.osVersion})`;
      } else {
        return `${deviceInfo.platform} Simulator (${deviceInfo.osVersion})`;
      }
    } catch (error) {
      console.error('❌ Error getting device description:', error);
      return `${Platform.OS} Device`;
    }
  }

  /**
   * Validate device fingerprint integrity
   */
  async validateDeviceFingerprint(): Promise<boolean> {
    try {
      const storedFingerprint = await SecureStorage.getItem(this.deviceFingerprintKey);
      if (!storedFingerprint) {
        return false;
      }

      const parsed: DeviceFingerprint = JSON.parse(storedFingerprint);
      const currentDeviceInfo = await this.getDeviceInfo();

      // Check if core device characteristics match
      const coreMatch = 
        parsed.deviceInfo.platform === currentDeviceInfo.platform &&
        parsed.deviceInfo.installationId === currentDeviceInfo.installationId &&
        parsed.deviceInfo.deviceModel === currentDeviceInfo.deviceModel;

      return coreMatch;
    } catch (error) {
      console.error('❌ Error validating device fingerprint:', error);
      return false;
    }
  }
}

export default new DeviceIdentificationService();
