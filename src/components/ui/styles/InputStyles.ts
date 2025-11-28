import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import { StyleSheet } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
  container: {
    marginVertical: responsiveHeight(1.5),
  },
  label: {
    ...Typography.bodyMedium,
    color: Colors.textSecondary,
    fontWeight: "600",
    marginBottom: responsiveHeight(1.2),
    fontSize: responsiveFontSize(1.8),
    letterSpacing: 0.5,
  },
  required: {
    color: Colors.emerald,
    fontSize: responsiveFontSize(1.8),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(2),
    color: Colors.textPrimary,
    backgroundColor: Colors.bgInput,
  },
  inputError: {
    borderColor: Colors.red,
  },
  error: {
    ...Typography.caption,
    fontSize: responsiveFontSize(1.6),
    color: Colors.red,
    marginTop: responsiveHeight(0.8),
  },
});
