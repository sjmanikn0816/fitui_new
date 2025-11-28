import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Colors } from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const getIcon = (routeName: string, focused: boolean, size: number) => {
    const iconStyle = {
      width: size,
      height: size,
      resizeMode: "contain" as const,
      tintColor: focused ? Colors.emerald : "rgba(255, 255, 255, 0.5)",
    };

    switch (routeName) {
      case "Landing":
        return (
          <View style={[styles.centerButton, focused && styles.centerButtonActive]}>
            {focused && (
              <View style={styles.centerGlow} />
            )}
            <Image
              source={
                focused
                  ? require("assets/Ai_inactive.png")
                  : require("assets/Ai_active.png")
              }
              style={{ width: 26, height: 26, resizeMode: "contain" }}
            />
          </View>
        );
      case "NutritionPlan":
        return (
          <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
            <Image
              source={
                focused
                  ? require("assets/nutrition_inactive.png")
                  : require("assets/nutrition_active.png")
              }
              style={iconStyle}
            />
          </View>
        );
      case "HealthTrack":
        return (
          <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
            <Image
              source={
                focused
                  ? require("assets/health_inactive.png")
                  : require("assets/health_active.png")
              }
              style={iconStyle}
            />
          </View>
        );
      case "GoalCustomizationMain":
        return (
          <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
            <Image
              source={
                focused
                  ? require("assets/goal_inactive.png")
                  : require("assets/goal_active.png")
              }
              style={iconStyle}
            />
          </View>
        );
      case "FoodAnalysis":
        return (
          <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
            <Image
              source={
                focused
                  ? require("assets/food_inactive.png")
                  : require("assets/food_active.png")
              }
              style={iconStyle}
            />
          </View>
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
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 }]}>
      {/* Outer glow effect */}
      <View style={styles.glowContainer}>
        <LinearGradient
          colors={["transparent", "rgba(52, 211, 153, 0.08)", "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={styles.glowGradient}
        />
      </View>

      {/* Main tab bar with blur */}
      <View style={styles.tabBarWrapper}>
        <BlurView
          intensity={Platform.OS === "ios" ? 40 : 100}
          tint="dark"
          style={styles.blurView}
        >
          <View style={styles.tabBarInner}>
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

              const icon = getIcon(route.name, isFocused, 24);
              if (!icon) return null;

              return (
                <TouchableOpacity
                  key={route.key}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  onPress={onPress}
                  onLongPress={onLongPress}
                  style={[
                    styles.tabButton,
                    isCenter && styles.centerTabButton,
                  ]}
                  activeOpacity={0.7}
                >
                  {icon}
                  {/* Active indicator dot */}
                  {isFocused && !isCenter && (
                    <View style={styles.activeIndicator} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
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
    position: "absolute",
    bottom: 10,
    left: 40,
    right: 40,
    height: 60,
    zIndex: -1,
  },
  glowGradient: {
    flex: 1,
    borderRadius: 30,
  },
  tabBarWrapper: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 28,
    overflow: "hidden",
    // Glass border effect
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 24,
  },
  blurView: {
    borderRadius: 28,
    overflow: "hidden",
  },
  tabBarInner: {
    flexDirection: "row",
    backgroundColor: "rgba(18, 18, 22, 0.75)",
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "space-around",
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    minWidth: 50,
  },
  centerTabButton: {
    flex: 1.3,
  },
  iconWrapper: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  iconWrapperActive: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.3)",
    // Glow effect
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  centerButton: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: "rgba(52, 211, 153, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "rgba(52, 211, 153, 0.25)",
  },
  centerButtonActive: {
    backgroundColor: "rgba(52, 211, 153, 0.25)",
    borderColor: Colors.emerald,
    borderWidth: 2,
    // Strong glow
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
  },
  centerGlow: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(52, 211, 153, 0.15)",
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.emerald,
    marginTop: 4,
    // Glow on indicator
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
  },
});

export default CustomTabBar;
