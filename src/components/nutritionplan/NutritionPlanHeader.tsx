import { styles } from "@/screens/styles/NutritionPlanStyles";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";


const NutritionPlanHeader = () => {
  return (
    <View style={styles.header}>
      <Text style={styles.headerTitle}>Your Nutrition Target</Text>
      <Text style={styles.headerSubtitle}>
        Personalised recommendations based on your profile
      </Text>

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.newPlanButton}>
          <Text style={styles.newPlanButtonText}>New Plan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.updateButton}>
          <Text style={styles.updateButtonText}>Update</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NutritionPlanHeader;
