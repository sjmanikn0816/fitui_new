import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Clock, Flame, ChevronRight } from "lucide-react-native";
import { Colors } from "@/constants/Colors";
import { Meal } from "@/types/types";

interface MealCardProps {
  title: string;
  meal: Meal;
  onPress: () => void;
}

const MealCard: React.FC<MealCardProps> = ({ title, meal, onPress }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <View style={styles.cardLeft}>
      {/* <Image
        source={{
          uri: meal.image || "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
        }}
        style={styles.icon}
      /> */}
      <View style={styles.info}>
        <Text style={styles.mealType}>{title}</Text>
        <Text style={styles.mealName}>{meal.name}</Text>
        <View style={styles.meta}>
          <Clock size={12} color="#6B7280" />
          <Text style={styles.metaText}>{meal.prep_time_minutes || 15} min</Text>
          <Text style={styles.separator}>•</Text>
          <Text style={styles.metaText}>{meal.difficulty || "Easy"}</Text>
        </View>
      </View>
    </View>
    <View style={styles.cardRight}>
      <View style={styles.calories}>
        <Flame size={16} color="#f97316" />
        <Text style={styles.calText}>{meal.nutrition?.calories || 0} cal</Text>
      </View>
      <ChevronRight size={20} color="#9ca3af" />
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    marginBottom: 14,
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  cardLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  cardRight: { flexDirection: "row", alignItems: "center" },
  icon: { width: 48, height: 48, borderRadius: 12, marginRight: 12 },
  info: { flex: 1 },
  mealType: { fontSize: 12, fontWeight: "700", color: Colors.textSecondary, marginBottom: 2 },
  mealName: { fontSize: 16, fontWeight: "600", color: Colors.textPrimary },
  meta: { flexDirection: "row", alignItems: "center", marginTop: 6 },
  metaText: { fontSize: 12, color: Colors.textMuted },
  separator: { marginHorizontal: 6, fontSize: 12, color: Colors.textMuted },
  calories: { flexDirection: "row", alignItems: "center", marginRight: 12 },
  calText: { fontSize: 14, fontWeight: "600", marginLeft: 4, color: Colors.textSecondary },
});

export default MealCard;
