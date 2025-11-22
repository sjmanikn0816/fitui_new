import { Colors } from "@/constants/Colors";
import { verticalScale } from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
 
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  headerCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    overflow: "hidden",
  },
  headerImageBg: {
    width: "100%",
  },
  headerImageStyle: {
    borderRadius: 16,
  },
  headerOverlay: {
    padding: 16,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerUserBox: {
    alignItems: "flex-end",
  },
  titleWithBg: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitleWithBg: {
    fontSize: 16,
    color: "rgba(255,255,255,0.95)",
    fontWeight: "600",
    marginBottom: 4,
  },
  descriptionWithBg: {
    fontSize: 13,
    color: "rgba(255,255,255,0.9)",
    lineHeight: 18,
  },
  // Instructions card
  instructionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },
  methodList: {
    gap: 10,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  methodText: {
    fontSize: 14,
    color: "#6B7280",
    flex: 1,
    lineHeight: 20,
  },
  // Divider
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E7EB",
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "700",
    color: "#9CA3AF",
  },
  voiceTextContainer: {
    gap: 0,
  },
});