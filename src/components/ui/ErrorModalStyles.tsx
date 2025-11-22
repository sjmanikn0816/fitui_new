import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modal: {
    backgroundColor: Colors.white,
    padding: 20,
    borderRadius: 12,
    width: "80%",
  },
  title: {
    ...Typography.h4,
    marginBottom: 10,
    color: Colors.error,
    fontWeight: "700",
    textAlign: "center",
  },
  message: {
    ...Typography.body,
    color: Colors.text,
    marginBottom: 20,
    textAlign: "center",
  },
  button: {
    backgroundColor: Colors.black,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    ...Typography.bodyMedium,
    color: Colors.white,
    fontWeight: "600",
  },
});