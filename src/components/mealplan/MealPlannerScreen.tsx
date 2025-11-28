import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet } from "react-native";
import HomeScreen from "./HomeScreen";
import MealDetailScreen from "./MealDetailScreen";
import { Colors } from "@/constants/Colors";
import { useAppSelector } from "@/redux/store/hooks";
import { MealPlan, Meal } from "@/types";
import LoadingSpinner from "../ui/LoadingSpinner";

type TabId = "make-it" | "go-shop" | "dine-in" | "mom-it";

interface MealPlannerProps {
  mealType?: string;
  surpriseMode?: boolean;
  fromLanding?: boolean;
  activeTab?: TabId;
  onTabChange?: (tab: TabId) => void;
}

const MealPlannerScreen: React.FC<MealPlannerProps> = ({
  mealType,
  surpriseMode = false,
  fromLanding = false,
  activeTab = "make-it",
  onTabChange,
}) => {
  const [activeScreen, setActiveScreen] = useState<"home" | "mealDetail">("home");
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string>(mealType || "");

  // Get meal plan from Redux store (already fetched in LandingScreen)
  const { data: mealPlan, loading, error } = useAppSelector(
    (state) => state.mealPlan
  );

  const handleSelectMeal = (type: string, meal: Meal) => {
    setSelectedMeal(meal);
    setSelectedMealType(type);
    setActiveScreen("mealDetail");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <LoadingSpinner visible={loading} message="Fetching meal plan..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {typeof error === "string" ? error : error?.message || "An error occurred"}
        </Text>
        {error?.error_type && (
          <Text style={styles.errorType}>Error Type: {error.error_type}</Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {activeScreen === "home" ? (
        <>
          {!mealPlan || Object.keys(mealPlan).length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No meal plan found</Text>
            </View>
          ) : (
            <HomeScreen
              mealPlan={mealPlan}
              planType="daily"
              onSelectMeal={handleSelectMeal}
              activeTab={activeTab}
              onTabChange={onTabChange}
            />
          )}
        </>
      ) : (
        selectedMeal && (
          <MealDetailScreen
            meal={selectedMeal}
            mealType={selectedMealType}
            onBack={() => setActiveScreen("home")}
          />
        )
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#EF4444",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 14,
  },
  errorType: {
    color: "#6B7280",
    fontSize: 12,
  },
  emptyContainer: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  emptyText: {
    color: "#6B7280",
    fontSize: 14,
  },
});

export default MealPlannerScreen;