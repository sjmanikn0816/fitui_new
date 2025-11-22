// utils/permissions.ts
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

/**
 * Request microphone permission for voice recording
 * @returns Promise<boolean> - true if permission granted, false otherwise
 */
export const requestMicrophonePermission = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    try {
      // Check if already granted
      const alreadyGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
      );

      if (alreadyGranted) {
        return true;
      }

      // Request permission
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: 'Microphone Permission',
          message: 'This app needs microphone access for voice search',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        return true;
      } else if (granted === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
        // User denied with "Don't ask again"
        Alert.alert(
          'Permission Required',
          'Microphone permission is required for voice search. Please enable it in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Open Settings', 
              onPress: () => Linking.openSettings() 
            }
          ]
        );
        return false;
      }
      
      return false;
    } catch (err) {
      console.warn('Permission request error:', err);
      return false;
    }
  }
  
  // iOS - permissions handled via Info.plist
  return true;
};