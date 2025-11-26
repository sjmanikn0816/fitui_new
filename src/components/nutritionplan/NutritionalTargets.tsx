import React from "react";
import { View, Text } from "react-native";
import { nutritionalTargets } from "@/data/dummyData";
import { styles } from "@/screens/styles/NutritionPlanStyles";


const NutritionalTargets = () => {
  return (
    <View style={styles.nutritionalTargets}>
      <View style={styles.sectionHeader}>
        <View style={styles.targetIconHeader}>
          <Text style={styles.targetEmojiHeader}>🎯</Text>
        </View>
        <Text style={styles.sectionTitle}>Nutritional Targets</Text>
      </View>

      {nutritionalTargets.map((target) => (
        <View key={target.id} style={styles.targetItem}>
          <View
            style={[styles.targetIcon, { backgroundColor: target.bgColor }]}
          >
            <Text style={styles.targetEmoji}>{target.icon}</Text>
          </View>
          <View style={styles.targetInfo}>
            <Text style={styles.targetName}>{target.name}</Text>
            <Text style={styles.targetAmount}>{target.amount}</Text>
            <Text style={styles.targetPercentage}>{target.percentage}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

export default NutritionalTargets;
