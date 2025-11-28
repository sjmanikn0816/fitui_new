// FoodAnalysisStackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Colors } from "@/constants/Colors";
import HeaderWithSubtitle from "@/components/ui/HeaderWithSubtitle";
import AllScreensMenu from "@/screens/main/AllScreensMenu";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import HealthTrackMonitorScreen from "@/screens/main/HealthTrackMonitorScreen";
import GoalAssessmentScreen from "@/screens/main/GoalAssesment";
import GoalCustomizationStackNavigator from "./GoalCustomizationStackNavigator";
import LandingScreen from "@/screens/main/LandinScreen";
import DashboardScreen from "@/screens/main/DashboardScreen";
import RestaurantDetailScreen from "@/screens/main/Dashboardtabs/RestaurantDetailScreen";
import MealPlanEmailScreen from "@/components/mealPlanEmail/MealPlanEmailScreen";

const HealthTrackStack = createStackNavigator();

const defaultHeaderOptions = (title: string, subtitle?: string) => ({
  headerShown: true,
  headerTitle: () => <HeaderWithSubtitle subtitle={subtitle} title={title} />,
  headerStyle: { backgroundColor: Colors.bgPrimary },
  headerTintColor: Colors.textPrimary,
  headerBackTitle: "",
});

export const HealthStackNavigator = () => {
  return (
    <HealthTrackStack.Navigator screenOptions={{ headerShown: false }}>
      <HealthTrackStack.Screen
        name="HealthTrack"
        component={HealthTrackMonitorScreen}
      />



      {/* Profile Stack */}
      {/* Profile Stack */}

    </HealthTrackStack.Navigator>
  );
};
