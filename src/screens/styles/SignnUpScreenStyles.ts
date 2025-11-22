import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    alignItems: "center",
    paddingTop: Spacing.xl,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    textAlign: "center",
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: Spacing.xl,
  },
  form: {
    flex: 1,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nameInput: {
    flex: 0.48,
  },
  continueButton: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  signInPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    paddingBottom: Spacing.lg,
  },
  signInText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  signInLink: {
    ...Typography.bodyMedium,
    color: Colors.primary,
  },
});
