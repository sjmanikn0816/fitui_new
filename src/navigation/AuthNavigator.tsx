import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import PersonalDetailsScreen from "../screens/auth/PersonalDetailsScreen";
import HealthProfileScreen from "../screens/auth/HealthProfileScreen";
import SignUpScreen from "@/screens/auth/SignUpScreen";
import SignInScreen from "@/screens/auth/SignInScreen";
import GoogleLoginWebView from "@/screens/auth/GoogleLoginWebView";
import TermsScreen from "@/screens/TermsScreen";

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  PersonalDetails: undefined;
  HealthProfile: undefined;
  GoogleLoginScreen: undefined;
  Terms: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="GoogleLoginScreen" component={GoogleLoginWebView} />
      <Stack.Screen name="Terms" component={TermsScreen} />
      <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
      <Stack.Screen name="HealthProfile" component={HealthProfileScreen} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
