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
    color: Colors.text,
    fontWeight: "700",
    marginBottom: responsiveHeight(1.2),
    fontSize: responsiveFontSize(2),
  },
  required: {
    color: Colors.error,
    fontSize: responsiveFontSize(2),
  },
  dropdown: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: responsiveWidth(3),
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(4),
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownError: {
    borderColor: Colors.error,
  },
  dropdownText: {
    fontSize: responsiveFontSize(2),
    color: Colors.text,
    flex: 1,
    textAlign: "center",
  },
  placeholderText: {
    color: Colors.gray400,
  },
  arrow: {
    fontSize: responsiveFontSize(1.5),
    color: Colors.gray400,
    marginLeft: responsiveWidth(2),
  },
  error: {
    ...Typography.caption,
    fontSize: responsiveFontSize(1.6),
    color: Colors.error,
    marginTop: responsiveHeight(0.8),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: responsiveWidth(3),
    maxHeight: responsiveHeight(40),
    width: responsiveWidth(80),
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  dropdownList: {
    maxHeight: responsiveHeight(35),
  },
  dropdownItem: {
    paddingVertical: responsiveHeight(1.5),
    paddingHorizontal: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray200,
  },
  dropdownItemSelected: {
    backgroundColor: Colors.gray200,
  },
  dropdownItemText: {
    fontSize: responsiveFontSize(2.7),
    color: Colors.text,
    textAlign: "center",
  },
  dropdownItemTextSelected: {
    color: Colors.black,
    fontWeight: "800",
  },
});
