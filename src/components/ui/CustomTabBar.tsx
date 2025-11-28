import React from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Image,
} from "react-native";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { FoodAnalysisIcon, KcalIcon } from "@/components/icons/Icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomTabBar: React.FC<BottomTabBarProps> = ({
  state,
  descriptors,
  navigation,
}) => {
  const insets = useSafeAreaInsets();

  const getIcon = (routeName: string, focused: boolean, size: number) => {
    const color = focused ? Colors.emerald : Colors.textMuted;

    switch (routeName) {
      case "Landing":
        return (
          <View style={[styles.centerButton, focused && styles.centerButtonActive]}>
            <Image
              source={
                focused
                  ? require("assets/primaryAi.png")
                  : require("assets/Ai.png")
              }
              style={{ width: 28, height: 28 }}
            />
          </View>
        );
      case "FoodAnalysis":
        return <FoodAnalysisIcon size={size} color={color} focused={focused} />;
      case "HealthTrack":
        return <MaterialCommunityIcons name="walk" size={size} color={color} />;
      case "Favorites":
        return <MaterialIcons name="track-changes" size={size} color={color} />;
      case "NutritionPlan":
        return <KcalIcon size={24} color={color} focused={focused} />;
      default:
        return <MaterialIcons name="help" size={size} color={color} />;
    }
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }]}>
      <View style={styles.tabBarContainer}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
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
              {getIcon(route.name, isFocused, 24)}
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
