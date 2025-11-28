import { Colors } from "@/constants/Colors";
import { StyleSheet, Dimensions, Platform, StatusBar } from "react-native";

const { width, height } = Dimensions.get("window");

// Scale function for font/padding/size
const scale = (size: number) => (width / 375) * size; // 375 = base width
const verticalScale = (size: number) => (height / 812) * size; // 812 = base height (iPhone X)

export const styles = StyleSheet.create({
  // --- Modal Container ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  modalContainer: {
    width: width * 0.95, // 95% of screen width
    height: height * 0.85, // 85% of screen height
    maxHeight: height * 0.9,
    backgroundColor: Colors.bgCard,
    borderRadius: scale(24),
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(20),
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },

  // --- Header with Back Button ---
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: verticalScale(16),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(12),
    backgroundColor: Colors.bgCardHover,
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  headerTextContainer: {
    flex: 1,
  },

  // --- Header Titles ---
  title: {
    fontSize: scale(26),
    fontWeight: "800",
    color: Colors.textPrimary,
    marginBottom: verticalScale(6),
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: scale(14),
    color: Colors.textMuted,
    fontWeight: "500",
  },

  // --- WebView ---
  webViewContainer: {
    flex: 1,
    minHeight: height * 0.35, // 35% of screen height
    maxHeight: height * 0.6, // 60% of screen height
    borderRadius: scale(16),
    overflow: "hidden",
    marginVertical: verticalScale(12),
    backgroundColor: Colors.bgSecondary,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  webView: {
    flex: 1,
    backgroundColor: Colors.bgSecondary,
  },

  // --- Loader ---
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(40),
    backgroundColor: "rgba(10, 10, 12, 0.5)",
    borderRadius: scale(16),
  },
  loaderText: {
    color: Colors.textMuted,
    marginTop: verticalScale(12),
    fontSize: scale(14),
    fontWeight: "500",
  },

  // --- Scroll Indicator ---
  scrollIndicator: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: verticalScale(12),
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(16),
    backgroundColor: Colors.bgCardHover,
    borderRadius: scale(20),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  scrollText: {
    fontSize: scale(12),
    color: Colors.textSecondary,
    fontWeight: "700",
    textAlign: "center",
    marginTop: verticalScale(4),
    letterSpacing: 0.3,
  },

  // --- Checkbox ---
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(20),
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(16),
    backgroundColor: Colors.bgCardHover,
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  checkbox: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(10),
    borderWidth: 2.5,
    borderColor: Colors.textMuted,
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(14),
    backgroundColor: Colors.bgSecondary,
  },
  checkboxChecked: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  checkboxLabel: {
    fontSize: scale(14),
    color: Colors.textPrimary,
    flex: 1,
    lineHeight: verticalScale(20),
    fontWeight: "600",
  },

  // --- Accept Button ---
  acceptButton: {
    borderRadius: scale(14),
    overflow: "hidden",
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  acceptButtonDisabled: {
    opacity: 0.5,
  },
  gradientButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(18),
    paddingHorizontal: scale(28),
    borderRadius: scale(14),
    gap: scale(8),
  },
  acceptButtonText: {
    fontSize: scale(17),
    fontWeight: "700",
    color: Colors.bgPrimary,
    letterSpacing: 0.2,
  },

  // --- Bottom Helper ---
  helperText: {
    fontSize: scale(12),
    color: Colors.textMuted,
    textAlign: "center",
    marginTop: verticalScale(12),
    fontStyle: "italic",
    fontWeight: "400",
  },
});
