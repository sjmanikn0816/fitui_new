
import DeviceIdentificationService, { DeviceFingerprint } from './DeviceIdentificationService';
import { Config } from '../constants/config';
import { SecureStorage } from './secureStorage';

export interface RegisteredDevice {
  id: string;
  userId: string;
  deviceId: string;
  deviceName: string;
  platform: string;
  deviceModel: string;
  manufacturer: string;
  isHealthDataEnabled: boolean;
  registeredAt: string;
  lastActiveAt: string;
  isCurrentDevice: boolean;
}

export interface DeviceRegistrationRequest {
  userId: string;
  deviceFingerprint: DeviceFingerprint;
  healthDataRequested: boolean;
}

export interface DeviceRegistrationResponse {
  success: boolean;
  device: RegisteredDevice;
  isNewDevice: boolean;
  message: string;
}

export interface DeviceValidationResult {
  isRegistered: boolean;
  isHealthDataEnabled: boolean;
  device: RegisteredDevice | null;
  requiresRegistration: boolean;
  message: string;
}

class DeviceRegistrationService {
  private static readonly REGISTERED_DEVICE_KEY = 'registered_device_info';
  private static readonly DEVICE_REGISTRATION_STATUS_KEY = 'device_registration_status';
  private readonly backendUrl = Config.API_BASE_URL;

  // Static getter methods to ensure keys are always available
  private static get registeredDeviceKey(): string {
    return DeviceRegistrationService.REGISTERED_DEVICE_KEY;
  }

  private static get deviceRegistrationStatusKey(): string {
    return DeviceRegistrationService.DEVICE_REGISTRATION_STATUS_KEY;
  }

