// ProfileStackNavigator.tsx
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import ProfileScreen from "@/screens/main/ProfileScreen";
import EditProfileScreen from "@/screens/main/profile/ProfileEditScreen";
import NotificationsScreen from "@/screens/main/profile/NotificationScreen";
import HelpCenterScreen from "@/screens/main/profile/HelpCenterScreen";
import PrivacySecurityScreen from "@/screens/main/profile/PrivacySecurityScreen";
import SettingsScreen from "@/screens/main/profile/AppSetting";
import { Colors } from "@/constants/Colors";
import HeaderWithSubtitle from "@/components/ui/HeaderWithSubtitle";
import ChangePasswordScreen from "@/screens/main/profile/ChangePasswordScreen";
import PrivacyPolicyScreen from "@/screens/main/profile/PrivacyPolicyScreen";
import TermsConditionsScreen from "@/screens/main/profile/TermsConditionsScreen";

const ProfileStack = createStackNavigator();

const defaultHeaderOptions = (title: string, subtitle?: string) => ({
  headerShown: true,
  headerTitle: () => <HeaderWithSubtitle subtitle={subtitle} title={title} />,
  headerStyle: {
    backgroundColor: Colors.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.navBorder,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTintColor: Colors.textPrimary,
  headerBackTitle: "",
});

export const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen}  />

      {/* Profile inner screens (with visible bottom tabs) */}
      <ProfileStack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={defaultHeaderOptions("Edit Profile", "Back")}
      />
      <ProfileStack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={defaultHeaderOptions("Notifications", "Back")}
      />
      <ProfileStack.Screen
        name="HelpCenter"
        component={HelpCenterScreen}
        options={defaultHeaderOptions("Help & Support", "Back")}
      />
      <ProfileStack.Screen
        name="PrivacySecurity"
        component={PrivacySecurityScreen}
        options={defaultHeaderOptions("Privacy & Security", "Back")}
      />
      <ProfileStack.Screen
        name="AppSettings"
        component={SettingsScreen}
        options={defaultHeaderOptions("App Settings", "Back")}
      />
<ProfileStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen}  options={defaultHeaderOptions("Privacy & Security", "Back")}/>
<ProfileStack.Screen name="TermsConditions" component={TermsConditionsScreen}  options={defaultHeaderOptions("Terms & Condtions", "Back")} />
             <ProfileStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
        options={defaultHeaderOptions("Change Password", "Back")}
      />
      </ProfileStack.Navigator>
  );};
      
      
