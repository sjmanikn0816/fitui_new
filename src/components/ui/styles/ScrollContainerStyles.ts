import { StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { verticalScale } from "@/utils/responsive";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: verticalScale(60),
  },
});
