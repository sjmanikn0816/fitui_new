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
    color: Colors.text,
    fontWeight:"600",
    marginBottom: responsiveHeight(1.2),
    fontSize: responsiveFontSize(2),
  },
  required: {
    color: Colors.error,
    fontSize: responsiveFontSize(2),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: responsiveWidth(3), 
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(4),
    fontSize: responsiveFontSize(2),
    color: Colors.text,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.error,
  },
  error: {
    ...Typography.caption,
    fontSize: responsiveFontSize(1.6),
    color: Colors.error,
    marginTop: responsiveHeight(0.8),
  },
});
