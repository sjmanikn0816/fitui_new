import { Colors } from "@/constants/Colors";
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
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.borderDark,
    borderRadius: responsiveWidth(4),
    paddingVertical: responsiveHeight(2),
    paddingHorizontal: responsiveWidth(4),
    backgroundColor: Colors.bgInput,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownError: {
    borderColor: Colors.red,
  },
  dropdownText: {
    fontSize: responsiveFontSize(2),
    color: Colors.textPrimary,
    flex: 1,
    textAlign: "center",
  },
  placeholderText: {
    color: Colors.textMuted,
  },
  arrow: {
    fontSize: responsiveFontSize(1.5),
    color: Colors.textMuted,
    marginLeft: responsiveWidth(2),
  },
  error: {
    ...Typography.caption,
    fontSize: responsiveFontSize(1.6),
    color: Colors.red,
    marginTop: responsiveHeight(0.8),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.bgSecondary,
    borderRadius: responsiveWidth(4),
    maxHeight: responsiveHeight(40),
    width: responsiveWidth(80),
    elevation: 10,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  dropdownList: {
    maxHeight: responsiveHeight(35),
  },
  dropdownItem: {
    paddingVertical: responsiveHeight(1.8),
    paddingHorizontal: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  dropdownItemSelected: {
    backgroundColor: "rgba(52, 211, 153, 0.1)",
  },
  dropdownItemText: {
    fontSize: responsiveFontSize(2.5),
    color: Colors.textSecondary,
    textAlign: "center",
  },
  dropdownItemTextSelected: {
    color: Colors.emerald,
    fontWeight: "700",
  },
});
