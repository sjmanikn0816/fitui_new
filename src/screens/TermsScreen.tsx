import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
} from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/TersmScreenStyles";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "@/navigation/AuthNavigator";
import Logo from "@/components/ui/Logo";
import { Colors } from "@/constants/Colors";
import MainHeader from "@/components/ui/MainHeaderNav";
import { SecureStorage } from "@/services/secureStorage";

const TermsScreen: React.FC = () => {
  const [accepted, setAccepted] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation<StackNavigationProp<AuthStackParamList>>();

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handleAcceptPress = async () => {
    if (accepted && isScrolledToBottom) {
      await SecureStorage.setItem("termsAccepted", "true");
      navigation.replace("SignUp");
    }
  };

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;

    if (isBottom && !isScrolledToBottom) {
      setIsScrolledToBottom(true);
    }
  };

  // Inject CSS into the webpage to hide footer
  const injectedJS = `
    const style = document.createElement('style');
    style.innerHTML = \`
      footer, .footer, #footer, .site-footer {
        display: none !important;
        height: 0 !important;
        visibility: hidden !important;
      }
    \`;
    document.head.appendChild(style);
    true;
  `;

  return (
    <>
      <MainHeader
        title=""
        showBackButton={true}
        onBackPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <View style={styles.headerSection}>
          <Logo />
          <Text style={styles.title}>Terms & Conditions</Text>
          <Text style={styles.subtitle}>
            Please read the terms carefully before continuing
          </Text>
        </View>

        <View style={styles.webViewContainer}>
          <WebView
            originWhitelist={["*"]}
            source={{ uri: "https://y-xis.com/terms" }}
            onScroll={handleScroll}
            onLoadEnd={() => setLoading(false)}
            injectedJavaScript={injectedJS}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            style={styles.webView}
            showsVerticalScrollIndicator={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={Colors.black} />
                <Text style={styles.loaderText}>Loading Terms...</Text>
              </View>
            )}
          />
        </View>

        {!isScrolledToBottom && (
          <Animated.View
            style={[
              styles.scrollIndicator,
              { transform: [{ scale: pulseAnim }] },
            ]}
          >
            <Ionicons name="chevron-down" size={24} color={Colors.black} />
            <Text style={styles.scrollText}>Scroll to continue</Text>
          </Animated.View>
        )}

        <View style={styles.bottomContainer}>
          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAccepted(!accepted)}
            activeOpacity={0.7}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
              {accepted && <Ionicons name="checkmark" size={20} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>
              I have read and agree to the Terms & Conditions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.acceptButton,
              (!accepted || !isScrolledToBottom) && styles.acceptButtonDisabled,
            ]}
            onPress={handleAcceptPress}
            disabled={!accepted || !isScrolledToBottom}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={
                accepted && isScrolledToBottom
                  ? [Colors.black, Colors.black]
                  : ["#cbd5e1", "#94a3b8"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton}
            >
              <Text style={styles.acceptButtonText}>Continue to FitAI</Text>
              <Ionicons name="arrow-forward" size={22} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>

          {!isScrolledToBottom && (
            <Text style={styles.helperText}>
              Please scroll to the bottom to enable the continue button
            </Text>
          )}
        </View>
      </View>
    </>
  );
};

export default TermsScreen;
