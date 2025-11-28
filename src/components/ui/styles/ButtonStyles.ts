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
    borderRadius: responsiveHeight(1.8),
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
    backgroundColor: Colors.emerald,
  },
  secondary: {
    backgroundColor: Colors.bgCardHover,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: Colors.borderDark,
  },
  disabled: {
    opacity: 0.5,
  },

  // Sizes
  small: {
    paddingVertical: responsiveHeight(1.2),
    paddingHorizontal: responsiveWidth(4),
  },
  medium: {
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(5),
  },
  large: {
    paddingVertical: responsiveHeight(2.5),
    paddingHorizontal: responsiveWidth(6.5),
  },

  // Text styles
  text: {
    ...Typography.bodyMedium,
    fontSize: responsiveFontSize(2),
    fontWeight: "600",
  },
  primaryText: {
    color: Colors.bgPrimary,
  },
  secondaryText: {
    color: Colors.textPrimary,
  },
  outlineText: {
    color: Colors.textSecondary,
  },
});
