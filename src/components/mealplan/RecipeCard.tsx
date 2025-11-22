// components/RecipeCard.tsx
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { styles } from "../styles/ReceipCardStyles";

interface RecipeCardProps {
  title: string;
  description?: string;
  calories: number | string;
  time?: number | string;
  difficulty?: string;
  imageUrl: string;
  onPress?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({
  title,
  description,
  calories,
  time,
  difficulty,
  imageUrl,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.recipeCard} onPress={onPress}>
      <Image source={{ uri: imageUrl }} style={styles.recipeImage} />
      <View style={styles.recipeContent}>
        <Text style={styles.recipeTitle}>{title}</Text>
        {description && <Text style={styles.recipeDescription}>{description}</Text>}
        <View style={styles.recipeStats}>
          <View style={styles.recipeStat}>
            <Text style={styles.recipeStatValue}>{calories}</Text>
            <Text style={styles.recipeStatLabel}>kcal</Text>
          </View>
          {time && (
            <View style={styles.recipeStat}>
              <Text style={styles.recipeStatValue}>{time}</Text>
              <Text style={styles.recipeStatLabel}>min</Text>
            </View>
          )}
          {difficulty && <Text style={styles.recipeDifficulty}>{difficulty}</Text>}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default RecipeCard;
