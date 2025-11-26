// components/FoodAnalysisResults/WarningsSection.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const WarningsSection = ({ warnings }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Important Notes</Text>
      <View style={styles.warningsCard}>
        {warnings.map((warning, index) => (
          <View key={index} style={styles.warningItem}>
            <Ionicons name="information-circle" size={20} color="#FF9800" />
            <Text style={styles.warningText}>{warning}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: "#333", marginBottom: 16 },
  warningsCard: { backgroundColor: "#FFF3E0", borderRadius: 12, padding: 16 },
  warningItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  warningText: { flex: 1, fontSize: 13, color: "#F57C00", marginLeft: 8, lineHeight: 18 },
});

export default WarningsSection;
