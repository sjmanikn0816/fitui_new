import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";
import { AlertTriangle } from "lucide-react-native"; 

interface MedicalBannerProps {
  message?: string;
}

const MedicalBanner: React.FC<MedicalBannerProps> = ({
  message = "Due to your Health conditions, we recommended consulting with  healthcare professionals starting your weight lose journey ",
}) => {
  return (
    <View style={styles.container}>
      <AlertTriangle color={Colors.warning} size={22} style={{ marginRight: 8 }} />
      <View style={{ flex: 1 }}>
        <Text style={styles.title}>⚠️ Medical Supervision Recommended</Text>
        <Text style={styles.subtitle}>{message}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginHorizontal: 16,
    marginBottom: 20,
    padding: 16,
    backgroundColor: "#FEF3C7", 
    borderRadius: 16,
    borderWidth:1,
    borderColor: "#FBBF24", 
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#92400E", 
    marginBottom: 4,
  },
  subtitle: { fontSize: 13, color: "#78350F" },
});

export default MedicalBanner;
