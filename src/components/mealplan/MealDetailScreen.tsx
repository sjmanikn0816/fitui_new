import React from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Clock, Activity, Leaf, Check, ChefHat, Flame } from "lucide-react-native";
import { Meal } from "@/types/types";
import { Colors } from "@/constants/Colors";

interface MealDetailScreenProps {
  meal: Meal;
  mealType: string;
  onBack: () => void;
}

const MealDetailScreen: React.FC<MealDetailScreenProps> = ({ meal, mealType, onBack }) => {
  const nutrition = meal.nutrition || {};
  const recipe = meal.recipe || {};
console.log(nutrition)
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Enhanced Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButtonContainer}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <View style={styles.mealBadge}>
          <Text style={styles.mealType}>{mealType.toUpperCase()}</Text>
        </View>
        <Text style={styles.mealName}>{meal.name}</Text>
        <Text style={styles.mealDescription}>
          {meal.description || recipe.description || "A delicious and nutritious meal"}
        </Text>
      </View>

      {/* Enhanced Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Clock size={20} color="#3b82f6" />
          </View>
          <Text style={styles.statValue}>{meal.prep_time_minutes || 15}</Text>
          <Text style={styles.statLabel}>minutes</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Activity size={20} color="#8b5cf6" />
          </View>
          <Text style={styles.statValue}>{meal.difficulty || "Easy"}</Text>
          <Text style={styles.statLabel}>difficulty</Text>
        </View>
        <View style={styles.statCard}>
          <View style={styles.statIconContainer}>
            <Flame size={20} color="#ef4444" />
          </View>
          <Text style={styles.statValue}>{nutrition.calories?.toFixed(0) || "0"}</Text>
          <Text style={styles.statLabel}>calories</Text>
        </View>
      </View>

           <View style={styles.card}>
                <View style={styles.cardHeader}>
      <View style={styles.cardIconContainer}>
        <Activity size={18} color="#0ea5e9" />
      </View>
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

      {/* Enhanced Nutrition Facts */}
      {/* <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.cardIconContainer}>
            <Activity size={18} color="#3b82f6" />
          </View>
          <Text style={styles.cardTitle}>Nutrition Facts</Text>
        </View>

        <View style={styles.macroGrid}>
          <View style={styles.macroRow}>
            <MacroItem label="Protein" value={nutrition.protein_g} unit="g" color="#3b82f6" />
            <MacroItem label="Carbs" value={nutrition.carbs_g} unit="g" color="#f59e0b" />
          </View>
          <View style={styles.macroRow}>
            <MacroItem label="Fat" value={nutrition.fat_g} unit="g" color="#ef4444" />
            <MacroItem label="Fiber" value={nutrition.fiber_g} unit="g" color="#10b981" />
          </View>
          <View style={styles.macroRow}>
            <MacroItem label="Sugar" value={nutrition.sugar_g} unit="g" color="#8b5cf6" />
          </View>
        </View>
      </View> */}


