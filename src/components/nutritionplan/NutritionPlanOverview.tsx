import { styles } from "@/screens/styles/NutritionPlanStyles";
import React from "react";
import { View, Text } from "react-native";

const NutritionPlanOverview = () => {
  return (
    <View style={styles.planOverview}>
      <Text style={styles.planTitle}>Healthy Living Nutrition Plan</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>⏰</Text>
          </View>
          <Text style={styles.statNumber}>3335</Text>
          <Text style={styles.statLabel}>calories</Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>⏰</Text>
          </View>
          <Text style={styles.statNumber}>4</Text>
          <Text style={styles.statLabel}>meals per day</Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>✓</Text>
          </View>
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>days per week</Text>
        </View>
      </View>
    </View>
  );
};

export default NutritionPlanOverview;
