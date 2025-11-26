import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const AnimatedTextInline = ({
  children,
  style,
  duration = 600,
  ...rest   // 👈 capture numberOfLines, ellipsizeMode, etc.
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(6)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.Text
      {...rest}    // 👈 pass props so numberOfLines works
      style={[
        style,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {children}
    </Animated.Text>
  );
};
