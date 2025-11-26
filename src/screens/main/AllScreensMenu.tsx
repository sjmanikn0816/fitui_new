import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { styles } from "../styles/AllScreenStyles";
import { screensList } from "@/navigation/Screen";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { showConfirmation } from "@/redux/slice/conformationSlice";
import { logout, logoutUser } from "@/redux/slice/auth/authSlice";
import { deleteAccount } from "@/services/UserService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import SignOutButton from "@/components/ui/SignOutButton";

const AllScreensMenu: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const  user  = useAppSelector((state) => state.auth.user);

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleSelect = (id: string) => {
    switch (id) {
      case "Profile":
        navigation.navigate("Profile" as never);
        break;
      case "GoalCustomizationMain":
        navigation.navigate("GoalCustomizationMain" as never);
        break;
      case "goal-customization":
      // case "GoalCustomization":
      //   navigation.navigate("GoalCustomization" as never);
      //   break;
      case "WeeklyMeal":
        navigation.navigate("WeeklyMeal" as never);
        break;
      default:
        console.log("Navigate to:", id);
        break;
    }
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
            console.log("User signed out from AllScreensMenu");
            navigation.navigate("AuthNavigator" as never); // optional: redirect to login
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

  const handleDeleteAccount = () => {
    dispatch(
      showConfirmation({
        title: "Delete Account",
        message:
          "This will permanently delete your account and data. This action cannot be undone. Continue?",
        onConfirm: async () => {
          try {
            setDeleting(true);
            await deleteAccount(Number(user?.userId));
            await dispatch(logoutUser());
            dispatch(logout());
            navigation.navigate("AuthNavigator" as never);
          } catch (e) {
            console.log("Delete account failed", e);
            Alert.alert("Error", "Failed to delete account. Please try again.");
          } finally {
            setDeleting(false);
          }
        },
      })
    );
  };

  const allScreens = screensList;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="arrow-back" size={24} color="#111827" />
        </TouchableOpacity>
        <Text style={styles.header}>All Features</Text>
        <View style={styles.placeholder} />
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={[styles.listContainer, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {allScreens.map((screen) => {
          return (
            <TouchableOpacity
              key={screen.id}
              style={[styles.card, { opacity: 0.95 }]}
              onPress={() => handleSelect(screen.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "#F9FAFB" },
                  ]}
                >
                  <Icon
                    name={screen.icon}
                    size={26}
                    color={screen.color || "#6B7280"}
                  />
                </View>

                <View style={styles.textContainer}>
                  <Text style={[styles.cardTitle, { color: "#111827" }]}>
                    {screen.label}
                  </Text>
                  <Text style={styles.cardDescription}>
                    {screen.description}
                  </Text>
                </View>

                <View style={styles.arrowContainer}>
                  <View
                    style={[styles.modernArrow, { borderColor: "#D1D5DB" }]}
                  >
                    <Icon
                      name="chevron-forward"
                      size={22}
                      color="#9CA3AF"
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
        <SignOutButton onPress={handleSignOut} />

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          disabled={deleting}
        >
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        </TouchableOpacity>
      </ScrollView>

      <LoadingSpinner
        visible={signingOut || deleting}
        message={signingOut ? "Signing out..." : "Deleting account..."}
      />
    </View>
  );
};

export default AllScreensMenu;
