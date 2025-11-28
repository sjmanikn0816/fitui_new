// components/FoodAnalysisResults/QualityScoreSection.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const QualityScoreSection = ({ totalNutrition }) => {
  const getQualityColor = (score) => {
    if (score >= 80) return Colors.emerald;
    if (score >= 60) return "#FBBF24";
    return "#F87171";
  };

  const renderQualityIndicator = (label, value) => (
    <View style={styles.qualityIndicatorItem} key={label}>
      <Ionicons
        name={value ? "checkmark-circle" : "close-circle"}
        size={20}
        color={value ? Colors.emerald : "#F87171"}
      />
      <Text style={styles.qualityIndicatorText}>{label}</Text>
    </View>
  );

  const indicators = totalNutrition.nutritional_quality_indicators || {};

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Nutritional Quality</Text>
      <View style={styles.qualityCard}>
        <View style={styles.qualityScore}>
          <Text
            style={[
              styles.qualityScoreValue,
              { color: getQualityColor(indicators.overall_quality_score) },
            ]}
          >
            {indicators.overall_quality_score?.toFixed(0) || "N/A"}
          </Text>
          <Text style={styles.qualityScoreLabel}>/ 100</Text>
        </View>
        <View style={styles.qualityIndicators}>
          {Object.entries(indicators).map(([key, value]) =>
            key !== "overall_quality_score" &&
            renderQualityIndicator(key.replace(/_/g, " "), value)
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary, marginBottom: 16 },
  qualityCard: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    padding: 20,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  qualityScore: { alignItems: "center", paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: Colors.borderDark },
  qualityScoreValue: { fontSize: 48, fontWeight: "800" },
  qualityScoreLabel: { fontSize: 16, color: Colors.textMuted, fontWeight: "600" },
  qualityIndicators: { marginTop: 16 },
  qualityIndicatorItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  qualityIndicatorText: { fontSize: 14, fontWeight: "500", color: Colors.textPrimary, marginLeft: 8, textTransform: "capitalize" },
});

export default QualityScoreSection;
