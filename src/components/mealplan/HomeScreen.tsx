// HomeScreen.tsx - Redesigned with smart meal suggestions and fixed alignment
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

// Action Hub Tabs Configuration
const TABS: { id: TabId; label: string; icon: string; colors: string[]; textColor: string; isOutlined?: boolean }[] = [
  { id: "make-it", label: "Make it", icon: "pencil", colors: ["#FFFFFF", "#FFFFFF"], textColor: "#059669", isOutlined: true },
  { id: "go-shop", label: "Go Shop", icon: "cart-outline", colors: ["#10B981", "#059669"], textColor: "#FFFFFF" },
  { id: "dine-in", label: "Dine-In", icon: "restaurant-outline", colors: ["#8B5CF6", "#7C3AED"], textColor: "#FFFFFF" },
  { id: "mom-it", label: "Mom It", icon: "home-outline", colors: ["#F97316", "#EA580C"], textColor: "#FFFFFF" },
];

// Grafana-inspired color palette
const GRAFANA_COLORS = {
  teal: "#00D4AA",
  cyan: "#00A3CC",
  purple: "#7C4DFF",
  lightPurple: "#B388FF",
  orange: "#FF9830",
  green: "#73BF69",
};

// Circular Progress Component with Grafana gradient
const CircularProgress = ({
  current,
  total,
  size = 180,
  strokeWidth = 14,
}: {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.min(current / total, 1);
  const strokeDashoffset = circumference * (1 - progress);

  // Calculate position for the indicator dot
  const angle = (progress * 360 - 90) * (Math.PI / 180);
  const dotX = size / 2 + radius * Math.cos(angle);
  const dotY = size / 2 + radius * Math.sin(angle);

  return (
    <View style={{ width: size, height: size, justifyContent: "center", alignItems: "center" }}>
      <Svg width={size} height={size}>
        <Defs>
          <SvgGradient id="grafanaGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor={GRAFANA_COLORS.teal} />
            <Stop offset="33%" stopColor={GRAFANA_COLORS.cyan} />
            <Stop offset="66%" stopColor={GRAFANA_COLORS.purple} />
            <Stop offset="100%" stopColor={GRAFANA_COLORS.lightPurple} />
          </SvgGradient>
        </Defs>

        {/* Background circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#grafanaGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />

        {/* Indicator dot */}
        <Circle
          cx={dotX}
          cy={dotY}
          r={7}
          fill={GRAFANA_COLORS.cyan}
          stroke="#FFFFFF"
          strokeWidth={2}
        />
      </Svg>

      {/* Center Text */}
      <View style={styles.progressCenterText}>
        <Text style={styles.caloriesValue}>{current}</Text>
        <Text style={styles.caloriesTotal}>/ {total} kcal</Text>
      </View>
    </View>
  );
};

// Macro Progress Bar Component
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
      <Text style={styles.macroLabel}>{label}</Text>
      <View style={styles.macroBarBackground}>
        <LinearGradient
          colors={[color, color]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.macroBarFill, { width: `${progress * 100}%` }]}
        />
      </View>
      <Text style={styles.macroValue}>{current} kal</Text>
    </View>
  );
};

// Meal Card Component
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
            <Feather name="edit-2" size={14} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

