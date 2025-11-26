// HomeScreen.tsx - Redesigned with advanced dark mode styling consistent with HealthTrackMonitorScreen
import React, { useState } from "react";
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
import MealCard from "./MealCard";
import { Meal, MealPlan } from "@/types/types";
import NutritionTargets from "./NutritionTargets";
import { Colors } from "@/constants/Colors";
import MedicalBanner from "./AiRecomendationBanner";
import { useNavigation } from "@react-navigation/native";

const { width: screenWidth } = Dimensions.get("window");

// Advanced color palette matching HealthTrackMonitorScreen
const CARD_COLORS = {
  // Breakfast - Orange/Amber
  breakfastPrimary: "#FB923C",
  breakfastSecondary: "#FBBF24",
  breakfastGlow: "rgba(251, 146, 60, 0.4)",
  breakfastBg: ["#7c2d12", "#b45309"] as [string, string],

  // Lunch - Green/Teal
  lunchPrimary: "#34D399",
  lunchSecondary: "#5EEAD4",
  lunchGlow: "rgba(52, 211, 153, 0.4)",
  lunchBg: ["#065f46", "#059669"] as [string, string],

  // Dinner - Purple/Blue
  dinnerPrimary: "#A78BFA",
  dinnerSecondary: "#C4B5FD",
  dinnerGlow: "rgba(167, 139, 250, 0.4)",
  dinnerBg: ["#4c1d95", "#6d28d9"] as [string, string],

  // Header - Blue gradient
  headerBg: ["#1e3a5f", "#2563eb"] as [string, string],

  // Common
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.9)",
  textMuted: "rgba(255, 255, 255, 0.75)",
  textLabel: "rgba(255, 255, 255, 0.85)",
};

