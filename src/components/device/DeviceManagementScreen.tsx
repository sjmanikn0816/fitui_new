import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useAppSelector } from '@/redux/store/hooks';
import DeviceRegistrationService, { RegisteredDevice } from '../../services/DeviceRegistrationService';
import DeviceIdentificationService from '../../services/DeviceIdentificationService';

const DeviceManagementScreen: React.FC = () => {
  const [devices, setDevices] = useState<RegisteredDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentDeviceId, setCurrentDeviceId] = useState<string>('');

  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);

  useEffect(() => {
    initializeDeviceInfo();
    loadDevices();
  }, []);

  const initializeDeviceInfo = async () => {
    try {
      const deviceInfo = await DeviceIdentificationService.getDeviceInfo();
      setCurrentDeviceId(deviceInfo.deviceId);
    } catch (error) {
      console.error('Error getting current device info:', error);
    }
  };

  const loadDevices = async () => {
    if (!user?.userId) return;

    try {
      setLoading(true);
      const userDevices = await DeviceRegistrationService.getUserDevices(
        user.id.toString(),
        token || undefined
      );
      setDevices(userDevices);
    } catch (error) {
      console.error('Error loading devices:', error);
      Alert.alert('Error', 'Failed to load registered devices');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDevices();
    setRefreshing(false);
  };

  const handleToggleHealthData = async (device: RegisteredDevice) => {
    if (!user?.id) return;

    try {
      const newStatus = !device.isHealthDataEnabled;
      const success = await DeviceRegistrationService.updateHealthDataPermission(
        user.id.toString(),
        newStatus,
        token || undefined
      );

      if (success) {
        Alert.alert(
          'Success',
          `Health data ${newStatus ? 'enabled' : 'disabled'} for ${device.deviceName}`,
          [{ text: 'OK', onPress: loadDevices }]
        );
      } else {
        Alert.alert('Error', 'Failed to update health data permission');
      }
    } catch (error) {
      console.error('Error updating health data permission:', error);
      Alert.alert('Error', 'Failed to update health data permission');
    }
  };

  const handleUnregisterDevice = (device: RegisteredDevice) => {
    if (device.deviceId === currentDeviceId) {
      Alert.alert(
        'Cannot Unregister',
        'You cannot unregister the current device. Please use another device to manage this one.'
      );
      return;
    }

    Alert.alert(
      'Unregister Device',
      `Are you sure you want to unregister "${device.deviceName}"? This will prevent health data sync from this device.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Unregister',
          style: 'destructive',
          onPress: () => performUnregister(device),
        },
      ]
    );
  };

  const performUnregister = async (device: RegisteredDevice) => {
    if (!user?.id) return;

    try {
      const success = await DeviceRegistrationService.unregisterDevice(
        user.id.toString(),
        token || undefined
      );

      if (success) {
        Alert.alert(
          'Success',
          `${device.deviceName} has been unregistered`,
          [{ text: 'OK', onPress: loadDevices }]
        );
      } else {
        Alert.alert('Error', 'Failed to unregister device');
      }
    } catch (error) {
      console.error('Error unregistering device:', error);
      Alert.alert('Error', 'Failed to unregister device');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'ios':
        return 'phone-iphone';
      case 'android':
        return 'phone-android';
      default:
        return 'devices';
    }
  };

  const renderDevice = (device: RegisteredDevice) => {
    const isCurrentDevice = device.deviceId === currentDeviceId;

    return (
      <View key={device.id} style={[styles.deviceCard, isCurrentDevice && styles.currentDeviceCard]}>
        <View style={styles.deviceHeader}>
          <View style={styles.deviceInfo}>
            <View style={styles.deviceIconContainer}>
              <MaterialIcons
                name={getPlatformIcon(device.platform)}
                size={24}
                color={isCurrentDevice ? Colors.primary : Colors.textSecondary}
              />
            </View>
            <View style={styles.deviceDetails}>
              <Text style={[styles.deviceName, isCurrentDevice && styles.currentDeviceText]}>
                {device.deviceName}
                {isCurrentDevice && ' (This Device)'}
              </Text>
              <Text style={styles.devicePlatform}>
                {device.platform.toUpperCase()} • {device.deviceModel}
              </Text>
              <Text style={styles.deviceDate}>
                Registered: {formatDate(device.registeredAt)}
              </Text>
              <Text style={styles.deviceDate}>
                Last Active: {formatDate(device.lastActiveAt)}
              </Text>
            </View>
          </View>
          
          <View style={styles.deviceStatus}>
            <View style={[
              styles.statusBadge,
              device.isHealthDataEnabled ? styles.enabledBadge : styles.disabledBadge
            ]}>
              <Text style={[
                styles.statusText,
                device.isHealthDataEnabled ? styles.enabledText : styles.disabledText
              ]}>
                {device.isHealthDataEnabled ? 'Health Data ON' : 'Health Data OFF'}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.deviceActions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.toggleButton]}
            onPress={() => handleToggleHealthData(device)}
          >
            <MaterialIcons
              name={device.isHealthDataEnabled ? 'toggle-on' : 'toggle-off'}
              size={20}
              color={device.isHealthDataEnabled ? Colors.primary : Colors.textSecondary}
            />
            <Text style={styles.actionButtonText}>
              {device.isHealthDataEnabled ? 'Disable' : 'Enable'} Health Data
            </Text>
          </TouchableOpacity>

          {!isCurrentDevice && (
            <TouchableOpacity
              style={[styles.actionButton, styles.unregisterButton]}
              onPress={() => handleUnregisterDevice(device)}
            >
              <MaterialIcons name="delete-outline" size={20} color="#E74C3C" />
              <Text style={[styles.actionButtonText, styles.unregisterText]}>
                Unregister
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <MaterialIcons name="devices" size={48} color={Colors.textSecondary} />
        <Text style={styles.loadingText}>Loading your devices...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Device Management</Text>
        <Text style={styles.subtitle}>
          Manage which devices can access your health data
        </Text>
      </View>

      <View style={styles.infoCard}>
        <MaterialIcons name="info" size={20} color={Colors.primary} />
        <Text style={styles.infoText}>
          For your privacy and security, each device must be registered separately to access health data.
          You can enable or disable health data sync for each device individually.
        </Text>
      </View>

      <View style={styles.devicesSection}>
        <Text style={styles.sectionTitle}>
          Registered Devices ({devices.length})
        </Text>
        
        {devices.length === 0 ? (
          <View style={styles.emptyState}>
            <MaterialIcons name="devices-other" size={64} color={Colors.textSecondary} />
            <Text style={styles.emptyTitle}>No Devices Registered</Text>
            <Text style={styles.emptySubtitle}>
              Devices will appear here when you grant health permissions
            </Text>
          </View>
        ) : (
          devices.map(renderDevice)
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.primaryLight,
    margin: Spacing.lg,
    padding: Spacing.md,
    borderRadius: 12,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.text,
    marginLeft: Spacing.sm,
    flex: 1,
    lineHeight: 18,
  },
  devicesSection: {
    padding: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginBottom: Spacing.md,
  },
  deviceCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currentDeviceCard: {
    borderColor: Colors.primary,
    borderWidth: 2,
  },
  deviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  deviceInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  deviceIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    ...Typography.bodyMedium,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.xs / 2,
  },
  currentDeviceText: {
    color: Colors.primary,
  },
  devicePlatform: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs / 2,
  },
  deviceDate: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontSize: 12,
  },
  deviceStatus: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: 12,
  },
  enabledBadge: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  disabledBadge: {
    backgroundColor: 'rgba(158, 158, 158, 0.1)',
  },
  statusText: {
    ...Typography.caption,
    fontSize: 12,
    fontWeight: '600',
  },
  enabledText: {
    color: '#4CAF50',
  },
  disabledText: {
    color: Colors.textSecondary,
  },
  deviceActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
    flex: 1,
  },
  toggleButton: {
    backgroundColor: Colors.gray100,
  },
  unregisterButton: {
    backgroundColor: 'rgba(231, 76, 60, 0.1)',
  },
  actionButtonText: {
    ...Typography.caption,
    marginLeft: Spacing.xs,
    fontWeight: '500',
  },
  unregisterText: {
    color: '#E74C3C',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl * 2,
  },
  emptyTitle: {
    ...Typography.h4,
    color: Colors.text,
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  emptySubtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
});

export default DeviceManagementScreen;
