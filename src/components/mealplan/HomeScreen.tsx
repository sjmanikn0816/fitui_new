// HomeScreen.tsx - Clean competitive nutrition app design with refresh functionality
import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Meal, MealPlan } from "@/types/types";
import NutritionTargets from "./NutritionTargets";
import { Colors } from "@/constants/Colors";
import MedicalBanner from "./AiRecomendationBanner";
import { useNavigation } from "@react-navigation/native";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { fetchMealPlanSimple } from "@/redux/slice/mealPlanSlice";

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
  const [refreshingSection, setRefreshingSection] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const plan = mealPlan ? (mealPlan[`${planType}_plan`] as any) : null;
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.mealPlan);
  const userProfile = useAppSelector((state) => state.auth.user);

  // Refresh handler for a specific meal section
  const handleRefreshMeal = useCallback(async (mealType: string) => {
    setRefreshingSection(mealType);
    try {
      const payload = {
        health_goals: userProfile?.healthGoals || ["general_wellness"],
        dietary_restrictions: userProfile?.dietaryRestrictions || [],
        allergies: userProfile?.allergies || [],
        cuisine_preferences: userProfile?.cuisinePreferences || [],
        plan_type: planType,
        target_daily_calories: userProfile?.targetCalories || 2000,
      };
      await dispatch(fetchMealPlanSimple(payload));
    } catch (error) {
      console.error("Error refreshing meal:", error);
    } finally {
      setRefreshingSection(null);
    }
  }, [dispatch, planType, userProfile]);

  // Pull to refresh handler
  const handlePullRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const payload = {
        health_goals: userProfile?.healthGoals || ["general_wellness"],
        dietary_restrictions: userProfile?.dietaryRestrictions || [],
        allergies: userProfile?.allergies || [],
        cuisine_preferences: userProfile?.cuisinePreferences || [],
        plan_type: planType,
        target_daily_calories: userProfile?.targetCalories || 2000,
      };
      await dispatch(fetchMealPlanSimple(payload));
    } catch (error) {
      console.error("Error refreshing:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [dispatch, planType, userProfile]);

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

  // Single Meal Item Component - Clean design
  const MealItem = ({ meal, type, index }: { meal: Meal; type: string; index: number }) => {
    const config = MEAL_CONFIG[type as keyof typeof MEAL_CONFIG] || MEAL_CONFIG.Lunch;

    return (
      <TouchableOpacity
        style={styles.mealItem}
        onPress={() => onSelectMeal(type, meal)}
        activeOpacity={0.7}
      >
        <View style={styles.mealItemLeft}>
          <View style={[styles.mealItemIndex, { backgroundColor: config.bgColor }]}>
            <Text style={[styles.mealItemIndexText, { color: config.color }]}>
              {index + 1}
            </Text>
          </View>
          <View style={styles.mealItemInfo}>
            <Text style={styles.mealItemName} numberOfLines={1}>
              {meal.name}
            </Text>
            <View style={styles.mealItemMeta}>
              <Ionicons name="time-outline" size={12} color="#9CA3AF" />
              <Text style={styles.mealItemMetaText}>
                {meal.prep_time_minutes || 15} min
              </Text>
              <View style={styles.metaDot} />
              <Text style={styles.mealItemMetaText}>
                {meal.difficulty || "Easy"}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.mealItemRight}>
          <View style={styles.nutritionBadge}>
            <Text style={styles.nutritionValue}>
              {meal.nutrition?.calories || 0}
            </Text>
            <Text style={styles.nutritionUnit}>kcal</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
        </View>
      </TouchableOpacity>
    );
  };

  // Meal Section Component - Clean design with refresh
  const MealSection = ({
    type,
    meals,
    showRefresh = true,
  }: {
    type: string;
    meals: Meal[];
    showRefresh?: boolean;
  }) => {
    const config = MEAL_CONFIG[type as keyof typeof MEAL_CONFIG] || MEAL_CONFIG.Lunch;
    const isRefreshingThis = refreshingSection === type;

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
          {showRefresh && (
            <TouchableOpacity
              style={styles.refreshButton}
              onPress={() => handleRefreshMeal(type)}
              disabled={isRefreshingThis || loading}
            >
              {isRefreshingThis ? (
                <ActivityIndicator size="small" color={config.color} />
              ) : (
                <Ionicons name="refresh" size={18} color={config.color} />
              )}
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.mealList}>
          {meals.map((meal, idx) => (
            <MealItem key={`${type}-${idx}`} meal={meal} type={type} index={idx} />
          ))}
        </View>

        {/* Quick nutrition summary */}
        <View style={styles.sectionFooter}>
          <View style={styles.quickStat}>
            <Ionicons name="flame-outline" size={14} color="#F59E0B" />
            <Text style={styles.quickStatText}>
              {meals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0)} kcal total
            </Text>
          </View>
          <View style={styles.quickStat}>
            <MaterialCommunityIcons name="food-drumstick-outline" size={14} color="#10B981" />
            <Text style={styles.quickStatText}>
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
          <View style={styles.nutritionContainer}>
            <NutritionTargets nutritionTargets={plan.daily_nutrition_target} />
          </View>
        )}

        {weeks.map((week, weekIdx) => (
          <View key={`week-${weekIdx}`} style={styles.weekContainer}>
            <View style={styles.weekHeader}>
              <MaterialCommunityIcons name="calendar-week" size={18} color="#3B82F6" />
              <Text style={styles.weekHeaderText}>
                Week {week.weekNumber} • {new Date(week.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} - {new Date(week.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </View>

            {week.days.map((dayPlan: any, dayIdx: number) => (
              <View key={dayIdx} style={styles.dayContainer}>
                <View style={styles.dayHeader}>
                  <View style={styles.dayIndicator} />
                  <Text style={styles.dayTitle}>
                    {new Date(dayPlan.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>

                {dayPlan.breakfast_options?.length > 0 && (
                  <MealSection type="Breakfast" meals={dayPlan.breakfast_options} />
                )}
                {dayPlan.lunch_options?.length > 0 && (
                  <MealSection type="Lunch" meals={dayPlan.lunch_options} />
                )}
                {dayPlan.dinner_options?.length > 0 && (
                  <MealSection type="Dinner" meals={dayPlan.dinner_options} />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  // Share Button
  const ShareButton = () => (
    <TouchableOpacity
      style={styles.shareButton}
      onPress={() => navigation.navigate("MealPlanEmail", { mealPlan })}
    >
      <Ionicons name="share-outline" size={18} color="#3B82F6" />
    </TouchableOpacity>
  );

  // Header Component
  const Header = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        <Text style={styles.headerTitle}>{title}</Text>
        {subtitle && <Text style={styles.headerSubtitle}>{subtitle}</Text>}
      </View>
      <View style={styles.headerRight}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={handlePullRefresh}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <ActivityIndicator size="small" color="#3B82F6" />
          ) : (
            <Ionicons name="refresh" size={20} color="#3B82F6" />
          )}
        </TouchableOpacity>
        <ShareButton />
      </View>
    </View>
  );

  // AI Suggestion Screen
  if (suggestionData) {
    return (
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={handlePullRefresh} />
        }
      >
        <Header
          title="Today's Plan"
          subtitle={new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        />

        <View style={styles.content}>
          {suggestionData.breakfast_options?.length > 0 && (
            <MealSection type="Breakfast" meals={suggestionData.breakfast_options} />
          )}
          {suggestionData.lunch_options?.length > 0 && (
            <MealSection type="Lunch" meals={suggestionData.lunch_options} />
          )}
          {suggestionData.dinner_options?.length > 0 && (
            <MealSection type="Dinner" meals={suggestionData.dinner_options} />
          )}
        </View>

        <View style={styles.bannerContainer}>
          <MedicalBanner />
        </View>
      </ScrollView>
    );
  }

  // Normal Plan Rendering
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={handlePullRefresh} />
      }
    >
      {planType === "daily" && (
        <>
          <Header
            title="Today's Plan"
            subtitle={new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          />

          {plan?.daily_nutrition_target && !suggestionData && (
            <View style={styles.nutritionContainer}>
              <NutritionTargets nutritionTargets={plan.daily_nutrition_target} />
            </View>
          )}
        </>
      )}

      {planType === "weekly" && <Header title="Weekly Plan" />}

      <View style={styles.content}>
        {planType === "weekly"
          ? renderWeeklyPlan()
          : plan && (
              <>
                {plan.breakfast_options?.length > 0 && (
                  <MealSection type="Breakfast" meals={plan.breakfast_options} />
                )}
                {plan.lunch_options?.length > 0 && (
                  <MealSection type="Lunch" meals={plan.lunch_options} />
                )}
                {plan.dinner_options?.length > 0 && (
                  <MealSection type="Dinner" meals={plan.dinner_options} />
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
    backgroundColor: "#F9FAFB",
  },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },

  // Content
  content: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  nutritionContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },

  // Meal Section
  mealSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginBottom: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#F3F4F6",
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
  refreshButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
  },

  // Meal List
  mealList: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  // Meal Item
  mealItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F9FAFB",
  },
  mealItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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
  mealItemInfo: {
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
  mealItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  nutritionBadge: {
    flexDirection: "row",
    alignItems: "baseline",
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    marginRight: 8,
  },
  nutritionValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#D97706",
  },
  nutritionUnit: {
    fontSize: 10,
    color: "#D97706",
    marginLeft: 2,
  },

  // Section Footer
  sectionFooter: {
    flexDirection: "row",
    justifyContent: "flex-start",
    gap: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#F9FAFB",
    borderTopWidth: 1,
    borderTopColor: "#F3F4F6",
  },
  quickStat: {
    flexDirection: "row",
    alignItems: "center",
  },
  quickStatText: {
    fontSize: 12,
    color: "#6B7280",
    marginLeft: 4,
    fontWeight: "500",
  },

  // Weekly Styles
  weekContainer: {
    marginBottom: 20,
  },
  weekHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 4,
    paddingVertical: 12,
  },
  weekHeaderText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#3B82F6",
    marginLeft: 8,
  },
  dayContainer: {
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginBottom: 8,
  },
  dayIndicator: {
    width: 4,
    height: 18,
    backgroundColor: "#3B82F6",
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
