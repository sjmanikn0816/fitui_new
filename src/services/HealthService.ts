import { Platform } from 'react-native';
import DeviceIdentificationService from './DeviceIdentificationService';
import { Config } from '../constants/config';

// Conditional imports for native modules
let AppleHealthKit: any = null;
let GoogleFit: any = null;
let HealthKitPermissions: any = null;
let Scopes: any = null;

const isExpoGo = false; // Disable Expo Go simulation to ensure real data is used

// Simulate native modules for Expo Go testing
if (isExpoGo) {
  console.log('Running in Expo Go - using simulated health modules');
} else {
  try {
    if (Platform.OS === 'ios') {
      const healthModule = require('react-native-health');
      AppleHealthKit = healthModule.default;
      HealthKitPermissions = healthModule.HealthKitPermissions;
    } else if (Platform.OS === 'android') {
      const googleFitModule = require('react-native-google-fit');
      GoogleFit = googleFitModule.default;
      Scopes = googleFitModule.Scopes;
    }
  } catch (error) {
    console.log('Native health modules not available');
  }
}

export interface HealthData {
  date: string;
  steps?: number;
  calories?: number;
  heartRate?: number;
  distance?: number;
  activeMinutes?: number;
  spo2?: number;
}

export interface HealthPermissionStatus {
  granted: boolean;
  message: string;
}

class HealthService {
  private isInitialized = false;

  // HealthKit permissions for iOS
  private getHealthKitPermissions() {
    if (!AppleHealthKit) return null;
    return {
      permissions: {
        read: [
          AppleHealthKit.Constants.Permissions.Steps,
          AppleHealthKit.Constants.Permissions.ActiveEnergyBurned,
          AppleHealthKit.Constants.Permissions.HeartRate,
          AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
          AppleHealthKit.Constants.Permissions.OxygenSaturation,
        ],
        write: [],
      },
    };
  }

  // Google Fit scopes for Android
  private getGoogleFitScopes() {
    if (!Scopes) return [];
    return [
      Scopes.FITNESS_ACTIVITY_READ,
      Scopes.FITNESS_BODY_READ,
      Scopes.FITNESS_LOCATION_READ,
    ];
  }

   // Initialize health services based on platform
  async initializeHealthServices(): Promise<HealthPermissionStatus> {
    try {
      if (Platform.OS === 'ios') {
        return await this.initializeHealthKit();
      } else if (Platform.OS === 'android') {
        return await this.initializeGoogleFit();
      } else {
        return {
          granted: false,
          message: 'Health services not supported on this platform',
        };
      }
    } catch (error) {
      console.error('Health service initialization error:', error);
      return {
        granted: false,
        message: 'Failed to initialize health services',
      };
    }
  }

   // Initialize HealthKit for iOS
  private async initializeHealthKit(): Promise<HealthPermissionStatus> {
    if (!AppleHealthKit) {
      console.log('HealthKit not available: native module not loaded');
      return {
        granted: false,
        message: 'HealthKit not available on this build. Please run a native build with react-native-health configured.',
      };
    }

    return new Promise((resolve) => {
      const permissions = this.getHealthKitPermissions();
      if (!permissions) {
        resolve({
          granted: false,
          message: 'HealthKit not available on this device',
        });
        return;
      }

      AppleHealthKit.initHealthKit(permissions, (error: string) => {
        if (error) {
          console.error('HealthKit initialization error:', error);
          resolve({
            granted: false,
            message: 'HealthKit access denied. Please enable in Settings > Privacy & Security > Health.',
          });
        } else {
          this.isInitialized = true;
          resolve({
            granted: true,
            message: 'HealthKit access granted successfully',
          });
        }
      });
    });
  }

