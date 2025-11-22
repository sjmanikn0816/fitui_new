import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  SafeAreaView,
  Alert,
} from "react-native";
import * as LocalAuthentication from "expo-local-authentication";

import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { styles } from "./styles/PrivacySecurityScreenStyles";
import { SecureStorage } from "@/services/secureStorage";

interface PrivacySecurityScreenProps {
  navigation: any;
}

const PrivacySecurityScreen = ({ navigation }: PrivacySecurityScreenProps) => {
  const dispatch = useAppDispatch();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    const loadBiometricPref = async () => {
      const stored = await SecureStorage.getItem("biometricEnabled");
      if (stored === "true") setBiometricEnabled(true);
    };
    loadBiometricPref();
  }, []);

  const handleChangePassword = () => {
    navigation.navigate("ChangePassword");
  };

  /** 🔐 Toggle Biometric Authentication */
  const handleBiometricToggle = async (enabled: boolean) => {
    if (enabled) {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();

      if (!hasHardware || !enrolled) {
        Alert.alert(
          "Unavailable",
          "Biometric authentication is not available or not set up on this device."
        );
        return;
      }

      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirm your identity to enable biometrics",
      });

      if (result.success) {
        await SecureStorage.setItem("biometricEnabled", "true");
        setBiometricEnabled(true);
        Alert.alert("Enabled", "Biometric login has been turned on.");
      } else {
        Alert.alert("Cancelled", "Biometric setup was cancelled.");
      }
    } else {
      await SecureStorage.removeItem("biometricEnabled");
      setBiometricEnabled(false);
      Alert.alert("Disabled", "Biometric login has been turned off.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Security Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.lockIcon}>🔒</Text>
            <Text style={styles.sectionTitle}>Security Settings</Text>
          </View>

          {/* Two-Factor Authentication */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.phoneIcon}>📱</Text>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                <Text style={styles.settingDescription}>
                  Add an extra layer of security to your account
                </Text>
              </View>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              trackColor={{ false: "#D1D5DB", true: "#34D399" }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Biometric Login */}
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Text style={styles.keyIcon}>🔑</Text>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Biometric Login</Text>
                <Text style={styles.settingDescription}>
                  Use fingerprint or face recognition to sign in
                </Text>
              </View>
            </View>
            <Switch
              value={biometricEnabled}
              onValueChange={handleBiometricToggle}
              trackColor={{ false: "#D1D5DB", true: "#34D399" }}
              thumbColor="#FFFFFF"
            />
          </View>
{/* <TouchableOpacity
  style={styles.policyButton}
  onPress={() => navigation.navigate("PrivacyPolicy")}
>
  <Text style={styles.documentIcon}>📄</Text>
  <Text style={styles.policyText}>Privacy & Terms</Text>
  <Text style={styles.chevron}>›</Text>
</TouchableOpacity> */}
          {/* Change Password */}
          <TouchableOpacity
            style={styles.passwordButton}
            onPress={handleChangePassword}
          >
            <Text style={styles.keyIconYellow}>🔑</Text>
            <Text style={styles.passwordText}>Change Password</Text>
            <Text style={styles.chevron}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PrivacySecurityScreen;
