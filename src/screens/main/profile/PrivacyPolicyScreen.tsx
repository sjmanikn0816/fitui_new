import LoadingSpinner from "@/components/ui/LoadingSpinner";
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";

interface PrivacyPolicyScreenProps {
  navigation: any;
}

const PrivacyPolicyScreen = ({ navigation }: PrivacyPolicyScreenProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  const injectedCSS = `
    const style = document.createElement('style');
    style.innerHTML = \`
      footer, .footer, #footer, .site-footer, .main-footer {
        display: none !important;
      }
      .sticky-footer, .bottom-bar, .cookie-banner {
        display: none !important;
      }
    \`;
    document.head.appendChild(style);
  `;

  return (
    <View style={styles.container}>
      {/* Header */}
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
        <View style={styles.placeholder} />
      </View> */}

      {/* WebView */}
      <View style={styles.webContainer}>
        <WebView
          originWhitelist={["*"]}
          source={{ uri: "https://y-xis.com/privacy" }}
          injectedJavaScript={injectedCSS}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState={true}
          showsVerticalScrollIndicator
          style={styles.webView}
        />

        {/* Spinner Overlay */}
        {loading && (
           <LoadingSpinner
        visible={loading}
        message="loading Privacy Policy..."
        // overlayColor="rgba(0,0,0,0.4)"
        // color="#FFD700"
      />

        )}
      </View>
</View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  backIcon: {
    fontSize: 32,
    color: "#111827",
    fontWeight: "300",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  placeholder: {
    width: 40,
  },
  webContainer: {
    flex: 1,
    position: "relative",
  },
  webView: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  loaderOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#6B7280",
  },
});

export default PrivacyPolicyScreen;
