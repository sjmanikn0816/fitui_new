import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
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
      tintColor: focused ? Colors.emerald : Colors.textMuted,
    };

    switch (routeName) {
      case "Landing":
        return (
          <View style={[styles.centerButton, focused && styles.centerButtonActive]}>
            <Image
              source={
                focused
                  ? require("assets/Ai_inactive.png")
                  : require("assets/Ai_active.png")
              }
              style={{ width: 28, height: 28, resizeMode: "contain" }}
            />
          </View>
        );
      case "NutritionPlan":
        return (
          <Image
            source={
              focused
                ? require("assets/nutrition_inactive.png")
                : require("assets/nutrition_active.png")
            }
            style={iconStyle}
          />
        );
      case "HealthTrack":
        return (
          <Image
            source={
              focused
                ? require("assets/health_inactive.png")
                : require("assets/health_active.png")
            }
            style={iconStyle}
          />
        );
      case "GoalCustomizationMain":
        return (
          <Image
            source={
              focused
                ? require("assets/goal_inactive.png")
                : require("assets/goal_active.png")
            }
            style={iconStyle}
          />
        );
      case "FoodAnalysis":
        return (
          <Image
            source={
              focused
                ? require("assets/food_inactive.png")
                : require("assets/food_active.png")
            }
            style={iconStyle}
          />
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

          const icon = getIcon(route.name, isFocused, 26);
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
            >
              {icon}
            </TouchableOpacity>
          );
        })}
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
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(15, 15, 18, 0.95)",
    borderRadius: 32,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    maxWidth: 340,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    // Glassy shadow effect
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 20,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
    minWidth: 48,
  },
  centerTabButton: {
    flex: 1.2,
  },
  centerButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(52, 211, 153, 0.3)",
  },
  centerButtonActive: {
    backgroundColor: "rgba(52, 211, 153, 0.25)",
    borderColor: Colors.emerald,
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
});

export default CustomTabBar;
