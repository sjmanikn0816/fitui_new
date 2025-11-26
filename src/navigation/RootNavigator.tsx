import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainStackNavigator from "@/navigation/MainStackNavigator"; // your tabs
import AllScreensMenu from "@/screens/main/AllScreensMenu";
import { ProfileStackNavigator } from "./ProfileStackNavigator";
import GoalCustomizationStackNavigator from "./GoalCustomizationStackNavigator";
import GoalAssessmentScreen from "@/screens/main/GoalAssesment";
import { AllScreenStackNavigator } from "./AllScreenMenuNavigaor";

export type RootStackParamList = {
  MainTabs: undefined;
  AllScreensMenu: undefined;
  Profile: undefined;
  GoalCustomizationMain: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

const RootNavigator: React.FC = () => {
  return (
    <RootStack.Navigator
      initialRouteName="MainTabs" 
      screenOptions={{ headerShown: false }}
      
    >
      {/* Main Bottom Tabs */}
      <RootStack.Screen name="MainTabs" component={MainStackNavigator}  options={{
        
      }}/>
       <RootStack.Screen name="AllScreensMenu" component={AllScreenStackNavigator}  options={{
        
      }}/>
  
      {/* All Screens Menu Modal */}

    </RootStack.Navigator>
  );
};

export default RootNavigator;
