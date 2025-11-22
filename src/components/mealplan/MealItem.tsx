// components/MealItem.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "../styles/MealItemStyles";

interface MealItemProps {
  title: string;
  subtitle?: string;
  calories: number | string;
  time?: string;
  color?: string;
  imageUrl: string;
  onPress?: () => void;
}

const MealItem: React.FC<MealItemProps> = ({
  title,
  subtitle,
  calories,
  time,
  color = "#000",
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.mealItem} onPress={onPress}>
      <View style={styles.mealItemLeft}>
        <Image
          source={{ uri: imageUrl }}
          style={[styles.mealImage, { borderColor: color }]}
        />
        <View style={styles.mealDetails}>
          <Text style={styles.mealTitle}>{title}</Text>
          {subtitle && <Text style={styles.mealSubtitle}>{subtitle}</Text>}
          {time && <Text style={styles.mealTime}>{time}</Text>}
        </View>
      </View>
      <View style={styles.mealCalories}>
        <Text style={styles.caloriesText}>{calories}</Text>
        <Text style={styles.caloriesLabel}>kcal</Text>
      </View>
    </TouchableOpacity>
  );
};

export default MealItem;