{/* Key Vitamins & Minerals */}
{nutrition && (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <View style={styles.cardIconContainer}>
        <Activity size={18} color="#0ea5e9" />
      </View>
      <Text style={styles.cardTitle}>Key Vitamins & Minerals</Text>
    </View>

    <View style={styles.micronutrientList}>
      <View style={styles.micronutrientRow}>
        <Text style={styles.micronutrientLabel}>Vitamin C</Text>
        <Text style={styles.micronutrientValue}>
          {nutrition.vitamin_c_mg} mg
        </Text>
      </View>
      <View style={styles.micronutrientRow}>
        <Text style={styles.micronutrientLabel}>Vitamin A</Text>
        <Text style={styles.micronutrientValue}>
          {nutrition.vitamin_a_mcg?.toFixed(1) || 0} mcg
        </Text>
      </View>
      <View style={styles.micronutrientRow}>
        <Text style={styles.micronutrientLabel}>Potassium</Text>
        <Text style={styles.micronutrientValue}>
          {nutrition.potassium_mg?.toFixed(1) || 0} mg
        </Text>
      </View>
      <View style={styles.micronutrientRow}>
        <Text style={styles.micronutrientLabel}>Calcium</Text>
        <Text style={styles.micronutrientValue}>
          {nutrition.calcium_mg?.toFixed(1) || 0} mg
        </Text>
      </View>
      <View style={styles.micronutrientRow}>
        <Text style={styles.micronutrientLabel}>Iron</Text>
        <Text style={styles.micronutrientValue}>
          {nutrition.iron_mg?.toFixed(1) || 0} mg
        </Text>
      </View>
    </View>
  </View>
)}

      {/* Enhanced Ingredients */}
      {recipe.ingredients_detailed && recipe.ingredients_detailed.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Leaf size={18} color="#10b981" />
            </View>
            <Text style={styles.cardTitle}>Ingredients</Text>
          </View>
          <View style={styles.ingredientsContainer}>
            {recipe.ingredients_detailed.map((item, idx) => (
              <View key={idx} style={styles.ingredientRow}>
                <View style={styles.checkCircle}>
                  <Check size={14} color="#ffffff" />
                </View>
                <View style={styles.ingredientContent}>
                  <Text style={styles.ingredientName}>{item.ingredient}</Text>
                  <Text style={styles.ingredientDetails}>
                    {item.quantity} {item.preparation && `• ${item.preparation}`}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Enhanced Cooking Instructions */}
      {recipe.instructions && recipe.instructions.length > 0 && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <ChefHat size={18} color="#f59e0b" />
            </View>
            <Text style={styles.cardTitle}>Cooking Instructions</Text>
          </View>
          <View style={styles.instructionsContainer}>
            {recipe.instructions.map((step, idx) => (
              <View key={idx} style={styles.instructionRow}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{idx + 1}</Text>
                </View>
                <View style={styles.instructionContent}>
                  <Text style={styles.instructionText}>{step}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Enhanced Health Benefits */}
      {meal.health_benefits && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.cardIconContainer}>
              <Activity size={18} color="#10b981" />
            </View>
            <Text style={styles.cardTitle}>Health Benefits</Text>
          </View>
          <View style={styles.healthBenefitsContainer}>
            <Text style={styles.healthBenefitsText}>{meal.health_benefits}</Text>
          </View>
        </View>
      )}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

const MacroItem = ({ label, value, unit, color }: { label: string; value?: number; unit?: string; color: string }) => (
  <View style={styles.macroItem}>
    <View style={[styles.macroIndicator, { backgroundColor: color }]} />
    <View style={styles.macroContent}>
      <Text style={styles.macroValue}>{value?.toFixed(1) || "0"}{unit}</Text>
      <Text style={styles.macroLabel}>{label}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.white,
  },
  header: { 
    padding: 24, 
    backgroundColor: "#ffffff",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  backButtonContainer: {
    marginBottom: 16,
  },
  backButton: { 
    fontSize: 15, 
    color: "#3b82f6", 
    fontWeight: "600" 
  },
  mealBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginBottom: 12,
  },
  mealType: { 
    fontSize: 12, 
    color: "#3b82f6", 
    fontWeight: "700",
    letterSpacing: 1,
  },
  mealName: { 
    fontSize: 26, 
    fontWeight: "bold", 
    marginBottom: 8,
    color: "#0f172a",
    lineHeight: 32,
  },
  mealDescription: { 
    fontSize: 15, 
    color: "#64748b", 
    lineHeight: 22 
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconContainer: {
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  card: { 
    backgroundColor: "#ffffff", 
    borderRadius: 20, 
    padding: 20, 
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  cardIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f8fafc",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  cardTitle: { 
    fontSize: 17, 
    fontWeight: "700", 
    color: "#0f172a",
    letterSpacing: -0.3,
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
  ingredientsContainer: {
    gap: 4,
  },
  ingredientRow: { 
    flexDirection: "row", 
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  checkCircle: { 
    width: 24, 
    height: 24, 
    borderRadius: 12, 
    backgroundColor: "#10b981", 
    alignItems: "center", 
    justifyContent: "center", 
    marginRight: 12,
    marginTop: 2,
  },
  ingredientContent: { 
    flex: 1 
  },
  ingredientName: { 
    fontSize: 15, 
    fontWeight: "600", 
    color: "#0f172a",
    marginBottom: 4,
  },
  ingredientDetails: { 
    fontSize: 13, 
    color: "#64748b" 
  },
  instructionsContainer: {
    gap: 4,
  },
  instructionRow: { 
    flexDirection: "row", 
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  stepNumber: { 
    width: 32, 
    height: 32, 
    borderRadius: 16, 
    backgroundColor: "#dbeafe", 
    alignItems: "center", 
    justifyContent: "center", 
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: { 
    fontSize: 14, 
    fontWeight: "700", 
    color: "#2563eb" 
  },
  instructionContent: {
    flex: 1,
  },
  instructionText: { 
    fontSize: 15, 
    color: "#334155",
    lineHeight: 22,
  },
  healthBenefitsContainer: {
    backgroundColor: "#f0fdf4",
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
  },
  healthBenefitsText: { 
    fontSize: 15, 
    color: "#166534",
    lineHeight: 22,
  },
  bottomSpacer: {
    height: 24,
  },

});

export default MealDetailScreen;