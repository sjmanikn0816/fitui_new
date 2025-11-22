import React from "react";
import { TouchableOpacity, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  loading: boolean;
  onDownload: () => void;
  onSendEmail: () => void;
}

const ActionButtons: React.FC<Props> = ({ loading, onDownload, onSendEmail }) => (
  <View style={styles.container}>
    <TouchableOpacity
      style={[styles.button, styles.download, loading && styles.disabled]}
      onPress={onDownload}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color="#fff" /> : (
        <>
          <Ionicons name="download-outline" size={20} color="#fff" />
          <Text style={styles.text}>Download PDF</Text>
        </>
      )}
    </TouchableOpacity>

    <TouchableOpacity
      style={[styles.button, styles.email, loading && styles.disabled]}
      onPress={onSendEmail}
      disabled={loading}
    >
      {loading ? <ActivityIndicator color="#fff" /> : (
        <>
          <Ionicons name="mail-outline" size={20} color="#fff" />
          <Text style={styles.text}>Send Email</Text>
        </>
      )}
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // <-- makes buttons horizontal
    justifyContent: "space-between", // spacing between buttons
    marginBottom: 30,
    gap: 12, // optional: modern RN supports gap
  },
  button: {
    flex: 1, // make buttons share available width equally
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  download: {
    backgroundColor: "#3b82f6",
    marginRight: 6,
  },
  email: {
    backgroundColor: "#10b981",
    marginLeft: 6,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default ActionButtons;
