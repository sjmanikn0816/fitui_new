import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import Logo from "../../components/ui/Logo";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { styles } from "../styles/SignUpScreenStyles";
import { SignUpSchema } from "@/utils/validationSchema";
import { Strings } from "@/constants/String";
import { useAppDispatch } from "@/redux/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import ScrollContainer from "@/components/ui/ScrollContainer";
import MainHeader from "@/components/ui/MainHeaderNav";
import { showModal } from "@/redux/slice/modalSlice";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import axios from "axios";
import DeviceInfo from "react-native-device-info";
import { Config } from "@/constants/config";
import { Endpoints } from "@/constants/endpoints";

type SignUpScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "SignUp"
>;

interface Props {
  navigation: SignUpScreenNavigationProp;
}

const SignUpScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  // Helper function to retry API calls with exponential backoff
  const retryWithBackoff = async (
    apiCall: () => Promise<any>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<any> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await apiCall();
      } catch (error: any) {
        const isLastAttempt = attempt === maxRetries - 1;
        const isNetworkError = !error.response; // No response = network issue
        const isServerError = error.response?.status >= 500;

        // Only retry on network errors or server errors (500+)
        if (!isLastAttempt && (isNetworkError || isServerError)) {
          const delay = baseDelay * Math.pow(2, attempt); // Exponential backoff
          console.log(`⏳ Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }

        // Don't retry on client errors (4xx) or if it's the last attempt
        throw error;
      }
    }
  };

  const handleContinue = async () => {
    try {
      setLoading(true);

      // Validate name fields
      if (!firstName.trim() || !lastName.trim()) {
        dispatch(
          showModal({
            type: "error",
            message: "Please enter both first and last name.",
          })
        );
        return;
      }

      // Validate email and password format
      await SignUpSchema.validate({ email, password }, { abortEarly: true });

      // ============================================================================
      // TODO: FIX EMAIL VALIDATION - Currently disabled, allowing all users to proceed
      // ============================================================================
      // ISSUE: Email validation endpoint is failing - needs backend investigation
      // TEMPORARY FIX: Bypass email validation, allow user to proceed
      // FINAL VALIDATION: Will happen at /userSignup endpoint after all 8 steps
      // ============================================================================

      /* DISABLED - Email validation code (to be fixed later)

      // COMPREHENSIVE EMAIL VALIDATION WITH RETRY
      const deviceId = await DeviceInfo.getUniqueId();
      const checkEmailUrl = `${Config.API_BASE_URL}${
        Endpoints.AUTH.EMAIL_EXIST
      }?email=${encodeURIComponent(email.trim())}`;

      console.log("========================================");
      console.log("🔍 Starting comprehensive email validation");
      console.log("Email:", email.trim());
      console.log("========================================");

      try {
        // Retry email check up to 3 times with exponential backoff
        const emailCheckResponse = await retryWithBackoff(
          () =>
            axios.post(
              checkEmailUrl,
              {},
              {
                headers: {
                  "X-Device-ID": deviceId,
                  "Content-Type": "application/json",
                },
                timeout: 10000, // 10 second timeout
              }
            ),
          3, // Max 3 attempts
          2000 // Start with 2 second delay
        );

        console.log("✅ Email validation API response:", emailCheckResponse.data);
        const responseData = emailCheckResponse.data;

        // Check if email already exists (multiple response formats)
        if (
          responseData?.exists === true ||
          responseData?.userExists === true ||
          responseData?.emailExists === true ||
          responseData?.message?.toLowerCase().includes("already") ||
          responseData?.message?.toLowerCase().includes("exists")
        ) {
          console.log("🚫 Email already registered");
          dispatch(
            showModal({
              type: "error",
              message:
                responseData?.message ||
                "This email is already registered. Please sign in or use a different email.",
            })
          );
          return; // BLOCK - email exists
        }

        // Email is available - proceed
        console.log("✅ Email is available, proceeding to registration");

      } catch (apiError: any) {
        // Detailed error logging
        console.log("========================================");
        console.log("❌ Email Validation Failed After Retries");
        console.log("========================================");
        console.log("URL:", checkEmailUrl);
        console.log("Email:", email.trim());
        console.log("Error:", apiError.message);

        if (apiError.response) {
          const statusCode = apiError.response.status;
          const errorMessage = apiError.response.data?.message || "";

          console.log("Status Code:", statusCode);
          console.log("Response Data:", apiError.response.data);

          // STRICT BLOCKING: Email already exists
          if (
            statusCode === 409 || // HTTP 409 Conflict
            errorMessage.toLowerCase().includes("already registered") ||
            errorMessage.toLowerCase().includes("email already exists") ||
            errorMessage.toLowerCase().includes("user already exists")
          ) {
            console.log("🚫 Email already exists - BLOCKING");
            dispatch(
              showModal({
                type: "error",
                message:
                  errorMessage ||
                  "This email is already registered. Please sign in or use a different email.",
              })
            );
            return; // BLOCK
          }

          // STRICT BLOCKING: Server errors (after retries failed)
          if (statusCode >= 500) {
            console.log("🚫 Server error after retries - BLOCKING");
            dispatch(
              showModal({
                type: "error",
                message:
                  "Unable to verify email availability due to server issues. Please try again in a moment.",
              })
            );
            return; // BLOCK - can't verify email
          }

          // Other client errors (400, 401, 403, etc.)
          console.log("🚫 Client error - BLOCKING");
          dispatch(
            showModal({
              type: "error",
              message:
                errorMessage || "Unable to validate email. Please check your email and try again.",
            })
          );
          return; // BLOCK
        } else if (apiError.request) {
          // Network error after all retries
          console.log("🚫 Network error after retries - BLOCKING");
          dispatch(
            showModal({
              type: "error",
              message:
                "Unable to connect to the server. Please check your internet connection and try again.",
            })
          );
          return; // BLOCK - no network
        } else {
          // Request setup error
          console.log("🚫 Request error - BLOCKING");
          dispatch(
            showModal({
              type: "error",
              message: "An error occurred. Please try again.",
            })
          );
          return; // BLOCK
        }
      }

      */ // END DISABLED EMAIL VALIDATION

      // ============================================================================
      // TEMPORARY: Proceeding without email validation
      // User will get validation error at final signup if email already exists
      // ============================================================================
      console.log("⚠️ Email validation DISABLED - proceeding to registration");
      console.log("Email will be validated at final signup endpoint: /userSignup");

      // All validations passed - proceed to next screen
      navigation.navigate("PersonalDetails", {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        provider: "MANUAL",
      });
    } catch (err: any) {
      dispatch(
        showModal({
          type: "error",
          message: err.message || "Something went wrong.",
        })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <MainHeader
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
        title=" "
      />

      <ScrollContainer>
        <View style={styles.content}>
          <Logo />
          <Text style={styles.title}>{Strings.auth.signUp.title}</Text>
          <Text style={styles.subtitle}>
            {Strings?.auth?.signUp?.subtitle ??
              Strings.auth.signUp.emailSubtitle}
          </Text>

          <View style={styles.form}>
            {/* Inputs */}
            <Input
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              autoCapitalize="words"
              placeholder="Enter your first name"
              required
              editable={!loading}
            />
            <Input
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              autoCapitalize="words"
              placeholder="Enter your last name"
              required
              editable={!loading}
            />
            <Input
              label={Strings.auth.emailLabel}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder={Strings.auth.emailPlaceholder}
              required
              editable={!loading}
            />
            <Input
              label={Strings.auth.passwordLabel}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              placeholder={Strings.auth.passwordPlaceholder}
              required
              editable={!loading}
            />

            <Button
              title={Strings.auth.signUp.continueButton}
              onPress={handleContinue}
              loading={loading}
              disabled={loading}
              style={styles.signInButton}
            />

            <Text style={styles.orText}>{Strings.auth.orText}</Text>

            {/* Social */}
            {/* <Button
              title={Strings.auth.continueWithGoogle}
              onPress={handleContinue}
              loading={loading}
              disabled={loading}
              style={styles.googleSignInButton}
              textStyle={styles.platformText}
              icon={<AntDesign name="google" size={20} color="black" />}
            />

            <Button
              title={Strings.auth.continueWithApple}
              onPress={handleContinue}
              loading={loading}
              disabled={loading}
              style={styles.appleSignInButton}
              textStyle={styles.platformText}
              icon={<FontAwesome name="apple" size={24} color="black" />}
            /> */}

            <View style={styles.signUpPrompt}>
              <Text style={styles.signUpText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                <Text style={styles.signUpLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollContainer>

      <LoadingSpinner visible={loading} message="Creating your account..." />
    </>
  );
};

export default SignUpScreen;
