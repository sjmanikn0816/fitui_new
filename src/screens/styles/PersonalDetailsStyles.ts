import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { scale, verticalScale } from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
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
  modernContainer: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(24),
    justifyContent: "space-between",
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
    width: "100%",
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(8),
  },
  backButton: {
    flex: 0.35,
    backgroundColor: Colors.gray200,
    borderColor: Colors.gray400,
  },
  continueButton: {
    backgroundColor: Colors.primary,
    paddingVertical: verticalScale(14),
    width: "100%",
    alignSelf: "center",
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

  // Progress bar for modern multi-step flow
  progressBarContainer: {
    marginBottom: verticalScale(30),
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
    textAlign: "center",
    fontWeight: "600",
    fontSize: 12,
  },

  // Step container and headings
  stepContainer: {
    flex: 1,
  },
  stepEmoji: {
    fontSize: 64,
    textAlign: "center",
    marginBottom: verticalScale(16),
  },
  stepTitle: {
    ...Typography.h2,
    fontSize: 26,
    fontWeight: "800",
    color: Colors.text,
    textAlign: "center",
    marginBottom: verticalScale(8),
  },
  stepSubtitle: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: verticalScale(32),
    paddingHorizontal: Spacing.md,
  },

  inputGroup: {
    gap: Spacing.md,
  },

  // Modern card layout used for options
  cardsContainer: {
    gap: Spacing.md,
  },
  cardsContainerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.sm,
  },
  modernCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(16),
    borderWidth: 2,
    borderColor: "#E5E7EB",
    borderRadius: 16,
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  modernCardActive: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F9FF",
    shadowColor: Colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 3,
  },
  modernCardContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: scale(14),
    flex: 1,
  },
  modernIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#F3F4F6",
  },
  modernIconContainerActive: {
    backgroundColor: "#DBEAFE",
  },
  emojiIcon: {
    fontSize: 28,
  },
  modernCardTextContainer: {
    flex: 1,
  },
  modernCardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: 2,
  },
  modernCardTitleActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
  modernCardSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "400",
  },
  modernCardSubtitleActive: {
    color: "#3B82F6",
  },
  checkmarkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  // Yes/No toggle styles
  toggleQuestion: {
    marginTop: verticalScale(24),
    paddingTop: verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
    marginBottom: Spacing.sm,
    textAlign: "center",
  },
  toggleButtons: {
    flexDirection: "row",
    gap: Spacing.sm,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: verticalScale(14),
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
    alignItems: "center",
  },
  toggleButtonActive: {
    borderColor: Colors.primary,
    backgroundColor: "#F0F9FF",
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.text,
  },
  toggleButtonTextActive: {
    color: Colors.primary,
    fontWeight: "700",
  },
});