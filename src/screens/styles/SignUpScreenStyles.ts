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
    backgroundColor: Colors.bgPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: responsiveHeight(3),
  },
  header: {
    backgroundColor: Colors.bgPrimary,
    alignItems: "center",
    paddingTop: responsiveHeight(3),
    marginTop: responsiveHeight(2),
  },
  content: {
    flex: 1,
    paddingHorizontal: responsiveWidth(6),
    marginTop: responsiveHeight(2),
  },
  title: {
    ...Typography.body,
    fontSize: responsiveFontSize(3),
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: responsiveHeight(1.2),
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  subtitle: {
    ...Typography.caption,
    fontSize: responsiveFontSize(2),
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: responsiveHeight(3),
  },
  form: {
    flex: 1,
  },
  platformText: {
    color: Colors.textPrimary,
    fontSize: responsiveFontSize(2),
  },
  signInButton: {
    height: responsiveHeight(7),
    width: responsiveWidth(88),
    marginVertical: responsiveHeight(1.5),
    marginBottom: responsiveHeight(2.5),
    backgroundColor: Colors.emerald,
    borderRadius: responsiveHeight(1.5),
    alignSelf: "center",
  },
  googleSignInButton: {
    height: responsiveHeight(6.5),
    width: responsiveWidth(88),
    marginBottom: responsiveHeight(2),
    backgroundColor: Colors.bgCard,
    borderRadius: responsiveHeight(1.5),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  appleSignInButton: {
    height: responsiveHeight(6.5),
    width: responsiveWidth(88),
    marginBottom: responsiveHeight(2.5),
    backgroundColor: Colors.bgCard,
    borderRadius: responsiveHeight(1.5),
    alignSelf: "center",
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  orText: {
    ...Typography.body,
    fontSize: responsiveFontSize(1.8),
    color: Colors.textMuted,
    textAlign: "center",
    marginBottom: responsiveHeight(2),
    letterSpacing: 1,
  },
  signUpPrompt: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    marginTop: responsiveHeight(2),
    paddingBottom: responsiveHeight(2),
  },
  signUpText: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.textMuted,
  },
  signUpLink: {
    fontSize: responsiveFontSize(1.8),
    color: Colors.emerald,
    fontWeight: "600",
  },
});
