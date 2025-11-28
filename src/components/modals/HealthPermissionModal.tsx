import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
  Linking,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import Button from '../ui/Button';
import HealthService, { HealthPermissionStatus } from '../../services/HealthService';

interface HealthPermissionModalProps {
  visible: boolean;
  onClose: () => void;
  onPermissionGranted: () => void;
  onPermissionDenied: () => void;
}

const HealthPermissionModal: React.FC<HealthPermissionModalProps> = ({
  visible,
  onClose,
  onPermissionGranted,
  onPermissionDenied,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  // Debug logging
  console.log('HealthPermissionModal - Render with visible:', visible);
  console.log('HealthPermissionModal - Platform:', Platform.OS);
  
  if (visible) {
    console.log('HealthPermissionModal - Modal is visible, rendering content');
  }

  const handleRequestPermission = async () => {
    setIsLoading(true);
    
    try {
      const result: HealthPermissionStatus = await HealthService.initializeHealthServices();
      
      if (result.granted) {
        Alert.alert(
          'Success!',
          result.message,
          [
            {
              text: 'OK',
              onPress: () => {
                onPermissionGranted();
                onClose();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'Permission Required',
          result.message,
          [
            {
              text: 'Open Settings',
              onPress: () => {
                if (Platform.OS === 'ios') {
                  Linking.openURL('app-settings:');
                } else {
                  Linking.openSettings();
                }
              },
            },
            {
              text: 'Skip for Now',
              style: 'cancel',
              onPress: () => {
                onPermissionDenied();
                onClose();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Health permission error:', error);
      Alert.alert(
        'Error',
        'Failed to request health permissions. Please try again.',
        [
          {
            text: 'OK',
            onPress: () => {
              onPermissionDenied();
              onClose();
            },
          },
        ]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Health Integration?',
      'You can enable health data access later in your profile settings.',
      [
        {
          text: 'Go Back',
          style: 'cancel',
        },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => {
            onPermissionDenied();
            onClose();
          },
        },
      ]
    );
  };


  const screenHeight = Dimensions.get('window').height;
  const screenWidth = Dimensions.get('window').width;
  const modalMaxHeight = screenHeight * 0.85;
  const modalWidth = screenWidth > 400 ? 400 : screenWidth * 0.9;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { maxHeight: modalMaxHeight, width: modalWidth }]}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#666" />
          </TouchableOpacity>

          <View style={styles.content}>
            <View style={styles.healthIcon}>
              <MaterialIcons name="favorite" size={32} color="white" />
            </View>
            
            <Text style={styles.title}>Enable Health Tracking</Text>
            <Text style={styles.subtitle}>
              Connect with {Platform.OS === 'ios' ? 'iOS' : 'Android'} to track your fitness progress
            </Text>

            <View style={styles.benefitsList}>
              <View style={styles.benefitItem}>
                <MaterialIcons name="directions-run" size={20} color="#4ECDC4" />
                <Text style={styles.benefitText}>Track daily steps and activity</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialIcons name="local-fire-department" size={20} color="#4ECDC4" />
                <Text style={styles.benefitText}>Monitor calories burned</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialIcons name="favorite" size={20} color="#4ECDC4" />
                <Text style={styles.benefitText}>Heart rate monitoring</Text>
              </View>
              <View style={styles.benefitItem}>
                <MaterialIcons name="insights" size={20} color="#4ECDC4" />
                <Text style={styles.benefitText}>Personalized fitness insights</Text>
              </View>
            </View>
          </View>

          <View style={styles.actions}>
            <Button
              title={isLoading ? 'Requesting Permission...' : 'Allow'}
              onPress={handleRequestPermission}
              disabled={isLoading}
              style={styles.allowButton}
            />
            <Button
              title="Don't Allow"
              onPress={handleSkip}
              variant="outline"
              style={styles.denyButton}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 10,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
    zIndex: 1,
    borderRadius: 20,
    backgroundColor: Colors.bgCardHover,
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  healthIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.emerald,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 0,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 12,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    flexGrow: 1,
    justifyContent: 'center',
  },
  benefitsList: {
    marginBottom: 16,
    paddingTop: 8,
    width: '100%',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  benefitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  benefitText: {
    fontSize: 16,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 22,
    marginLeft: 12,
  },
  actions: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    gap: 12,
    backgroundColor: Colors.bgCard,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  allowButton: {
    backgroundColor: Colors.emerald,
    marginBottom: 0,
  },
  denyButton: {
    borderColor: Colors.emerald,
    marginBottom: 0,
  },
});

export default HealthPermissionModal;
