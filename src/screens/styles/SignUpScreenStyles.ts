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
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: responsiveHeight(3), // extra bottom padding for safe scroll
  },
  header: {
    backgroundColor: Colors.gray100,
    alignItems: "center",
    paddingTop: responsiveHeight(5),
    marginTop: responsiveHeight(4),
  },
  content: {
    flex: 1,
    paddingHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(2),
  },
  title: {
    ...Typography.body,
    fontSize: responsiveFontSize(2.8),
    color: Colors.black,
    textAlign: "center",
    marginBottom: responsiveHeight(1.2),
    fontWeight: "700",
  },
  subtitle: {
    ...Typography.caption,
    fontSize: responsiveFontSize(2.2),
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: responsiveHeight(3),
  },
  form: {
    flex: 1,
  },
  platformText: {
    color: Colors.black,
    fontSize: responsiveFontSize(2),
  },
  signInButton: {
    height: responsiveHeight(6.5),
    width: responsiveWidth(88),
    marginVertical: responsiveHeight(1.5),
    marginBottom: responsiveHeight(2.5),
    backgroundColor: Colors.black,
    borderRadius: responsiveHeight(1),
    alignSelf: "center",
  },
  googleSignInButton: {
    height: responsiveHeight(6.5),
    width: responsiveWidth(88),
    marginBottom: responsiveHeight(2.5),
    backgroundColor: Colors.gray200,
    borderRadius: responsiveHeight(1),
    alignSelf: "center",
  },
  appleSignInButton: {
    height: responsiveHeight(6.5),
    width: responsiveWidth(88),
    marginBottom: responsiveHeight(2.5),
    backgroundColor: Colors.gray200,
    borderRadius: responsiveHeight(1),
    alignSelf: "center",
  },
  orText: {
    ...Typography.body,
    fontSize: responsiveFontSize(2.2),
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: responsiveHeight(2),
  },
signUpPrompt: {
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "center",
  alignItems: "center",
  marginTop: 10,
},
signUpText: {
  fontSize: 14,
    color: Colors.textSecondary,
},
signUpLink: {
  fontSize: 14,
    color: Colors.gray900,
  fontWeight: "600",
},

});