  /**
   * Register current device with the backend for health data access
   */
  async registerDevice(
    userId: string, 
    enableHealthData: boolean = true,
    jwtToken?: string
  ): Promise<DeviceRegistrationResponse> {
    try {
      console.log('📱 Registering device for user:', userId);
      
      const deviceFingerprint = await DeviceIdentificationService.getDeviceFingerprint();
      
      const registrationRequest: DeviceRegistrationRequest = {
        userId,
        deviceFingerprint,
        healthDataRequested: enableHealthData,
      };

      const response = await fetch(`${this.backendUrl}/devices/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` }),
        },
        body: JSON.stringify(registrationRequest),
      });

      if (!response.ok) {
        throw new Error(`Device registration failed: ${response.status} ${response.statusText}`);
      }

      const result: DeviceRegistrationResponse = await response.json();
      
      if (result.success) {
        // Store registration info locally
        await this.storeDeviceRegistration(result.device);
        console.log('✅ Device registered successfully:', result.device.deviceName);
      }

      return result;
    } catch (error) {
      console.error('❌ Error registering device:', error);
      throw error;
    }
  }

  /**
   * Validate if current device is registered and authorized for health data
   */
  async validateDeviceRegistration(
    userId: string,
    jwtToken?: string
  ): Promise<DeviceValidationResult> {
    try {
      console.log('🔍 Validating device registration for user:', userId);
      
      const deviceFingerprint = await DeviceIdentificationService.getDeviceFingerprint();
      
      const response = await fetch(
        `${this.backendUrl}/devices/validate/${userId}/${deviceFingerprint.deviceId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` }),
          },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          return {
            isRegistered: false,
            isHealthDataEnabled: false,
            device: null,
            requiresRegistration: true,
            message: 'Device not registered for health data access',
          };
        }
        throw new Error(`Device validation failed: ${response.status} ${response.statusText}`);
      }

      const result: DeviceValidationResult = await response.json();
      
      if (result.isRegistered && result.device) {
        // Update local registration info
        await this.storeDeviceRegistration(result.device);
      }

      return result;
    } catch (error) {
      console.error('❌ Error validating device registration:', error);
      
      // Return safe default on network error
      return {
        isRegistered: false,
        isHealthDataEnabled: false,
        device: null,
        requiresRegistration: true,
        message: 'Unable to validate device registration - network error',
      };
    }
  }

  /**
   * Get list of all registered devices for a user
   */
  async getUserDevices(userId: string, jwtToken?: string): Promise<RegisteredDevice[]> {
    try {
      const response = await fetch(`${this.backendUrl}/devices/user/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch user devices: ${response.status} ${response.statusText}`);
      }

      const devices: RegisteredDevice[] = await response.json();
      return devices;
    } catch (error) {
      console.error('❌ Error fetching user devices:', error);
      return [];
    }
  }

  /**
   * Enable or disable health data access for current device
   */
  async updateHealthDataPermission(
    userId: string,
    enabled: boolean,
    jwtToken?: string
  ): Promise<boolean> {
    try {
      const deviceFingerprint = await DeviceIdentificationService.getDeviceFingerprint();
      
      const response = await fetch(
        `${this.backendUrl}/devices/${deviceFingerprint.deviceId}/health-permission`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` }),
          },
          body: JSON.stringify({
            userId,
            healthDataEnabled: enabled,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update health permission: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Update local registration status
        await this.updateLocalHealthDataStatus(enabled);
        console.log(`✅ Health data permission ${enabled ? 'enabled' : 'disabled'} for device`);
      }

      return result.success;
    } catch (error) {
      console.error('❌ Error updating health data permission:', error);
      return false;
    }
  }

  /**
   * Unregister current device
   */
  async unregisterDevice(userId: string, jwtToken?: string): Promise<boolean> {
    try {
      const deviceFingerprint = await DeviceIdentificationService.getDeviceFingerprint();
      
      const response = await fetch(
        `${this.backendUrl}/devices/${deviceFingerprint.deviceId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` }),
          },
          body: JSON.stringify({ userId }),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to unregister device: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Clear local registration data
        await this.clearDeviceRegistration();
        console.log('✅ Device unregistered successfully');
      }

      return result.success;
    } catch (error) {
      console.error('❌ Error unregistering device:', error);
      return false;
    }
  }

  /**
   * Check if current device is registered locally
   */
  async isDeviceRegisteredLocally(): Promise<boolean> {
    try {
      const registrationData = await SecureStorage.getItem(DeviceRegistrationService.registeredDeviceKey);
      return registrationData !== null;
    } catch (error) {
      console.error('❌ Error checking local device registration:', error);
      return false;
    }
  }

  /**
   * Get locally stored device registration info
   */
  async getLocalDeviceRegistration(): Promise<RegisteredDevice | null> {
    try {
      const registrationData = await SecureStorage.getItem(DeviceRegistrationService.registeredDeviceKey);
      if (registrationData) {
        return JSON.parse(registrationData);
      }
      return null;
    } catch (error) {
      console.error('❌ Error getting local device registration:', error);
      return null;
    }
  }

  /**
   * Store device registration info locally
   */
  private async storeDeviceRegistration(device: RegisteredDevice): Promise<void> {
    try {
      await SecureStorage.setItem(DeviceRegistrationService.registeredDeviceKey, JSON.stringify(device));
      await SecureStorage.setItem(DeviceRegistrationService.deviceRegistrationStatusKey, 'registered');
      console.log('💾 Stored device registration locally');
    } catch (error) {
      console.error('❌ Error storing device registration:', error);
    }
  }

  /**
   * Update local health data status
   */
  private async updateLocalHealthDataStatus(enabled: boolean): Promise<void> {
    try {
      const registrationData = await this.getLocalDeviceRegistration();
      if (registrationData) {
        registrationData.isHealthDataEnabled = enabled;
        await this.storeDeviceRegistration(registrationData);
      }
    } catch (error) {
      console.error('❌ Error updating local health data status:', error);
    }
  }

  /**
   * Clear local device registration data
   */
  async clearDeviceRegistration(): Promise<void> {
    try {
      await Promise.all([
      SecureStorage.removeItem(
        DeviceRegistrationService.registeredDeviceKey
      ),
      SecureStorage.removeItem(
        DeviceRegistrationService.deviceRegistrationStatusKey
      ),
    ]);
      console.log('🗑️ Cleared local device registration data');
    } catch (error) {
      console.error('❌ Error clearing device registration:', error);
    }
  }

  /**
   * Get device registration status summary
   */
  async getRegistrationStatus(): Promise<{
    isRegistered: boolean;
    isHealthDataEnabled: boolean;
    deviceName: string;
    registeredAt: string | null;
  }> {
    try {
      const localRegistration = await this.getLocalDeviceRegistration();
      
      if (localRegistration) {
        return {
          isRegistered: true,
          isHealthDataEnabled: localRegistration.isHealthDataEnabled,
          deviceName: localRegistration.deviceName,
          registeredAt: localRegistration.registeredAt,
        };
      }

      return {
        isRegistered: false,
        isHealthDataEnabled: false,
        deviceName: await DeviceIdentificationService.getDeviceDescription(),
        registeredAt: null,
      };
    } catch (error) {
      console.error('❌ Error getting registration status:', error);
      return {
        isRegistered: false,
        isHealthDataEnabled: false,
        deviceName: 'Unknown Device',
        registeredAt: null,
      };
    }
  }

  /**
   * Refresh device registration with backend
   */
  async refreshDeviceRegistration(userId: string, jwtToken?: string): Promise<boolean> {
    try {
      const validation = await this.validateDeviceRegistration(userId, jwtToken);
      return validation.isRegistered;
    } catch (error) {
      console.error('❌ Error refreshing device registration:', error);
      return false;
    }
  }
}

export default new DeviceRegistrationService();
