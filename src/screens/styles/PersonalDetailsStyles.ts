import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { scale, verticalScale } from "@/utils/responsive";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
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
    color: Colors.textPrimary,
    textAlign: "center",
    fontWeight: "700",
    marginBottom: Spacing.sm,
    letterSpacing: 0.5,
  },
  subtitle1: {
    ...Typography.caption,
    color: Colors.textMuted,
    textAlign: "center",
    fontWeight: "600",
    marginBottom: Spacing.sm,
  },
  subtitle2: {
    ...Typography.small,
    fontWeight: "600",
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.caption,
    color: Colors.textMuted,
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
    color: Colors.textSecondary,
    fontSize: 11,
    marginBottom: Spacing.xs,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  required: {
    color: Colors.emerald,
  },
  labelDisabled: {
    ...Typography.caption,
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
    fontWeight: "600",
    opacity: 0.5,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xs,
    backgroundColor: Colors.bgCard,
    opacity: 1,
    paddingVertical: 0,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  switchRowDisabled: {
    opacity: 0.5,
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
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    alignItems: "center",
  },
  sexButtonActive: {
    borderColor: Colors.emerald,
    backgroundColor: "rgba(52, 211, 153, 0.1)",
  },
  sexButtonText: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
  },
  sexButtonTextActive: {
    color: Colors.emerald,
    fontWeight: "bold",
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 16,
    backgroundColor: Colors.bgCard,
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
    color: Colors.textSecondary,
    flex: 1,
    fontWeight: "500",
  },
  activityCardActive: {
    borderColor: Colors.emerald,
    backgroundColor: "rgba(52, 211, 153, 0.1)",
  },
  activityCardTextActive: {
    color: Colors.emerald,
    fontWeight: "bold",
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.bgCardHover,
  },
  iconContainerActive: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
  },
  checkmarkContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 8,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  buttonContainer: {
    width: "100%",
    paddingTop: verticalScale(24),
    paddingBottom: verticalScale(8),
  },
  backButton: {
    flex: 0.35,
    backgroundColor: Colors.bgCard,
    borderColor: Colors.borderDark,
    borderWidth: 1,
  },
  continueButton: {
    backgroundColor: Colors.emerald,
    paddingVertical: verticalScale(16),
    width: "100%",
    alignSelf: "center",
    borderRadius: 14,
  },
  backText: {
    color: Colors.textSecondary,
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
    backgroundColor: Colors.bgCardHover,
    justifyContent: "center",
    alignItems: "center",
  },
  stepCircleActive: {
    backgroundColor: Colors.emerald,
  },
  stepNumber: {
    color: Colors.textMuted,
    fontWeight: "bold",
  },
  stepNumberActive: {
    color: Colors.bgPrimary,
  },
  stepLine: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.bgCardHover,
    marginHorizontal: 4,
    borderRadius: 2,
  },
  stepLineActive: {
    backgroundColor: Colors.emerald,
  },

  // Progress bar for modern multi-step flow
  progressBarContainer: {
    marginBottom: verticalScale(30),
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: Colors.bgCardHover,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.emerald,
    borderRadius: 3,
  },
  progressText: {
    ...Typography.caption,
    color: Colors.textMuted,
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
    fontWeight: "700",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: verticalScale(8),
    letterSpacing: 0.5,
  },
  stepSubtitle: {
    ...Typography.body,
    fontSize: 15,
    color: Colors.textMuted,
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
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: 16,
    backgroundColor: Colors.bgCard,
  },
  modernCardActive: {
    borderColor: Colors.emerald,
    backgroundColor: "rgba(52, 211, 153, 0.1)",
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
    backgroundColor: Colors.bgCardHover,
  },
  modernIconContainerActive: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
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
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  modernCardTitleActive: {
    color: Colors.emerald,
    fontWeight: "700",
  },
  modernCardSubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    fontWeight: "400",
  },
  modernCardSubtitleActive: {
    color: Colors.emeraldLight,
  },
  checkmarkBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.emerald,
    justifyContent: "center",
    alignItems: "center",
  },

  // Yes/No toggle styles
  toggleQuestion: {
    marginTop: verticalScale(24),
    paddingTop: verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: Colors.borderDark,
  },
  toggleLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
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
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    alignItems: "center",
  },
  toggleButtonActive: {
    borderColor: Colors.emerald,
    backgroundColor: "rgba(52, 211, 153, 0.1)",
  },
  toggleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textSecondary,
  },
  toggleButtonTextActive: {
    color: Colors.emerald,
    fontWeight: "700",
  },
});