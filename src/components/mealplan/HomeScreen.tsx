// HomeScreen.tsx - Updated with Share functionality and empty-section hide fix
import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MealCard from "./MealCard";
import { Meal, MealPlan } from "@/types/types";
import NutritionTargets from "./NutritionTargets";
import { Colors } from "@/constants/Colors";
import MedicalBanner from "./AiRecomendationBanner";
import { useNavigation } from "@react-navigation/native";

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

  const renderMeals = (type: string, meals: Meal[]) =>
    meals.map((meal, idx) => (
      <MealCard
        key={`${type}-${idx}`}
        title={type}
        meal={meal}
        onPress={() => onSelectMeal(type, meal)}
      />
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
          <View key={`week-${weekIdx}`} style={{ marginBottom: 32 }}>
            <Text style={styles.weekHeader}>
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

            {week.days.map((dayPlan: any, dayIdx: number) => (
              <View key={dayIdx} style={{ marginBottom: 20 }}>
                <Text style={styles.weekDayTitle}>
                  {new Date(dayPlan.date).toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "short",
                    day: "numeric",
                  })}
                </Text>

                {dayPlan.breakfast_options?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Breakfast</Text>
                    {renderMeals("Breakfast", dayPlan.breakfast_options)}
                  </View>
                )}

                {dayPlan.lunch_options?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lunch</Text>
                    {renderMeals("Lunch", dayPlan.lunch_options)}
                  </View>
                )}

                {dayPlan.dinner_options?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dinner</Text>
                    {renderMeals("Dinner", dayPlan.dinner_options)}
                  </View>
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
      <Ionicons name="share-outline" size={20} color="#fff" />
      <Text style={styles.shareButtonText}>Share</Text>
    </TouchableOpacity>
  );

  // *** AI Suggestion Screen ***
  if (suggestionData) {
    return (
      <>
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Today's Plan</Text>
              <Text style={styles.headerDate}>
                {new Date().toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </Text>
            </View>
            <ShareButton />
          </View>

          {suggestionData.breakfast_options?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Breakfast</Text>
              {renderMeals("Breakfast", suggestionData.breakfast_options)}
            </View>
          )}

          {suggestionData.lunch_options?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Lunch</Text>
              {renderMeals("Lunch", suggestionData.lunch_options)}
            </View>
          )}

          {suggestionData.dinner_options?.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Dinner</Text>
              {renderMeals("Dinner", suggestionData.dinner_options)}
            </View>
          )}

          <MedicalBanner />
        </ScrollView>
      </>
    );
  }

  // *** NORMAL RENDERING ***
  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {planType === "daily" && (
          <>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>Today's Plan</Text>
                <Text style={styles.headerDate}>
                  {new Date().toLocaleDateString("en-US", {
                    weekday: "long",
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </Text>
              </View>
              <ShareButton />
            </View>

            {plan?.daily_nutrition_target && !suggestionData && (
              <View style={styles.section}>
                <NutritionTargets nutritionTargets={plan.daily_nutrition_target} />
              </View>
            )}
          </>
        )}

        {planType === "weekly" && (
          <View style={styles.weeklyHeader}>
            <Text style={styles.headerTitle}>Weekly Plan</Text>
            <ShareButton />
          </View>
        )}

        {planType === "weekly"
          ? renderWeeklyPlan()
          : plan && (
              <>
                {plan.breakfast_options?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Breakfast</Text>
                    {renderMeals("Breakfast", plan.breakfast_options)}
                  </View>
                )}

                {plan.lunch_options?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Lunch</Text>
                    {renderMeals("Lunch", plan.lunch_options)}
                  </View>
                )}

                {plan.dinner_options?.length > 0 && (
                  <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Dinner</Text>
                    {renderMeals("Dinner", plan.dinner_options)}
                  </View>
                )}
              </>
            )}

        <MedicalBanner />
        <View style={{ height: 10 }} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    padding: 20,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weeklyHeader: {
    padding: 20,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerTitle: { fontSize: 22, fontWeight: "700", color: "#111827" },
  headerDate: { fontSize: 14, color: "#6b7280", marginTop: 4 },
  section: { paddingHorizontal: 16, marginBottom: 20 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 12,
  },
  weekDayTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 12,
    marginLeft: 16,
  },
  weekHeader: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 12,
    marginLeft: 16,
  },
  shareButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#10b981",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    gap: 6,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  shareButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },
});

export default HomeScreen;
