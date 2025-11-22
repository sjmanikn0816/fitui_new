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
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  modalContainer: {
    width: width * 0.95, // 95% of screen width
    height: height * 0.85, // 85% of screen height
    maxHeight: height * 0.9,
    backgroundColor: "#D6DAE0",
    borderRadius: scale(24),
    paddingVertical: verticalScale(24),
    paddingHorizontal: scale(20),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
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
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTextContainer: {
    flex: 1,
  },

  // --- Header Titles ---
  title: {
    fontSize: scale(26),
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: verticalScale(6),
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: scale(14),
    color: "#6b7280",
    fontWeight: "500",
  },

  // --- WebView ---
  webViewContainer: {
    flex: 1,
    minHeight: height * 0.35, // 35% of screen height
    maxHeight: height * 0.6,  // 60% of screen height
    borderRadius: scale(16),
    overflow: "hidden",
    marginVertical: verticalScale(12),
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: "#D6DAE0",
  },
  webView: {
    flex: 1,
    backgroundColor: "#ffffff",
  },

  // --- Loader ---
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: verticalScale(40),
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: scale(16),
  },
  loaderText: {
    color: "#6b7280",
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
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: scale(20),
    alignSelf: "center",
  },
  scrollText: {
    fontSize: scale(12),
    color: "#374151",
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
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    borderRadius: scale(12),
    borderWidth: 1,
    borderColor: "#D6DAE0",
  },
  checkbox: {
    width: scale(28),
    height: scale(28),
    borderRadius: scale(10),
    borderWidth: 2.5,
    borderColor: "#9ca3af",
    justifyContent: "center",
    alignItems: "center",
    marginRight: scale(14),
    backgroundColor: "#ffffff",
  },
  checkboxChecked: {
    backgroundColor: "#1a1a1a",
    borderColor: "#1a1a1a",
  },
  checkboxLabel: {
    fontSize: scale(14),
    color: "#1f2937",
    flex: 1,
    lineHeight: verticalScale(20),
    fontWeight: "600",
  },

  // --- Accept Button ---
  acceptButton: {
    borderRadius: scale(14),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
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
    color: "#ffffff",
    letterSpacing: 0.2,
  },

  // --- Bottom Helper ---
  helperText: {
    fontSize: scale(12),
    color: "#9ca3af",
    textAlign: "center",
    marginTop: verticalScale(12),
    fontStyle: "italic",
    fontWeight: "400",
  },
});
