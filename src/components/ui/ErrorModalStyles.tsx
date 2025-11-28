import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  modal: {
    backgroundColor: Colors.bgCard,
    padding: 20,
    borderRadius: 12,
    width: "80%",
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  title: {
    ...Typography.h4,
    marginBottom: 10,
    color: "#F87171",
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.emerald,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    ...Typography.bodyMedium,
    color: Colors.bgPrimary,
    fontWeight: "600",
  },
});