// Smart Next Meal Helper
const getNextMealSuggestion = (
  loggedMeals: { breakfast: boolean; lunch: boolean; dinner: boolean }
): { mealType: MealType; message: string } => {
  const hour = new Date().getHours();

  // Morning (6am - 11am)
  if (hour >= 6 && hour < 11) {
    if (!loggedMeals.breakfast) {
      return { mealType: "Breakfast", message: "What's for Breakfast?" };
    }
    if (!loggedMeals.lunch) {
      return { mealType: "Lunch", message: "Plan your Lunch" };
    }
  }

  // Midday (11am - 3pm)
  if (hour >= 11 && hour < 15) {
    if (!loggedMeals.lunch) {
      return { mealType: "Lunch", message: "What's for Lunch?" };
    }
    if (!loggedMeals.dinner) {
      return { mealType: "Dinner", message: "Plan your Dinner" };
    }
  }

  // Afternoon/Evening (3pm - 9pm)
  if (hour >= 15 && hour < 21) {
    if (!loggedMeals.dinner) {
      return { mealType: "Dinner", message: "What's for Dinner?" };
    }
    if (!loggedMeals.lunch) {
      return { mealType: "Lunch", message: "Log your Lunch" };
    }
  }

  // Night (9pm - 6am)
  if (!loggedMeals.dinner) {
    return { mealType: "Dinner", message: "Log your Dinner" };
  }

  // All meals logged - suggest snack
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

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Navigation handlers
  const handleRefresh = () => {
    console.log("Refresh pressed");
  };

  const handleMenuPress = () => {
    navigation.navigate("AllScreensMenu");
  };

  const handleSharePress = () => {
    navigation.navigate("MealPlanEmail", { mealPlan });
  };

  // Calculate nutrition from meal plan data
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

  // Daily goals
  const dailyGoals = plan?.daily_nutrition_target || {
    calories: 1800,
    protein: 150,
    carbs: 300,
    fat: 90,
  };

  const activePlan = suggestionData || plan;

  // Get current date formatted
  const getCurrentDate = () => {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: "long", month: "short", day: "numeric" };
    return now.toLocaleDateString("en-US", options);
  };

  // Get AI suggestion based on nutrition progress
  const getAISuggestion = () => {
    const proteinPercent = (totalNutrition.protein / dailyGoals.protein) * 100;
    if (proteinPercent >= 60) {
      return "Evening check-in! Great job on hitting your protein goal.";
    }
    return "Keep going! You're making great progress today.";
  };

  // Get meals - simulating logged status based on available data
  const breakfastMeal = activePlan?.breakfast_options?.[0] || null;
  const lunchMeal = activePlan?.lunch_options?.[0] || null;
  const dinnerMeal = activePlan?.dinner_options?.[0] || null;

  // Determine logged status (in real app, this would come from user data)
  const loggedMeals = useMemo(() => ({
    breakfast: !!breakfastMeal,
    lunch: false, // Simulating lunch not logged yet
    dinner: false, // Simulating dinner not logged yet
  }), [breakfastMeal]);

  // Get smart next meal suggestion
  const nextMealSuggestion = useMemo(() =>
    getNextMealSuggestion(loggedMeals),
    [loggedMeals]
  );

  // Get the meal to suggest for logging
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

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Share Icons */}
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={styles.headerTop}>
            <Text style={styles.headerTitle}>Daily Fuel Overview</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerIconBtn} onPress={handleRefresh}>
                <Ionicons name="refresh" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={handleSharePress}>
                <Ionicons name="share-outline" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIconBtn} onPress={handleMenuPress}>
                <Ionicons name="ellipsis-horizontal" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.dateBadge}>
            <Text style={styles.dateBadgeText}>{getCurrentDate()}</Text>
          </View>
        </Animated.View>

        {/* Circular Progress */}
        <View style={styles.progressSection}>
          <CircularProgress
            current={totalNutrition.calories || 1250}
            total={dailyGoals.calories || 1800}
            size={180}
            strokeWidth={14}
          />
        </View>

        {/* Macro Progress Bars */}
        <View style={styles.macrosRow}>
          <MacroProgressBar
            label="Protein"
            current={totalNutrition.protein || 120}
            total={dailyGoals.protein || 150}
            color={GRAFANA_COLORS.teal}
          />
          <MacroProgressBar
            label="Carbs"
            current={totalNutrition.carbs || 330}
            total={dailyGoals.carbs || 300}
            color={GRAFANA_COLORS.purple}
          />
          <MacroProgressBar
            label="Fats"
            current={totalNutrition.fat || 230}
            total={dailyGoals.fat || 90}
            color={GRAFANA_COLORS.orange}
          />
        </View>

        {/* AI Suggestion Banner */}
        <View style={styles.suggestionBanner}>
          <View style={styles.suggestionIcon}>
            <MaterialCommunityIcons name="robot-happy-outline" size={20} color={GRAFANA_COLORS.teal} />
          </View>
          <Text style={styles.suggestionText}>{getAISuggestion()}</Text>
        </View>

        {/* Action Hub */}
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
                      <Feather name={tab.icon as any} size={12} color="#059669" />
                      <Text style={styles.actionButtonTextOutlined}>{tab.label}</Text>
                    </View>
                  ) : (
                    <LinearGradient
                      colors={tab.colors}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.actionButtonGradient}
                    >
                      <Ionicons name={tab.icon as any} size={12} color={tab.textColor} />
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

        {/* Meal Timeline */}
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

            {/* Smart Next Meal Section */}
            <View style={styles.nextMealSection}>
              <Text style={styles.nextMealTitle}>{nextMealSuggestion.message}</Text>
              <Text style={styles.nextMealSubtitle}>(planned)</Text>

              <TouchableOpacity
                style={styles.logMealButton}
                onPress={() => nextMealToLog && onSelectMeal(nextMealSuggestion.mealType, nextMealToLog)}
              >
                <LinearGradient
                  colors={[GRAFANA_COLORS.teal, "#059669"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.logMealGradient}
                >
                  <Text style={styles.logMealButtonText}>Log{"\n"}Meal</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.viewRecipeButton}
                onPress={() => nextMealToLog && onSelectMeal(nextMealSuggestion.mealType, nextMealToLog)}
              >
                <Text style={styles.viewRecipeButtonText}>View{"\n"}Recipe</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add Snack / Quick Log */}
          <TouchableOpacity
            style={styles.addSnackRow}
            onPress={() => navigation.navigate("FoodAnalysis")}
          >
            <Ionicons name="add" size={18} color={Colors.textSecondary} />
            <Text style={styles.addSnackText}>Add Snack / Quick Log</Text>
          </TouchableOpacity>
        </View>

        {/* Nutrition Targets (if available) */}
        {activePlan?.daily_nutrition_target && (
          <View style={styles.nutritionTargetContainer}>
            <NutritionTargets nutritionTargets={activePlan.daily_nutrition_target} />
          </View>
        )}

        {/* Medical/AI Banner */}
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
    backgroundColor: Colors.bgPrimary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : (StatusBar.currentHeight || 0) + 16,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  dateBadge: {
    alignSelf: "center",
    backgroundColor: Colors.bgCard,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  dateBadgeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },

  // Progress Section
  progressSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  progressCenterText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  caloriesValue: {
    fontSize: 42,
    fontWeight: "700",
    color: Colors.textPrimary,
  },
  caloriesTotal: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: -4,
  },

  // Macros Row
  macrosRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  macroContainer: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 8,
  },
  macroLabel: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: "600",
    marginBottom: 8,
  },
  macroBarBackground: {
    width: "100%",
    height: 10,
    backgroundColor: Colors.bgCardHover,
    borderRadius: 5,
    overflow: "hidden",
  },
  macroBarFill: {
    height: "100%",
    borderRadius: 5,
  },
  macroValue: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 6,
  },

  // Suggestion Banner
  suggestionBanner: {
    marginHorizontal: 20,
    marginBottom: 28,
    backgroundColor: Colors.bgCard,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  suggestionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  suggestionText: {
    flex: 1,
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },

  // Section
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 14,
    paddingHorizontal: 20,
  },

  // Action Hub - Flex Row
  actionHubRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
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
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: Colors.emerald,
    backgroundColor: Colors.bgCard,
    gap: 4,
  },
  actionButtonGradient: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 22,
    gap: 4,
  },
  actionButtonText: {
    fontSize: 11,
    fontWeight: "600",
  },
  actionButtonTextOutlined: {
    fontSize: 11,
    fontWeight: "600",
    color: "#059669",
  },

  // Meal Timeline
  mealTimelineRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 12,
  },
  mealCard: {
    flex: 1,
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 12,
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  mealImageContainer: {
    position: "relative",
    alignItems: "center",
    marginBottom: 10,
  },
  mealImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: Colors.borderDark,
  },
  loggedBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#10B981",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  loggedBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  mealType: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 2,
  },
  mealName: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 16,
  },
  mealFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mealCalories: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: "500",
  },
  editButton: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.bgCardHover,
    justifyContent: "center",
    alignItems: "center",
  },

  // Next Meal Section (Smart Suggestion)
  nextMealSection: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 4,
  },
  nextMealTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.textPrimary,
    textAlign: "center",
    marginBottom: 2,
  },
  nextMealSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 12,
  },
  logMealButton: {
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 8,
  },
  logMealGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: "center",
  },
  logMealButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "center",
    lineHeight: 16,
  },
  viewRecipeButton: {
    borderWidth: 1,
    borderColor: Colors.borderDark,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: Colors.bgCard,
  },
  viewRecipeButtonText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 14,
  },
  addSnackRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 16,
    paddingVertical: 8,
  },
  addSnackText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: "500",
  },

  // Nutrition Targets
  nutritionTargetContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  // Banner
  bannerContainer: {
    paddingHorizontal: 20,
    marginTop: 8,
  },
});

export default HomeScreen;