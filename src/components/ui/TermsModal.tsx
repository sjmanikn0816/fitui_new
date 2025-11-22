// components/modals/TermsModal.tsx

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Modal,
} from "react-native";
import { WebView } from "react-native-webview";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import aiApi from "@/services/aiApi";
import { Endpoints } from "@/constants/endpoints";

import { styles } from "@/screens/styles/TersmScreenStyles";
import { SecureStorage } from "@/services/secureStorage";

interface TermsModalProps {
  visible: boolean;
  onAccept: () => void;
  onClose?: () => void;
}

const TermsModal: React.FC<TermsModalProps> = ({ visible, onAccept, onClose }) => {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [accepted, setAccepted] = useState(false);
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const handleScroll = (event: any) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isBottom && !isScrolledToBottom) setIsScrolledToBottom(true);
  };

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const res = await aiApi.get(`${Endpoints.TERMS_CONDTION}`, {
          headers: { Accept: "text/html" },
          responseType: "text",
        });
        setHtmlContent(res.data || "<h3>No Terms Found</h3>");
        console.log(htmlContent)
      } catch {
        setHtmlContent("<h3>⚠️ Failed to load Terms</h3>");
      } finally {
        setLoading(false);
      }
    };
    fetchTerms();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.1, duration: 1000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const handleAcceptPress = async () => {
    if (accepted && isScrolledToBottom) {
      await SecureStorage.setItem("termsAccepted", "true");
      onAccept(); // trigger auth continuation
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.black} />
              </TouchableOpacity>
            )}
            <View style={styles.headerTextContainer}>
              <Text style={styles.title}>Terms & Conditions</Text>
              <Text style={styles.subtitle}>Please read carefully before continuing</Text>
            </View>
          </View>

          {loading ? (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color={Colors.black} />
              <Text style={styles.loaderText}>Loading Terms...</Text>
            </View>
          ) : (
            <View style={styles.webViewContainer}>
              <WebView
                originWhitelist={["*"]}
                source={{ html: htmlContent! }}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.webView}
              />
            </View>
          )}

          {!isScrolledToBottom && (
            <Animated.View style={[styles.scrollIndicator, { transform: [{ scale: pulseAnim }] }]}>
              <Ionicons name="chevron-down" size={24} color={Colors.black} />
              <Text style={styles.scrollText}>Scroll to continue</Text>
            </Animated.View>
          )}

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setAccepted(!accepted)}
          >
            <View style={[styles.checkbox, accepted && styles.checkboxChecked]}>
              {accepted && <Ionicons name="checkmark" size={18} color="#fff" />}
            </View>
            <Text style={styles.checkboxLabel}>
              I agree to the Terms & Conditions
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.acceptButton,
              (!accepted || !isScrolledToBottom) && styles.acceptButtonDisabled,
            ]}
            onPress={handleAcceptPress}
            disabled={!accepted || !isScrolledToBottom}
          >
            <LinearGradient
              colors={
                accepted && isScrolledToBottom
                  ? [Colors.black, Colors.black]
                  : ["#cbd5e1", "#94a3b8"]
              }
              style={styles.gradientButton}
            >
              <Text style={styles.acceptButtonText}>Continue to FitAI</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TermsModal;