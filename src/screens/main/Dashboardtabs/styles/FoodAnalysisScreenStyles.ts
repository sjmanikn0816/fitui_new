import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  // Header
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 20,
    backgroundColor: "#0D0D0D",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#262626",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginRight: 40,
  },
  // Simple header
  simpleHeaderContainer: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: "#0D0D0D",
  },
  simpleHeaderTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 120,
  },
  // Header Card
  headerCard: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#262626",
    backgroundColor: "#1A1A1A",
  },
  headerImageBg: {
    width: "100%",
  },
  headerImageStyle: {
    borderRadius: 16,
  },
  headerOverlay: {
    padding: 16,
    backgroundColor: "rgba(26, 26, 26, 0.85)",
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
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  subtitleWithBg: {
    fontSize: 16,
    color: "#9CA3AF",
    fontWeight: "600",
    marginBottom: 4,
  },
  descriptionWithBg: {
    fontSize: 13,
    color: "#6B7280",
    lineHeight: 18,
  },
  // Instructions card
  instructionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#262626",
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  methodList: {
    gap: 10,
  },
  methodItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  methodIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "rgba(45, 212, 191, 0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  methodText: {
    fontSize: 14,
    color: "#9CA3AF",
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
    backgroundColor: "#262626",
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "600",
    color: "#6B7280",
  },
  voiceTextContainer: {
    gap: 0,
  },
  // Section styles
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionDot: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: "#2DD4BF",
    marginRight: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Analysis Card
  analysisCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#262626",
  },
  analysisTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  analysisValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2DD4BF",
    marginBottom: 4,
  },
  analysisDescription: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  // Nutrition Grid
  nutritionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 12,
  },
  nutritionItem: {
    width: "47%",
    backgroundColor: "#262626",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
  },
  nutritionLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  nutritionValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // Camera/Upload buttons
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#2DD4BF",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    marginBottom: 12,
  },
  actionButtonSecondary: {
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#2DD4BF",
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  actionButtonTextSecondary: {
    color: "#2DD4BF",
  },
  // Result card
  resultCard: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#262626",
    marginBottom: 16,
  },
  resultImage: {
    width: "100%",
    height: 200,
    backgroundColor: "#262626",
  },
  resultContent: {
    padding: 16,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  resultBadge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(45, 212, 191, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  resultBadgeText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#2DD4BF",
  },
});
