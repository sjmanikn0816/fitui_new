import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useAppSelector } from '@/redux/store/hooks';
import HealthService from '../../services/HealthService';
import HealthDataSyncService from '../../services/HealthDataSyncService';
import Button from '../ui/Button';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';

/**
 * Debug component to test health data synchronization
 * This component helps diagnose sync issues and test the flow manually
 */
const HealthSyncDebugger: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  // Get auth state from Redux
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const logMessage = `[${timestamp}] ${message}`;
    console.log(logMessage);
    setDebugLogs(prev => [...prev, logMessage]);
  };

  const clearLogs = () => {
    setDebugLogs([]);
  };

  const testHealthPermissions = async () => {
    setLoading(true);
    addLog('🔍 Testing health permissions...');
    
    try {
      const result = await HealthService.initializeHealthServices();
      addLog(`✅ Health permissions result: ${JSON.stringify(result)}`);
      
      if (result.granted) {
        addLog('✅ Health permissions granted successfully');
      } else {
        addLog('❌ Health permissions denied');
      }
    } catch (error) {
      addLog(`❌ Health permissions error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testHealthDataFetch = async () => {
    setLoading(true);
    addLog('📊 Testing health data fetch...');
    
    try {
      const healthData = await HealthService.getHealthData(new Date());
      addLog(`📊 Health data fetched: ${JSON.stringify(healthData)}`);
    } catch (error) {
      addLog(`❌ Health data fetch error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testBackendSync = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'No user ID available. Please ensure you are logged in.');
      return;
    }

    setLoading(true);
    addLog('🚀 Testing backend sync...');
    addLog(`👤 User ID: ${user.id}`);
    addLog(`🔑 Has Token: ${!!token}`);
    
    try {
      // First get health data
      const healthData = await HealthService.getHealthData(new Date());
      addLog(`📊 Health data to sync: ${JSON.stringify(healthData)}`);
      
      // Then sync to backend
      const success = await HealthService.syncHealthDataToBackend(
        healthData,
        user.id.toString(),
        token || undefined
      );
      
      if (success) {
        addLog('✅ Backend sync successful!');
        Alert.alert('Success', 'Health data synced to backend successfully!');
      } else {
        addLog('❌ Backend sync failed');
        Alert.alert('Failed', 'Backend sync failed. Check logs for details.');
      }
    } catch (error) {
      addLog(`❌ Backend sync error: ${error}`);
      Alert.alert('Error', `Backend sync error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testFullSyncFlow = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'No user ID available. Please ensure you are logged in.');
      return;
    }

    setLoading(true);
    addLog('🔄 Testing full sync flow...');
    
    try {
      const syncResult = await HealthDataSyncService.startInitialSync(
        user.id.toString(),
        token || undefined
      );
      
      addLog(`🔄 Full sync result: ${JSON.stringify(syncResult)}`);
      
      if (syncResult.success) {
        Alert.alert('Success', `Full sync completed! ${syncResult.syncedDays} days synced.`);
      } else {
        Alert.alert('Partial Success', `Sync completed with issues: ${syncResult.syncedDays} successful, ${syncResult.failedDays} failed.`);
      }
    } catch (error) {
      addLog(`❌ Full sync error: ${error}`);
      Alert.alert('Error', `Full sync error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testManualSync = async () => {
    if (!user?.id) {
      Alert.alert('Error', 'No user ID available. Please ensure you are logged in.');
      return;
    }

    setLoading(true);
    addLog('🔄 Testing manual sync...');
    
    try {
      const success = await HealthService.getAndSyncHealthData(
        user.id.toString(),
        new Date(),
        token || undefined
      );
      
      addLog(`🔄 Manual sync result: ${success}`);
      
      if (success) {
        Alert.alert('Success', 'Manual sync completed successfully!');
      } else {
        Alert.alert('Failed', 'Manual sync failed. Check logs for details.');
      }
    } catch (error) {
      addLog(`❌ Manual sync error: ${error}`);
      Alert.alert('Error', `Manual sync error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Health Sync Debugger</Text>
        <Text style={styles.subtitle}>Debug and test health data synchronization</Text>
      </View>

      {/* Auth State Info */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Authentication State</Text>
        <Text style={styles.infoText}>Authenticated: {isAuthenticated ? '✅ Yes' : '❌ No'}</Text>
        <Text style={styles.infoText}>User ID: {user?.id || '❌ Not available'}</Text>
        <Text style={styles.infoText}>Has Token: {token ? '✅ Yes' : '❌ No'}</Text>
      </View>

      {/* Test Buttons */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Test Actions</Text>
        
        <Button
          title="Test Health Permissions"
          onPress={testHealthPermissions}
          loading={loading}
          style={styles.button}
        />
        
        <Button
          title="Test Health Data Fetch"
          onPress={testHealthDataFetch}
          loading={loading}
          style={styles.button}
        />
        
        <Button
          title="Test Backend Sync"
          onPress={testBackendSync}
          loading={loading}
          style={styles.button}
          disabled={!user?.id}
        />
        
        <Button
          title="Test Manual Sync"
          onPress={testManualSync}
          loading={loading}
          style={styles.button}
          disabled={!user?.id}
        />
        
        <Button
          title="Test Full Sync Flow"
          onPress={testFullSyncFlow}
          loading={loading}
          style={styles.button}
          disabled={!user?.id}
        />
      </View>

      {/* Debug Logs */}
      <View style={styles.section}>
        <View style={styles.logHeader}>
          <Text style={styles.sectionTitle}>Debug Logs</Text>
          <Button
            title="Clear"
            onPress={clearLogs}
            variant="outline"
            style={styles.clearButton}
          />
        </View>
        
        <ScrollView style={styles.logContainer} nestedScrollEnabled>
          {debugLogs.length === 0 ? (
            <Text style={styles.noLogsText}>No logs yet. Run a test to see debug information.</Text>
          ) : (
            debugLogs.map((log, index) => (
              <Text key={index} style={styles.logText}>
                {log}
              </Text>
            ))
          )}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  header: {
    padding: Spacing.lg,
    backgroundColor: Colors.bgCard,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  title: {
    ...Typography.h2,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  section: {
    margin: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: Colors.bgCard,
    borderRadius: 8,
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
  sectionTitle: {
    ...Typography.h3,
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  infoText: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  button: {
    marginBottom: Spacing.sm,
  },
  logHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  clearButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  logContainer: {
    maxHeight: 300,
    backgroundColor: Colors.bgCardHover,
    borderRadius: 4,
    padding: Spacing.sm,
  },
  noLogsText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontStyle: 'italic',
    textAlign: 'center',
    padding: Spacing.md,
  },
  logText: {
    ...Typography.caption,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    fontFamily: 'monospace',
  },
});

export default HealthSyncDebugger;
