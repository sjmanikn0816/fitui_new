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

const FoodAnalysisStack = createStackNavigator();

const defaultHeaderOptions = (title: string, subtitle?: string) => ({
  headerShown: true,
  headerTitle: () => <HeaderWithSubtitle subtitle={subtitle} title={title} />,
  headerStyle: { backgroundColor: Colors.white },
  headerTintColor: Colors.black,
  headerBackTitle: "",
});

export const FoodAnalysisStackNavigator = () => {
  return (
    <FoodAnalysisStack.Navigator screenOptions={{ headerShown: false }}>
      <FoodAnalysisStack.Screen
        name="FoodAnalysisMain"
        component={FoodAnalysisScreen}
      />

      {/* Nested screens under FoodAnalysis */}
      <FoodAnalysisStack.Screen
        name="AnalysisResults"
        component={FoodAnalysisResultsScreen}
        // options={defaultHeaderOptions("Analysis Results", "Back")}
      />

      {/* Dashboard screen for navigation from FoodAnalysis */}
      <FoodAnalysisStack.Screen
        name="Dashboard"
        component={DashboardScreen}
      />

      {/* Restaurant Detail screen */}
      <FoodAnalysisStack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={defaultHeaderOptions("Restaurant Details", "Back")}
      />

      {/* Meal Plan Email screen */}
      <FoodAnalysisStack.Screen
        name="MealPlanEmail"
        component={MealPlanEmailScreen}
        options={defaultHeaderOptions("Share Meal Plan", "Back")}
      />

      {/* All Screens Menu */}
      <FoodAnalysisStack.Screen
        name="AllScreensMenu"
        component={AllScreensMenu}
      />

      {/* Profile Stack */}
      <FoodAnalysisStack.Screen
        name="Profile"
        component={ProfileStackNavigator}
      />

      {/* Goal Customization */}
      <FoodAnalysisStack.Screen
        name="GoalCustomization"
        component={GoalCustomizationStackNavigator}
      />

      {/* Goal Assessment */}
      <FoodAnalysisStack.Screen
        name="GoalAssessment"
        component={GoalAssessmentScreen}
      />

      {/* Landing */}
      <FoodAnalysisStack.Screen
        name="LandingMain"
        component={LandingScreen}
      />
    </FoodAnalysisStack.Navigator>
  );
};
