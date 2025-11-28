import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";

const TopMenuBar = () => {
  const navigation = useNavigation();

  // Detect active tab screen inside MainTabs
  const activeTab = useNavigationState((state) => {
    const mainTabRoute = state.routes.find(r => r.name === "MainTabs");

    if (!mainTabRoute || !mainTabRoute.state) return "Landing";

    const tabIndex = mainTabRoute.state.index;
    return mainTabRoute.state.routeNames[tabIndex];
  });

  // Titles for each tab
  const screenTitles: Record<string, string> = {
    Landing: "AI Assistant",
    NutritionPlan: "Nutrition Plan",
    HealthTrack: "Health Tracking",
    FoodAnalysis: "Food Analysis",
    GoalCustomizationMain: "Goals",
  };

  const title = screenTitles[activeTab] || "Menu";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity
        onPress={() => navigation.navigate("AllScreensMenu" as never)}
        style={styles.iconButton}
      >
        <MaterialIcons name="menu" size={26} color={Colors.textPrimary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    backgroundColor: Colors.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  iconButton: {
    padding: 5,
  },
});

export default TopMenuBar;
