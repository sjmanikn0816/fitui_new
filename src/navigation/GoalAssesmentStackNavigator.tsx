// FoodAnalysisStackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Colors } from "@/constants/Colors";
import HeaderWithSubtitle from "@/components/ui/HeaderWithSubtitle";
import AllScreensMenu from "@/screens/main/AllScreensMenu";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import GoalAssessmentScreen from "@/screens/main/GoalAssesment";
import GoalCustomizationScreen from "@/screens/main/Dashboardtabs/GoalCustomizationTab";
import LandingScreen from "@/screens/main/LandinScreen";
import DashboardScreen from "@/screens/main/DashboardScreen";
import RestaurantDetailScreen from "@/screens/main/Dashboardtabs/RestaurantDetailScreen";
import MealPlanEmailScreen from "@/components/mealPlanEmail/MealPlanEmailScreen";

const GoalAssesmentStack = createStackNavigator();

const defaultHeaderOptions = (title: string, subtitle?: string) => ({
  headerShown: true,
  headerTitle: () => <HeaderWithSubtitle subtitle={subtitle} title={title} />,
  headerStyle: { backgroundColor: Colors.white },
  headerTintColor: Colors.black,
  headerBackTitle: "",
});

export const GoalAssesmentStackNavigator = () => {
  return (
    <GoalAssesmentStack.Navigator screenOptions={{ headerShown: false }}>
      <GoalAssesmentStack.Screen
        name="GoalAssesmnet"
        component={GoalAssessmentScreen}
      />


 

      {/* Profile Stack */}
 
    </GoalAssesmentStack.Navigator>
  );
};
