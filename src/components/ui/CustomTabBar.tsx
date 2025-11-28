import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Animated,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  // Animation values for each tab
  const scaleAnims = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;

  const glowAnims = useRef(
    state.routes.map(() => new Animated.Value(0))
  ).current;

  // Animate active tab
  useEffect(() => {
    state.routes.forEach((_, index) => {
      const isActive = state.index === index;

      // Scale animation
      Animated.spring(scaleAnims[index], {
        toValue: isActive ? 1.1 : 1,
        friction: 5,
        tension: 100,
        useNativeDriver: true,
      }).start();

      // Glow animation
      Animated.timing(glowAnims[index], {
        toValue: isActive ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [state.index]);

  const getIcon = (routeName: string, focused: boolean, size: number, index: number) => {
    const iconStyle = {
      width: size,
      height: size,
      resizeMode: "contain" as const,
      tintColor: focused ? Colors.emerald : Colors.textMuted,
    };

    // Animated glow wrapper for regular icons
    const AnimatedIconWrapper = ({ children }: { children: React.ReactNode }) => (
      <Animated.View
        style={[
          styles.iconWrapper,
          focused && styles.iconWrapperActive,
          {
            transform: [{ scale: scaleAnims[index] }],
            shadowOpacity: glowAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0, 0.6],
            }),
          },
        ]}
      >
        {children}
      </Animated.View>
    );

    switch (routeName) {
      case "Landing":
        return (
          <Animated.View
            style={[
              styles.centerButton,
              focused && styles.centerButtonActive,
              {
                transform: [{ scale: scaleAnims[index] }],
              }
            ]}
          >
            {/* Outer glow ring */}
            {focused && (
              <View style={styles.centerGlowRing} />
            )}
            <Image
              source={
                focused
                  ? require("assets/Ai_inactive.png")
                  : require("assets/Ai_active.png")
              }
              style={{ width: 28, height: 28, resizeMode: "contain" }}
            />
          </Animated.View>
        );
      case "NutritionPlan":
        return (
          <AnimatedIconWrapper>
            <Image
              source={
                focused
                  ? require("assets/nutrition_inactive.png")
                  : require("assets/nutrition_active.png")
              }
              style={iconStyle}
            />
          </AnimatedIconWrapper>
        );
      case "HealthTrack":
        return (
          <AnimatedIconWrapper>
            <Image
              source={
                focused
                  ? require("assets/health_inactive.png")
                  : require("assets/health_active.png")
              }
              style={iconStyle}
            />
          </AnimatedIconWrapper>
        );
      case "GoalCustomizationMain":
        return (
          <AnimatedIconWrapper>
            <Image
              source={
                focused
                  ? require("assets/goal_inactive.png")
                  : require("assets/goal_active.png")
              }
              style={iconStyle}
            />
          </AnimatedIconWrapper>
        );
      case "FoodAnalysis":
        return (
          <AnimatedIconWrapper>
            <Image
              source={
                focused
                  ? require("assets/food_inactive.png")
                  : require("assets/food_active.png")
              }
              style={iconStyle}
            />
          </AnimatedIconWrapper>
        );
      default:
        return null;
    }
  };

  // Filter out hidden tabs
  const visibleRoutes = state.routes.filter(
    (route) => route.name !== "AllScreensMenu"
  );

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
      {/* Gradient glow behind tab bar */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={['transparent', Colors.tabBarGlow, 'transparent']}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.glowGradient}
        />
      </View>

      {/* Main tab bar container with blur */}
      <View style={styles.tabBarWrapper}>
        {Platform.OS === 'ios' ? (
          <BlurView intensity={40} tint="dark" style={styles.blurContainer}>
            <View style={styles.tabBarOverlay} />
          </BlurView>
        ) : (
          <View style={[styles.blurContainer, styles.androidBackground]} />
        )}

        {/* Tab bar content */}
        <View style={styles.tabBarContainer}>
          {visibleRoutes.map((route, visibleIndex) => {
            const routeIndex = state.routes.findIndex((r) => r.key === route.key);
            const { options } = descriptors[route.key];
            const isFocused = state.index === routeIndex;
            const isCenter = route.name === "Landing";

            const onPress = () => {
              const event = navigation.emit({
                type: "tabPress",
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            const onLongPress = () => {
              navigation.emit({
                type: "tabLongPress",
                target: route.key,
              });
            };

            const icon = getIcon(route.name, isFocused, 26, routeIndex);
            if (!icon) return null;

            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                activeOpacity={0.7}
                style={[
                  styles.tabButton,
                  isCenter && styles.centerTabButton,
                ]}
              >
                {/* Active indicator background */}
                {isFocused && !isCenter && (
                  <Animated.View style={styles.activeIndicator} />
                )}
                {icon}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: 16,
    backgroundColor: "transparent",
  },
  glowContainer: {
    position: 'absolute',
    bottom: 8,
    left: 40,
    right: 40,
    height: 60,
    opacity: 0.5,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 30,
  },
  tabBarWrapper: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 28,
    overflow: 'hidden',
    // Outer shadow for depth
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 24,
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 28,
  },
  androidBackground: {
    backgroundColor: Colors.tabBarBg,
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: Colors.tabBarBg,
    borderRadius: 28,
  },
  tabBarContainer: {
    flexDirection: "row",
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: Colors.tabBarBorder,
    // Inner glow effect
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    minWidth: 52,
    position: 'relative',
  },
  centerTabButton: {
    flex: 1.3,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 4,
    right: 4,
    backgroundColor: Colors.activeTabBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.activeTabBorder,
  },
  iconWrapper: {
    padding: 8,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    // Shadow for glow effect
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    elevation: 4,
  },
  iconWrapperActive: {
    backgroundColor: 'transparent',
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(52, 211, 153, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(52, 211, 153, 0.25)",
    position: 'relative',
  },
  centerButtonActive: {
    backgroundColor: "rgba(52, 211, 153, 0.2)",
    borderColor: Colors.emerald,
    // Glow effect
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
  },
  centerGlowRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.3)',
    backgroundColor: 'transparent',
  },
});

export default CustomTabBar;
