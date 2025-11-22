import { styles } from "@/screens/styles/NutritionPlanStyles";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";


const MealCard = ({ meal }) => {
  return (
    <TouchableOpacity style={styles.mealCard}>
      <View style={styles.mealImageContainer}>
        <Image source={{ uri: meal.image }} style={styles.mealImage} />
        <View style={styles.mealTypeContainer}>
          <View style={styles.mealTypeIcon}>
            <Text style={styles.mealTypeEmoji}>{meal.mealIcon}</Text>
          </View>
          <Text style={styles.mealType}>{meal.mealType}</Text>
        </View>
        <View style={styles.caloriesBadge}>
          <Text style={styles.caloriesText}>{meal.calories}</Text>
        </View>
      </View>

      <View style={styles.mealInfo}>
        <Text style={styles.mealTitle}>{meal.title}</Text>
        <Text style={styles.mealDescription}>{meal.description}</Text>

        <View style={styles.nutritionRow}>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>C:{meal.nutrition.carbs}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>P:{meal.nutrition.protein}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>F:{meal.nutrition.fats}</Text>
          </View>
          <View style={styles.nutritionItem}>
            <Text style={styles.nutritionValue}>
              Fiber:{meal.nutrition.fiber}
            </Text>
          </View>
        </View>

        <Text style={styles.ingredientsLabel}>Key ingredients:</Text>
        <Text style={styles.ingredientsText}>{meal.ingredients}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MealCard;
