import React, { useState, useRef, useEffect } from "react";
import {ScrollView,TouchableOpacity,Animated,StyleSheet,Alert,RefreshControl,Text} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { scale, verticalScale } from "@/utils/responsive";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { fetchUserById } from "@/redux/slice/auth/authSlice";
import { fetchGoalCustomization } from "@/redux/slice/goalCustomizationSlice";
import aiApi from "@/services/aiApi";
import api from "@/services/api";
import { SecureStorage } from "@/services/secureStorage";
import { COLORS,FONT,ACTIVITY_LEVELS,GOAL_MAP,WEIGHT_GOAL_MAP} from "../../../constants/constants";

import { Assessment, Customization, Timeline } from "./types";
import { AssessmentCard } from "./AssessmentCard";
import { WellnessPlanHeader } from "./WellnessPlanHeader";
import { ErrorState, LoadingState, SafetyBanner } from "./LoadingAndErrorStates";


import { CustomizeSection } from "./CustomizeSection";
import { NutritionPlanCard } from "./NutritionPlanCard";
import { WellnessGuidanceCard } from "./WellnessGuidanceCard";

// Helper function to normalize goal formats
const normalizeGoal = (goal: string): string => {
  if (!goal) return "lose";
  const normalized = goal.toLowerCase();
  if (normalized.includes("lose") || normalized === "lose") return "lose";
  if (normalized.includes("gain") || normalized === "gain") return "gain";
  if (normalized.includes("maintain") || normalized === "maintain")
    return "maintain";
  return "lose";
};

