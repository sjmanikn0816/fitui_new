import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import HealthSyncDebugger from '../../components/debug/HealthSyncDebugger';
import { Colors } from '@/constants/Colors';

const HealthSyncDebugScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <HealthSyncDebugger />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default HealthSyncDebugScreen;
