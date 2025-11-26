import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { fetchUserById } from "@/redux/slice/auth/authSlice";
import aiApi from "@/services/aiApi";
import { SecureStorage } from "@/services/secureStorage";
import api from "@/services/api";
import { useNavigation } from "@react-navigation/native";
import { scale, verticalScale, moderateScale } from "@/utils/responsive";

const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#6366F1",
  white: "#FFFFFF",
  background: "#F8F9FA",
  cardBg: "#FFFFFF",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",

  statAge: { bg: "#DBEAFE", text: "#2563EB" },
  statWeight: { bg: "#F3E8FF", text: "#9333EA" },
  statBMI: { bg: "#DCFCE7", text: "#16A34A" },
  statTDEE: { bg: "#FED7AA", text: "#EA580C" },
};

const FONT = {
  xs: moderateScale(10),
  sm: moderateScale(12),
  base: moderateScale(14),
  lg: moderateScale(16),
  xl: moderateScale(18),
  xxl: moderateScale(22),
  xxxl: moderateScale(28),
};

interface Timeline {
  approach_name: string;
  target_weight_lbs: number;
  weight_change_lbs: number;
  timeline_weeks: number;
  weekly_rate: number;
  weight_goal: string;
  weight_loss_rate?: string;
  difficulty_level: string;
  focus_areas?: string[];
  expected_outcomes?: string[];
  nutrition_emphasis?: string;
  exercise_emphasis?: string;
}

interface UserAssessment {
  current_bmi: number;
  bmi_category: string;
  health_risk_level: string;
  medical_supervision_recommended: boolean;
}

interface SafetyAssessment {
  risk_level: string;
  user_category?: string;
  recommendations_allowed?: boolean;
  requires_professional_guidance?: boolean;
}

interface Assessment {
  success: boolean;
  weight_lbs: number;
  age: number;
  tdee: number;
  bmr: number;
  user_assessment: UserAssessment;
  safety_assessment?: SafetyAssessment;
  recommended_timeline?: Timeline;
  available_timelines?: Timeline[];
  important_notes?: string[];
}

interface Customization {
  success: boolean;
  target_calories: number;
  calorie_adjustment: number;
  weight_lbs: number;
  target_weight_lbs: number;
  macro_breakdown: {
    protein: { grams: number; percentage: number };
    carbohydrates: { grams: number; percentage: number };
    fat: { grams: number; percentage: number };
  };
  nutrition_targets: { fiber_g: number; sodium_mg: number };
  timeline_details: {
    weight_to_lose_lbs: number;
    weight_to_gain_lbs:number;
    expected_weekly_maintain_lbs:number;
    expected_weekly_loss_lbs: number;
    estimated_end_date: string;
    expected_weekly_gain_lbs:number;
    weight_to_maintain_lbs :number;

  };
  wellness_guidance: {
    mental_health: string[];
    sleep_and_recovery: string[];
    stress_management: string[];
    long_term_sustainability: string[];
  };
  safety_assessment: { risk_level: string };
}

