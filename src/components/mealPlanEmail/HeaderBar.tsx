import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface Props {
  loading: boolean;
  onClose: () => void;
}

const HeaderBar: React.FC<Props> = ({ loading, onClose }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onClose} style={styles.closeButton} disabled={loading}>
      <Ionicons name="close" size={28} color={loading ? "#9ca3af" : "#374151"} />
    </TouchableOpacity>
    <Text style={styles.title}>Share Meal Plan</Text>
    <View style={{ width: 28 }} />
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  closeButton: { padding: 4 },
  title: { fontSize: 20, fontWeight: "700", color: "#111827" },
});

export default HeaderBar;
