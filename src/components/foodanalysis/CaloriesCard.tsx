// components/FoodAnalysisResults/CaloriesCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { Colors } from "@/constants/Colors";

const CaloriesCard = ({ totalNutrition }) => {
  return (
    <LinearGradient colors={["#059669", "#34D399"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <Ionicons name="flame" size={32} color="#FFF" />
      <Text style={styles.value}>{totalNutrition.calories || "N/A"}</Text>
      <Text style={styles.label}>Total Calories</Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  card: { marginHorizontal: 20, marginTop: 20, borderRadius: 16, padding: 20, alignItems: "center", shadowColor: Colors.emerald, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.25, shadowRadius: 8, elevation: 5 },
  value: { fontSize: 36, fontWeight: "800", color: "#FFF", marginTop: 6 },
  label: { fontSize: 12, fontWeight: "600", color: "#FFF", opacity: 0.9, marginTop: 2, textTransform: "uppercase" },
});

export default CaloriesCard;