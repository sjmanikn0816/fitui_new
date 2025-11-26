import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { styles } from "./styles/HealthGoalsStyles";

interface Goal {
  id: string;
  title: string;
  progress: number;
  color: string;
}

const healthGoals: Goal[] = [
  { id: "weight_loss", title: "Weight Loss", progress: 78, color: "#10B981" },
  { id: "blood_pressure", title: "Maintain healthy blood pressure", progress: 92, color: "#3B82F6" },
  { id: "exercise", title: "Exercise 4 times per week", progress: 65, color: "#8B5CF6" },
];

const HealthGoalsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Goals</Text>

      {healthGoals.map((goal) => (
        <View key={goal.id} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.goalTitle}>{goal.title}</Text>
            <Text style={[styles.progressText, { color: goal.color }]}>
              {goal.progress}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBar, { width: `${goal.progress}%`, backgroundColor: goal.color }]}
            />
          </View>
        </View>
      ))}
    </View>
  );
};



export default HealthGoalsSection;
