import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "@/utils/responsive";

const COLORS = {
  primary: "#4F46E5",
  white: "#FFFFFF",
  cardBg: "#FFFFFF",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  success: "#10B981",
  statAge: { bg: "#DBEAFE", text: "#2563EB" },
  statWeight: { bg: "#F3E8FF", text: "#9333EA" },
  statBMI: { bg: "#DCFCE7", text: "#16A34A" },
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

export const AssessmentCard = ({
  age,
  weight,
  bmi,
  tdee,
  bmiCategory,
  healthRiskLevel,
  recommendedTimeline,
  importantNotes,
  availableTimelines = [],
  selectedTimelineId,
  onSelectTimeline,
  onStartPlan, // <-- added
}) => {
  const [expanded, setExpanded] = useState(false);
  const toggleExpand = () => setExpanded(!expanded);

  const statItems = [
    { label: "Age", value: age, colors: COLORS.statAge },
    { label: "Weight", value: weight, unit: "lbs", colors: COLORS.statWeight },
    { label: "BMI", value: bmi.toFixed(1), colors: COLORS.statBMI },
    { label: "TDEE", value: Math.round(tdee), colors: COLORS.statTDEE },
  ];

  return (
    <View style={styles.card}>
      {/* Expand Header */}
      <TouchableOpacity style={styles.cardHeader} onPress={toggleExpand}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="analytics-outline"
            size={scale(18)}
            color={COLORS.primary}
          />

          <View style={{ marginLeft: scale(8) }}>
            <Text style={styles.cardHeaderText}>Goal Assessment</Text>
            <Text style={styles.headerDescription}>Initial Health Analysis</Text>
          </View>
        </View>

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={scale(20)}
          color={COLORS.textSecondary}
        />
      </TouchableOpacity>

      {/* Expand Content */}
      {expanded && (
        <View>
          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            {statItems.map((stat, i) => (
              <View
                key={i}
                style={[styles.statBox, { backgroundColor: stat.colors.bg }]}
              >
                <Text
                  style={[styles.statValue, { color: stat.colors.text }]}
                >
                  {stat.value}
                </Text>
                <Text style={styles.statLabel}>
                  {stat.unit || stat.label}
                </Text>
              </View>
            ))}
          </View>

          {/* Recommended Timeline */}
          {recommendedTimeline && (
            <View style={styles.recommendedCard}>
              <Text style={styles.recommendedBadge}>RECOMMENDED</Text>

              <View style={styles.recommendedContent}>
                <View style={styles.recommendedLeft}>
                  <Text style={styles.recommendedTitle}>
                    {recommendedTimeline.approach_name.replace("_", " ")}
                  </Text>

                  <Text style={styles.recommendedSubtitle}>
                    Target: {recommendedTimeline.target_weight_lbs} lbs
                  </Text>

                  <Text style={styles.recommendedSubtitle}>
                    Rate: {recommendedTimeline.weekly_rate} lb/week
                  </Text>
                </View>

                <View style={styles.weeksContainer}>
                  <Text style={styles.weeksValue}>
                    {recommendedTimeline.timeline_weeks}
                  </Text>
                  <Text style={styles.weeksLabel}>weeks</Text>
                </View>
              </View>
            </View>
          )}

          {/* Available Timelines */}
          {availableTimelines.length > 0 && (
            <>
              <Text
                style={[
                  styles.notesTitle,
                  { marginLeft: scale(12), marginBottom: 4 },
                ]}
              >
                All Timeline Options
              </Text>

              {availableTimelines.map((t, index) => {
                const id = `${t.approach_name}-${t.target_weight_lbs}`;
                const isSelected = selectedTimelineId === id;

                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.timelineItem,
                      isSelected && styles.timelineSelected,
                    ]}
                    onPress={() => onSelectTimeline(id)}
                  >
                    <View>
                      <Text style={styles.recommendedTitle}>
                        {t.approach_name.replace("_", " ")}
                      </Text>

                      <Text style={styles.recommendedSubtitle}>
                        Target: {t.target_weight_lbs} lbs {" | "}
                        {t.timeline_weeks} weeks
                      </Text>
                    </View>

                    {isSelected && (
                      <Ionicons
                        name="checkmark-circle"
                        size={scale(22)}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
                  {/* <TouchableOpacity
              style={styles.startPlanBtn}
              onPress={() => onStartPlan(selectedTimelineId)}
            >
              <Text style={styles.startPlanText}>Start Meal Plan</Text>
              <Ionicons
                name="arrow-forward"
                size={scale(18)}
                color={COLORS.white}
              />
            </TouchableOpacity> */}
            </>
          )}

      
        
      

          {/* Notes */}
          {importantNotes?.length > 0 && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesTitle}>Important Notes</Text>
              {importantNotes.map((note, i) => (
                <Text key={i} style={styles.noteText}>
                  • {note}
                </Text>
              ))}
            </View>
          )}


        
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: scale(14),
    marginBottom: verticalScale(12),
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
    justifyContent: "space-between",
  },
  headerDescription: {
    paddingHorizontal: scale(10),
    paddingBottom: verticalScale(8),
    fontSize: FONT.xs,
    color: COLORS.textSecondary,
    fontWeight: "700"
  },
  cardHeaderText: {
    fontSize: FONT.base,
    fontWeight: "800",
    fontSize: scale(11),
    color: COLORS.textSecondary,
  },
  cardHeaderText: {
    fontSize: FONT.base,
    color: COLORS.textPrimary,
    marginLeft: scale(8),
  },
  statsGrid: {
    flexDirection: "row",
    padding: scale(12),
    gap: scale(8),
  },
  statBox: {
    flex: 1,
    borderRadius: scale(10),
    padding: scale(12),
    alignItems: "center",
  },
  statValue: {
    fontSize: FONT.lg,
    fontWeight: "900",
  },
  statLabel: {
    fontSize: FONT.xs,
    fontWeight: "700",
    fontWeight: "700",
  },
  statLabel: {
    fontSize: FONT.xs,
    color: COLORS.textSecondary,
    marginTop: verticalScale(2),
  },

  recommendedCard: {
    backgroundColor: COLORS.borderLight,
    borderRadius: scale(10),
    padding: scale(12),
    marginHorizontal: scale(12),
    marginBottom: verticalScale(12),
    borderLeftWidth: 3,
    borderLeftColor: COLORS.primary,
  },
  recommendedBadge: {

    fontSize: FONT.sm,
    color: COLORS.primary,
    fontWeight: "800",
    fontSize: FONT.xs,
    color: COLORS.primary,
    fontWeight: "700",

    marginBottom: verticalScale(4),
  },
  recommendedContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  timelineItem: {
    padding: scale(12),
    marginHorizontal: scale(12),
    marginBottom: verticalScale(8),
    borderRadius: scale(10),
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  timelineSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.borderLight,
  },

  recommendedLeft: { flex: 1 },
  recommendedTitle: {
    fontSize: FONT.base,
    fontWeight: "800",
    color: COLORS.textPrimary,
  },
  recommendedSubtitle: {
    fontSize: FONT.xs,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  weeksContainer: { alignItems: "flex-end" },
  weeksValue: {
    fontSize: FONT.xxl,
    fontWeight: "900",
    color: COLORS.primary,
  },
  weeksLabel: {
    fontSize: FONT.xs,
     fontWeight: "700",
    color: COLORS.textSecondary,
  },

  /* ⭐ START PLAN BUTTON */
  startPlanBtn: {
    backgroundColor: COLORS.primary,
    marginHorizontal: scale(12),
    marginTop: verticalScale(12),
    paddingVertical: verticalScale(12),
    borderRadius: scale(10),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: scale(8),
  },
  startPlanText: {
    color: COLORS.white,
    fontSize: FONT.base,
    fontWeight: "600",
  },

  notesContainer: { padding: scale(12), paddingTop: 0,marginTop:verticalScale(8) },
  notesTitle: {
    fontSize: FONT.sm,
    color: COLORS.textSecondary,
    fontWeight: "800",
    color: COLORS.textSecondary,
    marginBottom: 6,
  },
  noteText: {
    fontSize: FONT.xs,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
});
