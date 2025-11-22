// components/FoodAnalysisResults/MacroCard.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const MacroCard = ({ totalNutrition }) => {
  const macros = [
    {
      label: "Protein",
      value: totalNutrition.protein_g,
      color: "#FF6B35",
      icon: "💪",
      gradient: ["rgba(239, 68, 68, 0.88)", "rgba(220, 38, 38, 0.85)"],
      image: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&q=80"
    },
    {
      label: "Carbs",
      value: totalNutrition.carbs_g,
      color: "#4ECDC4",
      icon: "⚡",
      gradient: ["rgba(59, 130, 246, 0.88)", "rgba(37, 99, 235, 0.85)"],
      image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80"
    },
    {
      label: "Fat",
      value: totalNutrition.fat_g,
      color: "#FFE66D",
      icon: "🥑",
      gradient: ["rgba(245, 158, 11, 0.88)", "rgba(202, 138, 4, 0.85)"],
      image: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&q=80"
    },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {macros.map((macro) => (
        <View key={macro.label} style={styles.box}>
          <ImageBackground
            source={{ uri: macro.image }}
            style={styles.imageBg}
            imageStyle={styles.imageStyle}
          >
            <LinearGradient
              colors={macro.gradient}
              style={styles.overlay}
            >
              <Text style={styles.icon}>{macro.icon}</Text>
              <Text style={styles.label}>{macro.label}</Text>
              <Text style={styles.value}>{macro.value ?? "N/A"}</Text>
              <Text style={styles.unit}>g</Text>
            </LinearGradient>
          </ImageBackground>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingTop: 24, gap: 12 },
  box: {
    width: 120,
    height: 140,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3
  },
  imageBg: {
    width: "100%",
    height: "100%",
  },
  imageStyle: {
    borderRadius: 16,
  },
  overlay: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    fontSize: 28,
    marginBottom: 6,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "rgba(255,255,255,1)",
    textTransform: "uppercase",
    marginBottom: 6,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  value: {
    fontSize: 28,
    fontWeight: "900",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
  },
  unit: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255,255,255,1)",
    marginTop: 2,
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

export default MacroCard;