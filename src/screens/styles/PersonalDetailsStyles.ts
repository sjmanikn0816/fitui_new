import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { scale, verticalScale } from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: Spacing.xl,
  },
  header: {
    alignItems: "center",
    paddingTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: "center",
    fontWeight: "900",
    marginBottom: Spacing.sm,
  },
  subtitle1: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  subtitle2: {
    ...Typography.small,
    fontWeight: "600",
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.caption,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.md,
  },
  form: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  column: {
    flex: 1,
  },
  sexContainer: {
    marginBottom: Spacing.md,
  },
  Activitylevel: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.caption,
    color: Colors.text,
    fontSize: 10,
    marginBottom: Spacing.xs,
    fontWeight: "700",
  },
  required: {
    color: "#FF6B6B",
  },
  labelDisabled: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
    fontWeight: "600",
    opacity: 0.7,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
    backgroundColor: Colors.gray100,
    opacity: 1,
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  switchRowDisabled: {
    opacity: 0.6,
  },
  cardList: {
    flexDirection: "column",
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
  sexButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: Spacing.sm,
  },
  sexButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: "center",
  },
  sexButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F9FF",
  },
  sexButtonText: {
    ...Typography.bodyMedium,
    color: Colors.text,
  },
  sexButtonTextActive: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  activityCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.md,
    flex: 1,
  },
  activityCardText: {
    textAlign: "left",
    fontSize: 16,
    color: "#333",
    flex: 1,
    fontWeight: "500",
  },
  activityCardActive: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F9FF",
    shadowColor: Colors.primary,
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  activityCardTextActive: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
  },
  iconContainerActive: {
    backgroundColor: "#DBEAFE",
  },
  checkmarkContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: 6,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
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
  continueButton: {
    flex: 0.65,
    backgroundColor: Colors.primary,
  },
  backText: {
    color: Colors.black,
  },
  progressStepsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 20,
    marginLeft: 40,
  },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircleActive: {
    backgroundColor: Colors.primary,
  },
  stepNumber: {
    color: "#fff",
    fontWeight: "bold",
  },
  stepNumberActive: {
    color: "#fff",
  },
  stepLine: {
    flex: 1,
    height: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
    borderRadius: 2,
  },
  stepLineActive: {
    backgroundColor: Colors.primary,
  },
});