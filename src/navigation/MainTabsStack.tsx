// navigation/MainTabsStack.tsx
import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MainNavigator from "./MainNavigator";

const Stack = createStackNavigator();

const MainTabsStack: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={MainNavigator} />
    </Stack.Navigator>
  );
};

export default MainTabsStack;
