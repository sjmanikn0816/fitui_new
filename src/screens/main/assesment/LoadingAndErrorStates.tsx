import React from "react";
import { View, Text, ActivityIndicator, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "@/utils/responsive";

const COLORS = {
  primary: "#4F46E5",
  error: "#EF4444",
  textSecondary: "#6B7280",
  white: "#FFFFFF",
};

const FONT = {
  base: moderateScale(14),
};

interface LoadingStateProps {
  message?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading your wellness plan...",
}) => {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      <Text style={styles.loadingText}>{message}</Text>
    </View>
  );
};

interface ErrorStateProps {
  error: string;
  onRetry: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({ error, onRetry }) => {
  return (
    <View style={styles.errorContainer}>
      <Ionicons name="alert-circle-outline" size={scale(48)} color={COLORS.error} />
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

interface SafetyBannerProps {
  riskLevel: string;
}

export const SafetyBanner: React.FC<SafetyBannerProps> = ({ riskLevel }) => {
  return (
    <View style={styles.safetyBanner}>
      <Ionicons name="warning-outline" size={scale(18)} color="#F59E0B" />
      <Text style={styles.safetyText}>
        <Text style={styles.safetyBold}>Safety:</Text> Risk level is{" "}
        <Text style={styles.safetyBold}>{riskLevel}</Text>. Consult a healthcare
        professional before starting.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(40),
    minHeight: verticalScale(400),
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: FONT.base,
    color: COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: scale(40),
    minHeight: verticalScale(400),
  },
  errorText: {
    fontSize: FONT.base,
    color: COLORS.error,
    textAlign: "center",
    marginVertical: verticalScale(16),
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(28),
    borderRadius: scale(10),
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: FONT.base,
    fontWeight: "600",
  },
  safetyBanner: {
    flexDirection: "row",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.3)",
    padding: scale(12),
    borderRadius: scale(10),
    marginBottom: verticalScale(16),
    alignItems: "flex-start",
  },
  safetyText: {
    fontSize: moderateScale(10),
    color: COLORS.textSecondary,
    flex: 1,
    marginLeft: scale(8),
    lineHeight: moderateScale(10) * 1.5,
  },
  safetyBold: {
    fontWeight: "700",
    color: "#1F2937",
  },
});