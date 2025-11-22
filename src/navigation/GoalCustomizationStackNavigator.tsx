import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import GoalCustomizationScreen from "@/screens/main/Dashboardtabs/GoalCustomizationTab";
import HeaderWithSubtitle from "@/components/ui/HeaderWithSubtitle";
import { Colors } from "@/constants/Colors";
import GoalAssessmentScreen from "@/screens/main/GoalAssesment";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import AllScreensMenu from "@/screens/main/AllScreensMenu";
import LandingScreen from "@/screens/main/LandinScreen";
import DashboardScreen from "@/screens/main/DashboardScreen";
import RestaurantDetailScreen from "@/screens/main/Dashboardtabs/RestaurantDetailScreen";
import MealPlanEmailScreen from "@/components/mealPlanEmail/MealPlanEmailScreen";
const Stack = createStackNavigator();
const defaultHeaderOptions = (title: string, subtitle?: string) => ({
  headerShown: true,
  headerTitle: () => <HeaderWithSubtitle subtitle={subtitle} title={title} />,
  headerStyle: { backgroundColor: Colors.white },
  headerTintColor: Colors.black,
  headerBackTitle: "",
});
const GoalCustomizationStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="GoalCustomizationMain"
        component={GoalCustomizationScreen}
        //  options={defaultHeaderOptions("Goal customization", "Back")}
      />
      {/* <Stack.Screen name="GoalCustomization" component={GoalCustomizationStackNavigator} /> */}
      <Stack.Screen name="GoalAssessment" component={GoalAssessmentScreen} />
      <Stack.Screen name="LandingMain" component={LandingScreen} />


    </Stack.Navigator>
  );
};

export default GoalCustomizationStackNavigator;
