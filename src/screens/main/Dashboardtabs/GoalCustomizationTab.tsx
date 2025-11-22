import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Icon from "react-native-vector-icons/Feather";
import { styles } from "./styles/GoalCustomizationStyles";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import {
  clearCustomization,
  fetchGoalCustomization,
} from "@/redux/slice/goalCustomizationSlice";
import DashboardHeader from "@/components/DashboardHeader";
import { Colors } from "@/constants/Colors";
import { fetchUserById } from "@/redux/slice/auth/authSlice";
import { ImageBackground } from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SecureStorage } from "@/services/secureStorage";

const GoalCustomizationScreen = ({ navigation, route }) => {
  const dispatch = useAppDispatch();

  // Get data from route params (from GoalAssessmentScreen)
  const {
    assessment: assessmentFromRoute,
    user: userFromRoute,
    selectedTimeline: timelineFromRoute,
    tdee: tdeeFromRoute,
    bmr: bmrFromRoute,
    targetCalories: targetCaloriesFromRoute,
    targetWeight: targetWeightFromRoute,
    targetWeeks: targetWeeksFromRoute,
    weeklyRate: weeklyRateFromRoute,
    currentWeight: currentWeightFromRoute,
  } = route?.params || {};

  // console.log("🔍 Route Params Debug:", {
  //   targetWeeksFromRoute,
  //   timelineFromRoute,
  //   fullParams: route?.params
  // });

  const user = useAppSelector((state) => state.auth.user);
  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchUserById(user.userId));
    }
  }, [user?.userId]);
  const { customization, loading, error } = useAppSelector(
    (state) => state.goalCustomization
  );

  const currentYear = new Date().getFullYear();
  const calculatedBirthYear = user?.age ? currentYear - user.age : 1990;

  const activityEnumToApi = {
    NOT_ACTIVE: "Not Active",
    SOMEWHAT_ACTIVE: "Somewhat Active",
    ACTIVE: "Active",
    VERY_ACTIVE: "Very Active",
    EXTRA_ACTIVE: "Athletic",
    ATHLETIC: "Athletic",
    PRO_ATHLETE: "Pro Athlete",
  };

  const goalMap = {
    weight_loss: "lose",
    muscle_gain: "gain",
    maintenance: "maintain",
    lose: "lose",
    LOSE:"lose",
    gain: "gain",
    GAIN:'gain',
    MAINTAIN:'maintain',
    lose_weight: "LOSE",
    gain_weight: "gain",
    maintain_weight: "maintain",
  };


  const [birthYear, setBirthYear] = useState(
    user?.birthYear?.toString() || calculatedBirthYear.toString()
  );
  const [birthMonth, setBirthMonth] = useState(
    user?.birthMonth?.toString() || "6"
  );
  const [weightLbs, setWeightLbs] = useState(
    currentWeightFromRoute?.toString() || user?.weightInLbs?.toString() || "180"
  );
  const [heightFeet, setHeightFeet] = useState(
    user?.heightInFeet?.toString() || "5"
  );
  const [heightInches, setHeightInches] = useState(
    user?.heightInInches?.toString() || "10"
  );
  const [biologicalSex, setBiologicalSex] = useState(
    user?.gender || user?.biologicalSex || "M"
  );
  const [activityLevel, setActivityLevel] = useState(
    user?.activityLevel || "Active"
  );
  const [foodPreference, setFoodPreference] = useState(
    user?.dietPreference || user?.foodPreference || "Non-Veg"
  );
  const [targetWeightLbs, setTargetWeightLbs] = useState(
    targetWeightFromRoute?.toString() || user?.targetWeight?.toString() || "160"
  );
  const [targetWeeks, setTargetWeeks] = useState(
    targetWeeksFromRoute?.toString() || user?.targetWeeks || "20"
  );
  console.log(targetWeeks);
  const [weightGoal, setWeightGoal] = useState(
      goalMap[user?.goal] || "lose"
  );

  // Initialize form values from route params or user data
  useEffect(() => {
    // First priority: route params
    if (currentWeightFromRoute) setWeightLbs(currentWeightFromRoute.toString());
    if (targetWeightFromRoute)
      setTargetWeightLbs(targetWeightFromRoute.toString());
    if (targetWeeksFromRoute) setTargetWeeks(targetWeeksFromRoute.toString());
    if (timelineFromRoute?.weight_goal)
      setWeightGoal(goalMap[timelineFromRoute.weight_goal] || "lose");

    // Second priority: user data
    if (!currentWeightFromRoute && user) {
      if (user.birthYear) setBirthYear(user.birthYear.toString());
      if (user.birthMonth) setBirthMonth(user.birthMonth.toString());
      if (user.age) setBirthYear((currentYear - user.age).toString());
      if (user.weightInLbs) setWeightLbs(user.weightInLbs.toString());
      if (user.heightInFeet) setHeightFeet(user.heightInFeet.toString());
      if (user.heightInches) setHeightInches(user.heightInches.toString());
      if (user.gender) setBiologicalSex(user.gender);
      if (user.biologicalSex) setBiologicalSex(user.biologicalSex);
      if (user.activityLevel) setActivityLevel(user.activityLevel);
      if (user.dietPreference) setFoodPreference(user.dietPreference);
      if (user.foodPreference) setFoodPreference(user.foodPreference);
      if (user.targetWeight) setTargetWeightLbs(user.targetWeight.toString());
      if (user.targetWeeks) setTargetWeeks(user.targetWeeks.toString());
      if (user.goal) setWeightGoal(goalMap[user.goal.toLowerCase()] || "lose");
    }
  }, [
    user,
    currentWeightFromRoute,
    targetWeightFromRoute,
    targetWeeksFromRoute,
    timelineFromRoute,
  ]);

  const activityLevels = [
    { id: "NOT_ACTIVE", label: "Not Active", icon: "moon" },
    { id: "SOMEWHAT_ACTIVE", label: "Somewhat Active", icon: "sun" },
    { id: "ACTIVE", label: "Active", icon: "zap" },
    { id: "VERY_ACTIVE", label: "Very Active", icon: "trending-up" },
    { id: "EXTRA_ACTIVE", label: "Athletic", icon: "flame" },
    { id: "PRO_ATHLETE", label: "Pro Athlete", icon: "star" },
  ];

  const weightGoals = [
    {
      id: "lose",
      label: "Lose Weight",
      icon: "trending-down",
      color: "#ef4444",
    },
    { id: "maintain", label: "Maintain", icon: "minus", color: "#3b82f6" },
    { id: "gain", label: "Gain Weight", icon: "trending-up", color: "#10b981" },
  ];

  const handleCustomize = () => {
    const currentWeight = parseFloat(weightLbs);
    const targetWeight = parseFloat(targetWeightLbs);

    if (weightGoal === "gain" && targetWeight <= currentWeight) {
      Alert.alert(
        "Invalid Target",
        `For weight gain, your target weight (${targetWeight} lbs) must be greater than your current weight (${currentWeight} lbs).`
      );
      return;
    }

    if (weightGoal === "lose" && targetWeight >= currentWeight) {
      Alert.alert(
        "Invalid Target",
        `For weight loss, your target weight (${targetWeight} lbs) must be less than your current weight (${currentWeight} lbs).`
      );
      return;
    }

    if (
      weightGoal === "maintain" &&
      Math.abs(targetWeight - currentWeight) > 3
    ) {
      Alert.alert(
        "Invalid Target",
        `For maintenance, your target and current weights should be almost the same (within 3 lbs).`
      );
      return;
    }

    const mappedActivity =
      activityEnumToApi[user?.activityLevel || activityLevel] || "Active";

    dispatch(
      fetchGoalCustomization({
        birth_year: parseInt(birthYear),
        birth_month: parseInt(birthMonth) || 1,
        weight_lbs: currentWeight,
        height_feet: parseInt(heightFeet) || 5,
        height_inches: parseInt(heightInches) || 0,
        biological_sex: biologicalSex,
        activity_level: mappedActivity,
        food_preference: foodPreference,
        target_weight_lbs: targetWeight,
        target_weeks: parseInt(targetWeeks) || 12,
        weight_goal: weightGoal,
      })
    );
  };

  useEffect(() => {
    if (customization && user?.userId) {
      console.log("🎯 Goal customization complete. Refreshing user data...");
      dispatch(fetchUserById(user.id));
      Alert.alert(
        "✅ Goal Updated",
        "Your goal has been customized successfully!"
      );
    }
  }, [customization]);

  // Navigate to LandingMain
  const handleGoToLandingMain = async () => {
    if (!customization) {
      Alert.alert(
        "No Customization",
        "Please generate your plan first before proceeding to dashboard."
      );
      return;
    }

    await SecureStorage.setItem("goalAssessmentComplete", "true");

    navigation.navigate("LandingMain", {
      assessment: assessmentFromRoute || {
        tdee: customization.tdee,
        bmr: customization.bmr,
        weight_lbs: parseFloat(weightLbs),
      },
      user,
      selectedTimeline: timelineFromRoute || {
        target_weight_lbs: customization.target_weight_lbs,
        timeline_weeks:
          customization.timeline_details?.estimated_weeks_to_goal ||
          parseInt(targetWeeks),
        weekly_rate:
          customization.timeline_details?.expected_weekly_loss_lbs || 0,
      },
      tdee: customization.tdee,
      targetCalories: customization.target_calories,
      targetWeight: customization.target_weight_lbs,
      customization,
    });
  };

  // Calculate values from API response
  const currentWeightLbs = parseFloat(weightLbs);
  const targetWeightValue =
    customization?.target_weight_lbs || parseFloat(targetWeightLbs);
  const weightChange = Math.abs(currentWeightLbs - targetWeightValue);
  const weeklyRate =
    customization?.timeline_details?.expected_weekly_loss_lbs ||
    weightChange /
      (customization?.timeline_details?.estimated_weeks_to_goal ||
        parseInt(targetWeeks));
  const [menuVisible, setMenuVisible] = useState(false);

  const handleMenuPress = () => {
    navigation.navigate("AllScreensMenu");
  };
  return (
    <>
      <View style={styles.container}>
        <View style={styles.headerCard}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80",
            }}
            style={styles.headerImageBg}
            imageStyle={styles.headerImageStyle}
          >
            <LinearGradient
              colors={["rgba(59, 130, 246, 0.95)", "rgba(29, 78, 216, 0.90)"]}
              style={styles.headerOverlay}
            >
              <View style={styles.headerTopRow}>
                <View>
                  <Text style={styles.titleWithBg}>Goal Customization</Text>
                  <Text style={styles.subtitleWithBg}>
                    Set Your Fitness Goals
                  </Text>
                </View>

                {/* <View style={styles.headerUserBox}>
          <MaterialCommunityIcons
            name="target-account"
            size={36}
            color="#fff"
          />
        </View> */}
                <TouchableOpacity
                  onPress={handleMenuPress}
                  style={{
                    padding: 8,
                    backgroundColor: "rgba(255, 255, 255, 0.18)",
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.3)",
                    backdropFilter: "blur(10px)", // works on web but RN ignores
                  }}
                >
                  <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              <Text style={styles.descriptionWithBg}>
                Personalize your goals to get tailored meal plans & suggestions
              </Text>
            </LinearGradient>
          </ImageBackground>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            {/* Form Content */}
            <View style={styles.formSection}>
              {/* Weight Goal Card */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>🎯 Weight Goal</Text>
                <View style={styles.goalGrid}>
                  {weightGoals.map((goal) => (
                    <TouchableOpacity
                      key={goal.id}
                      style={[
                        styles.goalOption,
                        weightGoal === goal.id && {
                          borderColor: goal.color,
                          backgroundColor: `${goal.color}15`,
                        },
                      ]}
                      onPress={() => {
                        setWeightGoal(goal.id);
                        dispatch(clearCustomization());
                      }}
                    >
                      <Icon
                        name={goal.icon}
                        size={32}
                        color={weightGoal === goal.id ? goal.color : "#64748b"}
                      />
                      <Text
                        style={[
                          styles.goalOptionText,
                          weightGoal === goal.id && { color: goal.color },
                        ]}
                      >
                        {goal.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Current Weight Card */}
              <View style={styles.card}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.sectionTitle}>⚖️ Current Weight</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <TextInput
                      style={[
                        styles.input,
                        { width: 80, marginBottom: 0, textAlign: "right" },
                      ]}
                      value={weightLbs}
                      onChangeText={(text) => {
                        setWeightLbs(text);
                        dispatch(clearCustomization());
                      }}
                      keyboardType="numeric"
                      placeholder="180"
                      placeholderTextColor="#94a3b8"
                    />
                    <Text
                      style={{ fontSize: 16, color: "#64748b", marginLeft: 8 }}
                    >
                      lbs
                    </Text>
                  </View>
                </View>
              </View>

              {/* Target Details Card */}
              <View style={styles.card}>
                <Text style={styles.sectionTitle}>📊 Target Details</Text>

                <View style={styles.inputRow}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Target Weight (lbs)</Text>
                    <TextInput
                      style={styles.input}
                      value={targetWeightLbs}
                      onChangeText={(text) => {
                        setTargetWeightLbs(text);
                        dispatch(clearCustomization());
                      }}
                      keyboardType="numeric"
                      placeholder="160"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                  <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Timeline (weeks)</Text>
                    <TextInput
                      style={styles.input}
                      value={targetWeeks}
                      onChangeText={(text) => {
                        setTargetWeeks(text);
                        dispatch(clearCustomization());
                      }}
                      keyboardType="numeric"
                      placeholder="20"
                      placeholderTextColor="#94a3b8"
                    />
                  </View>
                </View>
              </View>

              {/* Error Display */}
              {error && (
                <View style={styles.errorContainer}>
                  <Icon name="alert-circle" size={20} color="#ef4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              )}

              {/* Customize Button */}
              <TouchableOpacity
                style={styles.customizeButton}
                onPress={handleCustomize}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#3b82f6", "#2563eb"]}
                  style={styles.buttonGradient}
                >
                  {loading ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator color="#fff" size="small" />
                      <Text style={styles.buttonText}>Creating Plan...</Text>
                    </View>
                  ) : (
                    <>
                      <Icon name="zap" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Generate My Plan</Text>
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              {/* Results */}
              {customization && customization.success && (
                <View style={styles.resultsContainer}>
                  {/* Summary Card */}
                  <LinearGradient
                    colors={["#3b82f6", "#2563eb"]}
                    style={styles.summaryCard}
                  >
                    <View style={styles.summaryHeader}>
                      <Icon name="check-circle" size={28} color="#fff" />
                      <Text style={styles.summaryTitle}>Your Custom Plan</Text>
                    </View>

                    <View style={styles.summaryGrid}>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Current</Text>
                        <Text style={styles.summaryValue}>
                          {currentWeightLbs.toFixed(0)} lbs
                        </Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Target</Text>
                        <Text style={styles.summaryValue}>
                          {targetWeightValue.toFixed(0)} lbs
                        </Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Change</Text>
                        <Text style={styles.summaryValue}>
                          {weightChange.toFixed(1)} lbs
                        </Text>
                      </View>
                      <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Timeline</Text>
                        <Text style={styles.summaryValue}>
                          {customization.timeline_details
                            ?.estimated_weeks_to_goal ||
                            parseInt(targetWeeks)}{" "}
                          weeks
                        </Text>
                      </View>
                    </View>

                    <View style={styles.weeklyBox}>
                      <Text style={styles.weeklyLabel}>Weekly Target</Text>
                      <Text style={styles.weeklyValue}>
                        {weeklyRate.toFixed(1)} lbs/week
                      </Text>
                    </View>
                  </LinearGradient>

                  {/* Nutrition Card */}
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Icon name="pie-chart" size={22} color="#3b82f6" />
                      <Text style={styles.cardTitle}>Daily Nutrition</Text>
                    </View>

                    <View style={styles.calorieBox}>
                      <Text style={styles.calorieLabel}>
                        Daily Calorie Target
                      </Text>
                      <Text style={styles.calorieValue}>
                        {customization.target_calories ||
                          customization.nutrition_targets?.calories}
                      </Text>
                      <Text style={styles.calorieUnit}>calories</Text>
                    </View>

                    <Text style={styles.macrosTitle}>Macros Breakdown</Text>
                    <View style={styles.macrosGrid}>
                      <View
                        style={[
                          styles.macroItem,
                          { backgroundColor: "#fee2e2" },
                        ]}
                      >
                        <Icon name="zap" size={20} color="#dc2626" />
                        <Text style={styles.macroLabel}>Protein</Text>
                        <Text style={styles.macroValue}>
                          {customization.nutrition_targets?.protein_g ||
                            customization.macro_breakdown?.protein?.grams?.toFixed(
                              0
                            )}
                          g
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.macroItem,
                          { backgroundColor: "#dbeafe" },
                        ]}
                      >
                        <Icon name="droplet" size={20} color="#2563eb" />
                        <Text style={styles.macroLabel}>Carbs</Text>
                        <Text style={styles.macroValue}>
                          {customization.nutrition_targets?.carbs_g ||
                            customization.macro_breakdown?.carbohydrates?.grams?.toFixed(
                              0
                            )}
                          g
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.macroItem,
                          { backgroundColor: "#fef3c7" },
                        ]}
                      >
                        <Icon name="sun" size={20} color="#ca8a04" />
                        <Text style={styles.macroLabel}>Fats</Text>
                        <Text style={styles.macroValue}>
                          {customization.nutrition_targets?.fat_g ||
                            customization.macro_breakdown?.fat?.grams?.toFixed(
                              0
                            )}
                          g
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Health Metrics Card */}
                  <View style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Icon name="heart" size={22} color="#ef4444" />
                      <Text style={styles.cardTitle}>Health Metrics</Text>
                    </View>

                    <View style={styles.metricsGrid}>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>BMR</Text>
                        <Text style={styles.metricValue}>
                          {customization.bmr?.toFixed(0)} cal
                        </Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>TDEE</Text>
                        <Text style={styles.metricValue}>
                          {customization.tdee?.toFixed(0)} cal
                        </Text>
                      </View>
                      <View style={styles.metricItem}>
                        <Text style={styles.metricLabel}>Daily Deficit</Text>
                        <Text style={styles.metricValue}>
                          {customization.timeline_details
                            ?.daily_calorie_deficit ||
                            Math.abs(
                              customization.calorie_adjustment || 0
                            )}{" "}
                          cal
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Wellness Guidance Card */}
                  {customization.wellness_guidance && (
                    <View style={styles.card}>
                      <View style={styles.cardHeader}>
                        <Icon name="star" size={22} color="#f59e0b" />
                        <Text style={styles.cardTitle}>Wellness Tips</Text>
                      </View>

                      {customization.wellness_guidance.mental_health &&
                        customization.wellness_guidance.mental_health.length >
                          0 && (
                          <View style={styles.tipSection}>
                            <Text style={styles.tipTitle}>Mental Health</Text>
                            {customization.wellness_guidance.mental_health.map(
                              (tip, index) => (
                                <View key={index} style={styles.tipItem}>
                                  <Icon
                                    name="check"
                                    size={16}
                                    color="#10b981"
                                  />
                                  <Text style={styles.tipText}>{tip}</Text>
                                </View>
                              )
                            )}
                          </View>
                        )}

                      {customization.wellness_guidance.sleep_and_recovery &&
                        customization.wellness_guidance.sleep_and_recovery
                          .length > 0 && (
                          <View style={styles.tipSection}>
                            <Text style={styles.tipTitle}>
                              Sleep & Recovery
                            </Text>
                            {customization.wellness_guidance.sleep_and_recovery.map(
                              (tip, index) => (
                                <View key={index} style={styles.tipItem}>
                                  <Icon
                                    name="check"
                                    size={16}
                                    color="#10b981"
                                  />
                                  <Text style={styles.tipText}>{tip}</Text>
                                </View>
                              )
                            )}
                          </View>
                        )}
                    </View>
                  )}

                  {/* Safety Warnings */}
                  {customization.safety_warnings &&
                    customization.safety_warnings.length > 0 && (
                      <View style={styles.warningCard}>
                        <Icon name="alert-triangle" size={20} color="#f59e0b" />
                        <Text style={styles.warningText}>
                          {customization.safety_warnings[0]}
                        </Text>
                      </View>
                    )}

                  {/* Go to Dashboard Button */}
                  <TouchableOpacity
                    style={styles.customizeButton}
                    onPress={handleGoToLandingMain}
                    activeOpacity={0.8}
                  >
                    <LinearGradient
                      colors={["#3b82f6", "#2563eb"]}
                      style={styles.buttonGradient}
                    >
                      <Icon name="home" size={20} color="#fff" />
                      <Text style={styles.buttonText}>Start Plan</Text>
                      <Icon name="arrow-right" size={20} color="#fff" />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
    </>
  );
};

export default GoalCustomizationScreen;