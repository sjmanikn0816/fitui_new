import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

import { Colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { RootState } from "@/redux/store";
import { signupUser } from "@/redux/slice/auth/authSlice";
import MainHeader from "@/components/ui/MainHeaderNav";
import ScrollContainer from "@/components/ui/ScrollContainer";
import { styles } from "@/screens/styles/PersonalDetailsStyles";
import Dropdown from "@/components/ui/Dropdown";
import { showModal } from "@/redux/slice/modalSlice";

import {
  Activity,
  ZapOff,
  Zap,
  Flame,
  Globe,
  Plane,
  Calendar,
  Clock,
  Briefcase,
  ChevronRight,
  Check,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react-native";

type PersonalDetailsScreenNavigationProp = StackNavigationProp<
  AuthStackParamList,
  "PersonalDetails"
>;

interface Props {
  navigation: PersonalDetailsScreenNavigationProp;
  route: any;
}

interface CardOption {
  label: string;
  icon?: React.ReactNode;
  value?: string;
  subtitle?: string;
  emoji?: string;
}

const PersonalDetailsScreen: React.FC<Props> = ({ route, navigation }) => {
  const {
    firstName = "",
    lastName = "",
    email = "",
    appJwt = "",
    refreshToken = "",
    password = "",
    provider = "",
  } = route.params || {};

  // State variables (keeping same keys for backend compatibility)
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [heightFeet, setHeightFeet] = useState("");
  const [heightInches, setHeightInches] = useState("");
  const [weight, setWeight] = useState("");
  const [gender, setGender] = useState<"M" | "F" | "O" | null>(null);
  const [dietPreference, setDietPreference] = useState<
    "Veg" | "Non-Veg" | "Vegan" | null
  >(null);
  const [onDiet, setOnDiet] = useState<boolean | null>(null);
  const [activityLevel, setActivityLevel] = useState<string | null>(null);
  const [ethnicity, setEthnicity] = useState<string | null>(null);
  const [travelPercentage, setTravelPercentage] = useState("");
  const [goalType, setGoalType] = useState<"LOSE" | "GAIN" | "MAINTAIN" | null>(null);

  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 8;

  // Animation values
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: RootState) => state.auth);

  // Options data
  const genders: CardOption[] = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Other", value: "O" },
  ];

  const dietOptions: CardOption[] = [
    { label: "Vegetarian", value: "Veg", emoji: "🥦", subtitle: "Plant-based meals" },
    { label: "Non-Vegetarian", value: "Non-Veg", emoji: "🍗", subtitle: "Includes meat" },
    { label: "Vegan", value: "Vegan", emoji: "🌱", subtitle: "100% plant-based" },
  ];

  const activityOptions: CardOption[] = [
    {
      label: "Not Active",
      icon: <ZapOff size={28} color={Colors.primary} />,
      value: "NOT_ACTIVE",
      subtitle: "Little to no exercise",
    },
    {
      label: "Somewhat Active",
      icon: <Activity size={28} color={Colors.primary} />,
      value: "SOMEWHAT_ACTIVE",
      subtitle: "Light exercise 1-3 days/week",
    },
    {
      label: "Active",
      icon: <Zap size={28} color={Colors.primary} />,
      value: "ACTIVE",
      subtitle: "Moderate exercise 3-5 days/week",
    },
    {
      label: "Very Active",
      icon: <Flame size={28} color={Colors.primary} />,
      value: "VERY_ACTIVE",
      subtitle: "Intense exercise 6-7 days/week",
    },
    {
      label: "Extra Active",
      icon: <Flame size={28} color="#FF4500" />,
      value: "EXTRA_ACTIVE",
      subtitle: "Athlete level training",
    },
  ];

  const ethnicityOptions: CardOption[] = [
    { label: "Asian", icon: <Globe size={24} color={Colors.primary} />, value: "Asian" },
    { label: "Black", icon: <Globe size={24} color={Colors.primary} />, value: "Black" },
    { label: "White", icon: <Globe size={24} color={Colors.primary} />, value: "White" },
    { label: "Hispanic", icon: <Globe size={24} color={Colors.primary} />, value: "Hispanic" },
    { label: "Mixed", icon: <Globe size={24} color={Colors.primary} />, value: "Mixed" },
    { label: "Other", icon: <Globe size={24} color={Colors.primary} />, value: "Other" },
  ];

  const travelFrequencyOptions: CardOption[] = [
    { label: "Daily", icon: <Plane size={24} color={Colors.primary} />, value: "Daily" },
    { label: "Weekly", icon: <Calendar size={24} color={Colors.primary} />, value: "Weekly" },
    { label: "Monthly", icon: <Briefcase size={24} color={Colors.primary} />, value: "Monthly" },
    {
      label: "A few times a year",
      icon: <Clock size={24} color={Colors.primary} />,
      value: "A few times a year",
    },
    {
      label: "Rarely/Never",
      icon: <ZapOff size={24} color={Colors.primary} />,
      value: "Rarely/Never",
    },
  ];

  const goalOptions: CardOption[] = [
    {
      label: "Lose Weight",
      icon: <TrendingDown size={32} color="#10B981" />,
      value: "LOSE",
      subtitle: "Burn fat and get lean",
      emoji: "📉",
    },
    {
      label: "Gain Weight",
      icon: <TrendingUp size={32} color="#3B82F6" />,
      value: "GAIN",
      subtitle: "Build muscle mass",
      emoji: "📈",
    },
    {
      label: "Maintain",
      icon: <Minus size={32} color="#8B5CF6" />,
      value: "MAINTAIN",
      subtitle: "Stay healthy & fit",
      emoji: "⚖️",
    },
  ];

  const feetOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1} ft`,
    value: (i + 1).toString(),
  }));

  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: currentYear - 1923 }, (_, i) => ({
    label: (currentYear - i).toString(),
    value: (currentYear - i).toString(),
  }));

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(2000, i).toLocaleString("en-US", { month: "long" }),
    value: (i + 1).toString(),
  }));

  const inchesOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i} in`,
    value: i.toString(),
  }));

  // Calculate age
  const age = (() => {
    if (!birthYear || !birthMonth) return 0;
    const today = new Date();
    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);
    if (isNaN(year) || isNaN(month)) return 0;
    let calculatedAge = today.getFullYear() - year;
    const monthDiff = today.getMonth() + 1 - month;
    if (monthDiff < 0) calculatedAge--;
    return calculatedAge;
  })();

  // Animate progress bar
  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: (currentStep / totalSteps) * 100,
      useNativeDriver: false,
      tension: 50,
      friction: 7,
    }).start();
  }, [currentStep]);

  // Step transition animation
  const animateStepTransition = (direction: "forward" | "backward") => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: direction === "forward" ? -50 : 50,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      animateStepTransition("forward");
      setTimeout(() => setCurrentStep(currentStep + 1), 150);
    } else {
      handleSubmit();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      animateStepTransition("backward");
      setTimeout(() => setCurrentStep(currentStep - 1), 150);
    } else {
      navigation.goBack();
    }
  };

  const validateCurrentStep = (): boolean => {
    switch (currentStep) {
      case 1:
        if (!birthYear || !birthMonth) {
          dispatch(showModal({ type: "error", message: "Please select your birth year and month" }));
          return false;
        }
        if (age < 13) {
          dispatch(showModal({ type: "error", message: "You must be at least 13 years old to use this app" }));
          return false;
        }
        return true;
      case 2:
        if (!weight || !heightFeet || !heightInches) {
          dispatch(showModal({ type: "error", message: "Please enter your weight and height" }));
          return false;
        }
        return true;
      case 3:
        if (!gender) {
          dispatch(showModal({ type: "error", message: "Please select your biological sex" }));
          return false;
        }
        return true;
      case 4:
        if (!dietPreference || onDiet === null) {
          dispatch(showModal({ type: "error", message: "Please complete your food preferences" }));
          return false;
        }
        return true;
      case 5:
        if (!activityLevel) {
          dispatch(showModal({ type: "error", message: "Please select your activity level" }));
          return false;
        }
        return true;
      case 6:
        if (!ethnicity) {
          dispatch(showModal({ type: "error", message: "Please select your ethnicity" }));
          return false;
        }
        return true;
      case 7:
        if (!travelPercentage) {
          dispatch(showModal({ type: "error", message: "Please select your travel frequency" }));
          return false;
        }
        return true;
      case 8:
        if (!goalType) {
          dispatch(showModal({ type: "error", message: "Please select your fitness goal" }));
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleContinue = () => {
    if (validateCurrentStep()) {
      goToNextStep();
    }
  };

  const handleSubmit = async () => {
    const payload: any = {
      firstName,
      lastName,
      email,
      password,
      provider: provider,
      age: age,
      heightInFeet: parseInt(heightFeet),
      heightInInches: parseInt(heightInches),
      gender,
      weightInLbs: Number(weight),
      dietPreference,
      isOnDiet: onDiet,
      exerciseHabits: null,
      healthAppUsage: null,
      usageFrequency: null,
      isAppHelpful: true,
      isSleepMonitoring: false,
      targetCalories: null,
      targetWeight: null,
      travelPercentage,
      hasMedicalCondition: false,
      watchesDietContent: false,
      ethnicity,
      goal: goalType ? goalType.toUpperCase() : null,
      birthMonth,
      birthYear,
      activityLevel,
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
    };

    try {
      const resultAction = await dispatch(signupUser(payload));
      if (signupUser.fulfilled.match(resultAction)) {
        navigation.navigate("HealthProfile");
      } else {
        const message =
          resultAction.payload && typeof resultAction.payload === "object"
            ? (resultAction.payload as any).message
            : (resultAction.payload as string);
        dispatch(showModal({ type: "error", message: message || "Something went wrong" }));
      }
    } catch (err) {
      console.error("Signup error:", err);
      dispatch(showModal({ type: "error", message: "Something went wrong" }));
    }
  };

  // Render progress bar
  const renderProgressBar = () => {
    const progressWidth = progressAnim.interpolate({
      inputRange: [0, 100],
      outputRange: ["0%", "100%"],
    });

    return (
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <Animated.View style={[styles.progressBarFill, { width: progressWidth }]} />
        </View>
        <Text style={styles.progressText}>
          Step {currentStep} of {totalSteps}
        </Text>
      </View>
    );
  };

  // Render option card
  const renderOptionCard = (
    option: CardOption,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      key={option.value || option.label}
      style={[styles.modernCard, isSelected && styles.modernCardActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.modernCardContent}>
        {(option.icon || option.emoji) && (
          <View style={[styles.modernIconContainer, isSelected && styles.modernIconContainerActive]}>
            {option.emoji ? (
              <Text style={styles.emojiIcon}>{option.emoji}</Text>
            ) : (
              option.icon
            )}
          </View>
        )}
        <View style={styles.modernCardTextContainer}>
          <Text style={[styles.modernCardTitle, isSelected && styles.modernCardTitleActive]}>
            {option.label}
          </Text>
          {option.subtitle && (
            <Text style={[styles.modernCardSubtitle, isSelected && styles.modernCardSubtitleActive]}>
              {option.subtitle}
            </Text>
          )}
        </View>
      </View>
      {isSelected && (
        <View style={styles.checkmarkBadge}>
          <Check size={16} color="#fff" strokeWidth={3} />
        </View>
      )}
    </TouchableOpacity>
  );

  // Render current step content
  const renderStepContent = () => {
    const animatedStyle = {
      opacity: fadeAnim,
      transform: [{ translateX: slideAnim }],
    };

    switch (currentStep) {
      case 1: // Age
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Text style={styles.stepEmoji}>🎂</Text>
            <Text style={styles.stepTitle}>When were you born?</Text>
            <Text style={styles.stepSubtitle}>We use this to personalize your nutrition plan</Text>
            <View style={styles.inputGroup}>
              <Dropdown
                label="Birth Year"
                placeholder="Select Year"
                items={yearOptions}
                selectedValue={birthYear}
                onSelect={(value) => setBirthYear(value.toString())}
                required
              />
              <Dropdown
                label="Birth Month"
                placeholder="Select Month"
                items={monthOptions}
                selectedValue={birthMonth}
                onSelect={(value) => setBirthMonth(value.toString())}
                required
              />
            </View>
          </Animated.View>
        );

      case 2: // Body Metrics
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Text style={styles.stepEmoji}>⚖️</Text>
            <Text style={styles.stepTitle}>Your body metrics</Text>
            <Text style={styles.stepSubtitle}>Help us calculate your ideal nutrition</Text>
            <View style={styles.inputGroup}>
              <Input
                label="Weight (lbs)"
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="150"
                required
              />
              <View style={styles.row}>
                <View style={styles.column}>
                  <Dropdown
                    label="Height (Feet)"
                    placeholder="Feet"
                    items={feetOptions}
                    selectedValue={heightFeet}
                    onSelect={(value) => setHeightFeet(value.toString())}
                    required
                  />
                </View>
                <View style={styles.column}>
                  <Dropdown
                    label="Inches"
                    placeholder="In"
                    items={inchesOptions}
                    selectedValue={heightInches}
                    onSelect={(value) => setHeightInches(value.toString())}
                    required
                  />
                </View>
              </View>
            </View>
          </Animated.View>
        );

      case 3: // Gender
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Text style={styles.stepEmoji}>👤</Text>
            <Text style={styles.stepTitle}>What's your biological sex?</Text>
            <Text style={styles.stepSubtitle}>This helps us personalize your calorie needs</Text>
            <View style={styles.cardsContainer}>
              {genders.map((g) =>
                renderOptionCard(g, gender === g.value, () => setGender(g.value as "M" | "F" | "O"))
              )}
            </View>
          </Animated.View>
        );

      case 4: // Food Preference
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Text style={styles.stepEmoji}>🥗</Text>
            <Text style={styles.stepTitle}>What's your food preference?</Text>
            <Text style={styles.stepSubtitle}>We'll tailor meal suggestions for you</Text>
            <View style={styles.cardsContainer}>
              {dietOptions.map((diet) =>
                renderOptionCard(diet, dietPreference === diet.value, () =>
                  setDietPreference(diet.value as "Veg" | "Non-Veg" | "Vegan")
                )
              )}
            </View>
            <View style={styles.toggleQuestion}>
              <Text style={styles.toggleLabel}>Currently on any diet plan?</Text>
              <View style={styles.toggleButtons}>
                <TouchableOpacity
                  style={[styles.toggleButton, onDiet === true && styles.toggleButtonActive]}
                  onPress={() => setOnDiet(true)}
                >
                  <Text style={[styles.toggleButtonText, onDiet === true && styles.toggleButtonTextActive]}>
                    Yes
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.toggleButton, onDiet === false && styles.toggleButtonActive]}
                  onPress={() => setOnDiet(false)}
                >
                  <Text style={[styles.toggleButtonText, onDiet === false && styles.toggleButtonTextActive]}>
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        );

      case 5: // Activity Level
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Text style={styles.stepEmoji}>💪</Text>
            <Text style={styles.stepTitle}>How active are you?</Text>
            <Text style={styles.stepSubtitle}>This helps us estimate your daily calorie needs</Text>
            <View style={styles.cardsContainer}>
              {activityOptions.map((activity) =>
                renderOptionCard(activity, activityLevel === activity.value, () =>
                  setActivityLevel(activity.value || null)
                )
              )}
            </View>
          </Animated.View>
        );

      case 6: // Ethnicity
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Text style={styles.stepEmoji}>🌍</Text>
            <Text style={styles.stepTitle}>What's your ethnicity?</Text>
            <Text style={styles.stepSubtitle}>Helps us provide culturally relevant meal options</Text>
            <View style={styles.cardsContainer}>
              {ethnicityOptions.map((eth) =>
                renderOptionCard(eth, ethnicity === eth.value, () => setEthnicity(eth.value || null))
              )}
            </View>
          </Animated.View>
        );

      case 7: // Travel Frequency
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Text style={styles.stepEmoji}>✈️</Text>
            <Text style={styles.stepTitle}>How often do you travel?</Text>
            <Text style={styles.stepSubtitle}>We'll suggest portable meal options</Text>
            <View style={styles.cardsContainer}>
              {travelFrequencyOptions.map((travel) =>
                renderOptionCard(travel, travelPercentage === travel.value, () =>
                  setTravelPercentage(travel.value || "")
                )
              )}
            </View>
          </Animated.View>
        );

      case 8: // Goal
        return (
          <Animated.View style={[styles.stepContainer, animatedStyle]}>
            <Text style={styles.stepEmoji}>🎯</Text>
            <Text style={styles.stepTitle}>What's your fitness goal?</Text>
            <Text style={styles.stepSubtitle}>Let's create your personalized plan</Text>
            <View style={styles.cardsContainer}>
              {goalOptions.map((goal) =>
                renderOptionCard(goal, goalType === goal.value, () =>
                  setGoalType(goal.value as "LOSE" | "GAIN" | "MAINTAIN")
                )
              )}
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <MainHeader
        title=""
        showBackButton={true}
        onBackPress={goToPreviousStep}
      />

      <ScrollContainer>
        <View style={styles.modernContainer}>
          {renderProgressBar()}
          {renderStepContent()}

          <View style={styles.buttonContainer}>
            <Button
              title={currentStep === totalSteps ? "Complete Setup" : "Continue"}
              onPress={handleContinue}
              loading={loading}
              style={styles.continueButton}
            />
          </View>
        </View>
      </ScrollContainer>
    </>
  );
};

export default PersonalDetailsScreen;
