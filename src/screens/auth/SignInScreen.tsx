import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Platform, Linking } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import * as WebBrowser from "expo-web-browser";

import { AuthStackParamList } from "../../navigation/AuthNavigator";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import ScrollContainer from "@/components/ui/ScrollContainer";
import Logo from "@/components/ui/Logo";
import MainHeader from "@/components/ui/MainHeaderNav";

import { SignUpSchema } from "@/utils/validationSchema";
import { styles } from "../styles/SignInScreenStyles";
import { Strings } from "@/constants/String";
import { Config } from "@/constants/config";
import { BASE_URL } from "@/services/base";
import { Endpoints } from "@/constants/endpoints";

import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import {
  getGoogleAuthUrl,
  loginUser,
  setAuthToken,
} from "@/redux/slice/auth/authSlice";
import { showModal } from "@/redux/slice/modalSlice";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { requestLocation } from "@/services/locationService";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import DeviceInfo from "react-native-device-info";
import { SecureStorage } from "@/services/secureStorage";

type SignInScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "SignIn"
>;

interface Props {
  navigation: SignInScreenNavigationProp;
}

const SignInScreen: React.FC<Props> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [currentProvider, setCurrentProvider] = useState<
    "GOOGLE" | "APPLE" | null
  >(null);

  // ---------------- LOGIN -----------------
  const handleLogin = async () => {
    setLoadingMessage("Logging in...");
    try {
      await SignUpSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
      const result = await dispatch(loginUser({ email, password }));

      if (loginUser.rejected.match(result)) {
        dispatch(
          showModal({
            type: "error",
            message: result.payload || "Login failed",
          })
        );
        setLoadingMessage(null);
      } else {
        await requestLocation(dispatch);
        setLoadingMessage(null);
      }
    } catch (err: any) {
      setLoadingMessage(null);
      if (err.inner) {
        const newErrors: { email?: string; password?: string } = {};
        err.inner.forEach((e: any) => {
          newErrors[e.path as "email" | "password"] = e.message;
        });
        setErrors(newErrors);
      } else {
        dispatch(
          showModal({
            type: "error",
            message: err.message || "Validation failed",
          })
        );
      }
    }
  };

  useEffect(() => {
    if (auth.error) {
      dispatch(showModal({ type: "error", message: auth.error }));
    }
  }, [auth.error]);
useEffect(() => {
  const handleUrl = async ({ url }: { url: string }) => {
    const redirectUrl = "fitaiapp://sso/callback";
    console.log("🌐 Deep link received:", url);

    if (!url.startsWith(redirectUrl)) {
      console.warn("⚠️ Ignoring unrelated URL:", url);
      return;
    }

    try {
      await WebBrowser.dismissBrowser();
      console.log("📴 Browser closed successfully.");

      const params = new URL(url).searchParams;
      const email = params.get("email") || "";
      const fullName = decodeURIComponent(params.get("name") || "");
      const sub = params.get("sub") || "";
      const [firstName, ...lastNameParts] = fullName.split(" ");
      const lastName = lastNameParts.join(" ");
      const appJwt = params.get("appJwt") || "";
      const refreshToken = params.get("refreshToken") || "";

      console.log("🔐 OAuth callback params parsed:", {
        email,
        firstName,
        lastName,
        sub,
        appJwt: appJwt ? "✅ present" : "❌ missing",
        refreshToken: refreshToken ? "✅ present" : "❌ missing",
      });

      setLoadingMessage("Checking user...");
      const deviceId = await DeviceInfo.getUniqueId();

      const apiUrl = `${Config.API_BASE_URL}${Endpoints.AUTH.EMAIL_EXIST}?email=${encodeURIComponent(
        email
      )}&sub=${encodeURIComponent(sub)}`;

      console.log("📡 Sending user existence check:", { apiUrl, deviceId });

      let response;
      try {
        response = await axios.post(
          apiUrl,
          {},
          {
            headers: {
              "X-Device-ID": deviceId,
              "Content-Type": "application/json",
            },
            validateStatus: () => true,
          }
        );
      } catch (networkError: any) {
        console.error("🌐 Network error in email check:", networkError.message);
        throw networkError;
      }

      console.log("📦 API Response from EMAIL_EXIST:", {
        status: response.status,
        data: response.data,
      });

      const userData = response.data?.body;
      const exists =
        (response.status === 200 || response.data?.statusCodeValue === 200) &&
        userData?.userId;

      if (exists) {
        console.log("✅ Existing user detected → logging in user...");

        const userPayload = {
          token: userData.jwtTokenDTO.jwtToken,
          refreshToken: userData.jwtTokenDTO.refreshToken,
          user: {
            ...userData.userPublic,
            userId: userData.userId,
            healthCondition: userData.healthCondition,
            immuneDisorder: userData.immuneDisorder,
            neurologicalHealth: userData.neurologicalHealth,
            cancer: userData.cancer,
            address: userData.address,
          },
        };

        dispatch(setAuthToken(userPayload));

        try {
        await Promise.all([
    SecureStorage.setItem("authToken", userPayload.token),
    SecureStorage.setItem("refreshToken", userPayload.refreshToken),
    SecureStorage.setItem("user", JSON.stringify(userPayload.user)),
  ]);
          console.log("💾 AsyncStorage write success.");
        } catch (storageError) {
          console.error("⚠️ AsyncStorage write failed:", storageError);
        }

        try {
          await requestLocation(dispatch);
          console.log("📍 Location request success.");
        } catch (locErr) {
          console.warn("⚠️ Location permission denied or failed:", locErr);
        }
      } else {
        console.log("🆕 New user detected → navigating to PersonalDetails...");
        navigation.navigate("PersonalDetails", {
          email,
          firstName,
          lastName,
          appJwt,
          refreshToken,
          provider: currentProvider,
        });

        try {
          await requestLocation(dispatch);
        } catch (err) {
          console.warn("⚠️ Location fetch after navigation failed:", err);
        }
      }
    } catch (error: any) {
      console.error("❌ OAuth callback failed:", {
        message: error.message,
        response: error.response?.data,
      });

      navigation.navigate("PersonalDetails", {
        email: "",
        firstName: "",
        lastName: "",
        appJwt: "",
        refreshToken: "",
        provider: currentProvider,
      });
    } finally {
      setLoadingMessage(null);
      setCurrentProvider(null);
      await WebBrowser.dismissBrowser();
    }
  };

  const subscription = Linking.addEventListener("url", handleUrl);
  return () => subscription.remove();
}, [dispatch, navigation, currentProvider]);