interface HomeScreenProps {
  mealPlan: MealPlan;
  planType: "daily" | "weekly" | "monthly";
  onSelectMeal: (type: string, meal: Meal) => void;
  suggestionData?: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({
  mealPlan,
  planType,
  onSelectMeal,
  suggestionData,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const plan = mealPlan ? (mealPlan[`${planType}_plan`] as any) : null;
  const navigation = useNavigation();

  // AI flag logic
  const isAiGenerated = Boolean(mealPlan?.daily_plan);

  // AI Label Component - Redesigned
  const AiGeneratedLabel = () => (
    <View style={styles.aiLabelContainer}>
      <Ionicons name="sparkles" size={14} color="#60A5FA" />
      <Text style={styles.aiLabelText}>AI-Generated</Text>
    </View>
  );

  const renderMeals = (type: string, meals: Meal[]) =>
    meals.map((meal, idx) => (
      <View key={`${type}-${idx}`}>
        <AiGeneratedLabel />
        <MealCard
          title={type}
          meal={meal}
          onPress={() => onSelectMeal(type, meal)}
        />
      </View>
    ));

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

  // Get meal section config
  const getMealConfig = (type: string) => {
    switch (type.toLowerCase()) {
      case "breakfast":
        return {
          colors: CARD_COLORS.breakfastBg,
          primary: CARD_COLORS.breakfastPrimary,
          glow: CARD_COLORS.breakfastGlow,
          icon: "sunny" as const,
        };
      case "lunch":
        return {
          colors: CARD_COLORS.lunchBg,
          primary: CARD_COLORS.lunchPrimary,
          glow: CARD_COLORS.lunchGlow,
          icon: "partly-sunny" as const,
        };
      case "dinner":
        return {
          colors: CARD_COLORS.dinnerBg,
          primary: CARD_COLORS.dinnerPrimary,
          glow: CARD_COLORS.dinnerGlow,
          icon: "moon" as const,
        };
      default:
        return {
          colors: CARD_COLORS.lunchBg,
          primary: CARD_COLORS.lunchPrimary,
          glow: CARD_COLORS.lunchGlow,
          icon: "restaurant" as const,
        };
    }
  };

  // Meal Section Card Component
  const MealSectionCard = ({
    type,
    meals,
  }: {
    type: string;
    meals: Meal[];
  }) => {
    const config = getMealConfig(type);
    return (
      <LinearGradient
        colors={config.colors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.mealSectionCard}
      >
        <View
          style={[styles.cardGlow, { backgroundColor: config.glow }]}
        />
        <View style={styles.mealSectionHeader}>
          <View
            style={[
              styles.mealIconContainer,
              { backgroundColor: config.glow },
            ]}
          >
            <Ionicons name={config.icon} size={22} color={config.primary} />
          </View>
          <Text style={styles.mealSectionTitle}>{type}</Text>
          <View style={[styles.mealBadge, { backgroundColor: config.glow }]}>
            <Text style={[styles.mealBadgeText, { color: config.primary }]}>
              {meals.length} {meals.length === 1 ? "option" : "options"}
            </Text>
          </View>
        </View>
        <View style={styles.mealCardsContainer}>
          {renderMeals(type, meals)}
        </View>
      </LinearGradient>
    );
  };

  const renderWeeklyPlan = () => {
    if (!plan?.daily_plans) return null;

    const weeks = groupByWeek(plan.daily_plans);

    return (
      <View>
        {plan?.daily_nutrition_target && !suggestionData && (
          <View style={styles.section}>
            <NutritionTargets nutritionTargets={plan.daily_nutrition_target} />
          </View>
        )}

        {weeks.map((week, weekIdx) => (
          <View key={`week-${weekIdx}`} style={{ marginBottom: 24 }}>
            <LinearGradient
              colors={["#1e3a5f", "#1e40af"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.weekHeaderCard}
            >
              <MaterialCommunityIcons
                name="calendar-week"
                size={20}
                color="#60A5FA"
              />
              <Text style={styles.weekHeaderText}>
                Week {week.weekNumber} —{" "}
                {new Date(week.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                to{" "}
                {new Date(week.endDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </Text>
            </LinearGradient>

            {week.days.map((dayPlan: any, dayIdx: number) => (
              <View key={dayIdx} style={styles.dayContainer}>
                <View style={styles.dayHeader}>
                  <View style={styles.dayIconContainer}>
                    <Ionicons name="calendar" size={16} color="#60A5FA" />
                  </View>
                  <Text style={styles.weekDayTitle}>
                    {new Date(dayPlan.date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>

                {dayPlan.breakfast_options?.length > 0 && (
                  <MealSectionCard
                    type="Breakfast"
                    meals={dayPlan.breakfast_options}
                  />
                )}

                {dayPlan.lunch_options?.length > 0 && (
                  <MealSectionCard
                    type="Lunch"
                    meals={dayPlan.lunch_options}
                  />
                )}

                {dayPlan.dinner_options?.length > 0 && (
                  <MealSectionCard
                    type="Dinner"
                    meals={dayPlan.dinner_options}
                  />
                )}
              </View>
            ))}
          </View>
        ))}
      </View>
    );
  };

  // Share Button - Redesigned
  const ShareButton = () => (
    <TouchableOpacity
      style={styles.shareButton}
      onPress={() => navigation.navigate("MealPlanEmail", { mealPlan })}
    >
      <LinearGradient
        colors={["#34D399", "#10B981"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.shareButtonGradient}
      >
        <Ionicons name="share-outline" size={18} color="#fff" />
        <Text style={styles.shareButtonText}>Share</Text>
      </LinearGradient>
    </TouchableOpacity>
  );

  // Header Component - Redesigned
  const HeaderSection = ({ title, subtitle }: { title: string; subtitle?: string }) => (
    <LinearGradient
      colors={CARD_COLORS.headerBg}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerCard}
    >
      <View style={[styles.cardGlow, { backgroundColor: "rgba(96, 165, 250, 0.3)" }]} />
      <View style={styles.headerContent}>
        <View style={styles.headerTextContainer}>
          <View style={styles.headerTitleRow}>
            <MaterialCommunityIcons
              name="food-apple"
              size={24}
              color="#60A5FA"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.headerTitle}>{title}</Text>
          </View>
          {subtitle && <Text style={styles.headerDate}>{subtitle}</Text>}
        </View>
        <ShareButton />
      </View>
    </LinearGradient>
  );

  // *** AI Suggestion Screen ***
  if (suggestionData) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <HeaderSection
          title="Today's Plan"
          subtitle={new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        />

        <View style={styles.contentContainer}>
          {suggestionData.breakfast_options?.length > 0 && (
            <MealSectionCard
              type="Breakfast"
              meals={suggestionData.breakfast_options}
            />
          )}

          {suggestionData.lunch_options?.length > 0 && (
            <MealSectionCard
              type="Lunch"
              meals={suggestionData.lunch_options}
            />
          )}

          {suggestionData.dinner_options?.length > 0 && (
            <MealSectionCard
              type="Dinner"
              meals={suggestionData.dinner_options}
            />
          )}
        </View>

        <View style={styles.bannerContainer}>
          <MedicalBanner />
        </View>
      </ScrollView>
    );
  }

  // *** NORMAL PLAN RENDERING ***
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {planType === "daily" && (
        <>
          <HeaderSection
            title="Today's Plan"
            subtitle={new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          />

          {plan?.daily_nutrition_target && !suggestionData && (
            <View style={styles.nutritionContainer}>
              <NutritionTargets nutritionTargets={plan.daily_nutrition_target} />
            </View>
          )}
        </>
      )}

      {planType === "weekly" && (
        <HeaderSection title="Weekly Plan" />
      )}

      <View style={styles.contentContainer}>
        {planType === "weekly"
          ? renderWeeklyPlan()
          : plan && (
              <>
                {plan.breakfast_options?.length > 0 && (
                  <MealSectionCard
                    type="Breakfast"
                    meals={plan.breakfast_options}
                  />
                )}

                {plan.lunch_options?.length > 0 && (
                  <MealSectionCard
                    type="Lunch"
                    meals={plan.lunch_options}
                  />
                )}

                {plan.dinner_options?.length > 0 && (
                  <MealSectionCard
                    type="Dinner"
                    meals={plan.dinner_options}
                  />
                )}
              </>
            )}
      </View>

      <View style={styles.bannerContainer}>
        <MedicalBanner />
      </View>
      <View style={{ height: 20 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },

  // Header Styles
  headerCard: {
    borderRadius: 20,
    margin: 16,
    marginBottom: 8,
    padding: 20,
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  headerDate: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.85)",
    marginTop: 6,
    marginLeft: 32,
    fontWeight: "500",
  },

  // Content Container
  contentContainer: {
    paddingHorizontal: 16,
  },
  nutritionContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  bannerContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },

  // Card Glow Effect
  cardGlow: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.6,
  },

  // Meal Section Card Styles
  mealSectionCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    overflow: "hidden",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  mealSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  mealIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  mealSectionTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  mealBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  mealBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },
  mealCardsContainer: {
    marginTop: 4,
  },

  // Weekly Styles
  weekHeaderCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 14,
    marginHorizontal: 16,
    marginBottom: 16,
  },
  weekHeaderText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginLeft: 10,
    letterSpacing: 0.3,
  },
  dayContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  dayHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "rgba(96, 165, 250, 0.1)",
    borderRadius: 10,
  },
  dayIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(96, 165, 250, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  weekDayTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1e3a5f",
  },

  // Section styles
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },

  // AI Label Styles - Redesigned
  aiLabelContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "rgba(96, 165, 250, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    marginBottom: 10,
  },
  aiLabelText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#60A5FA",
    marginLeft: 6,
  },

  // Share Button Styles - Redesigned
  shareButton: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  shareButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 6,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default HomeScreen;
