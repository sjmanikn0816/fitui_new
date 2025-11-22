import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";
import { scale, verticalScale } from "@/utils/responsive";

interface SpeechBubbleBackgroundProps {
  children: React.ReactNode;
}

const SpeechBubbleBackground: React.FC<SpeechBubbleBackgroundProps> = ({
  children,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg
          width="100%"
          height="100%"
          viewBox="0 0 350 380"
          preserveAspectRatio="none"
          style={styles.svg}
        >
          <Path
            d="M 60 0
               L 290 0
               Q 350 0 350 60
               L 350 280
               Q 350 340 290 340
               L 205 340
               C 195 340 185 350 175 368
               C 165 350 155 340 145 340
               L 60 340
               Q 0 340 0 280
               L 0 60
               Q 0 0 60 0
               Z"
            fill="#FFFFFFA8"
          />
        </Svg>
      </View>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "92%",
    position: "relative",
  },
  svgContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  svg: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  content: {
    paddingHorizontal: scale(24),
    paddingVertical: verticalScale(22),
    paddingBottom: verticalScale(40),
    zIndex: 1,
  },
});

export default SpeechBubbleBackground;
