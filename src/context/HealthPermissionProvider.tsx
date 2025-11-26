import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/store/hooks';
import { store } from '@/redux/store';
import HealthService from '../services/HealthService';
import HealthDataSyncService from '../services/HealthDataSyncService';
import HealthPermissionService from '../services/HealthPermissionService';
import DeviceIdentificationService from '../services/DeviceIdentificationService';
import DeviceRegistrationService from '../services/DeviceRegistrationService';
import HealthPermissionModal from '../components/modals/HealthPermissionModal';
import DeviceRegistrationModal from '../components/modals/DeviceRegistrationModal';

interface HealthPermissionContextType {
  healthPermissionRequested: boolean;
  healthPermissionGranted: boolean;
  showHealthPermissionModal: boolean;
  showDeviceRegistrationModal: boolean;
  deviceRegistrationStatus: 'checking' | 'registered' | 'unregistered' | 'error';
  currentDeviceName: string;
  requestHealthPermission: () => void;
  setHealthPermissionGranted: (granted: boolean) => void;
  setHealthPermissionRequested: (requested: boolean) => void;
  setShowHealthPermissionModal: (show: boolean) => void;
  setShowDeviceRegistrationModal: (show: boolean) => void;
}

const HealthPermissionContext = createContext<HealthPermissionContextType | undefined>(undefined);

interface HealthPermissionProviderProps {
  children: ReactNode;
}

