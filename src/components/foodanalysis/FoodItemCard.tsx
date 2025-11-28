// components/FoodAnalysisResults/FoodItemCard.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const FoodItemCard = ({ food }) => {
  return (
    <View style={styles.foodCard}>
      <View style={styles.foodHeader}>
        <View style={styles.foodTitleContainer}>
          <Ionicons name="restaurant" size={20} color="#FF6B35" />
          <Text style={styles.foodName}>{food.food_name}</Text>
        </View>
        <View style={styles.confidenceBadge}>
          <Text style={styles.confidenceText}>
            {(food.confidence_score * 100).toFixed(0)}%
          </Text>
        </View>
      </View>

      <View style={styles.foodDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="scale-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{food.estimated_quantity}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="flame-outline" size={16} color="#666" />
          <Text style={styles.detailText}>
            {food.nutrition?.calories != null ? `${food.nutrition.calories} kcal` : "N/A"}
          </Text>
        </View>
        {food.preparation_method && (
          <View style={styles.detailRow}>
            <Ionicons name="construct-outline" size={16} color="#666" />
            <Text style={styles.detailText}>{food.preparation_method}</Text>
          </View>
        )}
      </View>

      <View style={styles.miniMacros}>
        {["protein_g", "carbs_g", "fat_g"].map((macro) => (
          <View key={macro} style={styles.miniMacroItem}>
            <Text style={styles.miniMacroValue}>
              {food.nutrition?.[macro] != null ? `${food.nutrition[macro]}g` : "N/A"}
            </Text>
            <Text style={styles.miniMacroLabel}>
              {macro.split("_")[0].charAt(0).toUpperCase() + macro.split("_")[0].slice(1)}
            </Text>
          </View>
        ))}
      </View>

      {food.health_notes?.length > 0 && (
        <View style={styles.healthNotes}>
          {food.health_notes.map((note, idx) => (
            <View key={idx} style={styles.healthNoteBadge}>
              <Text style={styles.healthNoteText}>{note}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  foodCard: { backgroundColor: Colors.bgCard, borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.borderDark },
  foodHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  foodTitleContainer: { flexDirection: "row", alignItems: "center", flex: 1 },
  foodName: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary, marginLeft: 8 },
  confidenceBadge: { backgroundColor: "rgba(52, 211, 153, 0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  confidenceText: { fontSize: 12, fontWeight: "700", color: Colors.emerald },
  foodDetails: { flexDirection: "row", gap: 16, marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center" },
  detailText: { fontSize: 14, color: Colors.textSecondary, marginLeft: 4 },
  miniMacros: { flexDirection: "row", justifyContent: "space-around", paddingVertical: 12, backgroundColor: Colors.bgCardHover, borderRadius: 8, marginBottom: 12 },
  miniMacroItem: { alignItems: "center" },
  miniMacroValue: { fontSize: 16, fontWeight: "700", color: Colors.textPrimary },
  miniMacroLabel: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
  healthNotes: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  healthNoteBadge: { backgroundColor: "rgba(59, 130, 246, 0.15)", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  healthNoteText: { fontSize: 11, fontWeight: "600", color: "#3B82F6" },
});

export default FoodItemCard;
