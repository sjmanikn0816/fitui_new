import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  ImageBackground,
  Image,
  Platform,
  StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useAppSelector, useAppDispatch } from "@/redux/store/hooks";
import {
  fetchMealPlan,
  fetchMealPlanSimple,
} from "@/redux/slice/mealPlanSlice";
import { fetchUserById } from "@/redux/slice/auth/authSlice";
import { Colors } from "@/constants/Colors";
import Logo from "@/components/ui/Logo";
import { styles } from "../styles/LandingScreenStyles";
import InputSection from "@/components/ui/InputSection";
import { useMealTime } from "@/types/hooks";
import SpeechBubbleBackground from "@/components/ui/SpeechBubbleBackground";
import { Ionicons } from "@expo/vector-icons";
import { mapGender } from "@/utils/errorHandler";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { BlurView } from "expo-blur";
import * as Progress from "react-native-progress";
import { AnimatedTextInline } from "@/components/ui/AnimatedTextInline";

const LandingScreen: React.FC = () => {
  const [query, setQuery] = React.useState("");
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showProgress, setShowProgress] = React.useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const route = useRoute();
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();

  const { assessment, targetCalories } = route.params || {};
  const user = useAppSelector((state) => state.auth.user);
  const { healthCondition } = useAppSelector((state) => state.auth);
  const { immuneDisorder } = useAppSelector((state) => state.auth);
  const { loading } = useAppSelector((state) => state.mealPlan);
  const { currentMealType, mealImage } = useMealTime();
  const [processingType, setProcessingType] = React.useState<
    "suggest" | "surprise" | null
  >(null);

  console.log(immuneDisorder);
  // ✅ Fade animation
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (user?.userId) dispatch(fetchUserById(user.userId));
  }, [dispatch, user?.userId]);

  const ethnicityMap = {
    Hispanic: "Hispanic or Latino",
    Latino: "Hispanic or Latino",
    "African American": "Black or African American",
    Black: "Black or African American",
    Asian: "Asian",
    White: "White",
    "Prefer not to say": "Prefer not to say",
  };

  const activityLevels = [
    { id: "NOT_ACTIVE", label: "Not Active" },
    { id: "SOMEWHAT_ACTIVE", label: "Somewhat Active" },
    { id: "ACTIVE", label: "Active" },
    { id: "VERY_ACTIVE", label: "Very Active" },
    { id: "EXTRA_ACTIVE", label: "Athletic" },
    { id: "PRO_ATHLETE", label: "Pro Athlete" },
  ];

  const mappedActivity =
    activityLevels.find((a) => a.id === user?.activityLevel)?.label || "Active";

  const goToDashboard = async (type: "suggest" | "surprise") => {
    try {
      setProcessingType(type);
      setIsProcessing(true);
      setShowProgress(false);

      setTimeout(async () => {
        setShowProgress(true);
        await handleMealPlanRequest(type);
      }, 1500);
    } catch (error) {
      console.error("❌ Meal Plan Fetch Error:", error);
    }
  };

  const handleMealPlanRequest = async (type: "suggest" | "surprise") => {
    let ethnicity = "Asian";

    if (
      type === "suggest" &&
      (!ethnicity || ethnicity === "Prefer not to say")
    ) {
      ethnicity = "Asian";
    }

    const weightLbs = user?.weightInLbs ?? 180;
    const heightFeet = user?.heightInFeet ?? 5;
    const heightInches = user?.heightInInches ?? 0;
    const targetWeightLbs = user?.targetWeight ?? 180;

    const effectiveCalories = Math.round(
      targetCalories ?? user?.targetCalories ?? 1800
    );

    const basePayload = {
      plan_type: "daily",
      user_profile: {
        birth_year: user?.birthYear ?? 1990,
        birth_month: user?.birthMonth ?? 6,
        weight_lbs: weightLbs,
        height_feet: heightFeet,
        height_inches: heightInches,
        biological_sex: mapGender(user?.gender),
        food_preference: user?.dietPreference ?? "Non-Veg",
        on_diet_plan: user?.isOnDiet ?? false,
        activity_level: mappedActivity,
        travel_frequency: user?.travelPercentage ?? "Rarely/Never",
        ethnicity,
      },
      health_conditions: {
        diabetes_type1_type2:
          healthCondition?.diabetes_type1_type2 ??
          healthCondition?.diabetes ??
          healthCondition?.preDiabetes ??
          false,
        hypertension: healthCondition?.hypertension ?? false,
        cancer: healthCondition?.cancer ?? false,
        immune_disorder: healthCondition?.immune_disorder ?? false,
        neurological_health: healthCondition?.neurological_health ?? false,
        food_allergies: healthCondition?.food_allergies ?? [],
      },
      user_goal: {
        weight_goal:
          user?.goal === "LOSE"
            ? "lose"
            : user?.goal === "GAIN"
            ? "gain"
            : "maintain",
        target_weight_lbs: targetWeightLbs,
        target_calories: effectiveCalories,
      },
      options_per_meal: 1,
      include_recipes: true,
      recipe_detail_level: "detailed",
      target_date: new Date().toISOString().split("T")[0],
    };

    const finalPayload =
      query.trim().length > 0
        ? { ...basePayload, prompt: query.trim() }
        : { ...basePayload, target_daily_calories: effectiveCalories };

    if (query.trim().length > 0) {
      await dispatch(fetchMealPlan(finalPayload));
    } else {
      await dispatch(fetchMealPlanSimple(finalPayload));
    }

    navigation.navigate("Dashboard", {
      mealType: currentMealType,
      surpriseMode: type === "surprise",
      fromLanding: true,
    });

    // Reset animation state
    setIsProcessing(false);
    setShowProgress(false);
  };

  const handleProfilePress = () => navigation.navigate("Profile");
  const handleMorePress = () =>
    navigation.navigate("AllScreensMenu", { from: "LandingScreen" });

  return (
    <ImageBackground
      source={mealImage}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}
    >
      <BlurView
        intensity={70}
        tint="dark"
        style={StyleSheet.absoluteFillObject}
      />

      <LoadingSpinner
        visible={loading && !isProcessing}
        message="Fetching your personalized meal plan..."
      />

      <Animated.View
        style={{
          opacity: fadeAnim,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          position: "absolute",
          top: Platform.OS === "ios" ? 50 : 40,
          left: 16,
          right: 16,
          zIndex: 10,
        }}
      >
        <TouchableOpacity
          onPress={handleProfilePress}
          style={localStyles.circleBtn}
        />
        <TouchableOpacity onPress={handleMorePress} style={localStyles.moreBtn}>
          <Ionicons name="ellipsis-vertical" size={24} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <View style={styles.mainContent}>
        <Logo />

        <View style={styles.topSection}>
          <Animated.View
            style={[styles.speechBubbleContainer, { opacity: fadeAnim }]}
          >
            <SpeechBubbleBackground>
              <View style={styles.greetingRow}>
                <Image
                  source={require("assets/Ellipse 161.png")}
                  style={styles.profileImage}
                />
                <View style={styles.greetingTextContainer}>
                  <Text style={styles.greeting} numberOfLines={2}>
                    Hello, {user.firstName || "vella"}!
                  </Text>
                  <Text style={styles.subGreeting} numberOfLines={2}>
                    It's {currentMealType} time!
                  </Text>
                </View>
              </View>

              <View style={styles.blackDivider} />

              {!isProcessing ? (
                <>
                  <InputSection
                    query={query}
                    setQuery={setQuery}
                    loading={loading}
                    selectedImageUri={null}
                    setSelectedImageUri={() => {}}
                    openModal={() => {}}
                    triggerFoodAnalysis={() => {}}
                  />

                  <View style={styles.buttonRow}>
                    <TouchableOpacity
                      style={styles.yellowBtn}
                      onPress={() => goToDashboard("suggest")}
                      disabled={loading}
                    >
                      <Text style={styles.yellowBtnText}>Suggest Meal</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        styles.yellowBtn,
                        (query.trim().length > 0 || loading) && {
                          opacity: 0.5,
                        },
                      ]}
                      onPress={() => goToDashboard("surprise")}
                      disabled={query.trim().length > 0 || loading}
                    >
                      <Text style={styles.yellowBtnText}>Surprise Meal</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <View style={localStyles.messageContainer}>
                  <View style={{ maxWidth: "100%" }}>
                    <AnimatedTextInline
                      style={localStyles.processingTextTitle}
                      numberOfLines={1}
                    >
                      {processingType === "surprise"
                        ? "We’re cooking up something new!"
                        : "Craving for your preferred meals?"}
                    </AnimatedTextInline>
                  </View>

                  <AnimatedTextInline
                    style={localStyles.processingTextDesc}
                    duration={800}
                  >
                    {processingType === "surprise"
                      ? "This meal plan is based on your customized goals, but it may include cuisines outside your usual preferences, like South Asian, Italian, or other surprises!"
                      : "This meal plan is based on your customized goals, but it may include cuisines based on your usual preferences"}
                  </AnimatedTextInline>

                  {showProgress && (
                    <Progress.Bar
                      indeterminate
                      animationType="timing"
                      width={180}
                      color="#bed4e0ff"
                      borderWidth={0}
                      style={{ marginTop: 20 }}
                    />
                  )}
                </View>
              )}
            </SpeechBubbleBackground>
          </Animated.View>
        </View>
      </View>
    </ImageBackground>
  );
};

const localStyles = StyleSheet.create({
  messageContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20,
    paddingHorizontal: 16,
    backgroundColor: "rgb(51,51,51,0.6)",
    borderRadius: 12,
  },
  processingTextTitle: {
    color: Colors.gray200,
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
    textAlign: "center",
  },
  processingTextDesc: {
    color: Colors.gray300,
    fontSize: 14,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
    opacity: 0.9,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  moreBtn: {
    padding: 6,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderRadius: 10,
  },
});

export default LandingScreen;
