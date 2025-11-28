import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import {
  scale,
  verticalScale,
  moderateScale,
  fontScale,
} from "@/utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(24),
  },
  header: {
    alignItems: "center",
    paddingTop: verticalScale(16),
    marginBottom: verticalScale(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  title: {
    ...Typography.h2,
    fontSize: fontScale(24),
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: verticalScale(8),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    ...Typography.body,
    fontSize: fontScale(13),
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: verticalScale(16),
  },

  form: { flex: 1 },
  section: { marginBottom: verticalScale(24) },

  sectionTitle: {
    ...Typography.h4,
    fontSize: fontScale(16),
    color: Colors.textPrimary,
    marginBottom: verticalScale(6),
    fontWeight: "600",
  },
  sectionSubtitle: {
    ...Typography.caption,
    fontSize: fontScale(12),
    color: Colors.textMuted,
    marginBottom: verticalScale(12),
  },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  switchLabel: {
    ...Typography.body,
    fontSize: fontScale(14),
    color: Colors.textSecondary,
    flex: 1,
    marginRight: scale(12),
  },

  cardList: {
    flexDirection: "column",
    gap: verticalScale(10),
    marginTop: verticalScale(8),
  },

  conditionCard: {
    flexDirection: "row",
    alignItems: "center",
    textAlign: "center",
    paddingVertical: verticalScale(14),
    paddingHorizontal: scale(14),
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: moderateScale(14),
    backgroundColor: Colors.bgCard,
  },

  conditionCardActive: {
    borderColor: Colors.emerald,
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    shadowColor: Colors.emerald,
  },

  conditionCardText: {
    ...Typography.body,
    fontSize: fontScale(14),
    color: Colors.textSecondary,
    textAlign: "center",
    flex: 1,
  },

  conditionCardTextActive: {
    color: Colors.emerald,
    fontWeight: "600",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    marginBottom: verticalScale(16),
    gap: scale(12),
  },
  backButton: {
    flex: 0.35,
    backgroundColor: Colors.bgCard,
    borderColor: Colors.borderDark,
    borderWidth: 1,
  },
  backText: {
    fontSize: fontScale(14),
    color: Colors.textSecondary,
  },
  createButton: {
    flex: 0.65,
    backgroundColor: Colors.emerald,
  },

  signInPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: verticalScale(24),
  },
  signInText: {
    ...Typography.body,
    fontSize: fontScale(14),
    color: Colors.textMuted,
  },
  signInLink: {
    ...Typography.bodyMedium,
    fontSize: fontScale(14),
    color: Colors.emerald,
    fontWeight: "600",
  },
});
