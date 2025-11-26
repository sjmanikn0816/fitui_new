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
    backgroundColor: Colors.gray200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  completedStep: {
    backgroundColor: Colors.black,
  },
  currentStep: {
    backgroundColor: Colors.black,
  },
  stepText: {
    ...Typography.caption,
    color: Colors.gray500,
    fontWeight: '600',
  },
  currentStepText: {
    color: Colors.white,
  },
  connector: {
    width: 40,
    height: 2,
    backgroundColor: Colors.gray200,
    marginHorizontal: Spacing.xs,
  },
  completedConnector: {
    backgroundColor: Colors.gray100,
  },
});