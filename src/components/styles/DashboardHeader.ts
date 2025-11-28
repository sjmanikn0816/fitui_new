import { Colors } from "@/constants/Colors";
import { Dimensions, StyleSheet } from "react-native";
const { width } = Dimensions.get("window");

export const styles = StyleSheet.create({
  headerContent: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: "hidden",
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  headerImageStyle: {
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
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
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  activeHeaderTab: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  headerTabText: {
    color: Colors.textSecondary,
    fontSize: width > 400 ? 14 : 12,
    fontWeight: "500",
  },
  activeHeaderTabText: {
    color: Colors.bgPrimary,
    fontWeight: "600",
  },
  menuButton: {
    marginLeft: 10,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 8,
    borderWidth: 1,
    borderColor: Colors.borderDark,
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
    color: Colors.textPrimary,
  },
  welcomeText: {
    fontSize: width > 400 ? 22 : 19,
    fontWeight: "700",
    marginTop: 2,
    color: Colors.emerald,
  },
  descriptionText: {
    fontSize: width > 400 ? 14 : 12,
    marginTop: 2,
    color: Colors.textSecondary,
  },
});
