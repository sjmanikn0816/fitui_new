import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Colors } from "@/constants/Colors";
import HealthTrackMonitorScreen from "@/screens/main/HealthTrackMonitorScreen";
import NutritionStackNavigator from "./NutritionStackNavigator";
import { LandingStackNavigator } from "./LandingStackNavigator";
import { FoodAnalysisStackNavigator } from "./FoodAnalysisStackNavigator";
import MinimalFitnessApp from "@/screens/main/GoalAssesment";
import CustomTabBar from "@/components/ui/CustomTabBar";

export type MainTabParamList = {
  Landing: undefined;
  FoodAnalysis: undefined;
  Dashboard: undefined;
  Favorites: undefined;
  HealthTrack: undefined;
  Profile: undefined;
  NutritionPlan: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Landing"
      tabBar={(props) => <CustomTabBar {...props} />}
      sceneContainerStyle={{ backgroundColor: Colors.bgPrimary }}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
      }}
    >

  <Tab.Screen name="FoodAnalysis" component={FoodAnalysisStackNavigator} />
      <Tab.Screen name="HealthTrack" component={HealthTrackMonitorScreen} />
     <Tab.Screen name="Landing" component={LandingStackNavigator} />
      <Tab.Screen name="Favorites" component={MinimalFitnessApp} />
      <Tab.Screen name="NutritionPlan" component={NutritionStackNavigator} />
    </Tab.Navigator>
  );
};

export default MainNavigator;
