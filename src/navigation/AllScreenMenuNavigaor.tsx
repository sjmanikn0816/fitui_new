// FoodAnalysisStackNavigator.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import FoodAnalysisScreen from "@/screens/main/FoodAnalysisScreen";
import FoodAnalysisResultsScreen from "@/screens/main/FoodAnalysisResultsScreen";
import { Colors } from "@/constants/Colors";
import HeaderWithSubtitle from "@/components/ui/HeaderWithSubtitle";
import AllScreensMenu from "@/screens/main/AllScreensMenu";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import GoalCustomizationStackNavigator from "./GoalCustomizationStackNavigator";
import GoalAssessmentScreen from "@/screens/main/GoalAssesment";
import LandingScreen from "@/screens/main/LandinScreen";
import DashboardScreen from "@/screens/main/DashboardScreen";
import RestaurantDetailScreen from "@/screens/main/Dashboardtabs/RestaurantDetailScreen";
import MealPlanEmailScreen from "@/components/mealPlanEmail/MealPlanEmailScreen";
import { LandingStackNavigator } from "./LandingStackNavigator";
import WellnessScreen from "@/screens/main/assesment/WellnessScreen";
import WeeklyMealPlanner from "@/screens/main/profile/WeeklyPlanScreen";

const Stack = createStackNavigator();

const defaultHeaderOptions = (title: string, subtitle?: string) => ({
  headerShown: true,
  headerTitle: () => <HeaderWithSubtitle subtitle={subtitle} title={title} />,
  headerStyle: { backgroundColor: Colors.bgPrimary },
  headerTintColor: Colors.textPrimary,
  headerBackTitle: "",
});

export const AllScreenStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AllScreensMenu" component={AllScreensMenu} />
      <Stack.Screen
        name="GoalCustomizationMain"
        component={GoalCustomizationStackNavigator}
      />
      <Stack.Screen name="LandingMain" component={LandingStackNavigator} />

      <Stack.Screen name="Profile" component={ProfileStackNavigator} />

      {/* <Stack.Screen name="GoalCustomizationMain" component={WellnessScreen} /> */}
        <Stack.Screen name="WeeklyMeal" component={WeeklyMealPlanner} />

      {/* Profile Stack */}
    </Stack.Navigator>
  );
};
