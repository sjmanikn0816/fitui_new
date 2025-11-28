import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderBottomColor: Colors.borderDark,
    backgroundColor: Colors.bgPrimary,
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 50, // Align with paddingVertical
    padding: 8,
    zIndex: 10, // make sure it's above border
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: "600",
    textAlign: "center",
  },
});
