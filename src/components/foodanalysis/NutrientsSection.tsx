// components/FoodAnalysisResults/NutrientsSection.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const NutrientsSection = ({ totalNutrition }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Additional Nutrients</Text>
      <View style={styles.nutrientGrid}>
        <View style={styles.nutrientItem}>
          <Ionicons name="leaf-outline" size={20} color="#4CAF50" />
          <Text style={styles.nutrientValue}>
            {totalNutrition.fiber_g != null ? `${totalNutrition.fiber_g}g` : "N/A"}
          </Text>
          <Text style={styles.nutrientLabel}>Fiber</Text>
        </View>
        <View style={styles.nutrientItem}>
          <Ionicons name="water-outline" size={20} color="#2196F3" />
          <Text style={styles.nutrientValue}>
            {totalNutrition.sugar_g != null ? `${totalNutrition.sugar_g}g` : "N/A"}
          </Text>
          <Text style={styles.nutrientLabel}>Sugar</Text>
        </View>
        <View style={styles.nutrientItem}>
          <Ionicons name="snow-outline" size={20} color="#9C27B0" />
          <Text style={styles.nutrientValue}>
            {totalNutrition.sodium_mg != null ? `${totalNutrition.sodium_mg}mg` : "N/A"}
          </Text>
          <Text style={styles.nutrientLabel}>Sodium</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#333", marginBottom: 16 },
  nutrientGrid: { flexDirection: "row", justifyContent: "space-between" },
  nutrientItem: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
    elevation: 2,
  },
  nutrientValue: { fontSize: 20, fontWeight: "700", color: "#333", marginTop: 8 },
  nutrientLabel: { fontSize: 12, fontWeight: "500", color: "#666", marginTop: 4 },
});

export default NutrientsSection;
