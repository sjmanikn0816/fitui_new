import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { styles } from "./styles/HealthInseightsSection";

interface Insight {
  id: string;
  title: string;
  description: string;
  icon: string;
  bgColor: string;
  borderColor: string;
}

const healthInsights: Insight[] = [
  {
    id: "blood_sugar",
    title: "Blood Sugar Trending Down",
    description: "Your average blood sugar has decreased by 8.7% this week",
    icon: "📉",
    bgColor: "#ECFDF5",
    borderColor: "#10B981",
  },
  {
    id: "weight_progress",
    title: "Weight Goal Progress",
    description: "You're 78% of the way to your target weight",
    icon: "🎯",
    bgColor: "#EFF6FF",
    borderColor: "#3B82F6",
  },
  {
    id: "hydration",
    title: "Hydration Reminder",
    description: "Try to drink more water on the weekends",
    icon: "💧",
    bgColor: "#F0F9FF",
    borderColor: "#0EA5E9",
  },
];

const HealthInsightsSection: React.FC = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Health Insights</Text>

      {healthInsights.map((insight) => (
        <TouchableOpacity key={insight.id} style={styles.card}>
          <View style={styles.row}>
            <View style={[styles.iconBox, { backgroundColor: insight.bgColor }]}>
              <Text style={styles.icon}>{insight.icon}</Text>
            </View>
            <View style={styles.textBox}>
              <Text style={styles.cardTitle}>{insight.title}</Text>
              <Text style={styles.cardDesc}>{insight.description}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};



export default HealthInsightsSection;
