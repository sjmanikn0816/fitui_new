// components/SafetyAlert.tsx
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface SafetyAlertProps {
  message: string;
  suggestion?: string;
  safeAlternatives?: string[];
  requiredAction?: string;
  severity?: "critical" | "warning";
  onRetry?: () => void;
  onDismiss?: () => void;
}

const SafetyAlert: React.FC<SafetyAlertProps> = ({
  message,
  suggestion,
  safeAlternatives = [],
  requiredAction,
  severity = "critical",
  onRetry,
  onDismiss,
}) => {
  const isCritical = severity === "critical";

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.alertBox,
            { backgroundColor: isCritical ? "#fef2f2" : "#fffbeb" },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons
                name={isCritical ? "alert-circle" : "warning"}
                size={28}
                color={isCritical ? "#dc2626" : "#d97706"}
              />
              <Text
                style={[
                  styles.headerTitle,
                  { color: isCritical ? "#991b1b" : "#92400e" },
                ]}
              >
                {isCritical ? "⚠️ Safety Notice" : "⚠️ Warning"}
              </Text>
            </View>
          </View>

          {/* Main Message */}
          <Text
            style={[
              styles.message,
              { color: isCritical ? "#7f1d1d" : "#78350f" },
            ]}
          >
            {message}
          </Text>

          {/* Suggestion */}
          {suggestion && (
            <View style={styles.suggestionBox}>
              <Text style={styles.suggestionLabel}>💡 Suggestion:</Text>
              <Text style={styles.suggestionText}>{suggestion}</Text>
            </View>
          )}

          {/* Safe Alternatives */}
          {safeAlternatives.length > 0 && (
            <View style={styles.alternativesBox}>
              <Text style={styles.alternativesLabel}>✅ Try These Instead:</Text>
              {safeAlternatives.map((alt, idx) => (
                <Text key={idx} style={styles.alternativeItem}>
                  • {alt}
                </Text>
              ))}
            </View>
          )}

          {/* Required Action */}
          {requiredAction && (
            <View style={styles.actionBox}>
              <Ionicons name="information-circle" size={22} color="#2563eb" />
              <Text style={styles.actionText}>{requiredAction}</Text>
            </View>
          )}

          {/* Medical Disclaimer */}
          <View style={styles.disclaimerBox}>
            <Ionicons name="medical" size={18} color="#7c3aed" />
            <Text style={styles.disclaimerText}>
              This service provides information for educational purposes only and
              is not a substitute for professional medical advice.
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            {onRetry && (
              <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                <Ionicons name="refresh" size={20} color="#fff" />
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            )}

            {onDismiss && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={onDismiss}
              >
                <Text style={styles.secondaryButtonText}>Dismiss</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  alertBox: {
    maxWidth: 500,
    width: "100%",
    padding: 24,
    borderRadius: 16,
    borderLeftWidth: 5,
    borderLeftColor: "#EF4444",
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 20,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  suggestionBox: {
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  suggestionLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#3B82F6",
    marginBottom: 8,
  },
  suggestionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 21,
  },
  alternativesBox: {
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderLeftWidth: 3,
    borderLeftColor: Colors.emerald,
  },
  alternativesLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.emerald,
    marginBottom: 10,
  },
  alternativeItem: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
    marginBottom: 6,
  },
  actionBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(59, 130, 246, 0.1)",
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    gap: 10,
  },
  actionText: {
    flex: 1,
    fontSize: 14,
    color: "#3B82F6",
    lineHeight: 20,
    fontWeight: "500",
  },
  disclaimerBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(168, 85, 247, 0.1)",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
    gap: 8,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 12,
    color: "#A855F7",
    lineHeight: 18,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  retryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.emerald,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  retryButtonText: {
    color: Colors.bgPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.bgCardHover,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  secondaryButtonText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SafetyAlert;