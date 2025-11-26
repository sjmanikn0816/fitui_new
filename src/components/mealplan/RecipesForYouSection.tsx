import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

const RecipesForYouSection = ({ mealPlan, onViewAll, onRecipePress, showAll }) => {
  const RecipeCard = ({ recipe, onPress }) => (
    <TouchableOpacity 
      style={styles.recipeCard} 
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.recipeContent}>
        <View style={styles.recipeHeader}>
<View style={styles.iconContainer}>
  <Image
    source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' }} // meal/food icon
    style={styles.recipeIconImage}
    resizeMode="contain"
  />
</View>
          <View style={styles.headerRight}>
            <View style={styles.titleRow}>
              <Text style={styles.recipeTitle}>{recipe.name}</Text>
              <View style={styles.caloriesContainer}>
                <Text style={styles.caloriesNumber}>{recipe.nutrition?.calories || 0}</Text>
                <Text style={styles.caloriesLabel}>cal</Text>
              </View>
            </View>
            <View style={styles.metaRow}>
              <View style={styles.timeContainer}>
                <Text style={styles.timeIcon}>⏰</Text>
                <Text style={styles.timeText}>{recipe.prep_time_minutes || 10} min</Text>
                <Text style={styles.separator}>•</Text>
                <Text style={styles.difficultyText}>{recipe.difficulty || 'easy'}</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.recipeDescription}>
          {recipe.description || "Perfect for managing blood sugar levels"}
        </Text>

        <View style={styles.tagContainer}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryText}>{recipe.meal_type || 'breakfast'}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Helper function: pick all recipes or just 1 based on toggle
  const renderRecipes = (options, mealType) => {
    if (!options) return null;
    const recipes = showAll ? options : options.slice(0, 1);
    return recipes.map((recipe, index) => (
      <RecipeCard
        key={`recipe-${mealType}-${index}`}
        recipe={{
          name: recipe.name,
          nutrition: recipe.nutrition,
          prep_time_minutes: recipe.prep_time_minutes,
          difficulty: recipe.difficulty,
          description: recipe.description,
          meal_type: mealType,
        }}
        onPress={() => onRecipePress(recipe)}
      />
    ));
  };

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recipes for You</Text>
        <TouchableOpacity 
          style={styles.viewAllButton} 
          onPress={onViewAll}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>
            {showAll ? "Show Less" : "View All"}
          </Text>
        </TouchableOpacity>
      </View>

      {renderRecipes(mealPlan?.daily_plan?.breakfast_options, "breakfast")}
      {renderRecipes(mealPlan?.daily_plan?.lunch_options, "lunch")}
      {renderRecipes(mealPlan?.daily_plan?.dinner_options, "dinner")}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },
  viewAllButton: {
    backgroundColor: '#E0FDF4',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  viewAllText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  recipeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth:1,
    borderColor:Colors.gray200,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  recipeContent: {
    padding: 16,
  },
  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  recipeIcon: {
    fontSize: 20,
  },
  headerRight: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
    marginRight: 12,
  },
  caloriesContainer: {
    alignItems: 'flex-end',
  },
  caloriesNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10B981',
  },
  caloriesLabel: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  timeText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  separator: {
    fontSize: 13,
    color: '#6B7280',
    marginHorizontal: 6,
  },
  difficultyText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
//   iconContainer: {
//   width: 40,
//   height: 40,
//   borderRadius: 20,
//   backgroundColor: '#F3F4F6',
//   justifyContent: 'center',
//   alignItems: 'center',
// },
recipeIconImage: {
  width: 24,
  height: 24,
},
  recipeDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 16,
  },
  tagContainer: {
    flexDirection: 'row',
  },
  categoryTag: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  categoryText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
});

export default RecipesForYouSection;