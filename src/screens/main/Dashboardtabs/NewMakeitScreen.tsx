import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Image,
} from 'react-native';
import { 
  ChevronRight, 
  Clock, 
  Flame, 
  Activity, 
  Leaf, 
  Check, 
  ChefHat, 
  Utensils 
} from 'lucide-react-native';
import { Colors } from '@/constants/Colors';

const MealPlannerScreen = ({ mealPlan, onFetchMealPlan }) => {
  const [activeScreen, setActiveScreen] = useState('home');
  const [selectedMeal, setSelectedMeal] = useState(null);
  const [selectedMealType, setSelectedMealType] = useState(null);
  const [loading, setLoading] = useState(!mealPlan);
  const [error, setError] = useState(null);
  const [apiMealPlan, setApiMealPlan] = useState(mealPlan);

  useEffect(() => {
    if (!mealPlan && onFetchMealPlan) {
      fetchMealPlanData();
    } else if (mealPlan) {
      setApiMealPlan(mealPlan);
    }
  }, [mealPlan, onFetchMealPlan]);

  const fetchMealPlanData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await onFetchMealPlan();
      if (response && response.data) {
        console.log('Meal plan fetched:', response.data);
        setApiMealPlan(response.data);
      } else {
        throw new Error('Invalid API response format');
      }
    } catch (err) {
      console.error('Error fetching meal plan:', err);
      setError(err.message || 'Failed to load meal plan data');
    } finally {
      setLoading(false);
    }
  };

  // Get nutrition targets from API
  const nutritionTargets = apiMealPlan?.generation_metadata?.nutrition_targets || {
    calories: 0,
    protein_g: 0,
    carbs_g: 0,
    fat_g: 0,
  };

  // Get meals from daily plan
  const breakfastOptions = apiMealPlan?.daily_plan?.breakfast_options || [];
  const lunchOptions = apiMealPlan?.daily_plan?.lunch_options || [];
  const dinnerOptions = apiMealPlan?.daily_plan?.dinner_options || [];

  if (loading) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.loadingText}>Loading meal plan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMealPlanData}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!apiMealPlan) {
    return (
      <View style={styles.centerContent}>
        <Text style={styles.errorText}>No meal plan data available</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMealPlanData}>
          <Text style={styles.retryButtonText}>Load Meal Plan</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Meal Card Component
  const MealCard = ({ title, meal, onPress }) => (
    <TouchableOpacity style={styles.mealCard} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.mealCardContent}>
        <View style={styles.mealCardHeader}>
          <View style={styles.iconContainer}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3075/3075977.png' }}
              style={styles.mealIcon}
              resizeMode="contain"
            />
          </View>
          <View style={styles.mealInfo}>
            <Text style={styles.mealCardTitle}>{title}</Text>
            <Text style={styles.mealCardName}>{meal.name}</Text>
            <View style={styles.mealMeta}>
              <Clock size={12} color="#6B7280" />
              <Text style={styles.metaText}>{meal.prep_time_minutes || 15} min</Text>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.metaText}>{meal.difficulty || 'Easy'}</Text>
            </View>
          </View>
        </View>
        <View style={styles.caloriesContainer}>
          <Flame size={16} color="#f97316" />
          <Text style={styles.caloriesText}>{meal.nutrition?.calories || 0} cal</Text>
        </View>
      </View>
      <ChevronRight size={20} color="#9ca3af" />
    </TouchableOpacity>
  );

  // Home Screen
  const HomeScreen = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Today's Plan</Text>
        <Text style={styles.headerDate}>
          {apiMealPlan?.generation_metadata?.program_name || 'Meal Plan'} - Week{' '}
          {apiMealPlan?.generation_metadata?.week_number || 1}
        </Text>
        <Text style={styles.subtitle}>
          Personalized recommendations based on Health Profile
        </Text>
      </View>

      {/* Daily Target */}
      <View style={styles.section}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Daily Target</Text>
          <View style={styles.targetGrid}>
            <View style={styles.targetItem}>
              <Text style={styles.targetValue}>{nutritionTargets.calories}</Text>
              <Text style={styles.targetLabel}>Calories</Text>
            </View>
            <View style={styles.targetItem}>
              <Text style={[styles.targetValue, styles.proteinText]}>
                {nutritionTargets.protein_g}g
              </Text>
              <Text style={styles.targetLabel}>Protein</Text>
            </View>
            <View style={styles.targetItem}>
              <Text style={[styles.targetValue, styles.carbsText]}>
                {nutritionTargets.carbs_g}g
              </Text>
              <Text style={styles.targetLabel}>Carbs</Text>
            </View>
            <View style={styles.targetItem}>
              <Text style={[styles.targetValue, styles.fatText]}>
                {nutritionTargets.fat_g}g
              </Text>
              <Text style={styles.targetLabel}>Fat</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Meals */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Meals</Text>
        
        {/* Breakfast */}
        {breakfastOptions.length > 0 && (
          <>
            <Text style={styles.mealTypeHeader}>BREAKFAST</Text>
            {breakfastOptions.slice(0, 3).map((meal, index) => (
              <MealCard
                key={`breakfast-${index}`}
                title="Breakfast"
                meal={meal}
                onPress={() => {
                  setSelectedMealType('breakfast');
                  setSelectedMeal(meal);
                  setActiveScreen('mealDetail');
                }}
              />
            ))}
          </>
        )}

        {/* Lunch */}
        {lunchOptions.length > 0 && (
          <>
            <Text style={styles.mealTypeHeader}>LUNCH</Text>
            {lunchOptions.slice(0, 3).map((meal, index) => (
              <MealCard
                key={`lunch-${index}`}
                title="Lunch"
                meal={meal}
                onPress={() => {
                  setSelectedMealType('lunch');
                  setSelectedMeal(meal);
                  setActiveScreen('mealDetail');
                }}
              />
            ))}
          </>
        )}

        {/* Dinner */}
        {dinnerOptions.length > 0 && (
          <>
            <Text style={styles.mealTypeHeader}>DINNER</Text>
            {dinnerOptions.slice(0, 3).map((meal, index) => (
              <MealCard
                key={`dinner-${index}`}
                title="Dinner"
                meal={meal}
                onPress={() => {
                  setSelectedMealType('dinner');
                  setSelectedMeal(meal);
                  setActiveScreen('mealDetail');
                }}
              />
            ))}
          </>
        )}
      </View>
    </ScrollView>
  );

  // Meal Detail Screen
  const MealDetailScreen = () => {
    const nutrition = selectedMeal?.nutrition || {};
    const recipe = selectedMeal?.recipe || {};

    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.detailHeader}>
          <TouchableOpacity onPress={() => setActiveScreen('home')}>
            <Text style={styles.backButton}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.mealType}>{selectedMealType?.toUpperCase()}</Text>
          <Text style={styles.mealName}>{selectedMeal?.name}</Text>
          <Text style={styles.mealDescription}>
            {selectedMeal?.description || recipe?.description || 'A delicious and nutritious meal'}
          </Text>
        </View>

        <View style={styles.section}>
          {/* Quick Stats */}
          <View style={styles.card}>
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Clock size={16} color="#9ca3af" />
                <Text style={styles.statText}>
                  {selectedMeal?.prep_time_minutes || 15} min
                </Text>
              </View>
              <View style={styles.statItem}>
                <Activity size={16} color="#9ca3af" />
                <Text style={styles.statText}>
                  {selectedMeal?.difficulty || 'Easy'}
                </Text>
              </View>
              {selectedMeal?.nutrition_score && (
                <View style={styles.scoreChip}>
                  <Text style={styles.scoreText}>
                    Score: {selectedMeal.nutrition_score}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Macros Card */}
          <View style={styles.card}>
            <View style={styles.cardTitleRow}>
              <Activity size={16} color="#111827" />
              <Text style={styles.cardTitle}>Nutrition Facts</Text>
            </View>
            <View style={styles.macroGrid}>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>{nutrition.calories || 0}</Text>
                <Text style={styles.macroLabel}>Calories</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>
                  {nutrition.fiber_g ? nutrition.fiber_g.toFixed(1) : '0'}g
                </Text>
                <Text style={styles.macroLabel}>Fiber</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={styles.macroValue}>
                  {nutrition.sugar_g ? nutrition.sugar_g.toFixed(1) : '0'}g
                </Text>
                <Text style={styles.macroLabel}>Sugar</Text>
              </View>
            </View>
            <View style={styles.macroGrid}>
              <View style={styles.macroItem}>
                <Text style={[styles.macroValue, styles.proteinText]}>
                  {nutrition.protein_g ? nutrition.protein_g.toFixed(1) : '0'}g
                </Text>
                <Text style={styles.macroLabel}>Protein</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={[styles.macroValue, styles.carbsText]}>
                  {nutrition.carbs_g ? nutrition.carbs_g.toFixed(1) : '0'}g
                </Text>
                <Text style={styles.macroLabel}>Carbs</Text>
              </View>
              <View style={styles.macroItem}>
                <Text style={[styles.macroValue, styles.fatText]}>
                  {nutrition.fat_g ? nutrition.fat_g.toFixed(1) : '0'}g
                </Text>
                <Text style={styles.macroLabel}>Fat</Text>
              </View>
            </View>
          </View>

          {/* Micronutrients Card */}
          {nutrition && (nutrition.vitamin_c_mg || nutrition.vitamin_a_mcg || nutrition.potassium_mg || nutrition.calcium_mg || nutrition.iron_mg) && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Key Vitamins & Minerals</Text>
              <View style={styles.micronutrientList}>
                {nutrition.vitamin_c_mg && (
                  <View style={styles.micronutrientRow}>
                    <Text style={styles.micronutrientLabel}>Vitamin C</Text>
                    <Text style={styles.micronutrientValue}>
                      {nutrition.vitamin_c_mg.toFixed(1)} mg
                    </Text>
                  </View>
                )}
                {nutrition.vitamin_a_mcg && (
                  <View style={styles.micronutrientRow}>
                    <Text style={styles.micronutrientLabel}>Vitamin A</Text>
                    <Text style={styles.micronutrientValue}>
                      {nutrition.vitamin_a_mcg.toFixed(1)} mcg
                    </Text>
                  </View>
                )}
                {nutrition.potassium_mg && (
                  <View style={styles.micronutrientRow}>
                    <Text style={styles.micronutrientLabel}>Potassium</Text>
                    <Text style={styles.micronutrientValue}>
                      {nutrition.potassium_mg.toFixed(1)} mg
                    </Text>
                  </View>
                )}
                {nutrition.calcium_mg && (
                  <View style={styles.micronutrientRow}>
                    <Text style={styles.micronutrientLabel}>Calcium</Text>
                    <Text style={styles.micronutrientValue}>
                      {nutrition.calcium_mg.toFixed(1)} mg
                    </Text>
                  </View>
                )}
                {nutrition.iron_mg && (
                  <View style={styles.micronutrientRow}>
                    <Text style={styles.micronutrientLabel}>Iron</Text>
                    <Text style={styles.micronutrientValue}>
                      {nutrition.iron_mg.toFixed(1)} mg
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Ingredients Card */}
          {recipe?.ingredients_detailed && recipe.ingredients_detailed.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <Leaf size={16} color="#111827" />
                <Text style={styles.cardTitle}>Ingredients</Text>
              </View>
              {recipe.ingredients_detailed.map((item, idx) => (
                <View key={idx} style={styles.ingredientRow}>
                  <View style={styles.checkCircle}>
                    <Check size={12} color="#16a34a" />
                  </View>
                  <View style={styles.ingredientContent}>
                    <Text style={styles.ingredientName}>
                      {item.ingredient}
                    </Text>
                    <Text style={styles.ingredientDetails}>
                      {item.quantity} {item.preparation && `• ${item.preparation}`}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Instructions Card */}
          {recipe?.instructions && recipe.instructions.length > 0 && (
            <View style={styles.card}>
              <View style={styles.cardTitleRow}>
                <ChefHat size={16} color="#111827" />
                <Text style={styles.cardTitle}>Cooking Instructions</Text>
              </View>
              {recipe.instructions.map((step, idx) => (
                <View key={idx} style={styles.instructionRow}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{idx + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{step}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Health Benefits */}
          {selectedMeal?.health_benefits && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Health Benefits</Text>
              <Text style={styles.healthBenefitsText}>{selectedMeal.health_benefits}</Text>
            </View>
          )}

          {/* Action Button */}
          <TouchableOpacity style={styles.actionButton}>
            <Utensils size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Start Cooking</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {activeScreen === 'home' && <HomeScreen />}
      {activeScreen === 'mealDetail' && <MealDetailScreen />}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  headerDate: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  mealTypeHeader: {
    fontSize: 11,
    fontWeight: '700',
    color: '#00C079',
    textTransform: 'uppercase',
    marginTop: 12,
    marginBottom: 8,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  targetGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.gray,
    borderRadius: 20,
    padding: 10,
  },
  targetItem: {
    alignItems: 'center',
    flex: 1,
  },
  targetValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
  },
  targetLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  proteinText: {
    color: '#3b82f6',
  },
  carbsText: {
    color: '#16a34a',
  },
  fatText: {
    color: '#f97316',
  },
  mealCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.gray200,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  mealCardContent: {
    flex: 1,
  },
  mealCardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
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
  mealIcon: {
    width: 24,
    height: 24,
  },
  mealInfo: {
    flex: 1,
  },
  mealCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6b7280',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  mealCardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  mealMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  separator: {
    fontSize: 13,
    color: '#6B7280',
    marginHorizontal: 4,
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  caloriesText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  detailHeader: {
    backgroundColor: '#ffffff',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  backButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
    marginBottom: 12,
  },
  mealType: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  mealDescription: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statText: {
    fontSize: 14,
    color: '#4b5563',
  },
  scoreChip: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#15803d',
  },
  macroGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  macroItem: {
    flex: 1,
    alignItems: 'center',
  },
  macroValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  macroLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  micronutrientList: {
    gap: 12,
  },
  micronutrientRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  micronutrientLabel: {
    fontSize: 14,
    color: '#4b5563',
  },
  micronutrientValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  ingredientRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  ingredientContent: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  ingredientDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  instructionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#dbeafe',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563eb',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    paddingTop: 2,
  },
  healthBenefitsText: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default MealPlannerScreen;