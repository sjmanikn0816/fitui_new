import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NutritionTargets = ({ nutritionTargets }: any) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Daily Targets</Text>

      {/* Macro Grid */}
      <View style={styles.targetGrid}>
        <View style={styles.targetItem}>
          <Text style={styles.targetValue}>{nutritionTargets.calories}</Text>
          <Text style={styles.targetLabel}>Calories</Text>
        </View>
        <View style={styles.targetItem}>
          <Text style={[styles.targetValue, styles.proteinText]}>
            {nutritionTargets.protein_g}g
          </Text>
          <Text style={styles.targetLabel}>Protein</Text>
        </View>
        <View style={styles.targetItem}>
          <Text style={[styles.targetValue, styles.carbsText]}>
            {nutritionTargets.carbs_g}g
          </Text>
          <Text style={styles.targetLabel}>Carbs</Text>
        </View>
        <View style={styles.targetItem}>
          <Text style={[styles.targetValue, styles.fatText]}>
            {nutritionTargets.fat_g}g
          </Text>
          <Text style={styles.targetLabel}>Fat</Text>
        </View>
      </View>

      {/* Micronutrients */}
      {/* <View style={styles.micronutrientList}>
        <View style={styles.micronutrientRow}>
          <Text style={styles.micronutrientLabel}>Calcium</Text>
          <Text style={styles.micronutrientValue}>
            {nutritionTargets.calcium_mg} mg
          </Text>
        </View>
        <View style={styles.micronutrientRow}>
          <Text style={styles.micronutrientLabel}>Iron</Text>
          <Text style={styles.micronutrientValue}>
            {nutritionTargets.iron_mg} mg
          </Text>
        </View>
        <View style={styles.micronutrientRow}>
          <Text style={styles.micronutrientLabel}>Vitamin C</Text>
          <Text style={styles.micronutrientValue}>
            {nutritionTargets.vitamin_c_mg} mg
          </Text>
        </View>
        <View style={styles.micronutrientRow}>
          <Text style={styles.micronutrientLabel}>Potassium</Text>
          <Text style={styles.micronutrientValue}>
            {nutritionTargets.potassium_mg} mg
          </Text>
        </View>
      </View> */}
    </View>
  );
};

export default NutritionTargets;

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
  },
  targetGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f3f4f6",
    borderRadius: 20,
    padding: 12,
  
  },
  targetItem: {
    alignItems: "center",
    flex: 1,
  },
  targetValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#111827",
  },
  targetLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    fontWeight: "500",
  },
  proteinText: {
    color: "#3b82f6",
  },
  carbsText: {
    color: "#16a34a",
  },
  fatText: {
    color: "#f97316",
  },
  micronutrientList: {
    gap: 10,
  },
  micronutrientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  micronutrientLabel: {
    fontSize: 14,
    color: "#4b5563",
  },
  micronutrientValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
});
