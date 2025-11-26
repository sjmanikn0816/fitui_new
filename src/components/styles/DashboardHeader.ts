import { Colors } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  headerContent: {
     borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 3,
    bottom:20,
  },

  // Tabs
  modernTabsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
    paddingHorizontal: 12,
  },
  scrollableTabs: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  headerTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  activeHeaderTab: {
    backgroundColor: Colors.white,
  },
  headerTabText: {
    color: Colors.white,
    fontSize: width > 400 ? 14 : 12,
    fontWeight: "500",
  },
  activeHeaderTabText: {
    color: Colors.primary,
    fontWeight: "600",
  },
  menuButton: {
    marginLeft: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },

  // Text Section
  headerTextContainer: {
    marginHorizontal: 10,
    marginTop: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  greetingText: {
    fontSize: width > 400 ? 18 : 16,
    fontWeight: "600",
  },
  welcomeText: {
    fontSize: width > 400 ? 22 : 19,
    fontWeight: "700",
    marginTop: 2,
  },
  descriptionText: {
    fontSize: width > 400 ? 14 : 12,
    opacity: 0.9,
    marginTop: 2,
  },
});