export default function WellnessScreen() {
  const dispatch = useAppDispatch();
  const { healthCondition, user } = useAppSelector((state) => state.auth);


  const { customization: reduxCustomization, loading: customizationLoading } =
    useAppSelector((state) => state.goalCustomization);

  const health = healthCondition || {};
  const navigation = useNavigation();

  // State
  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [isCustomized, setIsCustomized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [savingTimeline, setSavingTimeline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(
    null
  );

  // New state for custom inputs
  const [customCurrentWeight, setCustomCurrentWeight] = useState<string>("");
  const [customTargetWeight, setCustomTargetWeight] = useState<string>("");
  const [customWeeks, setCustomWeeks] = useState<string>("");
  const [selectedWeightGoal, setSelectedWeightGoal] = useState<string>("");

  const customization = reduxCustomization;

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const customizeHeight = useRef(new Animated.Value(0)).current;

  // Helpers
  const mappedActivity =
    ACTIVITY_LEVELS.find((a) => a.id === user?.activityLevel)?.label ||
    "Active";

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchUserById(user.userId));
      fetchGoalAssessment();
    }
  }, [user?.userId]);

  useEffect(() => {
    if (user && !customCurrentWeight) {
      const currentWeight = user?.weightInLbs || "";
      setCustomCurrentWeight(currentWeight.toString());
      console.log("Initializing current weight from user:", currentWeight);

      const targetWeight = user?.targetWeight || "";
      setCustomTargetWeight(targetWeight.toString());
      console.log("Initializing target weight from user:", targetWeight);

      const weeks = user?.timeLine_weeks || "";
      setCustomWeeks(weeks.toString());
      console.log("Initializing weeks from user:", weeks);

      const normalizedGoal = normalizeGoal(user.goal);
      setSelectedWeightGoal(normalizedGoal);
      console.log(
        "Setting weight goal:",
        normalizedGoal,
        "from user goal:",
        user.goal
      );
    }
  }, [user]);

  useEffect(() => {
    if (assessment) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [assessment]);

  const fetchGoalAssessment = async () => {
    try {
      setError(null);
      setLoading(true);
      const requestBody = {
        birth_year: user.birthYear,
        birth_month: user.birthMonth,
        weight_lbs: user.weightInLbs || 150,
        height_feet: user.heightInFeet,
        height_inches: user.heightInInches,
        biological_sex: user.gender,
        activity_level: mappedActivity,
        food_preference: user.dietPreference,
        primary_goal: GOAL_MAP[user.goal],
        health_conditions: {
          diabetes_type1_type2:
            health.diabetes_type1_type2 ??
            health.diabetes ??
            health.preDiabetes ??
            false,
          hypertension: health.hypertension ?? false,
          cancer: health.cancer ?? false,
          immune_disorder: health.immune_disorder ?? false,
          neurological_health: health.neurological_health ?? false,
          food_allergies: health.food_allergies ?? [],
        },
      };
      const { data } = await aiApi.post("/goal-assessment", requestBody);
      if (data.success) {
        setAssessment(data);
        if (data.recommended_timeline) {
          setSelectedTimeline(data.recommended_timeline);
          await fetchCustomization(data.recommended_timeline);
        }
      } else throw new Error(data.message || "Assessment failed");
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCustomization = async (timeline: Timeline) => {
    try {
      const currentWeight =
        timeline?.weight_lbs ||
        assessment?.weight_lbs ||
        user?.weightInLbs ||
        150;

      const normalizedGoal = normalizeGoal(
        timeline?.weight_goal || user?.goal || "lose"
      );

      const requestBody = {
        birth_year: user.birthYear,
        birth_month: user.birthMonth,
        weight_lbs: currentWeight,
        height_feet: user.heightInFeet,
        height_inches: user.heightInInches,
        biological_sex: user.gender,
        activity_level: mappedActivity,
        weight_goal: normalizedGoal,
        target_weight_lbs: timeline.target_weight_lbs,
        primary_goal:
          GOAL_MAP[user.goal] ||
          (normalizedGoal === "lose"
            ? "lose_weight"
            : normalizedGoal === "gain"
              ? "gain_weight"
              : "maintain_weight"),
        target_weeks: timeline.timeline_weeks,
        health_conditions: {
          diabetes_type1_type2: user.health?.diabetes || false,
          hypertension: user.health?.hypertension || false,
          food_allergies: user.health?.food_allergies || [],
        },
      };

      console.log("🔵 Fetching customization with:", requestBody);

      // Dispatch and the Redux store will automatically update
      const result = await dispatch(fetchGoalCustomization(requestBody));

      if (fetchGoalCustomization.fulfilled.match(result)) {
        console.log("✅ Customization fetched successfully");
        console.log("📦 Customization data:", result.payload);
      } else {
        console.log("❌ API call failed:", result.error);
      }
    } catch (err) {
      console.error("❌ Failed to fetch customization:", err);
    }
  };

  const saveSelectedTimeline = async (timeline: Timeline): Promise<boolean> => {
    try {
      setSavingTimeline(true);
      const requestBody = {
        userId: user?.userId,
        approach_name: timeline.approach_name,
        target_weight_lbs: timeline.target_weight_lbs,
        weight_change_lbs: timeline.weight_change_lbs,
        timeline_weeks: timeline.timeline_weeks,
        weekly_rate: timeline.weekly_rate,
        weight_goal: timeline.weight_goal,
        weight_loss_rate: timeline.weight_loss_rate,
        difficulty_level: timeline.difficulty_level,
        focus_areas: timeline.focus_areas,
        expected_outcomes: timeline.expected_outcomes,
        nutrition_emphasis: timeline.nutrition_emphasis,
        exercise_emphasis: timeline.exercise_emphasis,
        tdee: assessment?.tdee,
        bmr: assessment?.bmr,
        current_weight_lbs: assessment?.weight_lbs || user?.weightInLbs,
        target_calories:
          customization?.target_calories ||
          (assessment ? assessment.tdee - timeline.weekly_rate * 500 : 0),
      };
      const { data } = await api.post(
        `/goal/assessment/${user?.userId}`,
        requestBody
      );
      if (data) {
        await SecureStorage.setItem(
          "selectedTimeline",
          JSON.stringify(timeline)
        );
        await SecureStorage.setItem("goalAssessmentComplete", "true");
        return true;
      } else throw new Error(data.message || "Failed to save timeline");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Failed to save timeline"
      );
      return false;
    } finally {
      setSavingTimeline(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchGoalAssessment();
  };

  const targetWeights = assessment?.available_timelines
    ? [
      ...new Set(
        assessment.available_timelines.map((t) => t.target_weight_lbs)
      ),
    ]
    : [];

  const filteredTimelines =
    selectedTarget && assessment?.available_timelines
      ? assessment.available_timelines.filter(

        (t) => t.target_weight_lbs === selectedTarget
      )
      : [];

  const toggleCustomize = () => {
    setShowCustomize(!showCustomize);
    Animated.spring(customizeHeight, {
      toValue: showCustomize ? 0 : 1,
      useNativeDriver: false,
      friction: 8,
    }).start();
  };

  const handleConfirm = async () => {
    if (!customCurrentWeight || !customTargetWeight || !selectedWeightGoal) {
      Alert.alert(
        "Missing Information",
        "Please fill in current weight, target weight, and select a weight goal."
      );
      return;
    }

    const currentWt = parseFloat(customCurrentWeight);
    const targetWt = parseFloat(customTargetWeight);
    const weeks = customWeeks ? parseInt(customWeeks) : null;

    if (isNaN(currentWt) || isNaN(targetWt)) {
      Alert.alert("Invalid Input", "Please enter valid weight values.");
      return;
    }

    if (currentWt <= 0 || targetWt <= 0) {
      Alert.alert("Invalid Input", "Weight values must be greater than zero.");
      return;
    }

    if (weeks && weeks < 1) {
      Alert.alert("Invalid Timeline", "Timeline must be at least 1 week.");
      return;
    }

    const weightDiff = targetWt - currentWt;

    if (selectedWeightGoal === "lose" && weightDiff >= 0) {
      Alert.alert(
        "Invalid Goal",
        "Target weight must be less than current weight for weight loss."
      );
      return;
    }
    if (selectedWeightGoal === "gain" && weightDiff <= 0) {
      Alert.alert(
        "Invalid Goal",
        "Target weight must be greater than current weight for weight gain."
      );
      return;
    }

    try {
      setLoading(true);

      const absoluteWeightDiff = Math.abs(weightDiff);
      const estimatedWeeks = weeks || Math.ceil(absoluteWeightDiff / 1.5);
      const weeklyRate = parseFloat(
        (absoluteWeightDiff / estimatedWeeks).toFixed(2)
      );

      const weightLossRate =
        weeklyRate > 2
          ? "aggressive"
          : weeklyRate > 1
            ? "moderate"
            : "conservative";
     // Custom timeline
      const customTimeline: Timeline = {
        approach_name: "custom_plan",
        target_weight_lbs: targetWt,
        timeline_weeks: estimatedWeeks,
        weekly_rate: weeklyRate,
        weight_change_lbs: weightDiff,
        weight_goal: selectedWeightGoal,
        weight_loss_rate: weightLossRate,
        difficulty_level:
          weeklyRate > 2
            ? "aggressive"
            : weeklyRate > 1

              ? "moderate"
              : "conservative",

        focus_areas: ["Nutrition", "Exercise"],
        expected_outcomes: [`Reach ${targetWt} lbs in ${estimatedWeeks} weeks`],
        nutrition_emphasis: "Balanced macro distribution",
        exercise_emphasis: "Consistent activity",
        weight_lbs: currentWt,
      };

      console.log("🔵 Custom Timeline:", customTimeline);
      await dispatch(fetchUserById(user.userId));

      // Fetch customization with the custom timeline
      await fetchCustomization(customTimeline);
      await dispatch(fetchUserById(user.userId));
      // Save the timeline
      const saved = await saveSelectedTimeline(customTimeline);
      if (saved) {
        setIsCustomized(true);
        setSelectedTimeline(customTimeline);
        Alert.alert("Success", "Your custom plan has been saved!");
        toggleCustomize();
        await dispatch(fetchUserById(user.userId));
      }
    } catch (error) {
      console.error("Customization error:", error);
      Alert.alert("Error", "Failed to apply customization. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStartJourney = async () => {
    if (selectedTimeline) {
      const saved = await saveSelectedTimeline(selectedTimeline);
      if (saved) {
        navigation.navigate("Landing");
        Alert.alert("Success", "Your wellness journey has started!");
      }
    } else {
      Alert.alert("Select Timeline", "Please choose a timeline to continue.");
    }
  };

  // Debug logging
  console.log("📊 Current state:", {
    customCurrentWeight,
    customTargetWeight,
    customWeeks,
    selectedWeightGoal,
    userWeight: user?.weightInLbs,
    userGoal: user?.goal,
    hasCustomization: !!customization,
    customizationData: customization,
  });

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={COLORS.primary}
        />
      }
    >
      {(loading || customizationLoading) && !assessment ? (
        <LoadingState />
      ) : error ? (
        <ErrorState error={error} onRetry={fetchGoalAssessment} />
      ) : !assessment ? (
        <ErrorState
          error="No assessment data available"
          onRetry={fetchGoalAssessment}
        />
      ) : (
        <Animated.View
          style={[
            styles.content,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <WellnessPlanHeader
            onMenuPress={() => navigation.navigate("AllScreensMenu")}
          />

          <AssessmentCard
            age={assessment.age || new Date().getFullYear() - user?.birthYear}
            weight={assessment.weight_lbs}
            onStartPlan={() => handleStartJourney()}
            bmi={assessment.user_assessment?.current_bmi}
            tdee={assessment.tdee}
            bmiCategory={assessment.user_assessment?.bmi_category}
            healthRiskLevel={assessment.user_assessment?.health_risk_level}
            recommendedTimeline={assessment.recommended_timeline}
            importantNotes={assessment.important_notes}
            availableTimelines={assessment.available_timelines}
            selectedTimelineId={selectedApproach}
            onSelectTimeline={(id) => {
              setSelectedApproach(id);

              const picked = assessment.available_timelines.find(
                (t) => `${t.approach_name}-${t.target_weight_lbs}` === id
              );

              if (picked) {
                setSelectedTimeline(picked);

                // Auto-populate customization fields
                setCustomTargetWeight(picked.target_weight_lbs.toString());
                setCustomWeeks(picked.timeline_weeks.toString());

                // Auto-select weight goal if available
                if (picked.weight_goal) {
                  const normalizedGoal = normalizeGoal(picked.weight_goal);
                  setSelectedWeightGoal(normalizedGoal);
                }

                // Auto-open customization section
                if (!showCustomize) {
                  setShowCustomize(true);
                  Animated.spring(customizeHeight, {
                    toValue: 1,
                    useNativeDriver: false,
                    friction: 8,
                  }).start();
                }

                fetchCustomization(picked);
              }
            }}
          />

          <CustomizeSection
            showCustomize={showCustomize}
            customizeHeight={customizeHeight}
            targetWeights={targetWeights}
            selectedTarget={selectedTarget}
            selectedApproach={selectedApproach}
            filteredTimelines={filteredTimelines}
            currentWeight={assessment.weight_lbs || user?.weightInLbs}
            loading={loading || customizationLoading}
            onToggleCustomize={toggleCustomize}
            onSelectTarget={(w) => {
              setSelectedTarget(w);
              setCustomTargetWeight(w.toString());
              setSelectedApproach(null);
            }}
            onSelectApproach={setSelectedApproach}
            onConfirm={handleConfirm}
            customCurrentWeight={customCurrentWeight}
            customTargetWeight={customTargetWeight}
            customWeeks={customWeeks}
            selectedWeightGoal={selectedWeightGoal}
            onCurrentWeightChange={setCustomCurrentWeight}
            onTargetWeightChange={(value) => {
              setCustomTargetWeight(value);
              setSelectedTarget(null);
            }}
            onWeeksChange={setCustomWeeks}
            onWeightGoalSelect={setSelectedWeightGoal}
          />

          {customization && (
            <>
              {console.log("🟢 Rendering NutritionPlanCard with:", {
                targetCalories: customization.target_calories,
                calorieAdjustment: customization.calorie_adjustment,
                currentWeight: customization.weight_lbs,
                targetWeight: customization.target_weight_lbs,
                macroBreakdown: customization.macro_breakdown,
                nutritionTargets: customization.nutrition_targets,
                timelineDetails: customization.timeline_details,
                goal: WEIGHT_GOAL_MAP[user.goal],
                isCustomized: isCustomized,
              })}
              <NutritionPlanCard
                targetCalories={customization.target_calories}
                calorieAdjustment={customization.calorie_adjustment}
                currentWeight={customization.weight_lbs}
                targetWeight={customization.target_weight_lbs}
                macroBreakdown={customization.macro_breakdown}
                nutritionTargets={customization.nutrition_targets}
                timelineDetails={customization.timeline_details}
                goal={normalizeGoal(user?.goal || "lose")}
                isCustomized={isCustomized}
              />
            </>
          )}

          {customization?.wellness_guidance && (
            <WellnessGuidanceCard
              wellnessGuidance={customization.wellness_guidance}
            />
          )}

          {assessment?.safety_assessment && (
            <SafetyBanner riskLevel={assessment.safety_assessment.risk_level} />
          )}

          <TouchableOpacity
            style={styles.startButton}
            activeOpacity={0.8}
            onPress={handleStartJourney}
          >
            <LinearGradient
              colors={[COLORS.primary, COLORS.primaryLight]}
              style={styles.startButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.startButtonText}>
                {savingTimeline ? "Starting..." : "Start Meal Plan"}
              </Text>
              <Ionicons
                name="arrow-forward"
                size={scale(20)}
                color={COLORS.white}
                style={{ marginLeft: scale(8) }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { padding: scale(16), paddingBottom: verticalScale(80) },
  startButton: {
    borderRadius: scale(12),
    overflow: "hidden",
    marginBottom: verticalScale(20),
  },
  startButtonGradient: {
    flexDirection: "row",
    padding: verticalScale(16),
    alignItems: "center",
    justifyContent: "center",
  },
  startButtonText: {
    color: COLORS.white,
    fontSize: FONT.lg,
    fontWeight: "700",
  },
});
