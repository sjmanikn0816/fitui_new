// components/FoodAnalysisResults/NutrientsSection.tsx
import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const NutrientsSection = ({ totalNutrition }) => {
  const nutrients = [
    {
      icon: "leaf-outline",
      value: totalNutrition.fiber_g,
      label: "Fiber",
      unit: "g",
      gradient: ["rgba(16, 185, 129, 0.88)", "rgba(5, 150, 105, 0.85)"],
      image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80"
    },
    {
      icon: "water-outline",
      value: totalNutrition.sugar_g,
      label: "Sugar",
      unit: "g",
      gradient: ["rgba(59, 130, 246, 0.88)", "rgba(37, 99, 235, 0.85)"],
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80"
    },
    {
      icon: "snow-outline",
      value: totalNutrition.sodium_mg,
      label: "Sodium",
      unit: "mg",
      gradient: ["rgba(168, 85, 247, 0.88)", "rgba(139, 92, 246, 0.85)"],
      image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&q=80"
    },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Additional Nutrients</Text>
      <View style={styles.nutrientGrid}>
        {nutrients.map((nutrient) => (
          <View key={nutrient.label} style={styles.nutrientItemWrapper}>
            <ImageBackground
              source={{ uri: nutrient.image }}
              style={styles.imageBg}
              imageStyle={styles.imageStyle}
            >
              <LinearGradient
                colors={nutrient.gradient}
                style={styles.overlay}
              >
                <Ionicons name={nutrient.icon as any} size={24} color="#fff" />
                <Text style={styles.nutrientValue}>
                  {nutrient.value != null ? `${nutrient.value}${nutrient.unit}` : "N/A"}
                </Text>
                <Text style={styles.nutrientLabel}>{nutrient.label}</Text>
              </LinearGradient>
            </ImageBackground>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#333", marginBottom: 16 },
  nutrientGrid: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  nutrientItemWrapper: {
    flex: 1,
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  imageBg: {
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    borderRadius: 12,
  },
  overlay: {
    flex: 1,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  nutrientValue: {
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
  },
  nutrientLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,1)",
    marginTop: 4,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default NutrientsSection;
