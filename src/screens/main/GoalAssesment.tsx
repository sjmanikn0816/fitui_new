import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Animated,
  Platform,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import aiApi from "@/services/aiApi";
import { styles } from "../styles/GoalAssesmentScreen";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { fetchUserById } from "@/redux/slice/auth/authSlice";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import api from "@/services/api";
import { SecureStorage } from "@/services/secureStorage";
const { width, height } = Dimensions.get("window");

const GoalAssessmentScreen = ({ navigation }) => {
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTimeline, setSelectedTimeline] = useState(null);
  const [expandedTimeline, setExpandedTimeline] = useState(null);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [savingTimeline, setSavingTimeline] = useState(false);
  const expandAnim = useRef(new Animated.Value(0)).current;

  const dispatch = useAppDispatch();
  const { healthCondition } = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.auth.user);
  const health = healthCondition || {};

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchUserById(user.userId));
    }
  }, [user?.userId]);

  const formatText = (text) =>
    text
      ? text
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      : "";

  const activityLevels = [
    { id: "NOT_ACTIVE", label: "Not Active", icon: "moon" },
    { id: "SOMEWHAT_ACTIVE", label: "Somewhat Active", icon: "sun" },
    { id: "ACTIVE", label: "Active", icon: "zap" },
    { id: "VERY_ACTIVE", label: "Very Active", icon: "trending-up" },
    { id: "EXTRA_ACTIVE", label: "Athletic", icon: "flame" },
    { id: "PRO_ATHLETE", label: "Pro Athlete", icon: "star" },
  ];

  const mappedActivity =
    activityLevels.find((a) => a.id === user?.activityLevel)?.label || "Active";

  const fetchGoalAssessment = async () => {
    try {
      setError(null);
      setLoading(true);

      const goalMap = {
        LOSE: "lose_weight",
        GAIN: "gain_weight",
        MAINTAIN: "maintain_weight",
      };

      const requestBody = {
        birth_year: user.birthYear || 2000,
        birth_month: user.birthMonth || 1,
        weight_lbs: user.weightInLbs || 150,
        height_feet: user.heightInFeet || 5,
        height_inches: user.heightInInches || 0,
        biological_sex: user.gender || "M",
        activity_level: mappedActivity || "Active",
        food_preference: user.dietPreference || "Non-Veg",
        primary_goal: goalMap[user.goal] || "lose_weight",
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
        }

        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }).start();
      } else {
        throw new Error(data.message || "Assessment failed");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Something went wrong";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Function to save selected timeline to backend
  const saveSelectedTimeline = async (timeline) => {
    try {
      setSavingTimeline(true);

      // Validate required data
      if (!user?.userId) {
        throw new Error("User ID is missing");
      }

      if (!assessment) {
        throw new Error("Assessment data is missing. Please refresh the page.");
      }

      // Safely parse numeric values with fallbacks
      const tdee = parseFloat(assessment.tdee) || 0;
      const bmr = parseFloat(assessment.bmr) || 0;
      const currentWeight = parseFloat(assessment.weight_lbs) || parseFloat(user?.weightInLbs) || 0;
      const weeklyRate = parseFloat(timeline.weekly_rate) || 1;

      // Calculate target calories with validation
      const targetCalories = tdee - (weeklyRate * 500);

      // Validate calculations
      if (isNaN(targetCalories) || targetCalories <= 0) {
        console.error("Invalid calculation:", { tdee, weeklyRate, targetCalories });
        throw new Error("Unable to calculate target calories. Please try again.");
      }

      const requestBody = {
        userId: user.userId,
        approach_name: timeline.approach_name,
        target_weight_lbs: parseFloat(timeline.target_weight_lbs),
        weight_change_lbs: parseFloat(timeline.weight_change_lbs),
        timeline_weeks: parseInt(timeline.timeline_weeks),
        weekly_rate: weeklyRate,
        weight_goal: timeline.weight_goal,
        weight_loss_rate: timeline.weight_loss_rate,
        difficulty_level: timeline.difficulty_level,
        focus_areas: timeline.focus_areas || [],
        expected_outcomes: timeline.expected_outcomes || [],
        nutrition_emphasis: timeline.nutrition_emphasis,
        exercise_emphasis: timeline.exercise_emphasis,
        tdee: tdee,
        bmr: bmr,
        current_weight_lbs: currentWeight,
        target_calories: Math.round(targetCalories),
      };

      console.log("📤 Sending timeline save request:", requestBody);

      const { data } = await api.post(
        `/goal/assessment/${user.userId}`,
        requestBody
      );

      if (data) {
        console.log("✅ Timeline saved successfully:", data);
        await SecureStorage.setItem(
          "selectedTimeline",
          JSON.stringify(timeline)
        );
        await SecureStorage.setItem("goalAssessmentComplete", "true");
        return true;
      } else {
        throw new Error(data.message || "Failed to save timeline");
      }
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || "Failed to save timeline";
      console.error("❌ Save timeline error:", message);
      console.error("Error details:", err.response?.data);
      Alert.alert("Error", message);
      return false;
    } finally {
      setSavingTimeline(false);
    }
  };
  

  useEffect(() => {
    fetchGoalAssessment();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchGoalAssessment();
  }, []);
const handleMenuPress = () => {

  navigation.navigate("AllScreensMenu");
};
  const getDifficultyColor = (level) => {
    const colors = {
      beginner_friendly: ["#10b981", "#34d399"],
      moderate_commitment: ["#3b82f6", "#60a5fa"],
      challenging: ["#f59e0b", "#fbbf24"],
    };
    return colors[level] || ["#6b7280", "#9ca3af"];
  };

  const getRiskColor = (level) => {
    const colors = {
      low: "#10b981",
      moderate: "#f59e0b",
      high: "#ef4444",
    };
    return colors[level] || "#6b7280";
  };
  console.log("Selected Timeline:", selectedTimeline);
  // Handle Start Journey - Save to DB then Navigate to Customization
  const handleStartJourney = async () => {
    if (!selectedTimeline || !assessment || !user) {
      Alert.alert("Error", "Please select a timeline to continue");
      return;
    }

    // Debug logging
    console.log("📊 Assessment Data:", {
      tdee: assessment.tdee,
      bmr: assessment.bmr,
      weight_lbs: assessment.weight_lbs,
      hasAssessment: !!assessment,
    });
    console.log("👤 User Data:", {
      userId: user?.userId,
      weightInLbs: user?.weightInLbs,
    });

    // Save timeline to DB
    const saved = await saveSelectedTimeline(selectedTimeline);
    console.log("Save Result:", saved);
    if (!saved) {
      Alert.alert("Warning", "Timeline couldn't be saved. Please try again.");
      return;
    }

    const targetCalories = assessment.tdee - selectedTimeline.weekly_rate * 500;

    navigation.navigate("GoalCustomization", {
      assessment,
      user,
      selectedTimeline,
      tdee: assessment?.tdee ?? 0,
      bmr: assessment?.bmr ?? 0,
      targetCalories,
      targetWeight: selectedTimeline?.target_weight_lbs ?? 0,
      targetWeeks: selectedTimeline?.timeline_weeks ?? 0,
      weeklyRate: selectedTimeline?.weekly_rate ?? 0,
      currentWeight: assessment?.weight_lbs ?? 0,
    });
  };


  const handleTimelineSelect = async (timeline) => {
    setSelectedTimeline(timeline);

    // Navigate to details
    // navigation.navigate("TimelineDetails", {
    //   timeline,
    //   assessment,
    // });
  };

  if (loading && !refreshing) {
    return (
      <LoadingSpinner
        message="Loading your goal assessment..."
        visible={loading}
      />
    );
  }

  if (error && !assessment) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="warning-outline" size={64} color="#ef4444" />
        <Text style={styles.errorText}>Failed to load assessment</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={fetchGoalAssessment}
        >
          <Ionicons name="refresh" size={20} color="#fff" />
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!assessment) {
    return null;
  }

  const isRecommended = (timeline) =>
    timeline.approach_name === assessment.recommended_timeline?.approach_name &&
    timeline.timeline_weeks === assessment.recommended_timeline?.timeline_weeks;

  const isSelected = (timeline) =>
    selectedTimeline?.approach_name === timeline.approach_name &&
    selectedTimeline?.timeline_weeks === timeline.timeline_weeks;

  const isExpanded = (timeline) =>
    expandedTimeline?.approach_name === timeline.approach_name &&
    expandedTimeline?.timeline_weeks === timeline.timeline_weeks;

  return (
    <View style={styles.container}>
      <View style={styles.headerCard}>
        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
          }}
          style={styles.headerImageBg}
          imageStyle={styles.headerImageStyle}
        >
          <LinearGradient
            colors={["rgba(59, 130, 246, 0.92)", "rgba(139, 92, 246, 0.90)"]}
            style={styles.headerOverlay}
          >
            <View style={styles.headerTopRow}>
              <View>
                <Text style={styles.titleWithBg}>Your Goal Assessment</Text>
                <Text style={styles.subtitleWithBg}>
                  Timeline & Detailed Stats
                </Text>
              </View>

              {/* <View style={styles.headerUserBox}>
                <Ionicons name="fitness" size={36} color="#fff" />
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
              Weekly progress, calorie targets & goal projections
            </Text>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Health Risk Assessment */}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#3b82f6"]}
            tintColor="#3b82f6"
          />
        }
      >
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Current Stats - Horizontal Scroll */}
          <View style={styles.statsSection}>
            {assessment.user_assessment && (
              <View style={styles.riskCard}>
                <View style={styles.riskHeader}>
                  <Ionicons
                    name="shield-checkmark"
                    size={24}
                    color={getRiskColor(
                      assessment.user_assessment.health_risk_level
                    )}
                  />
                  <Text style={styles.riskTitle}>Health Assessment</Text>
                </View>
                <View style={styles.riskContent}>
                  <View style={styles.riskItem}>
                    <Text style={styles.riskLabel}>BMI Category</Text>
                    <Text style={styles.riskValue}>
                      {assessment.user_assessment.bmi_category}
                    </Text>
                  </View>
                  <View style={styles.riskDivider} />
                  <View style={styles.riskItem}>
                    <Text style={styles.riskLabel}>Risk Level</Text>
                    <View
                      style={[
                        styles.riskBadge,
                        {
                          backgroundColor:
                            getRiskColor(
                              assessment.user_assessment.health_risk_level
                            ) + "20",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.riskBadgeText,
                          {
                            color: getRiskColor(
                              assessment.user_assessment.health_risk_level
                            ),
                          },
                        ]}
                      >
                        {formatText(
                          assessment.user_assessment.health_risk_level
                        )}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            <Text style={styles.sectionTitle}>Your Current Stats</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCardSmall}>
                <ImageBackground
                  source={{
                    uri: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&q=80",
                  }}
                  style={styles.statImageBgSmall}
                  imageStyle={styles.statImageStyleSmall}
                >
                  <LinearGradient
                    colors={["rgba(255, 255, 255, 0.85)", "rgba(240, 240, 240, 0.80)"]}
                    style={styles.statOverlaySmall}
                  >
                    <Ionicons name="scale-outline" size={24} color="#3b82f6" />
                    <Text style={styles.statLabelLight}>Weight</Text>
                    <Text style={styles.statValueLight}>{assessment.weight_lbs}</Text>
                    <Text style={styles.statUnitLight}>lbs</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>

              <View style={styles.statCardSmall}>
                <ImageBackground
                  source={{
                    uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
                  }}
                  style={styles.statImageBgSmall}
                  imageStyle={styles.statImageStyleSmall}
                >
                  <LinearGradient
                    colors={["rgba(255, 255, 255, 0.85)", "rgba(240, 240, 240, 0.80)"]}
                    style={styles.statOverlaySmall}
                  >
                    <Ionicons name="fitness-outline" size={24} color="#10b981" />
                    <Text style={styles.statLabelLight}>BMI</Text>
                    <Text style={styles.statValueLight}>
                      {assessment.user_assessment?.current_bmi}
                    </Text>
                    <Text style={styles.statUnitLight}>index</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>

              <View style={styles.statCardSmall}>
                <ImageBackground
                  source={{
                    uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
                  }}
                  style={styles.statImageBgSmall}
                  imageStyle={styles.statImageStyleSmall}
                >
                  <LinearGradient
                    colors={["rgba(255, 255, 255, 0.85)", "rgba(240, 240, 240, 0.80)"]}
                    style={styles.statOverlaySmall}
                  >
                    <Ionicons name="flame-outline" size={24} color="#ec4899" />
                    <Text style={styles.statLabelLight}>TDEE</Text>
                    <Text style={styles.statValueLight}>
                      {Math.round(assessment.tdee)}
                    </Text>
                    <Text style={styles.statUnitLight}>cal/day</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>

              <View style={styles.statCardSmall}>
                <ImageBackground
                  source={{
                    uri: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&q=80",
                  }}
                  style={styles.statImageBgSmall}
                  imageStyle={styles.statImageStyleSmall}
                >
                  <LinearGradient
                    colors={["rgba(255, 255, 255, 0.85)", "rgba(240, 240, 240, 0.80)"]}
                    style={styles.statOverlaySmall}
                  >
                    <Ionicons
                      name="speedometer-outline"
                      size={24}
                      color="#ef4444"
                    />
                    <Text style={styles.statLabelLight}>BMR</Text>
                    <Text style={styles.statValueLight}>
                      {Math.round(assessment.bmr)}
                    </Text>
                    <Text style={styles.statUnitLight}>cal/day</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>

              <View style={styles.statCardSmall}>
                <ImageBackground
                  source={{
                    uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
                  }}
                  style={styles.statImageBgSmall}
                  imageStyle={styles.statImageStyleSmall}
                >
                  <LinearGradient
                    colors={["rgba(255, 255, 255, 0.85)", "rgba(240, 240, 240, 0.80)"]}
                    style={styles.statOverlaySmall}
                  >
                    <Ionicons name="walk" size={24} color="#a855f7" />
                    <Text style={styles.statLabelLight}>Activity</Text>
                    <Text style={[styles.statValueLight, { fontSize: 14 }]}>
                      {assessment.activity_level}
                    </Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
            </View>
          </View>

          {/* Timeline Options */}
          <View style={styles.timelinesContainer}>
            <Text style={styles.sectionTitle}>Choose Your Timeline</Text>
            <Text style={styles.sectionSubtitle}>
              {assessment.available_timelines?.length} options available
            </Text>

            {assessment.available_timelines?.map((timeline, index) => {
              const expanded = isExpanded(timeline);
              const selected = isSelected(timeline);

              return (
                <View key={index}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={() => handleTimelineSelect(timeline)}
                    disabled={savingTimeline}
                  >
                    <View
                      style={[
                        styles.timelineCard,
                        selected && styles.timelineCardSelected,
                      ]}
                    >
                      {isRecommended(timeline) && (
                        <LinearGradient
                          colors={["#3b82f6", "#8b5cf6"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.recommendedBadge}
                        >
                          <Ionicons name="star" size={14} color="#fff" />
                          <Text style={styles.recommendedText}>
                            Recommended
                          </Text>
                        </LinearGradient>
                      )}

                      <View style={styles.timelineHeader}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.timelineName}>
                            {formatText(timeline.approach_name)}
                          </Text>
                          <LinearGradient
                            colors={getDifficultyColor(
                              timeline.difficulty_level
                            )}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.difficultyBadge}
                          >
                            <Text style={styles.difficultyText}>
                              {formatText(timeline.difficulty_level)}
                            </Text>
                          </LinearGradient>
                        </View>
                        <View style={styles.rightSection}>
                          <View style={styles.weeksContainer}>
                            <Text style={styles.weeksNumber}>
                              {timeline.timeline_weeks}
                            </Text>
                            <Text style={styles.weeksLabel}>weeks</Text>
                          </View>
                          <Ionicons
                            name={expanded ? "chevron-up" : "chevron-down"}
                            size={24}
                            color="#64748b"
                          />
                        </View>
                      </View>

                      {/* Quick Overview */}
                      <View style={styles.quickMetrics}>
                        <View style={styles.quickMetric}>
                          <Ionicons
                            name="trophy-outline"
                            size={18}
                            color="#10b981"
                          />
                          <Text style={styles.quickMetricText}>
                            {timeline.target_weight_lbs} lbs
                          </Text>
                        </View>
                        <View style={styles.quickMetric}>
                          <Ionicons
                            name="trending-down"
                            size={18}
                            color="#f59e0b"
                          />
                          <Text style={styles.quickMetricText}>
                            {timeline.weekly_rate} lbs/wk
                          </Text>
                        </View>
                        <View style={styles.quickMetric}>
                          <Ionicons
                            name="analytics-outline"
                            size={18}
                            color="#8b5cf6"
                          />
                          <Text style={styles.quickMetricText}>
                            {Math.abs(timeline.weight_change_lbs)} lbs total
                          </Text>
                        </View>
                      </View>

                      {selected && (
                        <View style={styles.selectedIndicator}>
                          <Ionicons
                            name="checkmark-circle"
                            size={18}
                            color="#3b82f6"
                          />
                          <Text style={styles.selectedText}>Selected</Text>
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>

          {assessment.important_notes &&
            assessment.important_notes.length > 0 && (
              <View style={styles.notesCard}>
                <View style={styles.notesHeader}>
                  <Ionicons
                    name="information-circle"
                    size={24}
                    color="#3b82f6"
                  />
                  <Text style={styles.notesTitle}>Important Notes</Text>
                </View>
                {assessment.important_notes.map((note, index) => (
                  <View key={index} style={styles.noteItem}>
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color="#10b981"
                    />
                    <Text style={styles.noteText}>{note}</Text>
                  </View>
                ))}
              </View>
            )}

          {/* Medical Disclaimer */}
          <View style={styles.disclaimer}>
            <Ionicons name="warning-outline" size={24} color="#f59e0b" />
            <View style={{ flex: 1 }}>
              <Text style={styles.disclaimerText}>
                <Text style={styles.disclaimerBold}>Medical Disclaimer: </Text>
                This service provides nutritional information for educational
                purposes only. Always consult with your healthcare provider
                before making dietary changes.
              </Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Action Button */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={[
            styles.startButton,
            (!selectedTimeline || savingTimeline) && styles.startButtonDisabled,
          ]}
          onPress={handleStartJourney}
          disabled={!selectedTimeline || savingTimeline}
        >
          <LinearGradient
            colors={
              selectedTimeline && !savingTimeline
                ? ["#3b82f6", "#8b5cf6"]
                : ["#d1d5db", "#9ca3af"]
            }
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}
          >
            {savingTimeline ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.startButtonText}>Start My Journey</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default GoalAssessmentScreen;