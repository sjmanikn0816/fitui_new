import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.lg,
  },
  step: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.bgCardHover,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedStep: {
    backgroundColor: Colors.emerald,
  },
  currentStep: {
    backgroundColor: Colors.emerald,
  },
  stepText: {
    ...Typography.caption,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  currentStepText: {
    color: Colors.bgPrimary,
  },
  connector: {
    width: 40,
    height: 2,
    backgroundColor: Colors.borderDark,
    marginHorizontal: Spacing.xs,
  },
  completedConnector: {
    backgroundColor: Colors.emerald,
  },
});