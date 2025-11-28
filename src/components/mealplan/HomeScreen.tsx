// HomeScreen.tsx - Redesigned with premium dark theme UI (functionality preserved)
import React, { useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
  StatusBar,
  Animated,
  Easing,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Meal, MealPlan } from "@/types/types";
import NutritionTargets from "./NutritionTargets";
import MedicalBanner from "./AiRecomendationBanner";
import { useNavigation } from "@react-navigation/native";
import { Colors } from "@/constants/Colors";
import Svg, { Circle, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

type TabId = "make-it" | "go-shop" | "dine-in" | "mom-it";
type MealType = "Breakfast" | "Lunch" | "Dinner" | "Snack";

interface HomeScreenProps {
  mealPlan: MealPlan;
  planType: "daily" | "weekly" | "monthly";
  onSelectMeal: (type: string, meal: Meal) => void;
  suggestionData?: any;
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
}

// Action Hub Tabs Configuration (PRESERVED)
const TABS: { id: TabId; label: string; icon: string; colors: string[]; textColor: string; isOutlined?: boolean }[] = [
  { id: "make-it", label: "Make it", icon: "pencil", colors: ["#FFFFFF", "#FFFFFF"], textColor: "#00D9A5", isOutlined: true },
  { id: "go-shop", label: "Go Shop", icon: "cart-outline", colors: ["#00D9A5", "#00B88D"], textColor: "#FFFFFF" },
  { id: "dine-in", label: "Dine-In", icon: "restaurant-outline", colors: ["#8B5CF6", "#7C3AED"], textColor: "#FFFFFF" },
  { id: "mom-it", label: "Mom It", icon: "home-outline", colors: ["#F97316", "#EA580C"], textColor: "#FFFFFF" },
];

// Premium dark theme palette (matching sample image)
const THEME = {
  bg: "#0D0F14",
  cardBg: "#151921",
  cardBgElevated: "#1A2332",
  cardBorder: "#1E2430",
  accent: "#00D9A5",
  accentGlow: "rgba(0, 217, 165, 0.15)",
  accentSecondary: "#00F5B8",
  purple: "#8B5CF6",
  orange: "#F97316",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  textMuted: "#6B7280",
};

// Circular Progress Component - ENHANCED VISUALS
const CircularProgress = ({
  current,
  total,
  size = 200,
  strokeWidth = 12,
}: {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2 - 8;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(current / total, 1);
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={THEME.accent} />
            <Stop offset="100%" stopColor={THEME.accentSecondary} />
          </SvgGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={THEME.cardBorder}
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>

      {/* Center Text - ENHANCED */}
      <View style={styles.progressCenterText}>
        <Text style={styles.caloriesValue}>{current}</Text>
        <Text style={styles.caloriesTotal}>/ {total} kcal</Text>
      </View>
    </View>
  );
};

// Macro Progress Bar Component - ENHANCED VISUALS
const MacroProgressBar = ({
  label,
  current,
  total,
  color,
}: {
  label: string;
  current: number;
  total: number;
  color: string;
}) => {
  const progress = Math.min(current / total, 1);

  return (
    <View style={styles.macroContainer}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>
          {current}<Text style={styles.macroUnit}>g</Text>
        </Text>
      </View>
      <View style={styles.macroBarBackground}>
        <View style={[styles.macroBarFill, { width: `${progress * 100}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

// Meal Card Component - ENHANCED VISUALS (FUNCTIONALITY PRESERVED)
const MealCard = ({
  meal,
  mealType,
  isLogged,
  onPress,
  onEdit,
}: {
  meal: Meal;
  mealType: string;
  isLogged: boolean;
  onPress: () => void;
  onEdit?: () => void;
}) => {
  const getMealImage = () => {
    if (meal.image_url) return meal.image_url;
    const placeholders: Record<string, string> = {
      Breakfast: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=80",
      Lunch: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
      Dinner: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&q=80",
      Snack: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400&q=80",
    };
    return placeholders[mealType] || placeholders.Lunch;
  };

  return (
    <TouchableOpacity style={styles.mealCard} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.mealImageContainer}>
        <Image source={{ uri: getMealImage() }} style={styles.mealImage} />
        {isLogged && (
          <View style={styles.loggedBadge}>
            <Ionicons name="checkmark" size={10} color="#FFFFFF" />
            <Text style={styles.loggedBadgeText}>Logged</Text>
          </View>
        )}
      </View>

      <Text style={styles.mealType}>{mealType}</Text>
      <Text style={styles.mealName} numberOfLines={2}>{meal.name}</Text>

      <View style={styles.mealFooter}>
        <Text style={styles.mealCalories}>{meal.nutrition?.calories || 0} kcal</Text>
        {onEdit && (
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Feather name="edit-2" size={12} color={THEME.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Smart Next Meal Helper (PRESERVED)
const getNextMealSuggestion = (
  loggedMeals: { breakfast: boolean; lunch: boolean; dinner: boolean }
): { mealType: MealType; message: string } => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 11) {
    if (!loggedMeals.breakfast) {
      return { mealType: "Breakfast", message: "What's for Breakfast?" };
    }
    if (!loggedMeals.lunch) {
      return { mealType: "Lunch", message: "Plan your Lunch" };
    }
  }

  if (hour >= 11 && hour < 15) {
    if (!loggedMeals.lunch) {
      return { mealType: "Lunch", message: "What's for Lunch?" };
    }
    if (!loggedMeals.dinner) {
      return { mealType: "Dinner", message: "Plan your Dinner" };
    }
  }

  if (hour >= 15 && hour < 21) {
    if (!loggedMeals.dinner) {
      return { mealType: "Dinner", message: "What's for Dinner?" };
    }
    if (!loggedMeals.lunch) {
      return { mealType: "Lunch", message: "Log your Lunch" };
    }
  }

  if (!loggedMeals.dinner) {
    return { mealType: "Dinner", message: "Log your Dinner" };
  }

  return { mealType: "Snack", message: "Add a Snack" };
};

const HomeScreen: React.FC<HomeScreenProps> = ({
  mealPlan,
  planType,
  onSelectMeal,
  suggestionData,
  activeTab = "make-it",
  onTabChange,
}) => {
  const plan = mealPlan ? (mealPlan[`${planType}_plan`] as any) : null;
  const navigation = useNavigation<any>();

  // Animation values (PRESERVED)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.back(1.1)),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Navigation handlers (PRESERVED)
  const handleRefresh = () => {
    console.log("Refresh pressed");
  };

  const handleMenuPress = () => {
    navigation.navigate("AllScreensMenu");
  };

  const handleSharePress = () => {
    navigation.navigate("MealPlanEmail", { mealPlan });
  };

  // Calculate nutrition from meal plan data (PRESERVED)
  const calculateTotalNutrition = () => {
    const activePlan = suggestionData || plan;
    const meals = [
      ...(activePlan?.breakfast_options || []),
      ...(activePlan?.lunch_options || []),
      ...(activePlan?.dinner_options || []),
    ];

    return {
      calories: meals.reduce((sum, m) => sum + (m.nutrition?.calories || 0), 0),
      protein: meals.reduce((sum, m) => sum + (m.nutrition?.protein || 0), 0),
      carbs: meals.reduce((sum, m) => sum + (m.nutrition?.carbs || 0), 0),
      fat: meals.reduce((sum, m) => sum + (m.nutrition?.fat || 0), 0),
    };
  };

  const totalNutrition = calculateTotalNutrition();

  // Daily goals (PRESERVED)
  const dailyGoals = plan?.daily_nutrition_target || {
    calories: 1800,
    protein: 150,
    carbs: 300,
    fat: 90,
  };

  const activePlan = suggestionData || plan;

  // Get current date formatted (PRESERVED)
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "short", day: "numeric" };
    return now.toLocaleDateString("en-US", options);
  };

  // Get AI suggestion based on nutrition progress (PRESERVED)
  const getAISuggestion = () => {
    const proteinPercent = (totalNutrition.protein / dailyGoals.protein) * 100;
    if (proteinPercent >= 60) {
      return "Evening check-in! Great job on hitting your protein goal.";
    }
    return "Keep going! You're making great progress today.";
  };

  // Get meals (PRESERVED)
  const breakfastMeal = activePlan?.breakfast_options?.[0] || null;
  const lunchMeal = activePlan?.lunch_options?.[0] || null;
  const dinnerMeal = activePlan?.dinner_options?.[0] || null;

  // Determine logged status (PRESERVED)
  const loggedMeals = useMemo(() => ({
    breakfast: !!breakfastMeal,
    lunch: false,
    dinner: false,
  }), [breakfastMeal]);

  // Get smart next meal suggestion (PRESERVED)
  const nextMealSuggestion = useMemo(() =>
    getNextMealSuggestion(loggedMeals),
    [loggedMeals]
  );

  // Get the meal to suggest for logging (PRESERVED)
  const getNextMealToLog = (): Meal | null => {
    switch (nextMealSuggestion.mealType) {
      case "Breakfast":
        return breakfastMeal;
      case "Lunch":
        return lunchMeal;
      case "Dinner":
        return dinnerMeal;
      default:
        return lunchMeal || dinnerMeal;
    }
  };

  const nextMealToLog = getNextMealToLog();

  // Calculate calorie progress percentage
  const calorieProgress = Math.round(((totalNutrition.calories || 1250) / (dailyGoals.calories || 1800)) * 100);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.bg} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - ENHANCED */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Daily Fuel</Text>
              <Text style={styles.headerSubtitle}>{getCurrentDate()}</Text>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerIconBtn} onPress={handleRefresh}>
                <Ionicons name="refresh" size={20} color={THEME.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={handleSharePress}>
                <Ionicons name="share-outline" size={20} color={THEME.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={handleMenuPress}>
                <Ionicons name="ellipsis-horizontal" size={20} color={THEME.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Calorie Progress Card - NEW LAYOUT */}
        <View style={styles.calorieCard}>
          <LinearGradient
            colors={[THEME.cardBgElevated, THEME.cardBg]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.calorieCardGradient}
          >
            <View style={styles.calorieCardHeader}>
              <Text style={styles.calorieCardLabel}>CALORIE INTAKE</Text>
              <View style={styles.progressBadge}>
                <Text style={styles.progressBadgeText}>{calorieProgress}%</Text>
              </View>
            </View>

            <View style={styles.calorieContent}>
              <CircularProgress
                current={totalNutrition.calories || 1250}
                total={dailyGoals.calories || 1800}
                size={180}
                strokeWidth={12}
              />
            </View>
          </LinearGradient>
        </View>

        {/* Macros Card - NEW LAYOUT */}
        <View style={styles.macrosCard}>
          <Text style={styles.sectionLabel}>MACRONUTRIENTS</Text>
          <View style={styles.macrosGrid}>
            <MacroProgressBar
              label="Protein"
              current={totalNutrition.protein || 120}
              total={dailyGoals.protein || 150}
              color={THEME.accent}
            />
            <MacroProgressBar
              label="Carbs"
              current={totalNutrition.carbs || 180}
              total={dailyGoals.carbs || 300}
              color={THEME.purple}
            />
            <MacroProgressBar
              label="Fats"
              current={totalNutrition.fat || 55}
              total={dailyGoals.fat || 90}
              color={THEME.orange}
            />
          </View>
        </View>

        {/* AI Suggestion Banner - ENHANCED */}
        <View style={styles.suggestionBanner}>
          <View style={styles.suggestionIcon}>
            <MaterialCommunityIcons name="lightbulb-outline" size={18} color={THEME.accent} />
          </View>
          <View style={styles.suggestionContent}>
            <Text style={styles.suggestionTitle}>Daily Insight</Text>
            <Text style={styles.suggestionText}>{getAISuggestion()}</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={THEME.textMuted} />
        </View>

        {/* Action Hub - ENHANCED (FUNCTIONALITY PRESERVED) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Action Hub</Text>
          <View style={styles.actionHubRow}>
            {TABS.map((tab) => {
              const isOutlined = tab.isOutlined;

              return (
                <TouchableOpacity
                  key={tab.id}
                  style={styles.actionButton}
                  onPress={() => onTabChange?.(tab.id)}
                  activeOpacity={0.8}
                >
                  {isOutlined ? (
                    <View style={styles.actionButtonOutlined}>
                      <Feather name={tab.icon as any} size={14} color={THEME.accent} />
                      <Text style={styles.actionButtonTextOutlined}>{tab.label}</Text>
                    </View>
                  ) : (
                    <LinearGradient
                      colors={tab.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.actionButtonGradient}
                    >
                      <Ionicons name={tab.icon as any} size={14} color={tab.textColor} />
                      <Text style={[styles.actionButtonText, { color: tab.textColor }]}>
                        {tab.label}
                      </Text>
                    </LinearGradient>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Meal Timeline - ENHANCED (FUNCTIONALITY PRESERVED) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meal Timeline</Text>

          <View style={styles.mealTimelineRow}>
            {/* Breakfast Card */}
            {breakfastMeal && (
              <MealCard
                meal={breakfastMeal}
                mealType="Breakfast"
                isLogged={loggedMeals.breakfast}
                onPress={() => onSelectMeal("Breakfast", breakfastMeal)}
                onEdit={() => onSelectMeal("Breakfast", breakfastMeal)}
              />
            )}

            {/* Lunch Card - show if available, otherwise show dinner */}
            {lunchMeal ? (
              <MealCard
                meal={lunchMeal}
                mealType="Lunch"
                isLogged={loggedMeals.lunch}
                onPress={() => onSelectMeal("Lunch", lunchMeal)}
              />
            ) : dinnerMeal ? (
              <MealCard
                meal={dinnerMeal}
                mealType="Dinner"
                isLogged={loggedMeals.dinner}
                onPress={() => onSelectMeal("Dinner", dinnerMeal)}
              />
            ) : null}

            {/* Smart Next Meal Section - ENHANCED */}
            <View style={styles.nextMealSection}>
              <View style={styles.nextMealHeader}>
                <Text style={styles.nextMealTitle}>{nextMealSuggestion.message}</Text>
                <Text style={styles.nextMealSubtitle}>planned</Text>
              </View>

              <TouchableOpacity
                style={styles.logMealButton}
                onPress={() => nextMealToLog && onSelectMeal(nextMealSuggestion.mealType, nextMealToLog)}
              >
                <LinearGradient
                  colors={[THEME.accent, "#00B88D"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.logMealGradient}
                >
                  <Ionicons name="add" size={16} color="#FFFFFF" />
                  <Text style={styles.logMealButtonText}>Log Meal</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.viewRecipeButton}
                onPress={() => nextMealToLog && onSelectMeal(nextMealSuggestion.mealType, nextMealToLog)}
              >
                <Feather name="book-open" size={14} color={THEME.textSecondary} />
                <Text style={styles.viewRecipeButtonText}>View Recipe</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add Snack / Quick Log - ENHANCED */}
          <TouchableOpacity
            style={styles.addSnackRow}
            onPress={() => navigation.navigate("FoodAnalysis")}
          >
            <View style={styles.addSnackIcon}>
              <Ionicons name="add" size={16} color={THEME.accent} />
            </View>
            <Text style={styles.addSnackText}>Add Snack / Quick Log</Text>
            <Ionicons name="chevron-forward" size={16} color={THEME.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Nutrition Targets (PRESERVED) */}
        {activePlan?.daily_nutrition_target && (
          <View style={styles.nutritionTargetContainer}>
            <NutritionTargets nutritionTargets={activePlan.daily_nutrition_target} />
          </View>
        )}

        {/* Medical/AI Banner (PRESERVED) */}
        <View style={styles.bannerContainer}>
          <MedicalBanner />
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header - ENHANCED
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 0) + 16,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: THEME.textPrimary,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: THEME.cardBg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },

  // Calorie Card - NEW
  calorieCard: {
    marginHorizontal: 20,
    borderRadius: 24,
    overflow: "hidden",
    marginBottom: 16,
  },
  calorieCardGradient: {
    padding: 20,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    borderRadius: 24,
  },
  calorieCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  calorieCardLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.textMuted,
    letterSpacing: 1.2,
  },
  progressBadge: {
    backgroundColor: THEME.accentGlow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  progressBadgeText: {
    fontSize: 12,
    fontWeight: "700",
    color: THEME.accent,
  },
  calorieContent: {
    alignItems: "center",
    paddingVertical: 10,
  },

  // Progress Center
  progressCenterText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  caloriesValue: {
    fontSize: 48,
    fontWeight: "300",
    color: THEME.textPrimary,
    letterSpacing: -2,
  },
  caloriesTotal: {
    fontSize: 14,
    color: THEME.textMuted,
    marginTop: -4,
  },

  // Macros Card - NEW
  macrosCard: {
    marginHorizontal: 20,
    backgroundColor: THEME.cardBg,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.textMuted,
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  macrosGrid: {
    gap: 14,
  },
  macroContainer: {
    width: "100%",
  },
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 14,
    color: THEME.textPrimary,
    fontWeight: "500",
  },
  macroValue: {
    fontSize: 14,
    fontWeight: "600",
    color: THEME.textPrimary,
  },
  macroUnit: {
    fontSize: 12,
    fontWeight: "400",
    color: THEME.textMuted,
  },
  macroBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: THEME.cardBorder,
    borderRadius: 4,
    overflow: "hidden",
  },
  macroBarFill: {
    height: "100%",
    borderRadius: 4,
  },

  // Suggestion Banner - ENHANCED
  suggestionBanner: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: THEME.cardBg,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  suggestionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: THEME.accentGlow,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  suggestionContent: {
    flex: 1,
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: THEME.textPrimary,
    marginBottom: 2,
  },
  suggestionText: {
    fontSize: 13,
    color: THEME.textSecondary,
    lineHeight: 18,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: THEME.textMuted,
    letterSpacing: 1.2,
    marginBottom: 14,
    paddingHorizontal: 20,
    textTransform: "uppercase",
  },

  // Action Hub - ENHANCED
  actionHubRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
  actionButtonOutlined: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: THEME.accent,
    backgroundColor: "transparent",
    gap: 6,
  },
  actionButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 12,
    fontWeight: "600",
  },
  actionButtonTextOutlined: {
    fontSize: 12,
    fontWeight: "600",
    color: THEME.accent,
  },

  // Meal Timeline - ENHANCED
  mealTimelineRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 10,
  },
  mealCard: {
    flex: 1,
    backgroundColor: THEME.cardBg,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  mealImageContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 12,
  },
  mealImage: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: THEME.cardBorder,
  },
  loggedBadge: {
    position: "absolute",
    top: -4,
    left: -4,
    backgroundColor: THEME.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  loggedBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  mealType: {
    fontSize: 14,
    fontWeight: "700",
    color: THEME.textPrimary,
    marginBottom: 2,
  },
  mealName: {
    fontSize: 11,
    color: THEME.textSecondary,
    marginBottom: 10,
    lineHeight: 15,
  },
  mealFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealCalories: {
    fontSize: 12,
    color: THEME.textMuted,
    fontWeight: "600",
  },
  editButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: THEME.cardBorder,
    justifyContent: "center",
    alignItems: "center",
  },

  // Next Meal Section - ENHANCED
  nextMealSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 8,
  },
  nextMealHeader: {
    alignItems: "center",
    marginBottom: 14,
  },
  nextMealTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: THEME.textPrimary,
    textAlign: "center",
  },
  nextMealSubtitle: {
    fontSize: 11,
    color: THEME.textMuted,
    marginTop: 2,
  },
  logMealButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    width: "100%",
  },
  logMealGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    gap: 6,
  },
  logMealButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  viewRecipeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: THEME.cardBg,
    width: "100%",
  },
  viewRecipeButtonText: {
    fontSize: 12,
    color: THEME.textSecondary,
    fontWeight: "500",
  },

  // Add Snack Row - ENHANCED
  addSnackRow: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: THEME.cardBg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: THEME.cardBorder,
  },
  addSnackIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: THEME.accentGlow,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  addSnackText: {
    flex: 1,
    fontSize: 14,
    color: THEME.textPrimary,
    fontWeight: "500",
  },

  // Nutrition Targets (PRESERVED)
  nutritionTargetContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  // Banner (PRESERVED)
  bannerContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
});

export default HomeScreen;