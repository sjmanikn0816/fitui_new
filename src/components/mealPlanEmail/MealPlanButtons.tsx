import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const MealPlanButtons = ({
  loading,
  onDownload,
  onSend,
}: {
  loading: boolean;
  onDownload: () => void;
  onSend: () => void;
}) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[styles.button, styles.download, loading && styles.disabled]}
      onPress={onDownload}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <Ionicons name="download-outline" size={22} color="#fff" />
          <Text style={styles.text}>Download PDF</Text>
        </>
      )}
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, styles.email, loading && styles.disabled]}
      onPress={onSend}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <>
          <Ionicons name="mail-outline" size={22} color="#fff" />
          <Text style={styles.text}>Send Email</Text>
        </>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: { gap: 12, marginBottom: 30 },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  download: { backgroundColor: "#3b82f6" },
  email: { backgroundColor: "#10b981" },
  disabled: { opacity: 0.6 },
  text: { color: "#fff", fontWeight: "700" },
});

export default MealPlanButtons;
