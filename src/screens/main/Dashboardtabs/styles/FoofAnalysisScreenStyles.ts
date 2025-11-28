import { Colors } from "@/constants/Colors";
import { verticalScale } from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
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
    shadowColor: Colors.emerald,
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
    color: Colors.textPrimary,
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitleWithBg: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: 4,
  },
  descriptionWithBg: {
    fontSize: 13,
    color: Colors.textMuted,
    lineHeight: 18,
  },
  // Instructions card
  instructionCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  instructionRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
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
    color: Colors.textMuted,
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
    backgroundColor: Colors.borderDark,
  },
  dividerText: {
    paddingHorizontal: 16,
    fontSize: 14,
    fontWeight: "700",
    color: Colors.textMuted,
  },
  voiceTextContainer: {
    gap: 0,
  },
});
