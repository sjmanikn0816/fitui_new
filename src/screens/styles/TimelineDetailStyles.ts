import { StyleSheet, Platform } from "react-native";
import { scale, verticalScale, moderateScale } from "@/utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F7F7",
  },

  scrollContent: {
    paddingBottom: verticalScale(80),
  },

  header: {
    paddingHorizontal: scale(24),
    paddingTop: Platform.OS === "ios" ? verticalScale(60) : verticalScale(40),
    paddingBottom: verticalScale(36),
    alignItems: "center",
    borderBottomLeftRadius: scale(24),
    borderBottomRightRadius: scale(24),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },

  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? verticalScale(60) : verticalScale(40),
    left: scale(20),
    zIndex: 10,
  },

  headerTitle: {
    fontSize: moderateScale(26),
    fontWeight: "800",
    color: "#fff",
    marginTop: verticalScale(12),
    textAlign: "center",
  },

  headerSubtitle: {
    fontSize: moderateScale(15),
    color: "#e0e7ff",
    marginTop: verticalScale(4),
    textAlign: "center",
  },

  section: {
    backgroundColor: "#fff",
    marginHorizontal: scale(20),
    marginTop: verticalScale(20),
    padding: scale(20),
    borderRadius: scale(16),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: {
        elevation: 2,
      },
    }),
  },

  sectionTitle: {
    fontSize: moderateScale(18),
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: verticalScale(16),
  },

  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
    gap: scale(10),
  },

  statText: {
    fontSize: moderateScale(15),
    color: "#334155",
    fontWeight: "500",
  },

  tag: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(6),
    borderRadius: scale(8),
    alignSelf: "flex-start",
    marginBottom: verticalScale(8),
  },

  tagText: {
    fontSize: moderateScale(13),
    color: "#1e40af",
    fontWeight: "600",
  },

  outcomeTag: {
    backgroundColor: "#dcfce7",
  },

  outcomeText: {
    color: "#166534",
  },

  focusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(10),
    gap: scale(10),
  },

  focusText: {
    fontSize: moderateScale(15),
    color: "#334155",
    fontWeight: "500",
  },

  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    flexDirection: "row",
    paddingHorizontal: scale(20),
    paddingVertical: Platform.OS === "ios" ? verticalScale(18) : verticalScale(16),
    paddingBottom: Platform.OS === "ios" ? verticalScale(34) : verticalScale(20),
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    gap: scale(12),
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  startButton: {
    flex: 1,
    borderRadius: scale(12),
    overflow: "hidden",
  },

  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: verticalScale(16),
    borderRadius: scale(12),
    gap: scale(8),
  },

  startButtonText: {
    fontSize: moderateScale(16),
    color: "#fff",
    fontWeight: "700",
  },
});
