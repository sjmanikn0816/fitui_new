// components/AnalyzeButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface AnalyzeButtonProps {
  loading: boolean;
  disabled: boolean;
  onPress: () => void;
}

const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ loading, disabled, onPress }) => {
  return (
    <View style={styles.footer}>
      <TouchableOpacity
        style={[styles.analyzeButton, (disabled || loading) && styles.analyzeButtonDisabled]}
        onPress={onPress}
        disabled={disabled || loading}
      >
        {loading ? (
          <ActivityIndicator color="#FFF" size="small" />
        ) : (
          <>
            <Ionicons name="checkmark-circle" size={24} color="#FFF" />
            <Text style={styles.analyzeButtonText}>Log My Meal</Text>
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 100,
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  analyzeButton: {
    backgroundColor: '#FF6B35',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  analyzeButtonDisabled: { backgroundColor: '#CCC', shadowOpacity: 0 },
  analyzeButtonText: { fontSize: 18, fontWeight: '700', color: '#FFF', marginLeft: 8 },
});

export default AnalyzeButton;
