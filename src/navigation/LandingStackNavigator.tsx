import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import LandingScreen from "@/screens/main/LandinScreen";
import GoalAssessmentScreen from "@/screens/main/GoalAssesment";
import { TimelineDetailsScreen } from "@/screens/TimelineDetailsScreen";
import { Colors } from "@/constants/Colors";
import HeaderWithSubtitle from "@/components/ui/HeaderWithSubtitle";
import GoalCustomizationStackNavigator from "./GoalCustomizationStackNavigator";
import DashboardScreen from "@/screens/main/DashboardScreen";
import RestaurantDetailScreen from "@/screens/main/Dashboardtabs/RestaurantDetailScreen";
import MealPlanEmailScreen from "@/components/mealPlanEmail/MealPlanEmailScreen";
import AllScreensMenu from "@/screens/main/AllScreensMenu";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import { SecureStorage } from "@/services/secureStorage";

const LandingStack = createStackNavigator();

const defaultHeaderOptions = (title, subtitle) => ({
  headerShown: true,
  headerTitle: () => <HeaderWithSubtitle subtitle={subtitle} title={title} />,
  headerStyle: { backgroundColor: Colors.white },
  headerTintColor: Colors.black,
  headerBackTitle: "",
});

export const LandingStackNavigator = () => {
  const [initialRoute, setInitialRoute] = useState<"GoalAssessment" | "LandingMain">("GoalAssessment");
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const checkGoalStatus = async () => {
    try {
      const assessmentDone = await SecureStorage.getItem("goalAssessmentComplete");

      const userJson = await SecureStorage.getItem("user");
      const userObj = userJson ? JSON.parse(userJson) : null;

      const journeyStarted = userObj?.journeyStarted === true;

      console.log("Assessment Done:", assessmentDone);
      console.log("Journey Started:", journeyStarted);

      // Only go to LandingMain **if BOTH are true**
      if (assessmentDone === "true" && journeyStarted) {
        setInitialRoute("LandingMain");
      } else {
        setInitialRoute("GoalAssessment");
      }

    } catch (error) {
      console.log("Error reading storage:", error);
      setInitialRoute("GoalAssessment"); // fallback
    }

    setLoading(false);
  };

  checkGoalStatus();
}, []);

  if (loading) return null; // or a splash/loading screen

  return (
    <LandingStack.Navigator
      initialRouteName={initialRoute}
      screenOptions={{ headerShown: false }}
    >
      <LandingStack.Screen name="GoalAssessment" component={GoalAssessmentScreen} />
      <LandingStack.Screen name="LandingMain" component={LandingScreen} />
      <LandingStack.Screen name="GoalCustomization" component={GoalCustomizationStackNavigator} />
    
      <LandingStack.Screen name="Dashboard" component={DashboardScreen} />
      
      <LandingStack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={defaultHeaderOptions("Restaurant Details", "Back")}
      />

      <LandingStack.Screen
        name="MealPlanEmail"
        component={MealPlanEmailScreen}
        options={defaultHeaderOptions("Share Meal Plan", "Back")}
      />
      <LandingStack.Screen
        name="TimelineDetails"
        component={TimelineDetailsScreen}
        options={{ headerShown: false }}
      />
    </LandingStack.Navigator>
  );
};
