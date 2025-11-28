import { Colors } from "@/constants/Colors";
import { verticalScale } from "@/utils/responsive";
import { Platform, StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    paddingBottom: verticalScale(60),
    paddingTop: Platform.OS === "android" ? 0 : 0,
  },
  content: {
    flex: 1,
  },
});
