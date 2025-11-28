import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  StatusBar,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import { screensList } from "@/navigation/Screen";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { showConfirmation } from "@/redux/slice/conformationSlice";
import { logout, logoutUser } from "@/redux/slice/auth/authSlice";
import { deleteAccount } from "@/services/UserService";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const { width } = Dimensions.get("window");

const AllScreensMenu: React.FC = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const [signingOut, setSigningOut] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const user = useAppSelector((state) => state.auth.user);

  const handleSelect = (id: string) => {
    switch (id) {
      case "Profile":
        navigation.navigate("Profile" as never);
        break;
      case "GoalCustomizationMain":
        navigation.navigate("GoalCustomizationMain" as never);
        break;
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
            navigation.navigate("AuthNavigator" as never);
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
      <StatusBar barStyle="light-content" backgroundColor="#0D0D0D" />

      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.header}>All Features</Text>
        <View style={styles.placeholder} />
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      >
        {allScreens.map((screen, index) => {
          return (
            <TouchableOpacity
              key={screen.id}
              style={styles.card}
              onPress={() => handleSelect(screen.id)}
              activeOpacity={0.7}
            >
              <View style={styles.cardContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: screen.color ? `${screen.color}20` : "#2DD4BF20" },
                  ]}
                >
                  <Icon
                    name={screen.icon}
                    size={24}
                    color={screen.color || "#2DD4BF"}
                  />
                </View>

                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>{screen.label}</Text>
                  <Text style={styles.cardDescription}>
                    {screen.description}
                  </Text>
                </View>

                <View style={styles.arrowContainer}>
                  <Icon name="chevron-forward" size={20} color="#6B7280" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          disabled={signingOut}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <View style={styles.signOutIconContainer}>
              <Icon name="log-out-outline" size={24} color="#F97316" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.signOutText}>Sign Out</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Icon name="chevron-forward" size={20} color="#6B7280" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeleteAccount}
          disabled={deleting}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <View style={styles.deleteIconContainer}>
              <Icon name="trash-outline" size={24} color="#EF4444" />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.deleteButtonText}>Delete Account</Text>
            </View>
            <View style={styles.arrowContainer}>
              <Icon name="chevron-forward" size={20} color="#6B7280" />
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <LoadingSpinner
        visible={signingOut || deleting}
        message={signingOut ? "Signing out..." : "Deleting account..."}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D0D",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 56,
    paddingBottom: 20,
    backgroundColor: "#0D0D0D",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#1F1F1F",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  placeholder: {
    width: 40,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#262626",
    overflow: "hidden",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
    marginLeft: 14,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 18,
  },
  arrowContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: "#262626",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    marginBottom: 12,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#262626",
    overflow: "hidden",
  },
  signOutIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F9731620",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#F97316",
  },
  deleteButton: {
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#262626",
    overflow: "hidden",
  },
  deleteIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EF444420",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },
  bottomSpacer: {
    height: 80,
  },
});

export default AllScreensMenu;
