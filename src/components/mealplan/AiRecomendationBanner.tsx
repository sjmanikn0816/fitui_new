import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { AlertTriangle } from "lucide-react-native";

// Dark theme colors (matching HomeScreen)
const THEME = {
  bg: "#0D0F14",
  cardBg: "#151921",
  cardBorder: "#1E2430",
  warning: "#F59E0B",
  warningGlow: "rgba(245, 158, 11, 0.12)",
  warningBorder: "rgba(245, 158, 11, 0.25)",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
};

interface MedicalBannerProps {
  message?: string;
}

const MedicalBanner: React.FC<MedicalBannerProps> = ({
  message = "Due to your Health conditions, we recommended consulting with healthcare professionals starting your weight loss journey",
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <AlertTriangle color={THEME.warning} size={20} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Medical Supervision Recommended</Text>
        <Text style={styles.subtitle}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
    padding: 16,
    backgroundColor: THEME.warningGlow,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.warningBorder,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.warning,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: THEME.textSecondary,
    lineHeight: 18,
  },
});

export default MedicalBanner;