import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "@/utils/responsive";

const COLORS = {
  primary: "#4F46E5",
  cardBg: "#FFFFFF",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  statAge: { bg: "#DBEAFE", text: "#2563EB" },
  statWeight: { bg: "#F3E8FF", text: "#9333EA" },
  statTDEE: { bg: "#FED7AA", text: "#EA580C" },
};

export const FONT = {
  xs: moderateScale(12),
  sm: moderateScale(14),
  base:moderateScale(16),
  md: moderateScale(18),
  lg: moderateScale(20),
  xl: moderateScale(22),
  xxl: moderateScale(26),
};

interface MacroBreakdown {
  protein: { grams: number; percentage: number };
  carbohydrates: { grams: number; percentage: number };
  fat: { grams: number; percentage: number };
}

interface NutritionTargets {
  fiber_g: number;
  sodium_mg: number;
}

interface TimelineDetails {
  weight_to_lose_lbs?: number;
  weight_to_gain_lbs?: number;
  weight_to_maintain_lbs?: number;
  expected_weekly_loss_lbs?: number;
  expected_weekly_gain_lbs?: number;
  expected_weekly_maintain_lbs?: number;
  estimated_end_date: string;
}

interface NutritionPlanCardProps {
  targetCalories: number;
  calorieAdjustment: number;
  currentWeight: number;
  targetWeight: number;
  macroBreakdown: MacroBreakdown;
  nutritionTargets: NutritionTargets;
  timelineDetails: TimelineDetails;
  goal?: string;
  isCustomized: boolean;
}

