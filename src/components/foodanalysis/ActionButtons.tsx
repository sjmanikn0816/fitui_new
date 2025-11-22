// components/FoodAnalysisResults/ActionButtons.tsx
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const ActionButtons = ({ navigation }) => {
  return (
    <View style={styles.actionButtons}>
      {/* <TouchableOpacity
        style={styles.saveButton}
        onPress={() => navigation.navigate("Dashboard")}
      >
        <Ionicons name="checkmark-circle" size={24} color="#FFF" />
        <Text style={styles.saveButtonText}>Save to Log</Text>
      </TouchableOpacity> */}

      <TouchableOpacity style={styles.retryButton} onPress={() => navigation.goBack()}>
        <Ionicons name="refresh" size={24} color="#FF6B35" />
        <Text style={styles.retryButtonText}>Analyze Another</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginTop: 24 },
  saveButton: {
    flex: 1,
    backgroundColor: "#FF6B35",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    
    borderRadius: 12,
  },
  saveButtonText: { fontSize: 16, fontWeight: "700", color: "#FFF", marginLeft: 8 },
  retryButton: {
    flex: 1,
    backgroundColor: "#FFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF6B35",
  },
  retryButtonText: { fontSize: 16, fontWeight: "700", color: "#FF6B35", marginLeft: 8 },
});

export default ActionButtons;
