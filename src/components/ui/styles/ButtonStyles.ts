import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { Spacing } from "@/constants/Spacing";
import { Typography } from "@/constants/Typography";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";

export const styles = StyleSheet.create({
  button: {
    borderRadius: responsiveHeight(1.2), 
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconWrapper: {
    marginRight: responsiveWidth(2),
  },

  // Variants
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.gray200,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  disabled: {
    opacity: 0.6,
  },


  small: {
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(4),
  },
  medium: {
    paddingVertical: responsiveHeight(1),
    paddingHorizontal: responsiveWidth(5),
  },
  large: {
    paddingVertical: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(6.5),
  },


  text: {
    ...Typography.bodyMedium,
    fontSize: responsiveFontSize(2), 
  },
  primaryText: {
    color: Colors.white,
  },
  secondaryText: {
    color: Colors.text,
  },
  outlineText: {
    color: Colors.primary,
  },
});
