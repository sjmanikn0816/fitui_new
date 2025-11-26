// HomeScreen.tsx - Meal plan display with HealthTrackMonitorScreen-style header
import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Meal, MealPlan } from "@/types/types";
import NutritionTargets from "./NutritionTargets";
import MedicalBanner from "./AiRecomendationBanner";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

interface HomeScreenProps {
  mealPlan: MealPlan;
  planType: "daily" | "weekly" | "monthly";
  onSelectMeal: (type: string, meal: Meal) => void;
  suggestionData?: any;
}

// Meal type configurations
const MEAL_CONFIG = {
  Breakfast: {
    icon: "sunny-outline" as const,
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
    time: "7:00 - 9:00 AM",
  },
  Lunch: {
    icon: "partly-sunny-outline" as const,
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
    time: "12:00 - 2:00 PM",
  },
  Dinner: {
    icon: "moon-outline" as const,
    color: "#8B5CF6",
    bgColor: "rgba(139, 92, 246, 0.1)",
    time: "6:00 - 8:00 PM",
  },
  Snack: {
    icon: "cafe-outline" as const,
    color: "#EC4899",
    bgColor: "rgba(236, 72, 153, 0.1)",
    time: "Anytime",
  },
};

const HomeScreen: React.FC<HomeScreenProps> = ({
  mealPlan,
  planType,
  onSelectMeal,
  suggestionData,
}) => {
  const plan = mealPlan ? (mealPlan[`${planType}_plan`] as any) : null;
  const navigation = useNavigation();

  // Empty refresh handler - placeholder for future
  const handleRefresh = () => {
    console.log("Refresh pressed");
  };

  const handleMenuPress = () => {
    navigation.navigate("AllScreensMenu");
  };

  // Calculate total nutrition from all meals
  const calculateTotalNutrition = () => {
    const meals = [
      ...(plan?.breakfast_options || suggestionData?.breakfast_options || []),
      ...(plan?.lunch_options || suggestionData?.lunch_options || []),
      ...(plan?.dinner_options || suggestionData?.dinner_options || []),
    ];

    return {
      calories: meals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0),
      protein: meals.reduce((sum, m) => sum + (m.nutrition?.protein || 0), 0),
      carbs: meals.reduce((sum, m) => sum + (m.nutrition?.carbs || 0), 0),
      fat: meals.reduce((sum, m) => sum + (m.nutrition?.fat || 0), 0),
    };
  };

  const totalNutrition = calculateTotalNutrition();

  const groupByWeek = (dailyPlans: any[]) => {
    const weeks: any[] = [];
    let currentWeek: any[] = [];
    let weekStartDate = dailyPlans[0]?.date;

    dailyPlans.forEach((dayPlan, index) => {
      currentWeek.push(dayPlan);
      if ((index + 1) % 7 === 0 || index === dailyPlans.length - 1) {
        weeks.push({
          weekNumber: weeks.length + 1,
          startDate: weekStartDate,
          endDate: dayPlan.date,
          days: currentWeek,
        });
        currentWeek = [];
        weekStartDate = dailyPlans[index + 1]?.date;
      }
    });
    return weeks;
  };

  // Single Meal Item Component
  const MealItem = ({ meal, type, index }: { meal: Meal; type: string; index: number }) => {
    const config = MEAL_CONFIG[type as keyof typeof MEAL_CONFIG] || MEAL_CONFIG.Lunch;

    return (
      <TouchableOpacity
        style={styles.mealItem}
        onPress={() => onSelectMeal(type, meal)}
        activeOpacity={0.7}
      >
        <View style={[styles.mealItemIndex, { backgroundColor: config.bgColor }]}>
          <Text style={[styles.mealItemIndexText, { color: config.color }]}>
            {index + 1}
          </Text>
        </View>
        <View style={styles.mealItemContent}>
          <Text style={styles.mealItemName} numberOfLines={1}>{meal.name}</Text>
          <View style={styles.mealItemMeta}>
            <Ionicons name="time-outline" size={12} color="#9CA3AF" />
            <Text style={styles.mealItemMetaText}>{meal.prep_time_minutes || 15} min</Text>
            <View style={styles.metaDot} />
            <Text style={styles.mealItemMetaText}>{meal.difficulty || "Easy"}</Text>
          </View>
        </View>
        <View style={styles.mealItemCalories}>
          <Text style={styles.calorieValue}>{meal.nutrition?.calories || 0}</Text>
          <Text style={styles.calorieUnit}>kcal</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
      </TouchableOpacity>
    );
  };

  // Meal Section Component
  const MealSection = ({ type, meals }: { type: string; meals: Meal[] }) => {
    const config = MEAL_CONFIG[type as keyof typeof MEAL_CONFIG] || MEAL_CONFIG.Lunch;

    return (
      <View style={styles.mealSection}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderLeft}>
            <View style={[styles.sectionIcon, { backgroundColor: config.bgColor }]}>
              <Ionicons name={config.icon} size={18} color={config.color} />
            </View>
            <View>
              <Text style={styles.sectionTitle}>{type}</Text>
              <Text style={styles.sectionTime}>{config.time}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh}>
            <Ionicons name="refresh" size={16} color={config.color} />
          </TouchableOpacity>
        </View>

        {meals.map((meal, idx) => (
          <MealItem key={`${type}-${idx}`} meal={meal} type={type} index={idx} />
        ))}

        <View style={styles.sectionFooter}>
          <View style={styles.footerStat}>
            <Ionicons name="flame-outline" size={14} color="#F59E0B" />
            <Text style={styles.footerStatText}>
              {meals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0)} kcal
            </Text>
          </View>
          <View style={styles.footerStat}>
            <MaterialCommunityIcons name="food-drumstick-outline" size={14} color="#10B981" />
            <Text style={styles.footerStatText}>
              {meals.reduce((sum, m) => sum + (m.nutrition?.protein || 0), 0)}g protein
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderWeeklyPlan = () => {
    if (!plan?.daily_plans) return null;
    const weeks = groupByWeek(plan.daily_plans);

    return (
      <View>
        {plan?.daily_nutrition_target && !suggestionData && (
          <View style={styles.nutritionTargetContainer}>
            <NutritionTargets nutritionTargets={plan.daily_nutrition_target} />
          </View>
        )}

        {weeks.map((week, weekIdx) => (
          <View key={`week-${weekIdx}`} style={styles.weekBlock}>
            <View style={styles.weekHeaderBar}>
              <MaterialCommunityIcons name="calendar-week" size={18} color="#fff" />
              <Text style={styles.weekHeaderText}>
                Week {week.weekNumber} • {new Date(week.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} - {new Date(week.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </Text>
            </View>

            {week.days.map((dayPlan: any, dayIdx: number) => (
              <View key={dayIdx} style={styles.dayBlock}>
                <View style={styles.dayHeaderRow}>
                  <View style={styles.dayIndicator} />
                  <Text style={styles.dayTitle}>
                    {new Date(dayPlan.date).toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" })}
                  </Text>
                </View>
                {dayPlan.breakfast_options?.length > 0 && <MealSection type="Breakfast" meals={dayPlan.breakfast_options} />}
                {dayPlan.lunch_options?.length > 0 && <MealSection type="Lunch" meals={dayPlan.lunch_options} />}
                {dayPlan.dinner_options?.length > 0 && <MealSection type="Dinner" meals={dayPlan.dinner_options} />}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  const activePlan = suggestionData || plan;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header - HealthTrackMonitorScreen Style */}
      <View style={styles.headerCard}>
        <ImageBackground
          source={{ uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80" }}
          style={styles.headerImageBg}
          imageStyle={styles.headerImageStyle}
        >
          <LinearGradient
            colors={["rgba(16, 185, 129, 0.93)", "rgba(5, 150, 105, 0.90)"]}
            style={styles.headerOverlay}
          >
            <View style={styles.headerTopRow}>
              <View>
                <Text style={styles.headerTitle}>
                  {planType === "weekly" ? "Weekly Plan" : "Today's Meals"}
                </Text>
                <Text style={styles.headerSubtitle}>
                  {planType === "weekly"
                    ? "Your meal schedule for the week"
                    : new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
                  }
                </Text>
              </View>

              <View style={styles.headerActions}>
                <TouchableOpacity style={styles.headerBtn} onPress={handleRefresh}>
                  <Ionicons name="refresh" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.navigate("MealPlanEmail", { mealPlan })}>
                  <Ionicons name="share-outline" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.headerBtn} onPress={handleMenuPress}>
                  <Ionicons name="ellipsis-horizontal" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Nutrition Summary Row */}
            <View style={styles.headerInfoRow}>
              <View style={styles.headerInfoItem}>
                <Text style={styles.headerInfoLabel}>Calories</Text>
                <Text style={styles.headerInfoValue}>{totalNutrition.calories}</Text>
              </View>
              <View style={styles.headerInfoItem}>
                <Text style={styles.headerInfoLabel}>Protein</Text>
                <Text style={styles.headerInfoValue}>{totalNutrition.protein}g</Text>
              </View>
              <View style={styles.headerInfoItem}>
                <Text style={styles.headerInfoLabel}>Carbs</Text>
                <Text style={styles.headerInfoValue}>{totalNutrition.carbs}g</Text>
              </View>
              <View style={styles.headerInfoItem}>
                <Text style={styles.headerInfoLabel}>Fat</Text>
                <Text style={styles.headerInfoValue}>{totalNutrition.fat}g</Text>
              </View>
            </View>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Nutrition Targets Card */}
      {activePlan?.daily_nutrition_target && planType === "daily" && (
        <View style={styles.nutritionTargetContainer}>
          <NutritionTargets nutritionTargets={activePlan.daily_nutrition_target} />
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {planType === "weekly" ? (
          renderWeeklyPlan()
        ) : (
          <>
            {activePlan?.breakfast_options?.length > 0 && (
              <MealSection type="Breakfast" meals={activePlan.breakfast_options} />
            )}
            {activePlan?.lunch_options?.length > 0 && (
              <MealSection type="Lunch" meals={activePlan.lunch_options} />
            )}
            {activePlan?.dinner_options?.length > 0 && (
              <MealSection type="Dinner" meals={activePlan.dinner_options} />
            )}
          </>
        )}
      </View>

      <View style={styles.bannerContainer}>
        <MedicalBanner />
      </View>
      <View style={{ height: 24 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  // Header - HealthTrackMonitorScreen Style
  headerCard: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  headerImageBg: {
    width: "100%",
  },
  headerImageStyle: {
    borderRadius: 16,
  },
  headerOverlay: {
    padding: 16,
    borderRadius: 16,
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: 8,
  },
  headerBtn: {
    padding: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.25)",
  },
  headerInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 12,
    padding: 12,
  },
  headerInfoItem: {
    alignItems: "center",
  },
  headerInfoLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.85)",
    marginBottom: 2,
  },
  headerInfoValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.2)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },

  // Content
  content: {
    paddingHorizontal: 16,
  },
  nutritionTargetContainer: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },

  // Meal Section
  mealSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  sectionTime: {
    fontSize: 12,
    color: "#9CA3AF",
    marginTop: 1,
  },
  refreshBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },

  // Meal Item
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  mealItemIndex: {
    width: 28,
    height: 28,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  mealItemIndexText: {
    fontSize: 13,
    fontWeight: "700",
  },
  mealItemContent: {
    flex: 1,
  },
  mealItemName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 3,
  },
  mealItemMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  mealItemMetaText: {
    fontSize: 12,
    color: "#9CA3AF",
    marginLeft: 4,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 8,
  },
  mealItemCalories: {
    alignItems: "flex-end",
    marginRight: 8,
  },
  calorieValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#F59E0B",
  },
  calorieUnit: {
    fontSize: 10,
    color: "#9CA3AF",
  },

  // Section Footer
  sectionFooter: {
    flexDirection: "row",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#F9FAFB",
  },
  footerStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerStatText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
    fontWeight: "500",
  },

  // Weekly Styles
  weekBlock: {
    marginBottom: 20,
  },
  weekHeaderBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10B981",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  weekHeaderText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  dayBlock: {
    marginBottom: 12,
  },
  dayHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  dayIndicator: {
    width: 4,
    height: 18,
    backgroundColor: "#10B981",
    borderRadius: 2,
    marginRight: 10,
  },
  dayTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151",
  },
});

export default HomeScreen;
