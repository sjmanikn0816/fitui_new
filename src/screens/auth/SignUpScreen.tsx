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

  const handleContinue = async () => {
    try {
      setLoading(true);
      if (!firstName.trim() || !lastName.trim()) {
        dispatch(
          showModal({
            type: "error",
            message: "Please enter both first and last name.",
          })
        );
        return;
      }

      await SignUpSchema.validate({ email, password }, { abortEarly: true });

      // Check if email already exists in backend
      const deviceId = await DeviceInfo.getUniqueId();
      const checkEmailUrl = `${Config.API_BASE_URL}${
        Endpoints.AUTH.EMAIL_EXIST
      }?email=${encodeURIComponent(email.trim())}`;

      const emailCheckResponse = await axios.post(
        checkEmailUrl,
        {},
        {
          headers: {
            "X-Device-ID": deviceId,
            "Content-Type": "application/json",
          },
        }
      );

      // If email exists, show error and stop
      if (emailCheckResponse.data?.exists === true) {
        dispatch(
          showModal({
            type: "error",
            message:
              "This email is already registered. Please sign in or use a different email.",
          })
        );
        return;
      }

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
