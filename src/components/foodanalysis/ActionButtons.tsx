// components/FoodAnalysisResults/ActionButtons.tsx
import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

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
        <Ionicons name="refresh" size={24} color={Colors.emerald} />
        <Text style={styles.retryButtonText}>Analyze Another</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionButtons: { flexDirection: "row", gap: 12, paddingHorizontal: 20, marginTop: 24 },
  saveButton: {
    flex: 1,
    backgroundColor: Colors.emerald,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
  },
  saveButtonText: { fontSize: 16, fontWeight: "700", color: Colors.bgPrimary, marginLeft: 8 },
  retryButton: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.emerald,
  },
  retryButtonText: { fontSize: 16, fontWeight: "700", color: Colors.emerald, marginLeft: 8 },
});

export default ActionButtons;
