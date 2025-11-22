import React, { FC, useState } from "react";
import { ScrollView, Alert, View } from "react-native";
import DashboardHeader from "@/components/DashboardHeader";
import UserProfileCard from "@/components/profile/UserProfileCard";
import HealthSummaryCard from "@/components/profile/HealthSummaryCard";
import MenuSection from "@/components/profile/MenuSection";
import SignOutButton from "@/components/ui/SignOutButton";
import { Colors } from "@/constants/Colors";
import { getAccountOptions, getSupportOptions } from "@/data/profileMenu";
import { styles } from "./Dashboardtabs/styles/ProfileScreenStyles";
import { useHealthPermission } from "@/context/HealthPermissionProvider";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { logout, logoutUser } from "@/redux/slice/auth/authSlice";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { showConfirmation } from "@/redux/slice/conformationSlice";
// import Button from "@/components/ui/Button"; // Uncomment if you want health permission button

interface ProfileScreenProps {
  navigation?: any;
}

const ProfileScreen: FC<ProfileScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { healthPermissionGranted, requestHealthPermission } =
    useHealthPermission();

  const { user, healthCondition, immuneDisorder, neurologicalHealth, cancer } =
    useAppSelector((state) => state.auth);

  const [signingOut, setSigningOut] = useState(false);
  console.log(healthCondition);
  const handleNavigate = (screen: string, fallbackMsg: string) => {
    if (navigation) navigation.navigate(screen);
    else Alert.alert("Navigate", fallbackMsg);
  };

  const handleSignOut = () => {
    dispatch(
      showConfirmation({
        title: "Sign Out",
        message: "Are you sure you want to sign out?",
        onConfirm: async () => {
          try {
            setSigningOut(true);
            await new Promise((resolve) => setTimeout(resolve, 1000));
            await dispatch(logoutUser());
            dispatch(logout());
            console.log("User signed out");
          } catch (error) {
            console.error("Sign out error:", error);
            Alert.alert("Error", "Failed to sign out. Please try again.");
          } finally {
            setSigningOut(false);
          }
        },
        onCancel: () => console.log("Sign out canceled"),
      })
    );
  };
  const mockHealthData = {
    healthCondition: {
      diabetes: false,
      hypertension: true,
      allergies: ["Peanuts", "Dust"],
    },
    immuneDisorder: {
      hasDisorder: true,
      description: "Mild autoimmune response",
    },
    neurologicalHealth: {
      hasCondition: false,
      notes: "No neurological concerns reported.",
    },
    cancer: {
      hasCancer: false,
      familyHistory: true,
    },
  };
  return (
    <>
      <View style={styles.container}>
        <DashboardHeader
          onBackPress={() => navigation.goBack()}
          compact={true}
          showTabs={false}
          customHeaderConfig={{
            backgroundColor: Colors.white,
            title: "Profile",
            subtitle: "Manage your account",
            description: "Update info, settings & preferences",
            titleColor: Colors.text,
            subtitleColor: Colors.textSecondary,
            descriptionColor: Colors.textSecondary,
            backIconColor: Colors.text,
          }}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          scrollEnabled={!signingOut}
        >
         
          <UserProfileCard
            name={`${user.firstName || ""} ${user.lastName || ""}`}
            email={user.email}
            isVerified={user.isVerified}
          />

          {/* <HealthSummaryCard
            healthCondition={healthCondition || mockHealthData.healthCondition}
            immuneDisorder={immuneDisorder || mockHealthData.immuneDisorder}
            neurologicalHealth={
              neurologicalHealth || mockHealthData.neurologicalHealth
            }
            cancer={cancer || mockHealthData.cancer}
          /> */}

          <MenuSection
            title="Account"
            items={getAccountOptions(handleNavigate)}
          />
          <MenuSection
            title="Support"
            items={getSupportOptions(handleNavigate)}
          />

          {/* 🚪 Sign Out */}
          {/* <SignOutButton onPress={handleSignOut} disabled={signingOut} /> */}

          {/* 🔒 Health Permission Button (optional) */}
          {/* {!healthPermissionGranted && (
            <Button
              title="Enable Health Tracking"
              onPress={requestHealthPermission}
              variant="primary"
              disabled={signingOut}
            />
          )} */}
        </ScrollView>
      </View>

      <LoadingSpinner visible={signingOut} message="Signing out..." />
    </>
  );
};

export default ProfileScreen;
