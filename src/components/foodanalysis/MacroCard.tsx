// components/FoodAnalysisResults/MacroCard.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Colors } from "@/constants/Colors";

const MacroCard = ({ totalNutrition }) => {
  const macros = [
    { label: "Protein", value: totalNutrition.protein_g, color: "#FF6B35", icon: "💪" },
    { label: "Carbs", value: totalNutrition.carbs_g, color: "#4ECDC4", icon: "⚡" },
    { label: "Fat", value: totalNutrition.fat_g, color: "#FFE66D", icon: "🥑" },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {macros.map((macro) => (
        <View key={macro.label} style={styles.box}>
          <Text style={styles.icon}>{macro.icon}</Text>
          <Text style={styles.label}>{macro.label}</Text>
          <Text style={styles.value}>{macro.value ?? "N/A"}</Text>
          <Text style={styles.unit}>g</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  box: { width: 110, backgroundColor: Colors.bgCard, borderRadius: 16, padding: 16, alignItems: "center", borderWidth: 1, borderColor: Colors.borderDark, shadowColor: Colors.emerald, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 1 },
  bar: { position: "absolute", top: 0, left: 0, right: 0, height: 4, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
  icon: { fontSize: 28, marginTop: 4, marginBottom: 6 },
  label: { fontSize: 11, fontWeight: "600", color: Colors.textMuted, textTransform: "uppercase", marginBottom: 6 },
  value: { fontSize: 26, fontWeight: "800", color: Colors.textPrimary },
  unit: { fontSize: 12, fontWeight: "600", color: Colors.textMuted, marginTop: 2 },
});

export default MacroCard;