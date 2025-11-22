// components/MealPlanPreview.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MealPlanPreviewProps {
  mealPlan: any;
}

const MealPlanPreview: React.FC<MealPlanPreviewProps> = ({ mealPlan }) => {
  const breakfastCount = mealPlan?.daily_plan?.breakfast_options?.length || 0;
  const lunchCount = mealPlan?.daily_plan?.lunch_options?.length || 0;
  const dinnerCount = mealPlan?.daily_plan?.dinner_options?.length || 0;

  return (
    <View style={styles.previewSection}>
      <Text style={styles.previewTitle}>Meal Plan Preview</Text>
      <View style={styles.previewBox}>
        <Ionicons name="document-text" size={40} color="#10b981" />
        <Text style={styles.previewText}>
          {breakfastCount} Breakfast + {lunchCount} Lunch + {dinnerCount} Dinner options
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  previewSection: {
    marginBottom: 24,
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  previewBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#86efac',
  },
  previewText: {
    marginTop: 12,
    fontSize: 14,
    color: '#166534',
    textAlign: 'center',
  },
});

export default MealPlanPreview;