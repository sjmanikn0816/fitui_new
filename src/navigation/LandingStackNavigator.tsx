import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { fetchUserById } from "@/redux/slice/auth/authSlice";

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
import WeeklyMealPlanner from "@/screens/main/profile/WeeklyPlanScreen";
import WellnessScreen from "@/screens/main/assesment/WellnessScreen";

const LandingStack = createStackNavigator();

const defaultHeaderOptions = (title: string, subtitle: string) => ({
  headerShown: true,
  headerTitle: () => <HeaderWithSubtitle subtitle={subtitle} title={title} />,
  headerStyle: { backgroundColor: Colors.white },
  headerTintColor: Colors.black,
  headerBackTitle: "",
});

export const LandingStackNavigator = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector((state) => state.auth.user);


  return (
    <LandingStack.Navigator
      initialRouteName="LandingMain"
      screenOptions={{ headerShown: false }}
    >
      {/* FIRST TIME USER LOGIN FLOW */}
   

      {/* MAIN LANDING PAGE AFTER GOAL SETUP */}
      <LandingStack.Screen name="LandingMain" component={LandingScreen} />

      {/* GOAL CUSTOMIZATION FLOW */}
      {/* <LandingStack.Screen
        name="GoalCustomization"
        component={GoalCustomizationStackNavigator}
      /> */}

      {/* MAIN DASHBOARD */}
      <LandingStack.Screen name="Dashboard" component={DashboardScreen} />

      {/* RESTAURANT DETAILS */}
      <LandingStack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={defaultHeaderOptions("Restaurant Details", "Back")}
      />

      {/* MEAL PLAN SHARE */}
      <LandingStack.Screen
        name="MealPlanEmail"
        component={MealPlanEmailScreen}
        options={defaultHeaderOptions("Share Meal Plan", "Back")}
      />

      {/* TIMELINE DETAILS */}
      <LandingStack.Screen
        name="TimelineDetails"
        component={TimelineDetailsScreen}
        options={{ headerShown: false }}
      />

      {/* HIDDEN DEVELOPER MENU */}


      {/* PROFILE FLOW */}

    </LandingStack.Navigator>
  );
};
