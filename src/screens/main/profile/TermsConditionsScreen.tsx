// src/screens/TermsConditionsScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { WebView } from "react-native-webview";
import { Colors } from "@/constants/Colors";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const TermsConditionsScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);

  const injectedCSS = `
    const style = document.createElement('style');
    style.innerHTML = \`
      footer, .footer, #footer, .site-footer { display: none !important; }
      header, .header, #header, .site-header { display: none !important; }
    \`;
    document.head.appendChild(style);
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ uri: "https://y-xis.com/terms" }}
        injectedJavaScript={injectedCSS}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        showsVerticalScrollIndicator
        style={styles.webView}
      />

      {loading && (
        <LoadingSpinner
          visible={loading}
          message="loading Terms & Conditions..."
          // overlayColor="rgba(0,0,0,0.4)"
          // color="#FFD700"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { padding: 16, borderBottomWidth: 1, borderColor: "#eee" },
  title: { fontSize: 18, fontWeight: "600", color: "#111" },
  webView: { flex: 1 },
  loader: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.6)",
  },
  loaderText: { marginTop: 10, color: "#666" },
});

export default TermsConditionsScreen;
