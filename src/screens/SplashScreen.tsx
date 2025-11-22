// src/screens/SplashScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

// Color Scheme
const Colors = {
  primary: "#0277BD",
  primaryDark: "#01579B",
  white: "#FFFFFF",
  black: "#000000",
  lightBlue: "#E3F2FD",
  mediumBlue: "#B3E5FC",
  skyBlue: "#81D4FA",
};

export default function SplashScreen() {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const slideAnim = useState(new Animated.Value(50))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim, slideAnim]);

  return (
    <LinearGradient
      colors={[Colors.lightBlue, Colors.mediumBlue, Colors.skyBlue]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Water wave background - Top */}
      <View style={styles.waveContainer}>
        <View style={styles.wave} />
        <View style={[styles.wave, styles.wave2]} />
      </View>

      {/* Logo Container with Animation */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* FitAI Logo Circle with Primary Color */}
        <View style={styles.logoBorder}>
          <View style={styles.logoBox}>
            <Image
              source={require(".././../assets/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Animated Text Below Logo */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.textLine} />
          <View style={[styles.textLine, { width: "70%" }]} />
        </Animated.View>
      </Animated.View>

      {/* Bottom water accent with primary color */}
      <View style={styles.bottomWave} />

      {/* Floating bubbles decoration */}
      <View style={[styles.bubble, { bottom: 120, left: 30 }]} />
      <View style={[styles.bubble, { bottom: 200, right: 40, width: 16, height: 16 }]} />
      <View style={[styles.bubble, { bottom: 80, right: 80, width: 12, height: 12 }]} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.lightBlue,
  },
  waveContainer: {
    position: "absolute",
    top: -50,
    width: width * 1.5,
    height: 200,
    opacity: 0.25,
  },
  wave: {
    position: "absolute",
    width: "100%",
    height: 100,
    backgroundColor: Colors.primary,
    borderRadius: 100,
  },
  wave2: {
    top: 50,
    opacity: 0.6,
    backgroundColor: Colors.primaryDark,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  logoBorder: {
    width: 160,
    height: 160,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: Colors.primary,
    padding: 8,
    marginBottom: 30,
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  logoBox: {
    flex: 1,
    borderRadius: 32,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.lightBlue,
  },
  logoImage: {
    width: "80%",
    height: "80%",
  },
  textContainer: {
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  textLine: {
    width: "90%",
    height: 8,
    backgroundColor: Colors.primary,
    borderRadius: 4,
    opacity: 0.5,
  },
  bottomWave: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 120,
    backgroundColor: Colors.primary,
    opacity: 0.08,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 120,
  },
  bubble: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    opacity: 0.12,
  },
});