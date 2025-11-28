import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { useAppSelector } from '@/redux/store/hooks';
import HealthService, { HealthData } from '../../services/HealthService';
import HealthDataSyncService, { SyncResult } from '../../services/HealthDataSyncService';
import Button from '../ui/Button';

interface HealthMetricCardProps {
  title: string;
  value: string | number;
  unit: string;
  icon: string;
  color: string;
}

const HealthMetricCard: React.FC<HealthMetricCardProps> = ({
  title,
  value,
  unit,
  icon,
  color,
}) => (
  <View style={styles.metricCard}>
    <View style={[styles.metricIcon, { backgroundColor: color + '20' }]}>
      <MaterialIcons name={icon as any} size={24} color={color} />
    </View>
    <View style={styles.metricContent}>
      <Text style={styles.metricTitle}>{title}</Text>
      <Text style={styles.metricValue}>
        {value} <Text style={styles.metricUnit}>{unit}</Text>
      </Text>
    </View>
  </View>
);

interface HealthDashboardProps {
  userId?: string;
}

const HealthDashboard: React.FC<HealthDashboardProps> = ({ userId }) => {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [syncStatus, setSyncStatus] = useState<{
    isActive: boolean;
    lastSyncResult: SyncResult | null;
    nextSyncTime: string | null;
  } | null>(null);

  // Get user data from Redux if not provided as prop
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const effectiveUserId = userId || user?.userId?.toString();

  useEffect(() => {
    if (effectiveUserId) {
      loadTodaysHealthData();
      loadSyncStatus();
    }
  }, [effectiveUserId]);

  const loadSyncStatus = async () => {
    try {
      const status = await HealthDataSyncService.getSyncStatus();
      setSyncStatus(status);
      
      if (status.lastSyncResult?.lastSyncDate) {
        setLastSyncTime(new Date(status.lastSyncResult.lastSyncDate));
      }
    } catch (error) {
      console.error('❌ Error loading sync status:', error);
    }
  };

  const loadTodaysHealthData = async () => {
    if (!effectiveUserId) return;

    setLoading(true);
    try {
      // Try to get health data from device
      const todaysData = await HealthService.getHealthData(new Date());
      setHealthData(todaysData);
      console.log('📊 Loaded today\'s health data:', todaysData);
    } catch (error) {
      console.error('❌ Error loading health data:', error);
      Alert.alert('Error', 'Failed to load health data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncData = async () => {
    if (!effectiveUserId) {
      Alert.alert('Error', 'User not found. Please log in again.');
      return;
    }

    setRefreshing(true);
    try {
      console.log('🔄 Starting manual health data sync...');
      
      // Use the sync service for better management
      const syncResult = await HealthDataSyncService.manualSync();
      
      if (syncResult.success) {
        setLastSyncTime(new Date());
        await loadTodaysHealthData(); // Refresh the displayed data
        await loadSyncStatus(); // Update sync status
        
        Alert.alert(
          'Success', 
          `Health data synced successfully! ${syncResult.syncedDays} days synced.`
        );
      } else {
        Alert.alert(
          'Sync Failed', 
          `Unable to sync all data. ${syncResult.syncedDays} successful, ${syncResult.failedDays} failed.`
        );
      }
    } catch (error) {
      console.error('❌ Error syncing health data:', error);
      Alert.alert('Error', 'Failed to sync health data. Please check your connection.');
    } finally {
      setRefreshing(false);
    }
  };

  const handleBatchSync = async () => {
    if (!effectiveUserId) return;

    Alert.alert(
      'Sync Health Data',
      'This will sync the last 7 days of health data. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sync',
          onPress: async () => {
            setRefreshing(true);
            try {
              const results = await HealthService.batchSyncHealthData(
                effectiveUserId,
                7,
                token || undefined
              );
              
              setLastSyncTime(new Date());
              await loadTodaysHealthData();
              
              Alert.alert(
                'Sync Complete',
                `Successfully synced ${results.success} days of data.${
                  results.failed > 0 ? ` ${results.failed} days failed.` : ''
                }`
              );
            } catch (error) {
              console.error('❌ Batch sync error:', error);
              Alert.alert('Error', 'Failed to sync historical data.');
            } finally {
              setRefreshing(false);
            }
          },
        },
      ]
    );
  };

  const requestHealthPermissions = async () => {
    try {
      const result = await HealthService.initializeHealthServices();
      if (result.granted) {
        Alert.alert('Success', result.message);
        await loadTodaysHealthData();
      } else {
        Alert.alert('Permission Required', result.message);
      }
    } catch (error) {
      console.error('❌ Permission request error:', error);
      Alert.alert('Error', 'Failed to request health permissions.');
    }
  };

  if (!effectiveUserId) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Please log in to view health data</Text>
      </View>
    );
  }

  if (loading && !healthData) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading health data...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleSyncData} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Health Dashboard</Text>
        <Text style={styles.subtitle}>Today's Activity</Text>
        
        {/* Sync Status Indicator */}
        <View style={styles.syncStatusContainer}>
          {syncStatus?.isActive && (
            <View style={styles.syncActiveIndicator}>
              <MaterialIcons name="sync" size={16} color={Colors.success} />
              <Text style={styles.syncActiveText}>Auto-sync active</Text>
            </View>
          )}
          
          {lastSyncTime && (
            <Text style={styles.syncTime}>
              Last synced: {lastSyncTime.toLocaleTimeString()}
            </Text>
          )}
          
          {syncStatus?.lastSyncResult && (
            <Text style={[
              styles.syncResultText,
              { color: syncStatus.lastSyncResult.success ? Colors.success : Colors.warning }
            ]}>
              {syncStatus.lastSyncResult.success 
                ? `✅ ${syncStatus.lastSyncResult.syncedDays} days synced`
                : `⚠️ ${syncStatus.lastSyncResult.syncedDays}/${syncStatus.lastSyncResult.syncedDays + syncStatus.lastSyncResult.failedDays} synced`
              }
            </Text>
          )}
        </View>
      </View>

      {!HealthService.isHealthServiceAvailable() && (
        <View style={styles.permissionBanner}>
          <MaterialIcons name="warning" size={24} color={Colors.warning} />
          <View style={styles.permissionContent}>
            <Text style={styles.permissionTitle}>Health Access Required</Text>
            <Text style={styles.permissionText}>
              Enable health data access to track your fitness progress
            </Text>
          </View>
          <Button
            title="Enable"
            onPress={requestHealthPermissions}
            style={styles.permissionButton}
          />
        </View>
      )}

      {healthData ? (
        <View style={styles.metricsContainer}>
          <HealthMetricCard
            title="Steps"
            value={healthData.steps?.toLocaleString() || '0'}
            unit="steps"
            icon="directions-walk"
            color={Colors.primary}
          />
          
          <HealthMetricCard
            title="Calories"
            value={healthData.calories || '0'}
            unit="kcal"
            icon="local-fire-department"
            color="#FF6B35"
          />
          
          <HealthMetricCard
            title="Heart Rate"
            value={healthData.heartRate || '0'}
            unit="bpm"
            icon="favorite"
            color="#E74C3C"
          />
          
          <HealthMetricCard
            title="Distance"
            value={healthData.distance?.toFixed(1) || '0.0'}
            unit="km"
            icon="straighten"
            color="#3498DB"
          />
          
          <HealthMetricCard
            title="Active Minutes"
            value={healthData.activeMinutes || '0'}
            unit="min"
            icon="timer"
            color="#2ECC71"
          />
          
          <HealthMetricCard
            title="Blood Oxygen"
            value={healthData.spo2 || '0'}
            unit="%"
            icon="air"
            color="#9B59B6"
          />
        </View>
      ) : (
        <View style={styles.noDataContainer}>
          <MaterialIcons name="fitness-center" size={64} color={Colors.textSecondary} />
          <Text style={styles.noDataTitle}>No Health Data</Text>
          <Text style={styles.noDataText}>
            Sync your health data to see your daily activity
          </Text>
        </View>
      )}

      <View style={styles.actions}>
        <Button
          title="Sync Today's Data"
          onPress={handleSyncData}
          loading={refreshing}
          style={styles.actionButton}
        />
        
        <Button
          title="Sync Last 7 Days"
          onPress={handleBatchSync}
          variant="outline"
          loading={refreshing}
          style={styles.actionButton}
        />
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About Health Integration</Text>
        <Text style={styles.infoText}>
          This app integrates with {Platform.OS === 'ios' ? 'HealthKit' : 'Google Fit'} to 
          track your daily activity. Your health data is securely stored and only used to 
          provide personalized fitness insights.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgPrimary,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginTop: Spacing.md,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  title: {
    ...Typography.h1,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  syncTime: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  syncStatusContainer: {
    marginTop: Spacing.sm,
    gap: Spacing.xs,
  },
  syncActiveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  syncActiveText: {
    ...Typography.caption,
    color: Colors.success,
    fontWeight: '500',
  },
  syncResultText: {
    ...Typography.caption,
    fontWeight: '500',
  },
  permissionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.warning + '10',
    padding: Spacing.md,
    margin: Spacing.lg,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  permissionContent: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  permissionTitle: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  permissionText: {
    ...Typography.caption,
    color: Colors.textSecondary,
  },
  permissionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  metricsContainer: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  metricCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.bgCard,
    padding: Spacing.lg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  metricIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  metricContent: {
    flex: 1,
  },
  metricTitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  metricValue: {
    ...Typography.h2,
    color: Colors.textPrimary,
  },
  metricUnit: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  noDataContainer: {
    alignItems: 'center',
    padding: Spacing.xl,
  },
  noDataTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  noDataText: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  actions: {
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  actionButton: {
    marginBottom: 0,
  },
  infoSection: {
    padding: Spacing.lg,
    backgroundColor: Colors.bgCard,
    margin: Spacing.lg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  infoTitle: {
    ...Typography.bodyMedium,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  infoText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  errorText: {
    ...Typography.body,
    color: Colors.error,
    textAlign: 'center',
    margin: Spacing.lg,
  },
});

export default HealthDashboard;
