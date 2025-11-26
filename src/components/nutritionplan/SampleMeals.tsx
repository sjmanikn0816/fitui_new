import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { dayPlans } from "@/data/dummyData";

import MealCard from "./MealCard";
import { styles } from "@/screens/styles/NutritionPlanStyles";

const SampleMeals = () => {
  const [selectedDay, setSelectedDay] = useState(1);

  const currentDayMeals =
    dayPlans.find((plan) => plan.day === selectedDay)?.meals || [];

  return (
    <View style={styles.sampleMeals}>
      <View style={styles.sectionHeader}>
        <View style={styles.targetIconHeader}>
          <Text style={styles.targetEmojiHeader}>🍽️</Text>
        </View>
        <Text style={styles.sectionTitle}>Sample Meals</Text>
      </View>

      <View style={styles.dayTabs}>
        {dayPlans.map((plan) => (
          <TouchableOpacity
            key={plan.day}
            style={[
              styles.dayTab,
              selectedDay === plan.day && styles.activeTab,
            ]}
            onPress={() => setSelectedDay(plan.day)}
          >
            <Text
              style={
                selectedDay === plan.day
                  ? styles.activeTabText
                  : styles.inactiveTabText
              }
            >
              Day {plan.day}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {currentDayMeals.map((meal, index) => (
        <MealCard key={`${meal.id}-${index}`} meal={meal} />
      ))}
    </View>
  );
};

export default SampleMeals;
