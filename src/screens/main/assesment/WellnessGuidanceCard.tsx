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

interface WellnessGuidance {
  mental_health: string[];
  sleep_and_recovery: string[];
  stress_management: string[];
  long_term_sustainability: string[];
}

interface WellnessGuidanceCardProps {
  wellnessGuidance: WellnessGuidance;
}

export const WellnessGuidanceCard: React.FC<WellnessGuidanceCardProps> = ({
  wellnessGuidance,
}) => {
  const sections = [
    {
      icon: "bulb-outline",
      title: "Mental Health",
      items: wellnessGuidance.mental_health,
    },
    {
      icon: "moon-outline",
      title: "Sleep & Recovery",
      items: wellnessGuidance.sleep_and_recovery,
    },
    {
      icon: "leaf-outline",
      title: "Stress Management",
      items: wellnessGuidance.stress_management,
    },
    {
      icon: "trending-up-outline",
      title: "Long-term",
      items: wellnessGuidance.long_term_sustainability,
    },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Ionicons name="heart-outline" size={scale(18)} color={COLORS.primary} />
        <Text style={styles.cardHeaderText}>Wellness Guidance</Text>
      </View>

      {sections.map(
        (section, i) =>
          section.items &&
          section.items.length > 0 && (
            <View key={i} style={styles.guidanceSection}>
              <View style={styles.guidanceHeader}>
                <Ionicons
                  name={section.icon as any}
                  size={scale(18)}
                  color={COLORS.primary}
                />
                <Text style={styles.guidanceTitle}>{section.title}</Text>
              </View>
              {section.items.map((item, j) => (
                <Text key={j} style={styles.guidanceText}>
                  • {item}
                </Text>
              ))}
            </View>
          )
      )}
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
  guidanceSection: {
    backgroundColor: COLORS.borderLight,
    borderRadius: scale(10),
    padding: scale(12),
    marginHorizontal: scale(12),
    marginBottom: verticalScale(10),
  },
  guidanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  guidanceTitle: {
    fontSize: FONT.base,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginLeft: scale(8),
  },
  guidanceText: {
    fontSize: FONT.xs,
    fontWeight: "700",
    color: COLORS.textSecondary,
    marginLeft: scale(26),
    marginBottom: verticalScale(4),
    lineHeight: FONT.xs * 1.6,
  },
});