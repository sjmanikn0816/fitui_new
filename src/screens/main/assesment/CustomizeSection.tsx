import React from "react";
import { View, Text, TouchableOpacity, Animated, ActivityIndicator, StyleSheet, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "@/utils/responsive";

const COLORS = {
  primary: "#4F46E5",
  white: "#FFFFFF",
  cardBg: "#FFFFFF",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  inputBg: "#F9FAFB",
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

const WEIGHT_GOALS = [
  { id: "lose", label: "Lose Weight", icon: "trending-down" },
  { id: "maintain", label: "Maintain Weight", icon: "remove" },
  { id: "gain", label: "Gain Weight", icon: "trending-up" },
];

interface Timeline {
  approach_name: string;
  target_weight_lbs: number;
  timeline_weeks: number;
  weekly_rate: number;
  weight_loss_rate?: string;
}

interface CustomizeSectionProps {
  showCustomize: boolean;
  customizeHeight: Animated.Value;
  targetWeights: number[];
  selectedTarget: number | null;
  selectedApproach: string | null;
  filteredTimelines: Timeline[];
  currentWeight: number;
  loading: boolean;
  onToggleCustomize: () => void;
  onSelectTarget: (weight: number) => void;
  onSelectApproach: (id: string) => void;
  onConfirm: () => void;
  // New props
  customCurrentWeight?: string;
  customTargetWeight?: string;
  customWeeks?: string;
  selectedWeightGoal?: string;
  onCurrentWeightChange?: (value: string) => void;
  onTargetWeightChange?: (value: string) => void;
  onWeeksChange?: (value: string) => void;
  onWeightGoalSelect?: (goal: string) => void;
}

export const CustomizeSection: React.FC<CustomizeSectionProps> = ({
  showCustomize,
  customizeHeight,
  targetWeights,
  selectedTarget,
  selectedApproach,
  filteredTimelines,
  currentWeight,
  loading,
  onToggleCustomize,
  onSelectTarget,
  onSelectApproach,
  onConfirm,
  customCurrentWeight = "",
  customTargetWeight = "",
  customWeeks = "",
  selectedWeightGoal = "",
  onCurrentWeightChange = () => {},
  onTargetWeightChange = () => {},
  onWeeksChange = () => {},
  onWeightGoalSelect = () => {},
}) => {
  const formatText = (text: string): string =>
    text ? text.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "";

  const getApproachIcon = (name: string) => {
    if (name.includes("conservative")) return "walk-outline";
    if (name.includes("moderate")) return "fitness-outline";
    return "rocket-outline";
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={onToggleCustomize} activeOpacity={0.7}>
        <View style={styles.customizeHeader}>
          <View style={styles.customizeLeft}>
            <View style={styles.customizeIcon}>
              <Ionicons name="options-outline" size={scale(20)} color={COLORS.primary} />
            </View>
            <View>
              <Text style={styles.customizeTitle}>Want to Goal Customize?</Text>
              <Text style={styles.customizeSubtitle}>Personalized Nutrition Plan</Text>
            </View>
          </View>
          <Animated.View
            style={{
              transform: [
                {
                  rotate: customizeHeight.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "180deg"],
                  }),
                },
              ],
            }}
          >
            <Ionicons name="chevron-down" size={scale(20)} color={COLORS.textTertiary} />
          </Animated.View>
        </View>
      </TouchableOpacity>

      {showCustomize && (
        <Animated.View style={[styles.customizeContent, { opacity: customizeHeight }]}>
          <View style={styles.card}>
            {/* Step 1: Current Weight */}
            <Text style={styles.stepTitle}>Step 1: Current Weight</Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={customCurrentWeight}
                onChangeText={onCurrentWeightChange}
                placeholder="Enter current weight"
                keyboardType="numeric"
                placeholderTextColor={COLORS.textTertiary}
              />
              <Text style={styles.inputUnit}>lbs</Text>
            </View>

            {/* Step 2: Weight Goal */}
            <Text style={[styles.stepTitle, { marginTop: verticalScale(20) }]}>
              Step 2: Weight Goal
            </Text>
            <View style={styles.goalGrid}>
              {WEIGHT_GOALS.map((goal) => (
                <TouchableOpacity
                  key={goal.id}
                  style={[
                    styles.goalButton,
                    selectedWeightGoal === goal.id && styles.goalButtonActive,
                  ]}
                  onPress={() => onWeightGoalSelect(goal.id)}
                >
                  <Ionicons
                    name={goal.icon as any}
                    size={scale(24)}
                    color={selectedWeightGoal === goal.id ? COLORS.primary : COLORS.textSecondary}
                  />
                  <Text
                    style={[
                      styles.goalLabel,
                      selectedWeightGoal === goal.id && styles.goalLabelActive,
                    ]}
                  >
                    {goal.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Step 3: Target Weight */}
            <Text style={[styles.stepTitle, { marginTop: verticalScale(20) }]}>
              Step 3: Target Weight
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={customTargetWeight}
                onChangeText={onTargetWeightChange}
                placeholder="Enter target weight"
                keyboardType="numeric"
                placeholderTextColor={COLORS.textTertiary}
              />
              <Text style={styles.inputUnit}>lbs</Text>
            </View>

            {customCurrentWeight && customTargetWeight && (
              <View style={styles.weightDiffContainer}>
                <Ionicons name="swap-vertical" size={scale(16)} color={COLORS.primary} />
                <Text style={styles.weightDiffText}>
                  {Math.abs(parseFloat(customCurrentWeight) - parseFloat(customTargetWeight)).toFixed(1)} lbs{" "}
                  {parseFloat(customCurrentWeight) > parseFloat(customTargetWeight) ? "to lose" : "to gain"}
                </Text>
              </View>
            )}

            {/* Step 4: Timeline */}
            <Text style={[styles.stepTitle, { marginTop: verticalScale(20) }]}>
              Step 4: Timeline (Optional)
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={customWeeks}
                onChangeText={onWeeksChange}
                placeholder="Enter weeks (optional)"
                keyboardType="numeric"
                placeholderTextColor={COLORS.textTertiary}
              />
              <Text style={styles.inputUnit}>weeks</Text>
            </View>

       

            {/* Step 5: Approach (if target selected) */}
            {selectedTarget !== null && filteredTimelines.length > 0 && (
              <>
                <Text style={[styles.stepTitle, { marginTop: verticalScale(20) }]}>
                  Step 5: Choose Approach
                </Text>
                {filteredTimelines.map((t) => {
                  const id = `${t.approach_name}-${t.target_weight_lbs}`;
                  return (
                    <TouchableOpacity
                      key={id}
                      style={[
                        styles.approachButton,
                        selectedApproach === id && styles.approachButtonActive,
                      ]}
                      onPress={() => onSelectApproach(id)}
                    >
                      <View style={styles.approachLeft}>
                        <Ionicons
                          name={getApproachIcon(t.approach_name) as any}
                          size={scale(22)}
                          color={selectedApproach === id ? COLORS.primary : COLORS.textSecondary}
                        />
                        <View style={styles.approachInfo}>
                          <Text
                            style={[
                              styles.approachName,
                              selectedApproach === id && styles.approachNameActive,
                            ]}
                          >
                            {formatText(t.approach_name)}
                          </Text>
                          <Text style={styles.approachRate}>{t.weekly_rate} lb/week</Text>
                        </View>
                      </View>
                      <View style={styles.approachRight}>
                        <Text
                          style={[
                            styles.approachWeeks,
                            selectedApproach === id && styles.approachWeeksActive,
                          ]}
                        >
                          {t.timeline_weeks}
                        </Text>
                        <Text style={styles.approachWeeksLabel}>weeks</Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </>
            )}

            {/* Confirm Button */}
            {(customCurrentWeight && customTargetWeight && selectedWeightGoal) && (
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={onConfirm}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.confirmButtonText}>Apply Customization</Text>
                )}
              </TouchableOpacity>
            )}
          </View>
        </Animated.View>
      )}
    </>
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
  customizeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: scale(16),
  },
  customizeLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  customizeIcon: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: COLORS.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(12),
  },
  customizeTitle: {
    fontSize: FONT.base,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  customizeSubtitle: {
    fontSize: FONT.xs,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginTop: verticalScale(2),
  },
  customizeContent: {
    marginTop: verticalScale(-8),
  },
  stepTitle: {
    fontSize: FONT.sm,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: verticalScale(12),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(16),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: scale(16),
    marginBottom: verticalScale(8),
    backgroundColor: COLORS.inputBg,
    borderRadius: scale(10),
    borderWidth: 1.5,
    borderColor: COLORS.border,
    paddingHorizontal: scale(12),
  },
  input: {
    flex: 1,
    fontSize: FONT.base,
    color: COLORS.textPrimary,
    paddingVertical: verticalScale(12),
    fontWeight: "700",
  },
  inputUnit: {
    fontSize: FONT.sm,
    color: COLORS.textSecondary,
    fontWeight: "700",
    marginLeft: scale(8),
  },
  weightDiffContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: scale(16),
    marginBottom: verticalScale(8),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    backgroundColor: "rgba(79, 70, 229, 0.05)",
    borderRadius: scale(8),
  },
  weightDiffText: {
    fontSize: FONT.sm,
    color: COLORS.primary,
    fontWeight: "800",
    marginLeft: scale(6),
  },
  goalGrid: {
    flexDirection: "row",
    paddingHorizontal: scale(12),
    gap: scale(8),
    marginBottom: verticalScale(8),
  },
  goalButton: {
    flex: 1,
    padding: scale(12),
    borderRadius: scale(10),
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  goalButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(79, 70, 229, 0.05)",
  },
  goalLabel: {
    fontSize: FONT.xs,
    color: COLORS.textSecondary,
    marginTop: verticalScale(6),
    fontWeight: "700",
    textAlign: "center",
  },
  goalLabelActive: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  targetGrid: {
    flexDirection: "row",
    paddingHorizontal: scale(12),
    gap: scale(8),
  },
  targetButton: {
    flex: 1,
    padding: scale(12),
    borderRadius: scale(10),
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: "center",
  },
  targetButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(79, 70, 229, 0.05)",
  },
  targetValue: {
    fontSize: FONT.lg,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  targetValueActive: {
    color: COLORS.primary,
  },
  targetLabel: {
    fontSize: FONT.xs,
    color: COLORS.textSecondary,
    marginTop: verticalScale(2),
  },
  approachButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(12),
    borderRadius: scale(10),
    borderWidth: 1.5,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    marginHorizontal: scale(12),
    marginBottom: verticalScale(8),
  },
  approachButtonActive: {
    borderColor: COLORS.primary,
    backgroundColor: "rgba(79, 70, 229, 0.05)",
  },
  approachLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  approachInfo: {
    marginLeft: scale(12),
  },
  approachName: {
    fontSize: FONT.sm,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  approachNameActive: {
    color: COLORS.primary,
  },
  approachRate: {
    fontSize: FONT.xs,
    color: COLORS.textSecondary,
    marginTop: verticalScale(2),
  },
  approachRight: {
    alignItems: "flex-end",
  },
  goalImage: {
  width: scale(40),
  height: scale(40),
  resizeMode: "contain",
  opacity: 0.7,
},

goalImageActive: {
  opacity: 1,
  transform: [{ scale: 1.08 }],
},


  approachWeeks: {
    fontSize: FONT.base,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  approachWeeksActive: {
    color: COLORS.primary,
  },
  approachWeeksLabel: {
    fontSize: FONT.xs,
    color: COLORS.textSecondary,
  },
  confirmButton: {
    backgroundColor: COLORS.primary,
    margin: scale(12),
    padding: verticalScale(14),
    borderRadius: scale(10),
    alignItems: "center",
  },
  confirmButtonText: {
    color: COLORS.white,
    fontSize: FONT.base,
    fontWeight: "600",
  },
});