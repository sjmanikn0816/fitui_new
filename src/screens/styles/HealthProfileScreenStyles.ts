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
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(24),
  },
  header: {
    alignItems: "center",
    paddingTop: verticalScale(24),
    marginBottom: verticalScale(16),
  },
  content: {
    flex: 1,
    paddingHorizontal: scale(16),
  },
  title: {
    ...Typography.h2,
    fontSize: fontScale(24),
    color: Colors.gray900,
    textAlign: "center",
    marginBottom: verticalScale(8),
    fontWeight: "900",
  },
  subtitle: {
    ...Typography.body,
    fontSize: fontScale(12),
    color: Colors.gray600,
    textAlign: "center",
    marginBottom: verticalScale(16),
  },

  form: { flex: 1 },
  section: { marginBottom: verticalScale(24) },

  sectionTitle: {
    ...Typography.h4,
    fontSize: fontScale(16),
    color: Colors.gray800,
    marginBottom: verticalScale(6),
    fontWeight: "600",
  },
  sectionSubtitle: {
    ...Typography.caption,
    fontSize: fontScale(12),
    color: Colors.gray500,
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
    color: Colors.gray900,
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
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(14),
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderRadius: moderateScale(12),
    backgroundColor: Colors.gray100,
  },

  conditionCardActive: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F9FF",
    shadowColor: Colors.primary,
  },

  conditionCardText: {
    ...Typography.body,
    fontSize: fontScale(14),
    color: Colors.gray800,
    textAlign: "center",

    flex: 1,
  },

  conditionCardTextActive: {
    color: Colors.primary,
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
    backgroundColor: Colors.gray200,
    borderColor: Colors.gray400,
  },
  backText: {
    fontSize: fontScale(14),
    color: Colors.black,
  },
  createButton: {
    flex: 0.65,
    backgroundColor: Colors.primary,
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
    color: Colors.gray600,
  },
  signInLink: {
    ...Typography.bodyMedium,
    fontSize: fontScale(14),
    color: Colors.black,
    fontWeight: "600",
  },
});
