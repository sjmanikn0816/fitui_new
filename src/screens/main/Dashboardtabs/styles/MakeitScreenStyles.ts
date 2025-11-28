import { Colors } from "@/constants/Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  centerContent: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.textMuted,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: Colors.red,
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: Colors.emerald,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.bgPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  bottomSpacing: {
    height: 20,
  },
});
