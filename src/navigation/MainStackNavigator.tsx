import React, { useEffect, useState } from "react";
import { Image, Platform, View, StatusBar, Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useSelector } from "react-redux";
import { Colors } from "@/constants/Colors";
import { RootState } from "@/redux/store";

import { LandingStackNavigator } from "./LandingStackNavigator";
import { FoodAnalysisStackNavigator } from "./FoodAnalysisStackNavigator";
import { HealthStackNavigator } from "./HealthTrackNavigotor";
import NutritionStackNavigator from "./NutritionStackNavigator";
import GoalCustomizationStackNavigator from "./GoalCustomizationStackNavigator";
import { AllScreenStackNavigator } from "./AllScreenMenuNavigaor";

import { SecureStorage } from "@/services/secureStorage";

export type MainTabParamList = {
  FoodAnalysis: undefined;
  Landing: undefined;
  HealthTrack: undefined;
  NutritionPlan: undefined;
  GoalCustomizationMain: undefined;
  AllScreensMenu: undefined;
};

const Tab = createBottomTabNavigator<MainTabParamList>();

const MainNavigator: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);

  // ⭐ Initial tab based on journeyStarted
  const [initialTab, setInitialTab] = useState<
    "Landing" | "GoalCustomizationMain" | null
  >(null);

  // Load journey state from SecureStorage
  useEffect(() => {
    const loadJourneyState = async () => {
      try {
        const userJson = await SecureStorage.getItem("user");
        const userObj = userJson ? JSON.parse(userJson) : null;

        const journeyStarted = userObj?.journeyStarted === true;

        if (journeyStarted) {
          setInitialTab("Landing"); // AI tab initial
        } else {
          setInitialTab("GoalCustomizationMain"); // Customization tab initial
        }
      } catch (error) {
        console.log("Journey state error:", error);
        setInitialTab("Landing"); // fallback
      }
    };

    loadJourneyState();
  }, []);

  // ⛔ Avoid rendering until we know initialTab
  if (!initialTab) return null;

  // Helper: Icon renderer
  const renderTabIcon = (
    focused: boolean,
    active: any,
    inactive: any,
    size: number
  ) => (
    <Image
      source={focused ? active : inactive}
      style={{
        width: size + 6,
        height: size + 6,
        resizeMode: "contain",
        marginTop: 20,
        transform: [{ scale: focused ? 1.1 : 1 }],
      }}
    />
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "transparent" }}
      edges={["top", "bottom"]}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={{ flex: 1 }}>
        <Tab.Navigator
          initialRouteName={initialTab} // ⭐ Dynamic initial route
          screenOptions={{
            headerShown: false,
            tabBarShowLabel: false,
            tabBarHideOnKeyboard: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.black,

            tabBarStyle: {
              position: "absolute",
              backgroundColor: Colors.white,
              borderTopWidth: 0,
              height: Platform.OS === "ios" ? 80 : 70,
              paddingBottom: Platform.OS === "ios" ? 20 : 10,
              paddingTop: 5,
              elevation: 10,
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowOffset: { width: 0, height: 1 },
              shadowRadius: 3,
              marginTop: 10,
            },
          }}
        >

          {/* NUTRITION */}
          <Tab.Screen
            name="NutritionPlan"
            component={NutritionStackNavigator}
            options={{
              tabBarIcon: ({ focused, size }) =>
                renderTabIcon(
                  focused,
                  require("assets/nutrition_inactive.png"),
                  require("assets/nutrition_active.png"),
                  size
                ),
            }}
          />

          {/* HEALTH TRACK */}
          <Tab.Screen
            name="HealthTrack"
            component={HealthStackNavigator}
            options={{
              tabBarIcon: ({ focused, size }) =>
                renderTabIcon(
                  focused,
                  require("assets/health_inactive.png"),
                  require("assets/health_active.png"),
                  size
                ),
            }}
          />

          {/* AI LANDING TAB */}
          <Tab.Screen
            name="Landing"
            component={LandingStackNavigator}
            options={{
              tabBarIcon: ({ focused, size }) => {
                const scaleAnim = new Animated.Value(focused ? 1.1 : 1);

                Animated.spring(scaleAnim, {
                  toValue: focused ? 1.1 : 1,
                  useNativeDriver: true,
                  speed: 12,
                  bounciness: 8,
                }).start();

                return (
                  <Animated.View
                    style={{
                      transform: [{ scale: scaleAnim }],
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 20,
                    }}
                  >
                    <Image
                      source={
                        focused
                          ? require("assets/Ai_inactive.png")
                          : require("assets/Ai_active.png")
                      }
                      style={{
                        width: size * 1.2,
                        height: size * 1.2,
                        resizeMode: "contain",
                      }}
                    />
                  </Animated.View>
                );
              },

              tabBarStyle: {
                position: "absolute",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderTopWidth: 0,
                elevation: 0,
                height: Platform.OS === "ios" ? 80 : 70,
                paddingBottom: Platform.OS === "ios" ? 20 : 10,
                paddingTop: 5,
              },
            }}
          />

          {/* GOAL CUSTOMIZATION */}
          <Tab.Screen
            name="GoalCustomizationMain"
            component={GoalCustomizationStackNavigator}
            options={{
              tabBarIcon: ({ focused, size }) =>
                renderTabIcon(
                  focused,
                  require("assets/goal_inactive.png"),
                  require("assets/goal_active.png"),
                  size
                ),
            }}
          />

          {/* FOOD ANALYSIS */}
          <Tab.Screen
            name="FoodAnalysis"
            component={FoodAnalysisStackNavigator}
            options={{
              tabBarIcon: ({ focused, size }) =>
                renderTabIcon(
                  focused,
                  require("assets/food_inactive.png"),
                  require("assets/food_active.png"),
                  size
                ),
            }}
          />

          {/* HIDDEN MENU (NO TAB) */}
          <Tab.Screen
            name="AllScreensMenu"
            component={AllScreenStackNavigator}
            options={{
              tabBarButton: () => null,
              tabBarItemStyle: { display: "none" },
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </View>
    </SafeAreaView>
  );
};

export default MainNavigator;
