import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import Button from '../ui/Button';

interface DeviceRegistrationModalProps {
  visible: boolean;
  onClose: () => void;
  onRegisterDevice: () => void;
  onSkipRegistration: () => void;
  deviceName: string;
  isNewDevice: boolean;
}

const DeviceRegistrationModal: React.FC<DeviceRegistrationModalProps> = ({
  visible,
  onClose,
  onRegisterDevice,
  onSkipRegistration,
  deviceName,
  isNewDevice,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleRegisterDevice = async () => {
    setIsLoading(true);
    
    try {
      await onRegisterDevice();
      onClose();
    } catch (error) {
      console.error('Device registration error:', error);
      Alert.alert(
        'Registration Failed',
        'Failed to register device for health data access. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipRegistration = () => {
    Alert.alert(
      'Skip Device Registration?',
      'You can register this device for health data access later in your profile settings. Health data will not be synced on this device until registered.',
      [
        {
          text: 'Go Back',
          style: 'cancel',
        },
        {
          text: 'Skip',
          style: 'destructive',
          onPress: () => {
            onSkipRegistration();
            onClose();
          },
        },
      ]
    );
  };

  const screenHeight = Dimensions.get('window').height;
  const modalMaxHeight = screenHeight * 0.85;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { maxHeight: modalMaxHeight }]}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialIcons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
            <View style={styles.iconContainer}>
              <MaterialIcons name="security" size={48} color={Colors.primary} />
            </View>
            <Text style={styles.title}>
              {isNewDevice ? 'New Device Detected' : 'Device Registration Required'}
            </Text>
            <Text style={styles.subtitle}>
              Register "{deviceName}" for secure health data access
            </Text>
          </View>

          <ScrollView 
            style={styles.scrollContent}
            contentContainerStyle={styles.scrollContentContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.infoSection}>
              <View style={styles.infoItem}>
                <MaterialIcons name="info" size={20} color={Colors.primary} />
                <Text style={styles.infoText}>
                  {isNewDevice 
                    ? 'We detected you\'re logging in from a new device. To protect your health data, each device must be registered separately.'
                    : 'This device needs to be registered before it can access your health data.'
                  }
                </Text>
              </View>
            </View>

            <View style={styles.benefitsList}>
              <Text style={styles.benefitsTitle}>Device Registration Benefits:</Text>
              
              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <MaterialIcons name="security" size={20} color={Colors.primary} />
                </View>
                <Text style={styles.benefitText}>
                  Prevents health data mixing between devices
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <MaterialIcons name="verified-user" size={20} color="#4CAF50" />
                </View>
                <Text style={styles.benefitText}>
                  Ensures data privacy and security
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <MaterialIcons name="devices" size={20} color="#FF9800" />
                </View>
                <Text style={styles.benefitText}>
                  Manage health access per device
                </Text>
              </View>

              <View style={styles.benefitItem}>
                <View style={styles.benefitIcon}>
                  <MaterialIcons name="sync" size={20} color="#9C27B0" />
                </View>
                <Text style={styles.benefitText}>
                  Enable automatic health data sync
                </Text>
              </View>
            </View>

            <View style={styles.warningSection}>
              <View style={styles.warningHeader}>
                <MaterialIcons name="warning" size={18} color="#FF9800" />
                <Text style={styles.warningTitle}>Important</Text>
              </View>
              <Text style={styles.warningText}>
                If you skip registration, health data will not be synced from this device. 
                You can register later in Profile → Device Management.
              </Text>
            </View>

            <View style={styles.deviceInfo}>
              <Text style={styles.deviceInfoTitle}>Device Information:</Text>
              <Text style={styles.deviceInfoText}>Device: {deviceName}</Text>
              <Text style={styles.deviceInfoText}>
                Status: {isNewDevice ? 'New Device' : 'Unregistered'}
              </Text>
            </View>
          </ScrollView>

          <View style={styles.actions}>
            <Button
              title={isLoading ? 'Registering Device...' : 'Register Device'}
              onPress={handleRegisterDevice}
              disabled={isLoading}
              style={styles.registerButton}
            />
            <Button
              title="Skip for Now"
              onPress={handleSkipRegistration}
              variant="outline"
              style={styles.skipButton}
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
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    width: '100%',
    maxWidth: 420,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 12,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    position: 'relative',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  closeButton: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    padding: Spacing.sm,
    zIndex: 1,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.lg,
  },
  title: {
    ...Typography.h3,
    color: Colors.text,
    textAlign: 'center',
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: Spacing.sm,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    flexGrow: 1,
  },
  infoSection: {
    marginBottom: Spacing.lg,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primaryLight,
    padding: Spacing.md,
    borderRadius: 12,
  },
  infoText: {
    ...Typography.body,
    color: Colors.text,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 22,
  },
  benefitsList: {
    marginBottom: Spacing.lg,
  },
  benefitsTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  benefitIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  benefitText: {
    ...Typography.body,
    color: Colors.text,
    flex: 1,
    lineHeight: 22,
  },
  warningSection: {
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  warningTitle: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: '#FF9800',
    marginLeft: Spacing.xs,
  },
  warningText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  deviceInfo: {
    backgroundColor: Colors.gray100,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
  },
  deviceInfoTitle: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  deviceInfoText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs / 2,
  },
  actions: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    backgroundColor: Colors.white,
  },
  registerButton: {
    marginBottom: 0,
  },
  skipButton: {
    marginBottom: 0,
  },
});

export default DeviceRegistrationModal;