export const NutritionPlanCard: React.FC<NutritionPlanCardProps> = ({
  targetCalories,
  calorieAdjustment,
  currentWeight,
  targetWeight,
  macroBreakdown,
  nutritionTargets,
  timelineDetails,
  goal,
  isCustomized,
}) => {
  const macroItems = [
    {
      label: "Protein",
      value: macroBreakdown.protein.grams,
      pct: macroBreakdown.protein.percentage,
      colors: COLORS.statAge,
    },
    {
      label: "Carbs",
      value: macroBreakdown.carbohydrates.grams,
      pct: macroBreakdown.carbohydrates.percentage,
      colors: COLORS.statWeight,
    },
    {
      label: "Fat",
      value: macroBreakdown.fat.grams,
      pct: macroBreakdown.fat.percentage,
      colors: COLORS.statTDEE,
    },
  ];

  const getWeightChangeLabel = () => {
    if (goal === "lose") return "To Lose";
    if (goal === "gain") return "To Gain";
    return "To Maintain";
  };

const getWeightChangeValue = () => {
  const t = timelineDetails || {};

  return (
    t.weight_to_lose_lbs ??
    t.weight_to_gain_lbs ??
    t.weight_to_maintain_lbs ??
    0
  );
};


  const getWeeklyLabel = () => {
  return goal === "maintain" ? "Weekly Target" : "Weekly";
};

const getWeeklyValue = () => {
  const t = timelineDetails || {};

  return (
    t.expected_weekly_loss_lbs ??
    t.expected_weekly_gain_lbs ??
    t.expected_weekly_maintain_lbs ??
    0
  );
};




  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="nutrition-outline" size={scale(18)} color={COLORS.primary} />
        <Text style={styles.cardHeaderText}>
          Nutrition Plan {isCustomized && "(Customized)"}
        </Text>
      </View>

      <View style={styles.calorieCard}>
        <Text style={styles.calorieLabel}>Daily Calorie Target</Text>
        <Text style={styles.calorieValue}>{targetCalories}</Text>
        <Text style={styles.calorieSubtext}>
          kcal/day ({calorieAdjustment} deficit)
        </Text>
      </View>

      <Text style={styles.sectionLabel}>Macro Breakdown</Text>
      <View style={styles.macroGrid}>
        {macroItems.map((m, i) => (
          <View key={i} style={[styles.macroBox, { backgroundColor: m.colors.bg }]}>
            <Text style={[styles.macroValue, { color: m.colors.text }]}>{m.value}g</Text>
            <Text style={styles.macroLabel}>{m.label}</Text>
            <Text style={[styles.macroPercent, { color: m.colors.text }]}>{m.pct}%</Text>
          </View>
        ))}
      </View>

      <View style={styles.nutrientRow}>
        <View style={styles.nutrientBox}>
          <Text style={styles.nutrientValue}>{nutritionTargets.fiber_g}g</Text>
          <Text style={styles.nutrientLabel}>Fiber</Text>
        </View>
        <View style={styles.nutrientBox}>
          <Text style={styles.nutrientValue}>{nutritionTargets.sodium_mg}</Text>
          <Text style={styles.nutrientLabel}>Sodium (mg)</Text>
        </View>
      </View>

      <View style={styles.timelineCard}>
        <Text style={styles.timelineTitle}>Timeline</Text>
        <View style={styles.timelineGrid}>
          <View style={styles.timelineRow}>
            <Text style={styles.timelineLabel}>Current</Text>
            <Text style={styles.timelineValue}>{currentWeight} lbs</Text>
          </View>
          <View style={styles.timelineRow}>
            <Text style={styles.timelineLabel}>Target</Text>
            <Text style={styles.timelineValue}>{targetWeight} lbs</Text>
          </View>
          <View style={styles.timelineRow}>
            <Text style={styles.timelineLabel}>{getWeightChangeLabel()}</Text>
            <Text style={styles.timelineValue}>{getWeightChangeValue()} lbs</Text>
          </View>
          <View style={styles.timelineRow}>
            <Text style={styles.timelineLabel}>{getWeeklyLabel()}</Text>
            <Text style={styles.timelineValue}>{getWeeklyValue()} lb</Text>
          </View>
          <View
            style={[
              styles.timelineRow,
              {
                marginTop: verticalScale(8),
                paddingTop: verticalScale(8),
                borderTopWidth: 1,
                borderTopColor: COLORS.border,
              },
            ]}
          >
            <Text style={styles.timelineLabel}>Est. End Date</Text>
          <Text style={[styles.timelineValue, { color: COLORS.primary}]}>
  {timelineDetails?.estimated_end_date || "-"}
</Text>

          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: scale(14),
    marginBottom: verticalScale(12),
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  cardHeaderText: {
    fontSize: FONT.base,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginLeft: scale(8),
  },
  calorieCard: {
    backgroundColor: COLORS.borderLight,
    margin: scale(12),
    padding: scale(20),
    borderRadius: scale(12),
    alignItems: "center",
  },
  calorieLabel: {
    fontSize: FONT.sm,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  calorieValue: {
    fontSize: FONT.xl,
    fontWeight: "900",
    color: COLORS.textSecondary,
  },
  calorieValue: {
    fontSize: FONT.xxxl,
    fontWeight: "700",
    color: COLORS.primary,
    marginVertical: verticalScale(4),
  },
  calorieSubtext: {
    fontSize: FONT.xs,
     fontWeight: "700",
    color: COLORS.textSecondary,
  },
  sectionLabel: {
    fontSize: FONT.sm,
    color: COLORS.textSecondary,
    fontWeight: "700",
    color: COLORS.textSecondary,
  },
  sectionLabel: {
    fontSize: FONT.xs,
    color: COLORS.textSecondary,
    fontWeight: "600",
    paddingHorizontal: scale(12),
    marginBottom: verticalScale(8),
  },
  macroGrid: {
    flexDirection: "row",
    paddingHorizontal: scale(12),
    gap: scale(8),
    marginBottom: verticalScale(12),
  },
  macroBox: {
    flex: 1,
    backgroundColor: COLORS.borderLight,
    borderRadius: scale(10),
    padding: scale(12),
    alignItems: "center",
  },
  macroValue: {
    fontSize: FONT.lg,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  macroLabel: {
    fontSize: FONT.xs,

    fontWeight: "800",
    color: COLORS.textSecondary,
    marginTop: verticalScale(2),
  },
  macroPercent: {
    fontSize: FONT.xs,
    fontWeight: "900",
    color: COLORS.primary,
    marginTop: verticalScale(2),
  },
  nutrientRow: {
    flexDirection: "row",
    paddingHorizontal: scale(12),
    gap: scale(8),
    marginBottom: verticalScale(12),
  },
  nutrientBox: {
    flex: 1,
    backgroundColor: COLORS.borderLight,
    borderRadius: scale(8),
    padding: scale(10),
    alignItems: "center",
  },
  nutrientValue: {
    fontSize: FONT.base,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
  nutrientLabel: {
    fontSize: FONT.xs,
    fontWeight: "800",
    color: COLORS.textSecondary,
    marginTop: verticalScale(2),
  },
  timelineCard: {
    backgroundColor: COLORS.borderLight,
    borderRadius: scale(10),
    padding: scale(12),
    margin: scale(12),
    marginTop: 0,
  },
  timelineTitle: {
    fontSize: FONT.base,
    color: COLORS.textSecondary,
    fontWeight: "800",
    marginBottom: verticalScale(10),
  },
  timelineGrid: {},
  timelineRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(6),
  },
  
  timelineLabel: {
    fontSize: FONT.sm,
    fontWeight: "800",
    color: COLORS.textSecondary,
  },
  timelineValue: {
    fontSize: FONT.sm,
    fontWeight: "900",
    color: COLORS.textPrimary,
  },
});