export default function WellnessPlanMobile() {
  const dispatch = useAppDispatch();
  const { healthCondition, user } = useAppSelector((state) => state.auth);
  const health = healthCondition || {};
  const navigation = useNavigation();
  const [showCustomize, setShowCustomize] = useState(false);
  const [selectedApproach, setSelectedApproach] = useState<string | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<number | null>(null);
  const [isCustomized, setIsCustomized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [savingTimeline, setSavingTimeline] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [customization, setCustomization] = useState<Customization | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const customizeHeight = useRef(new Animated.Value(0)).current;

  const handleMenuPress = () => navigation.navigate("AllScreensMenu");

  const activityLevels = [
    { id: "NOT_ACTIVE", label: "Not Active" },
    { id: "SOMEWHAT_ACTIVE", label: "Somewhat Active" },
    { id: "ACTIVE", label: "Active" },
    { id: "VERY_ACTIVE", label: "Very Active" },
    { id: "EXTRA_ACTIVE", label: "Athletic" },
    { id: "PRO_ATHLETE", label: "Pro Athlete" },
  ];

  const formatText = (text: string): string =>
    text ? text.split("_").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "";

  const mappedActivity = activityLevels.find((a) => a.id === user?.activityLevel)?.label || "Active";

  useEffect(() => {
    if (user?.userId) {
      dispatch(fetchUserById(user.userId));
      fetchGoalAssessment();
    }
  }, [user?.userId]);

  useEffect(() => {
    if (assessment) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]).start();
    }
  }, [assessment]);

  const fetchGoalAssessment = async () => {
    try {
      setError(null);
      setLoading(true);
      const goalMap: Record<string, string> = { LOSE: "lose_weight", GAIN: "gain_weight", MAINTAIN: "maintain_weight" };
      const requestBody = {
        birth_year: user.birthYear,
        birth_month: user.birthMonth,
        weight_lbs: user.weightInLbs || 150,
        height_feet: user.heightInFeet,
        height_inches: user.heightInInches,
        biological_sex: user.gender,
        activity_level: mappedActivity,
        food_preference: user.dietPreference,
        primary_goal: goalMap[user.goal],
        health_conditions: {
          diabetes_type1_type2: health.diabetes_type1_type2 ?? health.diabetes ?? health.preDiabetes ?? false,
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
      const message = err.response?.data?.message || err.message || "Something went wrong";
      setError(message);
      Alert.alert("Error", message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchCustomization = async (timeline: Timeline) => {
    try {
      const primaryGoalMap: Record<string, string> = { LOSE: "lose_weight", GAIN: "gain_weight", MAINTAIN: "maintain_weight" };
      const weightGoalMap: Record<string, string> = { LOSE: "lose", GAIN: "gain", MAINTAIN: "maintain" };
      const requestBody = {
        birth_year: user.birthYear, birth_month: user.birthMonth, weight_lbs: user.weightInLbs,
        height_feet: user.heightInFeet, height_inches: user.heightInInches, biological_sex: user.gender,
        activity_level: mappedActivity, weight_goal: weightGoalMap[user.goal], target_weight_lbs: timeline.target_weight_lbs,
        weight_loss_rate: timeline.weight_loss_rate, primary_goal: primaryGoalMap[user.goal], target_weeks: timeline.timeline_weeks,
        health_conditions: { diabetes_type1_type2: user.health?.diabetes || false, hypertension: user.health?.hypertension || false, food_allergies: user.health?.food_allergies || [] },
        food_preference: user.dietPreference || "Non-Veg",
      };
      const { data } = await aiApi.post("/goal-customization", requestBody);
      if (data.success) setCustomization(data);
    } catch (err) { console.error("Failed to fetch customization:", err); }
  };

  const saveSelectedTimeline = async (timeline: Timeline): Promise<boolean> => {
    try {
      setSavingTimeline(true);
      const requestBody = {
        userId: user?.userId, approach_name: timeline.approach_name, target_weight_lbs: timeline.target_weight_lbs,
        weight_change_lbs: timeline.weight_change_lbs, timeline_weeks: timeline.timeline_weeks, weekly_rate: timeline.weekly_rate,
        weight_goal: timeline.weight_goal, weight_loss_rate: timeline.weight_loss_rate, difficulty_level: timeline.difficulty_level,
        focus_areas: timeline.focus_areas, expected_outcomes: timeline.expected_outcomes, nutrition_emphasis: timeline.nutrition_emphasis,
        exercise_emphasis: timeline.exercise_emphasis, tdee: assessment?.tdee, bmr: assessment?.bmr, current_weight_lbs: assessment?.weight_lbs,
        target_calories: assessment ? assessment.tdee - timeline.weekly_rate * 500 : 0,
      };
      const { data } = await api.post(`/goal/assessment/${user?.userId}`, requestBody);
      if (data) {
        await SecureStorage.setItem("selectedTimeline", JSON.stringify(timeline));
        await SecureStorage.setItem("goalAssessmentComplete", "true");
        return true;
      } else throw new Error(data.message || "Failed to save timeline");
    } catch (err: any) {
      Alert.alert("Error", err.response?.data?.message || err.message || "Failed to save timeline");
      return false;
    } finally { setSavingTimeline(false); }
  };

  const onRefresh = () => { setRefreshing(true); fetchGoalAssessment(); };

  const targetWeights = assessment?.available_timelines ? [...new Set(assessment.available_timelines.map((t) => t.target_weight_lbs))] : [];
  const filteredTimelines = selectedTarget && assessment?.available_timelines ? assessment.available_timelines.filter((t) => t.target_weight_lbs === selectedTarget) : [];

  const toggleCustomize = () => {
    setShowCustomize(!showCustomize);
    Animated.spring(customizeHeight, { toValue: showCustomize ? 0 : 1, useNativeDriver: false, friction: 8 }).start();
  };

  const handleConfirm = async () => {
    if (!selectedApproach) return;
    const timeline = filteredTimelines.find((t) => `${t.approach_name}-${t.target_weight_lbs}` === selectedApproach);
    if (!timeline) return;
    setLoading(true);
    try {
      await fetchCustomization(timeline);
      const saved = await saveSelectedTimeline(timeline);
      if (saved) { setIsCustomized(true); setSelectedTimeline(timeline); Alert.alert("Success", "Your customization has been saved!"); toggleCustomize(); }
    } catch { Alert.alert("Error", "Failed to apply customization"); }
    finally { setLoading(false); }
  };

  const statItems = assessment ? [
    { label: "Age", value: assessment.age || new Date().getFullYear() - user?.birthYear, colors: COLORS.statAge },
    { label: "Weight", value: assessment.weight_lbs, unit: "lbs", colors: COLORS.statWeight },
    { label: "BMI", value: assessment.user_assessment?.current_bmi?.toFixed(1), colors: COLORS.statBMI },
    { label: "TDEE", value: Math.round(assessment.tdee), colors: COLORS.statTDEE },
  ] : [];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}>
      {loading && !assessment ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Loading your wellness plan...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={scale(48)} color={COLORS.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchGoalAssessment}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : !assessment ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>No assessment data available</Text>
        </View>
      ) : (
        <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Header with Image Background */}
          <View style={styles.headerCard}>
            <ImageBackground
              source={{ uri: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" }}
              style={styles.headerImageBg}
              imageStyle={styles.headerImageStyle}
            >
              <LinearGradient colors={["rgba(79, 70, 229, 0.92)", "rgba(99, 102, 241, 0.90)"]} style={styles.headerOverlay}>
                <View style={styles.headerTopRow}>
                  <View style={styles.headerTitleContainer}>
                    <Text style={styles.headerTitle}>Your Wellness Plan</Text>
                    <Text style={styles.headerSubtitle}>Personalized Assessment</Text>
                  </View>
                  <TouchableOpacity onPress={handleMenuPress} style={styles.menuButton}>
                    <Ionicons name="ellipsis-horizontal" size={scale(20)} color={COLORS.white} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.headerDesc}>Timeline, nutrition targets & goal projections tailored for you</Text>
              </LinearGradient>
            </ImageBackground>
          </View>

          {/* Assessment Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Ionicons name="analytics-outline" size={scale(18)} color={COLORS.primary} />
              <Text style={styles.cardHeaderText}>Assessment Results</Text>
            </View>
            <View style={styles.statsGrid}>
              {statItems.map((stat, i) => (
                <View key={i} style={[styles.statBox, { backgroundColor: stat.colors.bg }]}>
                  <Text style={[styles.statValue, { color: stat.colors.text }]}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.unit || stat.label}</Text>
                </View>
              ))}
            </View>
            <View style={styles.statusBanner}>
              <Ionicons name="checkmark-circle" size={scale(20)} color={COLORS.success} />
              <View style={styles.statusText}>
                <Text style={styles.statusTitle}>{assessment.user_assessment?.bmi_category}</Text>
                <Text style={styles.statusSubtitle}>Risk: {assessment.user_assessment?.health_risk_level}</Text>
              </View>
            </View>
            {assessment.recommended_timeline && (
              <View style={styles.recommendedCard}>
                <Text style={styles.recommendedBadge}>RECOMMENDED</Text>
                <View style={styles.recommendedContent}>
                  <View style={styles.recommendedLeft}>
                    <Text style={styles.recommendedTitle}>{formatText(assessment.recommended_timeline.approach_name)}</Text>
                    <Text style={styles.recommendedSubtitle}>Target: {assessment.recommended_timeline.target_weight_lbs} lbs</Text>
                    <Text style={styles.recommendedSubtitle}>Rate: {assessment.recommended_timeline.weekly_rate} lb/week</Text>
                  </View>
                  <View style={styles.weeksContainer}>
                    <Text style={styles.weeksValue}>{assessment.recommended_timeline.timeline_weeks}</Text>
                    <Text style={styles.weeksLabel}>weeks</Text>
                  </View>
                </View>
              </View>
            )}
            {assessment.important_notes && assessment.important_notes.length > 0 && (
              <View style={styles.notesContainer}>
                <Text style={styles.notesTitle}>Important Notes</Text>
                {assessment.important_notes.map((note, i) => <Text key={i} style={styles.noteText}>• {note}</Text>)}
              </View>
            )}
          </View>

          {/* Customize Section */}
          <TouchableOpacity style={styles.card} onPress={toggleCustomize} activeOpacity={0.7}>
            <View style={styles.customizeHeader}>
              <View style={styles.customizeLeft}>
                <View style={styles.customizeIcon}><Ionicons name="options-outline" size={scale(20)} color={COLORS.primary} /></View>
                <View>
                  <Text style={styles.customizeTitle}>Want to Customize?</Text>
                  <Text style={styles.customizeSubtitle}>Choose different target & approach</Text>
                </View>
              </View>
              <Animated.View style={{ transform: [{ rotate: customizeHeight.interpolate({ inputRange: [0, 1], outputRange: ["0deg", "180deg"] }) }] }}>
                <Ionicons name="chevron-down" size={scale(20)} color={COLORS.textTertiary} />
              </Animated.View>
            </View>
          </TouchableOpacity>

          {showCustomize && (
            <Animated.View style={[styles.customizeContent, { opacity: customizeHeight }]}>
              <View style={styles.card}>
                <Text style={styles.stepTitle}>Step 1: Target Weight</Text>
                <View style={styles.targetGrid}>
                  {targetWeights.map((w) => (
                    <TouchableOpacity key={w} style={[styles.targetButton, selectedTarget === w && styles.targetButtonActive]} onPress={() => { setSelectedTarget(w); setSelectedApproach(null); }}>
                      <Text style={[styles.targetValue, selectedTarget === w && styles.targetValueActive]}>{w}</Text>
                      <Text style={styles.targetLabel}>lbs</Text>
                      <Text style={[styles.targetDiff, selectedTarget === w && styles.targetDiffActive]}>
                        {assessment.weight_lbs - w > 0 ? `-${assessment.weight_lbs - w}` : `+${Math.abs(assessment.weight_lbs - w)}`} lbs
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {selectedTarget !== null && (
                  <>
                    <Text style={[styles.stepTitle, { marginTop: verticalScale(20) }]}>Step 2: Approach</Text>
                    {filteredTimelines.map((t) => {
                      const id = `${t.approach_name}-${t.target_weight_lbs}`;
                      return (
                        <TouchableOpacity key={id} style={[styles.approachButton, selectedApproach === id && styles.approachButtonActive]} onPress={() => setSelectedApproach(id)}>
                          <View style={styles.approachLeft}>
                            <Ionicons name={t.approach_name.includes("conservative") ? "walk-outline" : t.approach_name.includes("moderate") ? "fitness-outline" : "rocket-outline"} size={scale(22)} color={selectedApproach === id ? COLORS.primary : COLORS.textSecondary} />
                            <View style={styles.approachInfo}>
                              <Text style={[styles.approachName, selectedApproach === id && styles.approachNameActive]}>{formatText(t.approach_name)}</Text>
                              <Text style={styles.approachRate}>{t.weekly_rate} lb/week</Text>
                            </View>
                          </View>
                          <View style={styles.approachRight}>
                            <Text style={[styles.approachWeeks, selectedApproach === id && styles.approachWeeksActive]}>{t.timeline_weeks}</Text>
                            <Text style={styles.approachWeeksLabel}>weeks</Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </>
                )}
                {selectedApproach && (
                  <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
                    {loading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.confirmButtonText}>Apply Customization</Text>}
                  </TouchableOpacity>
                )}
              </View>
            </Animated.View>
          )}

          {/* Nutrition Plan */}
          {customization && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="nutrition-outline" size={scale(18)} color={COLORS.primary} />
                <Text style={styles.cardHeaderText}>Nutrition Plan {isCustomized && "(Customized)"}</Text>
              </View>
              <View style={styles.calorieCard}>
                <Text style={styles.calorieLabel}>Daily Calorie Target</Text>
                <Text style={styles.calorieValue}>{customization.target_calories}</Text>
                <Text style={styles.calorieSubtext}>kcal/day ({customization.calorie_adjustment} deficit)</Text>
              </View>
              <Text style={styles.sectionLabel}>Macro Breakdown</Text>
              <View style={styles.macroGrid}>
                {[
                  { label: "Protein", value: customization.macro_breakdown.protein.grams, pct: customization.macro_breakdown.protein.percentage, colors: COLORS.statAge },
                  { label: "Carbs", value: customization.macro_breakdown.carbohydrates.grams, pct: customization.macro_breakdown.carbohydrates.percentage, colors: COLORS.statWeight },
                  { label: "Fat", value: customization.macro_breakdown.fat.grams, pct: customization.macro_breakdown.fat.percentage, colors: COLORS.statTDEE },
                ].map((m, i) => (
                  <View key={i} style={[styles.macroBox, { backgroundColor: m.colors.bg }]}>
                    <Text style={[styles.macroValue, { color: m.colors.text }]}>{m.value}g</Text>
                    <Text style={styles.macroLabel}>{m.label}</Text>
                    <Text style={[styles.macroPercent, { color: m.colors.text }]}>{m.pct}%</Text>
                  </View>
                ))}
              </View>
              <View style={styles.nutrientRow}>
                <View style={styles.nutrientBox}><Text style={styles.nutrientValue}>{customization.nutrition_targets.fiber_g}g</Text><Text style={styles.nutrientLabel}>Fiber</Text></View>
                <View style={styles.nutrientBox}><Text style={styles.nutrientValue}>{customization.nutrition_targets.sodium_mg}</Text><Text style={styles.nutrientLabel}>Sodium (mg)</Text></View>
              </View>
              <View style={styles.timelineCard}>
                <Text style={styles.timelineTitle}>Timeline</Text>
                <View style={styles.timelineGrid}>
                  <View style={styles.timelineRow}>
                    <Text style={styles.timelineLabel}>Current</Text>
                    <Text style={styles.timelineValue}>{customization.weight_lbs} lbs</Text>
                  </View>
                  <View style={styles.timelineRow}>
                    <Text style={styles.timelineLabel}>Target</Text>
                    <Text style={styles.timelineValue}>{customization.target_weight_lbs} lbs</Text>
                  </View>
              <View style={styles.timelineRow}>
  <Text style={styles.timelineLabel}>
    {customization?.goal === "lose"
      ? "To Lose"
      : customization?.goal === "gain"
      ? "To Gain"
      : "To Maintain"}
  </Text>

  <Text style={styles.timelineValue}>
    {(customization?.timeline_details?.weight_to_lose_lbs ??
      customization?.timeline_details?.weight_to_gain_lbs ??
      customization?.timeline_details?.weight_to_maintain_lbs ??
      0) + " lbs"}
  </Text>
</View>

<View style={styles.timelineRow}>
  <Text style={styles.timelineLabel}>
    {customization?.goal === "maintain" ? "Weekly Target" : "Weekly"}
  </Text>

  <Text style={styles.timelineValue}>
    {(customization?.timeline_details?.expected_weekly_loss_lbs ??
      customization?.timeline_details?.expected_weekly_gain_lbs ??
      customization?.timeline_details?.expected_weekly_maintain_lbs ??
      0) + " lb"}
  </Text>
</View>

                  <View style={[styles.timelineRow, { marginTop: verticalScale(8), paddingTop: verticalScale(8), borderTopWidth: 1, borderTopColor: COLORS.border }]}>
                    <Text style={styles.timelineLabel}>Est. End Date</Text>
                    <Text style={[styles.timelineValue, { color: COLORS.primary, fontWeight: "700" }]}>{customization.timeline_details.estimated_end_date}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {/* Wellness Guidance */}
          {customization?.wellness_guidance && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="heart-outline" size={scale(18)} color={COLORS.primary} />
                <Text style={styles.cardHeaderText}>Wellness Guidance</Text>
              </View>
              {[
                { icon: "bulb-outline", title: "Mental Health", items: customization.wellness_guidance.mental_health },
                { icon: "moon-outline", title: "Sleep & Recovery", items: customization.wellness_guidance.sleep_and_recovery },
                { icon: "leaf-outline", title: "Stress Management", items: customization.wellness_guidance.stress_management },
                { icon: "trending-up-outline", title: "Long-term", items: customization.wellness_guidance.long_term_sustainability },
              ].map((s, i) => s.items && s.items.length > 0 && (
                <View key={i} style={styles.guidanceSection}>
                  <View style={styles.guidanceHeader}>
                    <Ionicons name={s.icon as any} size={scale(18)} color={COLORS.primary} />
                    <Text style={styles.guidanceTitle}>{s.title}</Text>
                  </View>
                  {s.items.map((item, j) => <Text key={j} style={styles.guidanceText}>• {item}</Text>)}
                </View>
              ))}
            </View>
          )}

          {/* Safety Notice */}
          {assessment?.safety_assessment && (
            <View style={styles.safetyBanner}>
              <Ionicons name="warning-outline" size={scale(18)} color={COLORS.warning} />
              <Text style={styles.safetyText}>
                <Text style={styles.safetyBold}>Safety:</Text> Risk level is <Text style={styles.safetyBold}>{assessment.safety_assessment.risk_level}</Text>. Consult a healthcare professional before starting.
              </Text>
            </View>
          )}

          {/* Start Button */}
      <TouchableOpacity
  style={styles.startButton}
  activeOpacity={0.8}
  onPress={async () => {
    if (selectedTimeline) {
      const saved = await saveSelectedTimeline(selectedTimeline);

      if (saved) {
        navigation.navigate("LandingMain");
        Alert.alert("Success", "Your wellness journey has started!");
      }
    } else {
      Alert.alert("Select Timeline", "Please choose a timeline to continue.");
    }
  }}
>
            <LinearGradient colors={[COLORS.primary, COLORS.primaryLight]} style={styles.startButtonGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Text style={styles.startButtonText}>{savingTimeline ? "Starting..." : "Start My Journey"}</Text>
              <Ionicons name="arrow-forward" size={scale(20)} color={COLORS.white} style={{ marginLeft: scale(8) }} />
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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: scale(40), minHeight: verticalScale(400) },
  loadingText: { marginTop: verticalScale(16), fontSize: FONT.base, color: COLORS.textSecondary },
  errorContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: scale(40), minHeight: verticalScale(400) },
  errorText: { fontSize: FONT.base, color: COLORS.error, textAlign: "center", marginVertical: verticalScale(16) },
  retryButton: { backgroundColor: COLORS.primary, paddingVertical: verticalScale(12), paddingHorizontal: scale(28), borderRadius: scale(10) },
  retryButtonText: { color: COLORS.white, fontSize: FONT.base, fontWeight: "600" },

  // Header

  headerTopRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  headerTitleContainer: { flex: 1, marginRight: scale(12) },
  headerTitle: { fontSize: FONT.xxl, fontWeight: "700", color: COLORS.white },
  headerSubtitle: { fontSize: FONT.sm, color: "rgba(255,255,255,0.85)", marginTop: verticalScale(4) },
  menuButton: { padding: scale(8), backgroundColor: "rgba(255,255,255,0.2)", borderRadius: scale(50) },
  headerDesc: { fontSize: FONT.sm, color: "rgba(255,255,255,0.8)", marginTop: verticalScale(12), lineHeight: FONT.sm * 1.5 },

  // Card
  card: { backgroundColor: COLORS.cardBg, borderRadius: scale(14), marginBottom: verticalScale(12), overflow: "hidden", borderWidth: 1, borderColor: COLORS.border },
  cardHeader: { flexDirection: "row", alignItems: "center", paddingHorizontal: scale(16), paddingVertical: verticalScale(12), borderBottomWidth: 1, borderBottomColor: COLORS.borderLight },
  cardHeaderText: { fontSize: FONT.base, fontWeight: "600", color: COLORS.textPrimary, marginLeft: scale(8) },

  // Stats
  statsGrid: { flexDirection: "row", padding: scale(12), gap: scale(8) },
  statBox: { flex: 1, backgroundColor: COLORS.borderLight, borderRadius: scale(10), padding: scale(12), alignItems: "center" },
  statValue: { fontSize: FONT.lg, fontWeight: "700", color: COLORS.textPrimary },
  statLabel: { fontSize: FONT.xs, color: COLORS.textSecondary, marginTop: verticalScale(2) },

  // Status
  statusBanner: { flexDirection: "row", backgroundColor: COLORS.borderLight, borderRadius: scale(10), padding: scale(12), marginHorizontal: scale(12), marginBottom: verticalScale(12), alignItems: "center" },
  statusText: { flex: 1, marginLeft: scale(10) },
  statusTitle: { fontSize: FONT.base, fontWeight: "600", color: COLORS.textPrimary },
  statusSubtitle: { fontSize: FONT.xs, color: COLORS.textSecondary, marginTop: verticalScale(2) },

  // Recommended
  recommendedCard: { backgroundColor: COLORS.borderLight, borderRadius: scale(10), padding: scale(12), marginHorizontal: scale(12), marginBottom: verticalScale(12), borderLeftWidth: 3, borderLeftColor: COLORS.primary },
  recommendedBadge: { fontSize: FONT.xs, color: COLORS.primary, fontWeight: "700", marginBottom: verticalScale(4), letterSpacing: 0.5 },
  recommendedContent: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  recommendedTitle: { fontSize: FONT.base, fontWeight: "600", color: COLORS.textPrimary },
  recommendedSubtitle: { fontSize: FONT.xs, color: COLORS.textSecondary, marginTop: verticalScale(2) },
  weeksContainer: { alignItems: "flex-end" },
  weeksValue: { fontSize: FONT.xxl, fontWeight: "700", color: COLORS.primary },
  weeksLabel: { fontSize: FONT.xs, color: COLORS.textSecondary },

  // Notes
  notesContainer: { padding: scale(12), paddingTop: 0 },
  notesTitle: { fontSize: FONT.xs, color: COLORS.textSecondary, fontWeight: "600", marginBottom: verticalScale(6) },
  noteText: { fontSize: FONT.xs, color: COLORS.textSecondary, marginBottom: verticalScale(2), lineHeight: FONT.xs * 1.5 },
headerCard: {
  borderRadius: 20,
  overflow: "hidden",
  marginBottom: verticalScale(16),
},

headerImage: {
  borderRadius: 20,
},

headerOverlay: {
  flex: 1,
  padding: scale(18),
  justifyContent: "flex-end",
},
  // Customize
  customizeHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: scale(16) },
  customizeLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  customizeIcon: { width: scale(40), height: scale(40), borderRadius: scale(20), backgroundColor: COLORS.borderLight, alignItems: "center", justifyContent: "center", marginRight: scale(12) },
  customizeTitle: { fontSize: FONT.base, fontWeight: "600", color: COLORS.textPrimary },
  customizeSubtitle: { fontSize: FONT.xs, color: COLORS.textSecondary, marginTop: verticalScale(2) },
  customizeContent: { marginTop: verticalScale(-8) },
  stepTitle: { fontSize: FONT.sm, fontWeight: "600", color: COLORS.textPrimary, marginBottom: verticalScale(12), paddingHorizontal: scale(16), paddingTop: verticalScale(16) },

  // Target Grid
  targetGrid: { flexDirection: "row", paddingHorizontal: scale(12), gap: scale(8) },
  targetButton: { flex: 1, padding: scale(12), borderRadius: scale(10), borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, alignItems: "center" },
  targetButtonActive: { borderColor: COLORS.primary, backgroundColor: "rgba(79, 70, 229, 0.05)" },
  targetValue: { fontSize: FONT.lg, fontWeight: "700", color: COLORS.textPrimary },
  targetValueActive: { color: COLORS.primary },
  targetLabel: { fontSize: FONT.xs, color: COLORS.textSecondary, marginTop: verticalScale(2) },
  targetDiff: { fontSize: FONT.xs, color: COLORS.textTertiary, marginTop: verticalScale(2) },
  targetDiffActive: { color: COLORS.primary },

  // Approach
  approachButton: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: scale(12), borderRadius: scale(10), borderWidth: 1.5, borderColor: COLORS.border, backgroundColor: COLORS.white, marginHorizontal: scale(12), marginBottom: verticalScale(8) },
  approachButtonActive: { borderColor: COLORS.primary, backgroundColor: "rgba(79, 70, 229, 0.05)" },
  approachLeft: { flexDirection: "row", alignItems: "center" },
  approachName: { fontSize: FONT.sm, fontWeight: "600", color: COLORS.textPrimary },
  approachNameActive: { color: COLORS.primary },
  approachRate: { fontSize: FONT.xs, color: COLORS.textSecondary, marginTop: verticalScale(2) },
  approachWeeks: { fontSize: FONT.base, fontWeight: "700", color: COLORS.textPrimary },
  approachWeeksActive: { color: COLORS.primary },
  confirmButton: { backgroundColor: COLORS.primary, margin: scale(12), padding: verticalScale(14), borderRadius: scale(10), alignItems: "center" },
  confirmButtonText: { color: COLORS.white, fontSize: FONT.base, fontWeight: "600" },

  // Calorie
  calorieCard: { backgroundColor: COLORS.borderLight, margin: scale(12), padding: scale(20), borderRadius: scale(12), alignItems: "center" },
  calorieLabel: { fontSize: FONT.sm, color: COLORS.textSecondary },
  calorieValue: { fontSize: FONT.xxxl, fontWeight: "700", color: COLORS.primary, marginVertical: verticalScale(4) },
  calorieSubtext: { fontSize: FONT.xs, color: COLORS.textSecondary },

  // Macros
  sectionLabel: { fontSize: FONT.xs, color: COLORS.textSecondary, fontWeight: "600", paddingHorizontal: scale(12), marginBottom: verticalScale(8) },
  macroGrid: { flexDirection: "row", paddingHorizontal: scale(12), gap: scale(8), marginBottom: verticalScale(12) },
  macroBox: { flex: 1, backgroundColor: COLORS.borderLight, borderRadius: scale(10), padding: scale(12), alignItems: "center" },
  macroValue: { fontSize: FONT.lg, fontWeight: "700", color: COLORS.textPrimary },
  macroLabel: { fontSize: FONT.xs, color: COLORS.textSecondary, marginTop: verticalScale(2) },
  macroPercent: { fontSize: FONT.xs, color: COLORS.primary, marginTop: verticalScale(2) },

  // Nutrients
  nutrientRow: { flexDirection: "row", paddingHorizontal: scale(12), gap: scale(8), marginBottom: verticalScale(12) },
  nutrientBox: { flex: 1, backgroundColor: COLORS.borderLight, borderRadius: scale(8), padding: scale(10), alignItems: "center" },
  nutrientValue: { fontSize: FONT.base, fontWeight: "700", color: COLORS.textPrimary },
  nutrientLabel: { fontSize: FONT.xs, color: COLORS.textSecondary, marginTop: verticalScale(2) },

  // Timeline Card
  timelineCard: { backgroundColor: COLORS.borderLight, borderRadius: scale(10), padding: scale(12), margin: scale(12), marginTop: 0 },
  timelineTitle: { fontSize: FONT.xs, color: COLORS.textSecondary, fontWeight: "600", marginBottom: verticalScale(10) },
  timelineRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: verticalScale(6) },
  timelineLabel: { fontSize: FONT.sm, color: COLORS.textSecondary },
  timelineValue: { fontSize: FONT.sm, fontWeight: "600", color: COLORS.textPrimary },

  // Guidance
  guidanceSection: { backgroundColor: COLORS.borderLight, borderRadius: scale(10), padding: scale(12), marginHorizontal: scale(12), marginBottom: verticalScale(10) },
  guidanceHeader: { flexDirection: "row", alignItems: "center", marginBottom: verticalScale(8) },
  guidanceTitle: { fontSize: FONT.sm, fontWeight: "600", color: COLORS.textPrimary, marginLeft: scale(8) },
  guidanceText: { fontSize: FONT.xs, color: COLORS.textSecondary, marginLeft: scale(26), marginBottom: verticalScale(4), lineHeight: FONT.xs * 1.6 },

  // Safety
  safetyBanner: { flexDirection: "row", backgroundColor: "rgba(245, 158, 11, 0.1)", borderWidth: 1, borderColor: "rgba(245, 158, 11, 0.3)", padding: scale(12), borderRadius: scale(10), marginBottom: verticalScale(16), alignItems: "flex-start" },
  safetyText: { fontSize: FONT.xs, color: COLORS.textSecondary, flex: 1, marginLeft: scale(8), lineHeight: FONT.xs * 1.5 },
  safetyBold: { fontWeight: "700", color: COLORS.textPrimary },

  // Start Button
  startButton: { borderRadius: scale(12), overflow: "hidden", marginBottom: verticalScale(20) },
  startButtonGradient: { flexDirection: "row", padding: verticalScale(16), alignItems: "center", justifyContent: "center" },
  startButtonText: { color: COLORS.white, fontSize: FONT.lg, fontWeight: "700" },
});