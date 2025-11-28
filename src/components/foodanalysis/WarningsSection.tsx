// components/FoodAnalysisResults/WarningsSection.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

const WarningsSection = ({ warnings }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Important Notes</Text>
      <View style={styles.warningsCard}>
        {warnings.map((warning, index) => (
          <View key={index} style={styles.warningItem}>
            <Ionicons name="information-circle" size={20} color="#FBBF24" />
            <Text style={styles.warningText}>{warning}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", color: Colors.textPrimary, marginBottom: 16 },
  warningsCard: { backgroundColor: "rgba(251, 191, 36, 0.1)", borderRadius: 12, padding: 16, borderWidth: 1, borderColor: "rgba(251, 191, 36, 0.3)" },
  warningItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  warningText: { flex: 1, fontSize: 13, color: "#FBBF24", marginLeft: 8, lineHeight: 18 },
});

export default WarningsSection;
