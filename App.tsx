import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import * as LocalAuthentication from "expo-local-authentication";

import AuthNavigator from "@/navigation/AuthNavigator";
import RootNavigator from "@/navigation/RootNavigator";
import SplashScreen from "@/screens/SplashScreen";
import GlobalModal from "@/components/ui/GlobalModal";
import ConfirmationModal from "@/components/ui/ConformationModal";
import { HealthPermissionProvider } from "@/context/HealthPermissionProvider";

import { store } from "@/redux/store";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";
import { setAuthToken } from "@/redux/slice/auth/authSlice";
import { fetchUserById } from "@/redux/slice/auth/authSlice";
import { startTokenRefresh, stopTokenRefresh } from "@/services/aiTokenService";
import {
  startbaseTokenRefresh,
  stopbaseTokenRefresh,
} from "@/services/baseTokenRefresh";
import { requestLocation } from "@/services/locationService";
import { SecureStorage } from "@/services/secureStorage"; 

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [biometricChecking, setBiometricChecking] = useState(false);
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => !!state.auth.token);
  const user = useAppSelector((state) => state.auth.user);

  /* ------------------ INIT APP ------------------ */
  useEffect(() => {
    const initApp = async () => {
      console.log("🔄 Starting app initialization...");

      try {
       
        const [token, user, termsAccepted, biometricEnabled] = await Promise.all([
          SecureStorage.getItem("authToken"),
          SecureStorage.getItem("user"),
          SecureStorage.getItem("termsAccepted"),
          SecureStorage.getItem("biometricEnabled"),
        ]);

        if (token && user) {
          const parsedUser = JSON.parse(user);

          if (biometricEnabled === "true") {
            setBiometricChecking(true);

            try {
              const hasHardware = await LocalAuthentication.hasHardwareAsync();
              const enrolled = await LocalAuthentication.isEnrolledAsync();

              if (hasHardware && enrolled) {
                const result = await LocalAuthentication.authenticateAsync({
                  promptMessage: "Login with Biometrics",
                  cancelLabel: "Use password",
                  disableDeviceFallback: true,
                });

                if (result.success) {
                  console.log("🎉 Biometric success!");
                  dispatch(setAuthToken({ token, user: parsedUser }));
                } else {
                  console.log("❌ Biometric failed — fallback to manual login");
                }
              } else {
                console.log("⚠️ No biometric hardware — normal login");
                dispatch(setAuthToken({ token, user: parsedUser }));
              }
            } catch (err) {
              console.error("🚨 Biometric error:", err);
              dispatch(setAuthToken({ token, user: parsedUser }));
            } finally {
              setBiometricChecking(false);
            }
          } else {
            console.log("➡️ Biometrics not enabled — using saved token");
            dispatch(setAuthToken({ token, user: parsedUser }));
          }
        } else {
          console.log("🚫 No token found — user must login");
        }
      } catch (err) {
        console.error("❌ Error initializing app:", err);
      } finally {
        setTimeout(() => setLoading(false), 1000);
      }
    };

    initApp();
  }, [dispatch]);

  /* ------------------ START TOKEN REFRESH ------------------ */
  useEffect(() => {
    startTokenRefresh();
    return () => stopTokenRefresh();
  }, []);

  /* ------------------ BASE TOKEN & LOCATION ------------------ */
  useEffect(() => {
    if (isAuthenticated) {
      startbaseTokenRefresh();
      requestLocation(dispatch);
    } else {
      stopbaseTokenRefresh();
    }
  }, [isAuthenticated]);

  /* ------------------ AUTO FETCH USER DETAILS ------------------ */
  useEffect(() => {
    if (isAuthenticated && user?.userId) {
      console.log("📥 Auto fetching user details for ID:", user.userId);
      dispatch(fetchUserById(user.userId));
    }
  }, [isAuthenticated, user?.userId, dispatch]);

  if (loading || biometricChecking) {
    return <SplashScreen />;
  }

  return (
    <HealthPermissionProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        {isAuthenticated ? <RootNavigator /> : <AuthNavigator />}
      </NavigationContainer>
    </HealthPermissionProvider>
  );
}

/* ------------------ MAIN APP WRAPPER ------------------ */
export default function App() {
  return (
    <Provider store={store}>
      <AppContent />
      <ConfirmationModal />
      <GlobalModal />
    </Provider>
  );
}