   // Initialize Google Fit for Android
  private async initializeGoogleFit(): Promise<HealthPermissionStatus> {
    if (!GoogleFit) {
      console.log('Google Fit not available: native module not loaded');
      return {
        granted: false,
        message: 'Google Fit not available on this build. Please run a native build with react-native-google-fit configured.',
      };
    }

    try {
      const scopes = this.getGoogleFitScopes();
      const authResult = await GoogleFit.authorize({
        scopes: scopes,
      });

      if (authResult.success) {
        this.isInitialized = true;
        return {
          granted: true,
          message: 'Google Fit access granted successfully',
        };
      } else {
        return {
          granted: false,
          message: 'Google Fit access denied. Please enable in Google Fit app settings.',
        };
      }
    } catch (error) {
      console.error('Google Fit initialization error:', error);
      return {
        granted: false,
        message: 'Failed to connect to Google Fit',
      };
    }
  }

   // Check if health services are available and initialized
  isHealthServiceAvailable(): boolean {
    return this.isInitialized;
  }

  async fetchHealthDataFromBackend(date: Date, userId: string, jwtToken?: string): Promise<HealthData | null> {
    try {
      const deviceInfo = await DeviceIdentificationService.getDeviceInfo();
      const apiUrl = `${Config.API_BASE_URL}/health-data`;
      const params = new URLSearchParams({
        userId: typeof userId === 'number' ? String(userId) : userId,
        date: date.toISOString().split('T')[0],
        deviceIdentifier: deviceInfo.deviceId || '',
      });
      const response = await fetch(`${apiUrl}?${params.toString()}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {}),
        },
      });
      if (!response.ok) {
        return null;
      }
      const data = await response.json();
      if (!data) return null;
      return {
        date: data.date || date.toISOString().split('T')[0],
        steps: data.steps ?? 0,
        calories: data.calories ?? 0,
        heartRate: data.heartRate ?? 0,
        distance: data.distance ?? 0,
        activeMinutes: data.activeMinutes ?? 0,
        spo2: data.spo2 ?? 0,
      };
    } catch (e) {
      return null;
    }
  }


   // Get daily step count
  async getDailySteps(date: Date): Promise<number> {
    if (!this.isInitialized) {
      throw new Error('Health service not initialized');
    }

    if (Platform.OS === 'ios') {
      return this.getHealthKitSteps(date);
    } else if (Platform.OS === 'android') {
      return this.getGoogleFitSteps(date);
    }
    return 0;
  }

   // Get steps from HealthKit (iOS)
  private async getHealthKitSteps(date: Date): Promise<number> {
    return new Promise((resolve, reject) => {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      AppleHealthKit.getDailyStepCountSamples(
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        (callbackError: string, results: any[]) => {
          if (callbackError) {
            reject(new Error(callbackError));
          } else {
            // HealthKit may return per-source aggregates; taking the max avoids double counting across sources
            const maxSteps = Array.isArray(results) && results.length > 0
              ? results.reduce((max, sample) => {
                  const v = typeof sample?.value === 'number' ? sample.value : 0;
                  return v > max ? v : max;
                }, 0)
              : 0;
            resolve(maxSteps);
          }
        }
      );
    });
  }

   // Get steps from Google Fit (Android)
  private async getGoogleFitSteps(date: Date): Promise<number> {
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const result = await GoogleFit.getDailyStepCountSamples({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      if (result && result.length > 0) {
        // Prefer merged/estimated stream to avoid double counting across multiple sources
        const preferred =
          result.find((r: any) => r.source === 'com.google.android.gms:merge_step_deltas') ||
          result.find((r: any) => r.source === 'com.google.android.gms:estimated_steps') ||
          result[0];

        // Library returns an object with steps array [{date, value}] for each source
        const stepsArray = Array.isArray(preferred?.steps) ? preferred.steps : [];
        const total = stepsArray.reduce((sum: number, s: any) => {
          const v = typeof s?.value === 'number' ? s.value : (typeof s?.steps === 'number' ? s.steps : 0);
          return sum + v;
        }, 0);
        return total;
      }
      return 0;
    } catch (error) {
      console.error('Error fetching Google Fit steps:', error);
      return 0;
    }
  }

   // Get comprehensive health data for a specific date
  async getHealthData(date: Date): Promise<HealthData> {
    if (!this.isInitialized) {
      throw new Error('Health service not initialized');
    }

    try {
      const [steps, calories, heartRate, distance, activeMinutes, spo2] = await Promise.all([
        this.getDailySteps(date),
        this.getDailyCalories(date),
        this.getAverageHeartRate(date),
        this.getDailyDistance(date),
        this.getActiveMinutes(date),
        this.getSpO2(date),
      ]);
      
      return {
        date: date.toISOString().split('T')[0],
        steps,
        calories,
        heartRate,
        distance,
        activeMinutes,
        spo2,
      };
    } catch (error) {
      console.error('Error fetching health data:', error);
      throw error;
    }
  }

   // Get simulated health data for testing in Expo Go
  private getSimulatedHealthData(date: Date): HealthData {
    const baseSteps = 6000 + Math.floor(Math.random() * 4000);
    const baseCalories = 200 + Math.floor(Math.random() * 300);
    const baseHeartRate = 65 + Math.floor(Math.random() * 20);
    const baseDistance = 3 + Math.random() * 5;
    const baseActiveMinutes = 30 + Math.floor(Math.random() * 60);
    const baseSpo2 = 95 + Math.floor(Math.random() * 5);
    return {
      date: date.toISOString().split('T')[0],
      steps: baseSteps,
      calories: baseCalories,
      heartRate: baseHeartRate,
      distance: Math.round(baseDistance * 100) / 100,
      activeMinutes: baseActiveMinutes,
      spo2: baseSpo2,
    };
  }

   // Get daily calories burned
  async getDailyCalories(date: Date): Promise<number> {
    if (Platform.OS === 'ios') {
      return this.getHealthKitCalories(date);
    } else if (Platform.OS === 'android') {
      return this.getGoogleFitCalories(date);
    }
    return 0;
  }

   // Get average heart rate for the day
  async getAverageHeartRate(date: Date): Promise<number> {
    if (Platform.OS === 'ios') {
      return this.getHealthKitHeartRate(date);
    } else if (Platform.OS === 'android') {
      return this.getGoogleFitHeartRate(date);
    }
    return 0;
  }

   // Get daily distance
  async getDailyDistance(date: Date): Promise<number> {
    if (Platform.OS === 'ios') {
      return this.getHealthKitDistance(date);
    } else if (Platform.OS === 'android') {
      return this.getGoogleFitDistance(date);
    }
    return 0;
  }

   // Get active minutes
  async getActiveMinutes(date: Date): Promise<number> {
    if (Platform.OS === 'ios') {
      return this.getHealthKitActiveMinutes(date);
    } else if (Platform.OS === 'android') {
      return this.getGoogleFitActiveMinutes(date);
    }
    return 0;
  }

   // Get SpO2 (blood oxygen saturation)
  async getSpO2(date: Date): Promise<number> {
    if (Platform.OS === 'ios') {
      return this.getHealthKitSpO2(date);
    } else if (Platform.OS === 'android') {
      return this.getGoogleFitSpO2(date);
    }
    return 0;
  }

  // iOS HealthKit methods
  private async getHealthKitCalories(date: Date): Promise<number> {
    if (!AppleHealthKit) return 0;
    
    return new Promise((resolve, reject) => {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      AppleHealthKit.getActiveEnergyBurned(
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        (callbackError: string, results: any[]) => {
          if (callbackError) {
            console.error('HealthKit calories error:', callbackError);
            resolve(0);
          } else {
            const totalCalories = results.reduce((sum, sample) => sum + sample.value, 0);
            resolve(Math.round(totalCalories));
          }
        }
      );
    });
  }

  private async getHealthKitHeartRate(date: Date): Promise<number> {
    if (!AppleHealthKit) return 0;
    
    return new Promise((resolve, reject) => {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      AppleHealthKit.getHeartRateSamples(
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        (callbackError: string, results: any[]) => {
          if (callbackError) {
            console.error('HealthKit heart rate error:', callbackError);
            resolve(0);
          } else if (results.length > 0) {
            const avgHeartRate = results.reduce((sum, sample) => sum + sample.value, 0) / results.length;
            resolve(Math.round(avgHeartRate));
          } else {
            resolve(0);
          }
        }
      );
    });
  }

  private async getHealthKitDistance(date: Date): Promise<number> {
    if (!AppleHealthKit) return 0;
    
    return new Promise((resolve, reject) => {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      AppleHealthKit.getDistanceWalkingRunning(
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        (callbackError: string, results: any[]) => {
          if (callbackError) {
            console.error('HealthKit distance error:', callbackError);
            resolve(0);
          } else {
            const totalDistance = results.reduce((sum, sample) => sum + sample.value, 0);
            resolve(Math.round(totalDistance * 100) / 100); // Round to 2 decimal places
          }
        }
      );
    });
  }

  private async getHealthKitActiveMinutes(date: Date): Promise<number> {
    // HealthKit doesn't have a direct "active minutes" metric
    // We can estimate based on exercise time or other activity data
    return 0; // Placeholder - implement based on available HealthKit data
  }

  private async getHealthKitSpO2(date: Date): Promise<number> {
    if (!AppleHealthKit) return 0;
    
    return new Promise((resolve, reject) => {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      AppleHealthKit.getOxygenSaturationSamples(
        {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
        (callbackError: string, results: any[]) => {
          if (callbackError) {
            console.error('HealthKit SpO2 error:', callbackError);
            resolve(0);
          } else if (results.length > 0) {
            // Get the most recent SpO2 reading or average
            const avgSpO2 = results.reduce((sum, sample) => sum + sample.value, 0) / results.length;
            resolve(Math.round(avgSpO2));
          } else {
            resolve(0);
          }
        }
      );
    });
  }

  // Android Google Fit methods
  private async getGoogleFitCalories(date: Date): Promise<number> {
    if (!GoogleFit) return 0;
    
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const result = await GoogleFit.getDailyCalorieSamples({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      if (result && result.length > 0) {
        return Math.round(result.reduce((sum: number, sample: any) => sum + sample.calorie, 0));
      }
      return 0;
    } catch (error) {
      console.error('Google Fit calories error:', error);
      return 0;
    }
  }

  private async getGoogleFitHeartRate(date: Date): Promise<number> {
    if (!GoogleFit) return 0;
    
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const result = await GoogleFit.getHeartRateSamples({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      if (result && result.length > 0) {
        const avgHeartRate = result.reduce((sum: number, sample: any) => sum + sample.value, 0) / result.length;
        return Math.round(avgHeartRate);
      }
      return 0;
    } catch (error) {
      console.error('Google Fit heart rate error:', error);
      return 0;
    }
  }

  private async getGoogleFitDistance(date: Date): Promise<number> {
    if (!GoogleFit) return 0;
    
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      const result = await GoogleFit.getDailyDistanceSamples({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      if (result && result.length > 0) {
        const totalDistance = result.reduce((sum: number, sample: any) => sum + sample.distance, 0);
        return Math.round(totalDistance * 100) / 100; // Convert to km and round
      }
      return 0;
    } catch (error) {
      console.error('Google Fit distance error:', error);
      return 0;
    }
  }

  private async getGoogleFitActiveMinutes(date: Date): Promise<number> {
    if (!GoogleFit) return 0;
    
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      // Google Fit has move minutes data
      const result = await GoogleFit.getMoveMinutes({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      if (result && result.length > 0) {
        return result.reduce((sum: number, sample: any) => sum + sample.duration, 0);
      }
      return 0;
    } catch (error) {
      console.error('Google Fit active minutes error:', error);
      return 0;
    }
  }

  private async getGoogleFitSpO2(date: Date): Promise<number> {
    if (!GoogleFit) return 0;
    
    try {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      // Note: Google Fit may not have direct SpO2 support in all versions
      // This is a placeholder implementation - actual API may vary
      const result = await GoogleFit.getOxygenSaturationSamples({
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      if (result && result.length > 0) {
        const avgSpO2 = result.reduce((sum: number, sample: any) => sum + sample.value, 0) / result.length;
        return Math.round(avgSpO2);
      }
      return 0;
    } catch (error) {
      console.error('Google Fit SpO2 error:', error);
      return 0;
    }
  }

   // Send health data to backend with device information
  async syncHealthDataToBackend(healthData: HealthData, userId: string, jwtToken?: string): Promise<boolean> {
    try {
      const apiUrl = `${Config.API_BASE_URL}/health-data`;

      // Source platform
      const sourcePlatform = Platform.OS === 'ios' ? 'ios_healthkit' : 'android_googlefit';
      
      // Get device information for data isolation
      const deviceInfo = await DeviceIdentificationService.getDeviceInfo();
      
      // Parse userId safely, with fallback and validation
      let parsedUserId: number;
      
      if (typeof userId === 'number') {
        parsedUserId = userId;
      } else if (typeof userId === 'string') {
        parsedUserId = parseInt(userId, 10);
        if (isNaN(parsedUserId)) {
          console.error('❌ Invalid user ID - cannot parse to number:', userId);
          throw new Error(`Invalid user ID: ${userId}. Expected a number or numeric string.`);
        }
      } else {
        console.error('❌ Invalid user ID type:', typeof userId, userId);
        throw new Error(`Invalid user ID type: ${typeof userId}. Expected a number or string.`);
      }

      const requestBody = {
        userId: parsedUserId,
        date: healthData.date,
        steps: healthData.steps,
        calories: healthData.calories,
        heartRate: healthData.heartRate,
        distance: healthData.distance,
        activeMinutes: healthData.activeMinutes,
        spo2: healthData.spo2,
        sourcePlatform: sourcePlatform,
        deviceIdentifier: deviceInfo.deviceId, // Add device ID for isolation
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(jwtToken && { 'Authorization': `Bearer ${jwtToken}` }),
        },
        body: JSON.stringify(requestBody),
      });

      console.log('📡 Response Status:', response.status);
      
      let responseData;
      try {
        responseData = await response.json();
      } catch (parseError) {
        console.error('❌ Failed to parse response JSON:', parseError);
        const responseText = await response.text();
        console.log('📄 Raw Response:', responseText);
        return false;
      }
      
      if (response.ok && responseData.success) {
        console.log('✅ Health data synced successfully', responseData);
        return true;
      } else {
        console.error('❌ Backend rejected health data:', {
          status: response.status,
          statusText: response.statusText,
          responseData
        });
        return false;
      }
    } catch (error) {
      console.error('❌ Error syncing health data to backend:', error);
      if (error instanceof TypeError && error.message.includes('Network request failed')) {
        console.error('🌐 Network Error - Check if backend is running and URL is correct');
        console.error(`🔧 Current backend URL: ${Config.API_BASE_URL}`);
      }
      return false;
    }
  }

  /**
   * Get comprehensive health data and sync to backend
   */
  async getAndSyncHealthData(userId: string, date: Date = new Date(), jwtToken?: string): Promise<boolean> {
    try {
      if (!this.isHealthServiceAvailable()) {
        throw new Error('Health service not available or not initialized');
      }

      // Get health data from device
      const healthData = await this.getHealthData(date);
      
      // Sync to backend
      const syncSuccess = await this.syncHealthDataToBackend(healthData, userId, jwtToken);
      
      if (syncSuccess) {
        console.log('✅ Health data retrieved and synced successfully');
      } else {
        console.log('⚠️ Health data retrieved but sync failed');
      }
      
      return syncSuccess;
    } catch (error) {
      console.error('❌ Error in getAndSyncHealthData:', error);
      return false;
    }
  }

  /**
   * Batch sync multiple days of health data
   */
  async batchSyncHealthData(userId: string, days: number = 7, jwtToken?: string): Promise<{ success: number; failed: number }> {
    const results = { success: 0, failed: 0 };
    
    try {
      console.log(`🔄 Starting batch sync for ${days} days`);
      
      for (let i = 0; i < days; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        try {
          const success = await this.getAndSyncHealthData(userId, date, jwtToken);
          if (success) {
            results.success++;
          } else {
            results.failed++;
          }
        } catch (error) {
          console.error(`❌ Failed to sync data for ${date.toISOString().split('T')[0]}:`, error);
          results.failed++;
        }
        
        // Add small delay between requests to avoid overwhelming the backend
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      console.log(`✅ Batch sync completed: ${results.success} successful, ${results.failed} failed`);
    } catch (error) {
      console.error('❌ Error in batch sync:', error);
    }
    
    return results;
  }
}

export default new HealthService();
