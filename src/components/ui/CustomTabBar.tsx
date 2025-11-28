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

  // Single animation value for scale (native driver compatible)
  const scaleAnims = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;

  // Animate active tab scale only
  useEffect(() => {
    state.routes.forEach((_, index) => {
      const isActive = state.index === index;

      Animated.spring(scaleAnims[index], {
        toValue: isActive ? 1.05 : 1,
        friction: 6,
        tension: 120,
        useNativeDriver: true,
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

    // Simple icon wrapper with scale animation
    const AnimatedIconWrapper = ({ children }: { children: React.ReactNode }) => (
      <Animated.View
        style={[
          styles.iconWrapper,
          {
            transform: [{ scale: scaleAnims[index] }],
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
            <Image
              source={
                focused
                  ? require("assets/Ai_active.png")
                  : require("assets/Ai_inactive.png")
              }
              style={{
                width: 28,
                height: 28,
                resizeMode: "contain",
                tintColor: focused ? Colors.emerald : Colors.textMuted,
              }}
            />
          </Animated.View>
        );
      case "NutritionPlan":
        return (
          <AnimatedIconWrapper>
            <Image
              source={
                focused
                  ? require("assets/nutrition_active.png")
                  : require("assets/nutrition_inactive.png")
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
                  ? require("assets/health_active.png")
                  : require("assets/health_inactive.png")
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
                  ? require("assets/goal_active.png")
                  : require("assets/goal_inactive.png")
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
                  ? require("assets/food_active.png")
                  : require("assets/food_inactive.png")
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
      {/* Main tab bar container */}
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
          {visibleRoutes.map((route) => {
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

            const icon = getIcon(route.name, isFocused, 24, routeIndex);
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
    paddingHorizontal: 20,
    backgroundColor: "transparent",
  },
  tabBarWrapper: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 32,
    overflow: 'hidden',
  },
  blurContainer: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 32,
  },
  androidBackground: {
    backgroundColor: "rgba(18, 18, 22, 0.95)",
  },
  tabBarOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(18, 18, 22, 0.85)",
    borderRadius: 32,
  },
  tabBarContainer: {
    flexDirection: "row",
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    minWidth: 48,
  },
  centerTabButton: {
    flex: 1.2,
  },
  iconWrapper: {
    padding: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  centerButtonActive: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.3)",
  },
});

export default CustomTabBar;
