import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import NutritionPlanScreen from "@/screens/main/NutritionPlanScreen";
import PatientNutritionOverviewScreen from "@/screens/main/PatientNutritionOverviewScreen";
import WeightJourneyRegistrationScreen from "@/screens/main/WeightJourneyRegistrationScreen";
import AllScreensMenu from "@/screens/main/AllScreensMenu";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import GoalCustomizationStackNavigator from "./GoalCustomizationStackNavigator";
import LandingScreen from "@/screens/main/LandinScreen";
import DashboardScreen from "@/screens/main/DashboardScreen";
import GoalAssessmentScreen from "@/screens/main/GoalAssesment";
import MealPlanEmailScreen from "@/components/mealPlanEmail/MealPlanEmailScreen";
import RestaurantDetailScreen from "@/screens/main/Dashboardtabs/RestaurantDetailScreen";
import HeaderWithSubtitle from "@/components/ui/HeaderWithSubtitle";
import { Colors } from "@/constants/Colors";
import { AllScreenStackNavigator } from "./AllScreenMenuNavigaor";

const Stack = createStackNavigator();
const defaultHeaderOptions = (title: string, subtitle?: string) => ({
  headerShown: true,
  headerTitle: () => <HeaderWithSubtitle subtitle={subtitle} title={title} />,
  headerStyle: { backgroundColor: Colors.white },
  headerTintColor: Colors.black,
  headerBackTitle: "",
});
const NutritionStackNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Summary screen opened from the kcal tab */}
      <Stack.Screen
        name="PatientNutritionOverview"
        component={PatientNutritionOverviewScreen}
      />

      {/* <Stack.Screen name="NutritionPlan" component={NutritionPlanScreen} /> */}
      <Stack.Screen
        name="WeightJourneyRegistration"
        component={WeightJourneyRegistrationScreen}
      />

      <Stack.Screen
        name="AllScreensMenu"
        component={AllScreenStackNavigator}
        options={{
          presentation: "modal",
          cardStyle: { backgroundColor: "transparent" },
        }}
      />
      {/* <Stack.Screen
        name="GoalCustomization"
        component={GoalCustomizationStackNavigator}
      /> */}
        <Stack.Screen name="LandingMain" component={LandingScreen} />
           <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={defaultHeaderOptions("Restaurant Details", "Back")}
      />

      <Stack.Screen
        name="MealPlanEmail"
        component={MealPlanEmailScreen}
        options={defaultHeaderOptions("Share Meal Plan", "Back")}
      />
 
      {/* Profile Stack */}
      <Stack.Screen name="Profile" component={ProfileStackNavigator} />
    </Stack.Navigator>
  );
};

export default NutritionStackNavigator;