export const HealthPermissionProvider: React.FC<HealthPermissionProviderProps> = ({ children }) => {
  const [healthPermissionRequested, setHealthPermissionRequested] = useState(false);
  const [healthPermissionGranted, setHealthPermissionGranted] = useState(false);
  const [showHealthPermissionModal, setShowHealthPermissionModal] = useState(false);
  const [showDeviceRegistrationModal, setShowDeviceRegistrationModal] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [permissionCheckInProgress, setPermissionCheckInProgress] = useState(false);
  const [deviceRegistrationStatus, setDeviceRegistrationStatus] = useState<'checking' | 'registered' | 'unregistered' | 'error'>('checking');
  const [currentDeviceName, setCurrentDeviceName] = useState('This Device');
  const [deviceValidationInProgress, setDeviceValidationInProgress] = useState(false);
  
  // Get authentication state from Redux
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  // Initialize device info on mount
  useEffect(() => {
    const initializeDeviceInfo = async () => {
      try {
        const deviceName = await DeviceIdentificationService.getDeviceDescription();
        setCurrentDeviceName(deviceName);
      } catch (error) {
        console.error('❌ Error getting device info:', error);
      }
    };
    
    initializeDeviceInfo();
  }, []);

  // Device-aware permission check after successful login
  useEffect(() => {
    console.log('HealthPermissionProvider - Auth state changed:', {
      isAuthenticated,
      hasUser: !!user,
      userId: user?.id,
      healthPermissionRequested,
      showHealthPermissionModal,
      deviceRegistrationStatus
    });

    // Start device validation if authenticated and user data is available
    if (isAuthenticated && user?.id && !healthPermissionRequested && !permissionCheckInProgress && !deviceValidationInProgress) {
      console.log('HealthPermissionProvider - Starting device-aware permission check');
      checkDeviceAndPermissionStatus();
      return;
    }
  }, [isAuthenticated, user?.id, healthPermissionRequested]);

  /**
   * Device-aware permission check flow with device registration
   */
  const checkDeviceAndPermissionStatus = async () => {
    if (deviceValidationInProgress) {
      console.log('⏳ Device validation already in progress, skipping duplicate call');
      return;
    }

    setDeviceValidationInProgress(true);
    setDeviceRegistrationStatus('checking');
    
    try {
      const state = store.getState();
      const userId = state.auth.user?.id;
      const authToken = state.auth.token;

      if (!userId) {
        console.log('⚠️ No user ID available for device validation');
        setDeviceRegistrationStatus('error');
        return;
      }

      console.log('🔍 Starting device-aware permission check for user:', userId);
      
      // Step 1: Check if health permissions are already granted at user level
      const permissionCheck = await HealthPermissionService.checkPermissionStatus(
        userId.toString(), 
        authToken || undefined
      );
      
      if (!permissionCheck.shouldPrompt) {
        console.log('✅ Health permissions already granted, checking device registration');
        
        // Step 2: Validate device registration silently
        const deviceValidation = await DeviceRegistrationService.validateDeviceRegistration(
          userId.toString(), 
          authToken || undefined
        );

        if (!deviceValidation.isRegistered) {
          console.log('📱 Device not registered, registering silently in background');
          // Register device silently in background
          await DeviceRegistrationService.registerDevice(
            userId.toString(),
            true, // enableHealthData
            authToken || undefined
          );
        }

        setDeviceRegistrationStatus('registered');
        setHealthPermissionGranted(true);
        setHealthPermissionRequested(true);
        
        // Step 3: Start health data sync (only if not already syncing)
        if (!syncInProgress) {
          await startHealthDataSync(userId.toString(), authToken || undefined);
        }
      } else {
        console.log('📱 Health permissions not granted, showing health permission modal');
        setDeviceRegistrationStatus('checking');
        setShowHealthPermissionModal(true);
      }

    } catch (error) {
      console.error('❌ Error in device-aware permission check:', error);
      setDeviceRegistrationStatus('error');
      // Fallback to showing health permission modal on error
      setShowHealthPermissionModal(true);
    } finally {
      setDeviceValidationInProgress(false);
    }
  };

  /**
   * Industry-standard permission check flow (legacy)
   */
  const checkPermissionStatus = async () => {
    if (permissionCheckInProgress) {
      console.log('⏳ Permission check already in progress, skipping duplicate call');
      return;
    }

    setPermissionCheckInProgress(true);
    
    try {
      const state = store.getState();
      const userId = state.auth.user?.id;
      const authToken = state.auth.token;

      if (!userId) {
        console.log('⚠️ No user ID available for permission check');
        return;
      }

      console.log('🔍 Starting industry-standard permission check for user:', userId);
      
      // Use industry-standard 3-layer permission check
      const result = await HealthPermissionService.checkPermissionStatus(
        userId.toString(), 
        authToken || undefined
      );

      if (result.shouldPrompt) {
        console.log('📱 Showing health permission modal:', result.reason);
        setShowHealthPermissionModal(true);
      } else {
        console.log('✅ Permission already granted, skipping modal:', result.reason);
        setHealthPermissionGranted(true);
        setHealthPermissionRequested(true);
        
        // Start health data sync since permission is already granted (only if not already syncing)
        if (!syncInProgress) {
          await startHealthDataSync(userId.toString(), authToken || undefined);
        }
      }

    } catch (error) {
      console.error('❌ Error in permission check:', error);
      // Fallback to showing modal on error
      setShowHealthPermissionModal(true);
    } finally {
      setPermissionCheckInProgress(false);
    }
  };

  /**
   * Start health data sync after permission is granted
   */
  const startHealthDataSync = async (userId: string, authToken?: string) => {
    // Prevent duplicate sync calls
    if (syncInProgress) {
      console.log('⏳ Health data sync already in progress, skipping duplicate call');
      return;
    }

    setSyncInProgress(true);
    
    try {
      console.log('🚀 Starting automatic health data synchronization for user ID:', userId);
      
      // Initialize and start the sync service
      const syncResult = await HealthDataSyncService.startInitialSync(
        userId,
        authToken
      );
      
      console.log('✅ Health data sync service started:', syncResult);
      
      if (syncResult.success) {
        console.log(`📊 Successfully synced ${syncResult.syncedDays} days of health data`);
      } else {
        console.log(`⚠️ Partial sync: ${syncResult.syncedDays} successful, ${syncResult.failedDays} failed`);
      }
      
    } catch (error) {
      console.error('❌ Failed to start health data sync service:', error);
      // Note: Removed fallback sync to prevent duplicate sync calls
      // The HealthDataSyncService already handles retries internally
    } finally {
      setSyncInProgress(false);
    }
  };

  // Reset health permission and device states on logout
  useEffect(() => {
    if (!isAuthenticated) {
      setHealthPermissionRequested(false);
      setHealthPermissionGranted(false);
      setShowHealthPermissionModal(false);
      setShowDeviceRegistrationModal(false);
      setSyncInProgress(false);
      setPermissionCheckInProgress(false);
      setDeviceValidationInProgress(false);
      setDeviceRegistrationStatus('checking');
      console.log('🔄 Reset all health permission and device states on logout');
    }
  }, [isAuthenticated]);

  // Retry health data sync when user data becomes available
  useEffect(() => {
    const state = store.getState();
    const userId = state.auth.user?.id;
    console.log(userId)
    if (isAuthenticated && healthPermissionGranted && userId && !syncInProgress) {
      console.log('🔄 User data now available in Redux, retrying health data sync...');
      console.log('🔍 User ID from Redux store:', userId);
      // Only retry if we haven't already requested permissions and sync is not in progress
      if (!healthPermissionRequested) {
        handlePermissionGranted();
      }
    }
  }, [isAuthenticated, healthPermissionGranted, healthPermissionRequested, syncInProgress]);

  const requestHealthPermission = () => {
    setShowHealthPermissionModal(true);
  };

  const handlePermissionGranted = async () => {
    setHealthPermissionGranted(true);
    setHealthPermissionRequested(true);
    setShowHealthPermissionModal(false);
    
    console.log('Health permissions granted successfully');
    
    // Get user ID directly from Redux store
    const state = store.getState();
    const userId = state.auth.user?.id;
    const authToken = state.auth.token;
    
    console.log('🔍 Debug - Redux state:', { 
      hasUser: !!state.auth.user, 
      userId: userId, 
      hasToken: !!authToken 
    });
    
    if (userId) {
      try {
        // Step 1: Update backend permission status (industry standard)
        console.log('📝 Updating backend permission status...');
        const updateSuccess = await HealthPermissionService.updatePermissionStatus(
          userId.toString(),
          true,
          authToken || undefined
        );
        
        if (updateSuccess) {
          console.log('✅ Backend permission status updated successfully');
        } else {
          console.log('⚠️ Failed to update backend permission status');
        }
        
        // Step 2: Check if device is already registered
        console.log('📱 Checking device registration status...');
        const deviceValidation = await DeviceRegistrationService.validateDeviceRegistration(
          userId.toString(), 
          authToken || undefined
        );

        if (!deviceValidation.isRegistered) {
          console.log('📱 Device not registered, showing device registration modal');
          setDeviceRegistrationStatus('unregistered');
          setShowDeviceRegistrationModal(true);
          // Don't start sync yet - wait for device registration
          return;
        }

        if (!deviceValidation.isHealthDataEnabled) {
          console.log('📱 Device registered but health data disabled, showing device registration modal');
          setDeviceRegistrationStatus('registered');
          setShowDeviceRegistrationModal(true);
          return;
        }

        // Step 3: Device is already registered and health data enabled
        console.log('✅ Device already registered with health data enabled');
        setDeviceRegistrationStatus('registered');
        
        // Step 4: Start health data sync (only if not already syncing)
        if (!syncInProgress) {
          await startHealthDataSync(userId.toString(), authToken || undefined);
        } else {
          console.log('⏳ Sync already in progress, skipping duplicate sync call');
        }
        
      } catch (error) {
        console.error('❌ Error in permission granted flow:', error);
      }
    } else {
      console.error('❌ No user ID available in Redux store for health data sync');
      console.log('⚠️ Health data sync skipped - user not logged in or user data not loaded');
    }
  };

  const handlePermissionDenied = () => {
    setHealthPermissionGranted(false);
    setHealthPermissionRequested(true);
    setShowHealthPermissionModal(false);
    
    console.log('Health permissions denied by user');
  };

  const handleModalClose = () => {
    setShowHealthPermissionModal(false);
  };

  const handleDeviceRegistration = async () => {
    console.log('📱 User consented to device registration');
    
    try {
      const state = store.getState();
      const userId = state.auth.user?.id;
      const authToken = state.auth.token;

      if (!userId) {
        throw new Error('No user ID available for device registration');
      }

      // Register device with health data enabled
      const registrationResult = await DeviceRegistrationService.registerDevice(
        userId.toString(),
        true, // enableHealthData
        authToken || undefined
      );

      if (registrationResult.success) {
        console.log('✅ Device registered successfully:', registrationResult.device.deviceName);
        setDeviceRegistrationStatus('registered');
        setHealthPermissionGranted(true);
        setHealthPermissionRequested(true);
        
        // Start health data sync after successful registration
        if (!syncInProgress) {
          await startHealthDataSync(userId.toString(), authToken || undefined);
        }
      } else {
        throw new Error(registrationResult.message || 'Device registration failed');
      }
    } catch (error) {
      console.error('❌ Error registering device:', error);
      setDeviceRegistrationStatus('error');
      throw error; // Re-throw to be handled by modal
    }
  };

  const handleSkipDeviceRegistration = () => {
    console.log('📱 User skipped device registration');
    setDeviceRegistrationStatus('unregistered');
    setHealthPermissionRequested(true);
    // Health data sync will not start for unregistered devices
  };

  const handleDeviceModalClose = () => {
    setShowDeviceRegistrationModal(false);
  };

  return (
    <HealthPermissionContext.Provider
      value={{
        healthPermissionRequested,
        healthPermissionGranted,
        showHealthPermissionModal,
        showDeviceRegistrationModal,
        deviceRegistrationStatus,
        currentDeviceName,
        requestHealthPermission,
        setHealthPermissionGranted,
        setHealthPermissionRequested,
        setShowHealthPermissionModal,
        setShowDeviceRegistrationModal,
      }}
    >
      {children}
      
      {/* Health Permission Modal */}
      <HealthPermissionModal
        visible={showHealthPermissionModal}
        onClose={handleModalClose}
        onPermissionGranted={handlePermissionGranted}
        onPermissionDenied={handlePermissionDenied}
      />
      
      {/* Device Registration Modal */}
      <DeviceRegistrationModal
        visible={showDeviceRegistrationModal}
        onClose={handleDeviceModalClose}
        onRegisterDevice={handleDeviceRegistration}
        onSkipRegistration={handleSkipDeviceRegistration}
        deviceName={currentDeviceName}
        isNewDevice={deviceRegistrationStatus === 'unregistered'}
      />
      
    </HealthPermissionContext.Provider>
  );
};

export const useHealthPermission = () => {
  const context = useContext(HealthPermissionContext);
  if (context === undefined) {
    throw new Error('useHealthPermission must be used within a HealthPermissionProvider');
  }
  return context;
};

export default HealthPermissionProvider;
