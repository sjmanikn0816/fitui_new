import React from "react";
import { Image, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { Colors } from "@/constants/Colors";
import { FoodAnalysisIcon, KcalIcon } from "@/components/icons/Icons";
import HealthTrackMonitorScreen from "@/screens/main/HealthTrackMonitorScreen";
import NutritionStackNavigator from "./NutritionStackNavigator";
import FoodAnalysisScreen from "@/screens/main/FoodAnalysisScreen";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import { LandingStackNavigator } from "./LandingStackNavigator";
import { FoodAnalysisStackNavigator } from "./FoodAnalysisStackNavigator";
import FitnessGoalAssessment from "@/screens/main/RecipesScreen";
import MinimalFitnessApp from "@/screens/main/GoalAssesment";

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
  const user = useSelector((state: RootState) => state.auth.user);
  const avatarUri = user?.avatar || "https://via.placeholder.com/150";

  return (
    <Tab.Navigator
      initialRouteName="Landing"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case "Landing":
              return (
                <Image
                  source={
                    focused
                      ? require("assets/primaryAi.png")
                      : require("assets/Ai.png")
                  }
                  style={{ width: size, height: size }}
                />
              );
            case "Dashboard":
              return <MaterialIcons name="house" size={size} color={color} />;
            case "FoodAnalysis":
              return (
                <FoodAnalysisIcon size={size} color={color} focused={focused} />
              );
            case "HealthTrack":
              return <MaterialCommunityIcons name="walk" size={size} color={color} />;
            case "Favorites":
              return <MaterialCommunityIcons name="moped" size={size} color={color} />;
            case "NutritionPlan":
              return <KcalIcon size={25} color={color} focused={focused} />;
            default:
              return <MaterialIcons name="help" size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.black,
        tabBarItemStyle: { paddingVertical: 0 },
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.gray100,
          paddingBottom: Platform.OS === "ios" ? 6 : 0,
          paddingTop: 0,
          height: Platform.OS === "ios" ? 60 : 54,
        },
      })}
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
