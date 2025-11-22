import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import { useNavigation, useRoute } from "@react-navigation/native";

const GoogleWebViewLogin: React.FC = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { authUrl, redirectUrl } = route.params;

  const handleNavigationStateChange = (navState: any) => {
    const { url } = navState;
    console.log("Navigated to URL:", url);

    if (url.startsWith(redirectUrl)) {
      try {
        const parsedUrl = new URL(url);
        const code = parsedUrl.searchParams.get("code") || "";
        const state = parsedUrl.searchParams.get("state") || "";

        console.log("✅ Redirect detected in WebView");
        console.log("Code:", code, "State:", state);

        navigation.emit({
          type: "googleCodeReceived",
          data: { code, state },
        });

        navigation.goBack();
      } catch (err) {
        console.error("Error parsing redirect URL:", err);
      }
    }
  };

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: authUrl }}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState
        renderLoading={() => (
          <ActivityIndicator size="large" style={styles.loading} />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: "center" },
});

export default GoogleWebViewLogin;
