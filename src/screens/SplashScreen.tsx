// src/screens/SplashScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
  Text,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

export default function SplashScreen() {
  const fadeAnim = useState(new Animated.Value(0))[0];
  const scaleAnim = useState(new Animated.Value(0.8))[0];
  const slideAnim = useState(new Animated.Value(50))[0];
  const pulseAnim = useState(new Animated.Value(1))[0];

  useEffect(() => {
    // Main entrance animation
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

    // Pulse animation for glow effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [fadeAnim, scaleAnim, slideAnim, pulseAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />

      {/* Ambient Background Orbs */}
      <View style={styles.ambientBg}>
        <LinearGradient
          colors={["rgba(52, 211, 153, 0.15)", "transparent"]}
          style={styles.ambientOrb1}
        />
        <LinearGradient
          colors={["rgba(96, 165, 250, 0.08)", "transparent"]}
          style={styles.ambientOrb2}
        />
        <LinearGradient
          colors={["rgba(167, 139, 250, 0.06)", "transparent"]}
          style={styles.ambientOrb3}
        />
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
        {/* Glowing Ring Effect */}
        <Animated.View
          style={[
            styles.glowRing,
            { transform: [{ scale: pulseAnim }] },
          ]}
        />

        {/* Main Logo Circle */}
        <View style={styles.logoBorder}>
          <LinearGradient
            colors={[Colors.emerald, Colors.emeraldDark]}
            style={styles.logoBox}
          >
            <Image
              source={require("../../assets/icon.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </LinearGradient>
        </View>

        {/* Animated Text */}
        <Animated.View
          style={[
            styles.textContainer,
            {
              transform: [{ translateY: slideAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <Text style={styles.brandText}>fitAI</Text>
          <Text style={styles.taglineText}>Your Personal Health Companion</Text>
        </Animated.View>
      </Animated.View>

      {/* Bottom gradient fade */}
      <LinearGradient
        colors={["transparent", "rgba(52, 211, 153, 0.05)"]}
        style={styles.bottomGradient}
      />

      {/* Floating particles */}
      <View style={[styles.particle, { bottom: 150, left: 40 }]} />
      <View style={[styles.particle, { bottom: 250, right: 50, width: 8, height: 8 }]} />
      <View style={[styles.particle, { bottom: 100, right: 100, width: 6, height: 6 }]} />
      <View style={[styles.particle, { top: 180, left: 60, width: 4, height: 4 }]} />
      <View style={[styles.particle, { top: 250, right: 80, width: 5, height: 5 }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.bgPrimary,
  },
  ambientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  ambientOrb1: {
    position: "absolute",
    top: -80,
    right: -60,
    width: 280,
    height: 280,
    borderRadius: 140,
  },
  ambientOrb2: {
    position: "absolute",
    top: height * 0.4,
    left: -100,
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  ambientOrb3: {
    position: "absolute",
    bottom: 100,
    right: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  glowRing: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: "rgba(52, 211, 153, 0.2)",
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
  },
  logoBorder: {
    width: 140,
    height: 140,
    borderRadius: 70,
    padding: 4,
    backgroundColor: Colors.bgCard,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    marginBottom: 30,
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  logoBox: {
    flex: 1,
    borderRadius: 66,
    justifyContent: "center",
    alignItems: "center",
  },
  logoImage: {
    width: "70%",
    height: "70%",
  },
  textContainer: {
    alignItems: "center",
    gap: 8,
    marginTop: 10,
  },
  brandText: {
    fontSize: 48,
    fontWeight: "800",
    color: Colors.textPrimary,
    letterSpacing: 2,
    textShadowColor: "rgba(52, 211, 153, 0.5)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  taglineText: {
    fontSize: 14,
    color: Colors.textMuted,
    letterSpacing: 1,
    marginTop: 4,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: 200,
  },
  particle: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.emerald,
    opacity: 0.2,
  },
});
