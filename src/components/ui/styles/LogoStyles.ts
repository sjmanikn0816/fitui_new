import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";
import { Dimensions, StyleSheet } from "react-native";
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
} from "react-native-responsive-dimensions";
const { width: SCREEN_WIDTH } = Dimensions.get('window');
export const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  logoImage: {
    width: Math.min(420, SCREEN_WIDTH * 0.8),
    height: 50,
    aspectRatio: 3 / 1,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginVertical: 12,
  },
  logoText: {
    fontSize: responsiveFontSize(6.5),
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 2,
    textAlign: "center",
    marginVertical: 12,
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 15,
  },
  logoSmall: {
    width: 120,
    height: 50,
    aspectRatio: 4 / 1,
    resizeMode: 'contain',
  },
  text: {
    ...Typography.h3,
    color: Colors.black,
    fontWeight: "600",
    fontSize: responsiveFontSize(2.4),
  },
});
