import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
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
  const [activeScreen, setActiveScreen] = useState<"home" | "mealDetail">(
    "home"
  );
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<string>(
    mealType || ""
  );

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
    return <LoadingSpinner visible={loading} message="Fetching meal plan..." />;
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 20 }}>
        <Text style={{ color: "red", textAlign: "center", marginBottom: 10 }}>
          {typeof error === 'string' ? error : error?.message || 'An error occurred'}
        </Text>
        {error?.error_type && (
          <Text style={{ color: "#666", fontSize: 12 }}>
            Error Type: {error.error_type}
          </Text>
        )}
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }}>
      {activeScreen === "home" ? (
        <ScrollView showsVerticalScrollIndicator={false}>
          {!mealPlan || Object.keys(mealPlan).length === 0 ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 20,
              }}
            >
              <Text style={{ color: "#6B7280" }}>No meal plan found</Text>
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
        </ScrollView>
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

export default MealPlannerScreen;