const handleSocialLogin = async (type: "google" | "apple") => {
  setLoadingMessage(`Connecting with ${type}...`);
  setCurrentProvider(type === "google" ? "GOOGLE" : "APPLE");

  try {
    let authUrl: string | undefined;

    if (type === "google") {
      const result = await dispatch(getGoogleAuthUrl());
      authUrl = result.payload;
    } else if (type === "apple") {
      const deviceId = await DeviceInfo.getUniqueId();
      const response = await fetch(`${BASE_URL}${Endpoints.AUTH.APPLE_LOGIN}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": deviceId,
        },
      });
      const data = await response.json();
      authUrl = data.authUrl;
    }

    if (!authUrl) {
      console.error(`${type} authUrl is empty!`);
      setLoadingMessage(null);
      setCurrentProvider(null);
      return;
    }

    const redirectUrl = "fitaiapp://sso/callback";
    const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

    // ✅ Handle cancel/dismiss events properly
    if (result.type === "cancel" || result.type === "dismiss") {
      console.log(`❌ ${type} login cancelled by user.`);
      setLoadingMessage(null);
      setCurrentProvider(null);
      await WebBrowser.dismissBrowser();
      return;
    }

  } catch (err: any) {
    await WebBrowser.dismissBrowser();
    dispatch(
      showModal({
        type: "error",
        message: err.message || `${type} login failed`,
      })
    );
    setLoadingMessage(null);
    setCurrentProvider(null);
  }
};

  return (
    <>
      <MainHeader title="" />
      <ScrollContainer>
        <View style={styles.content}>
          <Logo />
          <Text style={styles.title}>{Strings.auth.signIn.title}</Text>
          <Text style={styles.subtitle}>{Strings.auth.signIn.subtitle}</Text>

          <View style={styles.form}>
            <Input
              label="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              error={errors.email}
            />
            <Input
              label={Strings.auth.passwordLabel}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
              autoComplete="password"
              placeholder={Strings.auth.passwordPlaceholder}
              error={errors.password}
              editable={!loadingMessage}
            />

            <Button
              title={loadingMessage ? "" : Strings.auth.signIn.signInButton}
              onPress={handleLogin}
              disabled={!!loadingMessage}
              style={styles.signInButton}
            />

            <Text style={styles.orText}>{Strings.auth.orText}</Text>

            <Button
              title={Strings.auth.continueWithGoogle}
              onPress={() => handleSocialLogin("google")}
              disabled={!!loadingMessage}
              style={styles.googleSignInButton}
              textStyle={styles.platformText}
              icon={<AntDesign name="google" size={20} color="black" />}
            />

            {Platform.OS === "ios" && (
              <Button
                title={Strings.auth.continueWithApple}
                onPress={() => handleSocialLogin("apple")}
                disabled={!!loadingMessage}
                style={styles.appleSignInButton}
                textStyle={styles.platformText}
                icon={<FontAwesome name="apple" size={24} color="black" />}
              />
            )}

            <View style={styles.signUpPrompt}>
              <Text style={styles.signUpText}>
                {Strings.auth.signIn.prompt}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignUp")}
                disabled={!!loadingMessage}
              >
                <Text style={styles.signUpLink}>
                  {Strings.auth.signIn.createOne}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollContainer>

      <LoadingSpinner
        visible={!!loadingMessage}
        message={loadingMessage || ""}
      />
    </>
  );
};

export default SignInScreen;
