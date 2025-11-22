import { Colors } from "@/constants/Colors";
import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { styles } from "./styles/MakeitScreenStyles";
import AIRecommendationsSection from "@/components/mealplan/AIRecommendationsSection";
import RecipesForYouSection from "@/components/mealplan/RecipesForYouSection";
import TodaysMealPlanSection from "@/components/mealplan/TodaymMealplan";
import QuickActionsSection from "@/components/mealplan/QuickActionSection";
import MealKitsSection from "@/components/mealplan/MealKitsSection";
import { showModal } from "@/redux/slice/modalSlice";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAppDispatch } from "@/redux/store/hooks";
const MakeItScreen = ({ mealPlan, onFetchMealPlan }) => {
  const [loading, setLoading] = React.useState(!mealPlan);
  const [error, setError] = React.useState(null);
  const [apiMealPlan, setApiMealPlan] = React.useState(mealPlan);
  const [showAllRecipes, setShowAllRecipes] = React.useState(false);
   const dispatch = useAppDispatch();

  console.log("mealPlan", mealPlan);

  React.useEffect(() => {
    if (!mealPlan && onFetchMealPlan) {
      fetchMealPlanData();
    }
  }, [mealPlan, onFetchMealPlan]);

  const fetchMealPlanData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await onFetchMealPlan();
      if (response && response.data) {
        setApiMealPlan(response.data);
      } else {
         dispatch(
              showModal({
                type: "error",
                message:  "Invalid API response format",
              })
            );
       
      }
    } catch (err) {
      console.error("Error fetching meal plan:", err);
        dispatch(
              showModal({
                type: "error",
                message: err.message  || "Login failed",
              })
            );
    } finally {
      setLoading(false);
    }
  };

  const handleViewWeek = () => console.log("View Week pressed");
  const handleViewAllRecipes = () => {
    setShowAllRecipes((prev) => !prev);
  };
  const handleRecipePress = (recipe) =>
    console.log("Recipe pressed:", recipe.name);
  const handleRecommendationPress = () =>
    console.log("AI Recommendation pressed");
  const handleActionPress = (actionId) =>
    console.log("Quick action pressed:", actionId);
  const handleMealKitPress = (kitId) => console.log("Meal kit pressed:", kitId);

 
  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchMealPlanData}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

 
  if (!loading && !apiMealPlan) {
    return (
         
      <LoadingSpinner
        visible={loading}
        message="Fetching meal plan..."
      />
    );
  }

  return (
    <>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {apiMealPlan && (
          <>
            <TodaysMealPlanSection
              mealPlan={apiMealPlan}
              onViewWeek={handleViewWeek}
            />

            <RecipesForYouSection
              mealPlan={apiMealPlan}
              onViewAll={handleViewAllRecipes}
              onRecipePress={handleRecipePress}
              showAll={showAllRecipes}
            />

            <AIRecommendationsSection
              onRecommendationPress={handleRecommendationPress}
            />

            <QuickActionsSection onActionPress={handleActionPress} />

            <MealKitsSection onMealKitPress={handleMealKitPress} />
          </>
        )}
      </ScrollView>

   
    </>
  );
};

export default MakeItScreen;