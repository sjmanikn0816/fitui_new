import { StyleSheet, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  // Header
  headerContainer: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: "#0D0D0D",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    marginTop: 4,
  },
  // Header with back button
  headerWithBackContainer: {
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
  headerTitleCentered: {
    flex: 1,
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginRight: 40,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerContent: {
    gap: 8,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  // Scroll view
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 60,
  },
  // Cards
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: "#262626",
  },
  // Section styles
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 16,
  },
  // Input styles
  inputRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },
  inputGroup: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#9CA3AF",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#262626",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#333333",
  },
  // Button styles
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  optionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#262626",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333333",
  },
  optionButtonActive: {
    backgroundColor: "#2DD4BF",
    borderColor: "#2DD4BF",
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  optionButtonTextActive: {
    color: "#0D0D0D",
  },
  // Grid options
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  gridOption: {
    width: "30%",
    alignItems: "center",
    backgroundColor: "#262626",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#333333",
  },
  gridOptionActive: {
    backgroundColor: "rgba(45, 212, 191, 0.15)",
    borderColor: "#2DD4BF",
  },
  gridOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 8,
    textAlign: "center",
  },
  gridOptionTextActive: {
    color: "#2DD4BF",
  },
  // Goal options
  goalGrid: {
    flexDirection: "row",
    gap: 12,
  },
  goalOption: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#262626",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#333333",
  },
  goalOptionText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#9CA3AF",
    marginTop: 12,
    textAlign: "center",
  },
  // Error styles
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(239, 68, 68, 0.15)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(239, 68, 68, 0.3)",
  },
  errorText: {
    flex: 1,
    fontSize: 14,
    color: "#EF4444",
  },
  // Customize button
  customizeButton: {
    marginBottom: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  buttonGradient: {
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#2DD4BF",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0D0D0D",
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  // Results
  resultsContainer: {
    gap: 16,
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#262626",
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#9CA3AF",
  },
  // Summary card
  summaryCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 16,
    backgroundColor: "#1A1A1A",
    borderWidth: 1,
    borderColor: "#262626",
  },
  summaryHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  summaryItem: {
    width: "47%",
    backgroundColor: "rgba(45, 212, 191, 0.15)",
    borderRadius: 12,
    padding: 16,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // Weekly box
  weeklyBox: {
    backgroundColor: "rgba(45, 212, 191, 0.15)",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  weeklyLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  weeklyValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // Card header
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  // Calorie box
  calorieBox: {
    backgroundColor: "rgba(45, 212, 191, 0.1)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(45, 212, 191, 0.2)",
  },
  calorieLabel: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 8,
  },
  calorieValue: {
    fontSize: 48,
    fontWeight: "700",
    color: "#2DD4BF",
  },
  calorieUnit: {
    fontSize: 16,
    color: "#9CA3AF",
    marginTop: 4,
  },
  // Macros
  macrosTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  macrosGrid: {
    flexDirection: "row",
    gap: 12,
  },
  macroItem: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    backgroundColor: "#262626",
  },
  macroLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 8,
    marginBottom: 4,
  },
  macroValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // Metrics
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  metricItem: {
    flex: 1,
    backgroundColor: "#262626",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  metricLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  metricValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  // Tips
  tipSection: {
    marginBottom: 16,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
    paddingLeft: 4,
  },
  tipText: {
    flex: 1,
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 20,
  },
  // Warning card
  warningCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(251, 191, 36, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.3)",
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: "#FBB524",
    lineHeight: 20,
  },
  // Workout
  workoutItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#262626",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#1A1A1A",
    alignItems: "center",
    justifyContent: "center",
  },
  workoutDetails: {
    flex: 1,
  },
  workoutLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },
  workoutValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  startButton: {
    borderRadius: 12,
    overflow: "hidden",
  },
  // Header card
  headerCard: {
    height: 170,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#262626",
  },
  headerImageBg: {
    width: "100%",
  },
  headerImageStyle: {
    borderRadius: 16,
  },
  headerOverlay: {
    height: 170,
    padding: 16,
    backgroundColor: "rgba(26, 26, 26, 0.8)",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  titleWithBg: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  subtitleWithBg: {
    fontSize: 16,
    fontWeight: "500",
    color: "#9CA3AF",
    marginTop: 4,
  },
  descriptionWithBg: {
    marginTop: 10,
    fontSize: 14,
    color: "#6B7280",
  },
  headerUserBox: {
    backgroundColor: "rgba(45, 212, 191, 0.15)",
    padding: 12,
    borderRadius: 12,
  },
  // Instagram-style header (if used)
  instaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1A1A1A",
    borderBottomWidth: 1,
    borderBottomColor: "#262626",
  },
  instaHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  instaAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#2DD4BF",
  },
  instaUsername: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  instaLocation: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 2,
  },
  instaMainImage: {
    height: 400,
    marginBottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  mainImageContent: {
    alignItems: "center",
    gap: 16,
  },
  mainImageTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  mainImageSubtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
  },
  instaActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#1A1A1A",
  },
  instaActionsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  instaActionBtn: {
    padding: 4,
  },
  instaLikes: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    backgroundColor: "#1A1A1A",
  },
  instaLikesText: {
    fontSize: 14,
    color: "#FFFFFF",
  },
  instaLikesBold: {
    fontWeight: "600",
  },
  instaCaption: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  instaCaptionText: {
    fontSize: 14,
    color: "#FFFFFF",
    lineHeight: 20,
    marginBottom: 8,
  },
  instaCaptionBold: {
    fontWeight: "600",
  },
  instaCaptionHashtags: {
    fontSize: 14,
    color: "#2DD4BF",
    lineHeight: 20,
  },
  formSection: {
    paddingTop: 16,
    backgroundColor: "#0D0D0D",
  },
});
