import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Animated, {
  FadeInUp,
  FadeInDown,
  FadeOutUp,
  FadeOutLeft,
  FadeInRight,
  SlideInRight,
  SlideOutLeft,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withDelay,
  interpolate,
  Easing,
  ZoomIn,
  BounceIn,
} from "react-native-reanimated";

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
  Check,
  TrendingDown,
  TrendingUp,
  Minus,
} from "lucide-react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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

// Animated Card Component with bounce effect
const AnimatedCard = ({
  option,
  isSelected,
  onPress,
  index,
}: {
  option: CardOption;
  isSelected: boolean;
  onPress: () => void;
  index: number;
}) => {
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotateZ: `${rotation.value}deg` },
    ],
  }));

  const handlePress = () => {
    // Bounce + slight rotation animation
    scale.value = withSequence(
      withSpring(0.95, { damping: 10, stiffness: 400 }),
      withSpring(1.05, { damping: 10, stiffness: 400 }),
      withSpring(1, { damping: 10, stiffness: 400 })
    );
    rotation.value = withSequence(
      withTiming(-2, { duration: 50 }),
      withTiming(2, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
    onPress();
  };

  return (
    <Animated.View
      entering={FadeInUp.delay(index * 80).springify().damping(12)}
      style={animatedStyle}
    >
      <TouchableOpacity
        style={[styles.modernCard, isSelected && styles.modernCardActive]}
        onPress={handlePress}
        activeOpacity={0.8}
      >
        <View style={styles.modernCardContent}>
          {(option.icon || option.emoji) && (
            <Animated.View
              style={[
                styles.modernIconContainer,
                isSelected && styles.modernIconContainerActive,
              ]}
              entering={isSelected ? ZoomIn.springify() : undefined}
            >
              {option.emoji ? (
                <Text style={styles.emojiIcon}>{option.emoji}</Text>
              ) : (
                option.icon
              )}
            </Animated.View>
          )}
          <View style={styles.modernCardTextContainer}>
            <Text
              style={[
                styles.modernCardTitle,
                isSelected && styles.modernCardTitleActive,
              ]}
            >
              {option.label}
            </Text>
            {option.subtitle && (
              <Text
                style={[
                  styles.modernCardSubtitle,
                  isSelected && styles.modernCardSubtitleActive,
                ]}
              >
                {option.subtitle}
              </Text>
            )}
          </View>
        </View>
        {isSelected && (
          <Animated.View
            style={styles.checkmarkBadge}
            entering={BounceIn.duration(400)}
          >
            <Check size={16} color="#fff" strokeWidth={3} />
          </Animated.View>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

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
  const [goalType, setGoalType] = useState<"LOSE" | "GAIN" | "MAINTAIN" | null>(
    null
  );

  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<"forward" | "backward">("forward");
  const totalSteps = 8;

  // Reanimated shared values
  const progress = useSharedValue(0);
  const progressGlow = useSharedValue(0);

  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state: RootState) => state.auth);

  const genders: CardOption[] = [
    { label: "Male", value: "M", emoji: "👨" },
    { label: "Female", value: "F", emoji: "👩" },
    { label: "Other", value: "O", emoji: "🧑" },
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

  const feetOptions = Array.from({ length: 6 }, (_, i) => ({
    label: `${i + 4} ft`,
    value: (i + 4).toString(),
  }));

  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 18;
  const yearOptions = Array.from({ length: maxYear - minYear + 1 }, (_, i) => ({
    label: (maxYear - i).toString(),
    value: (maxYear - i).toString(),
  }));

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: new Date(2000, i).toLocaleString("en-US", { month: "long" }),
    value: (i + 1).toString(),
  }));

  const inchesOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i} in`,
    value: i.toString(),
  }));

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

  // Animated progress bar
  useEffect(() => {
    progress.value = withSpring((currentStep / totalSteps) * 100, {
      damping: 15,
      stiffness: 100,
    });
    // Glow pulse effect
    progressGlow.value = withSequence(
      withTiming(1, { duration: 300 }),
      withTiming(0.6, { duration: 500 })
    );
  }, [currentStep]);

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
    shadowOpacity: interpolate(progressGlow.value, [0.6, 1], [0.3, 0.8]),
    shadowRadius: interpolate(progressGlow.value, [0.6, 1], [4, 12]),
  }));

  const goToNextStep = () => {
    if (currentStep < totalSteps) {
      setDirection("forward");
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const goToPreviousStep = () => {
    if (currentStep > 1) {
      setDirection("backward");
      setCurrentStep(currentStep - 1);
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
        if (age < 18) {
          dispatch(showModal({ type: "error", message: "You must be at least 18 years old to use this app" }));
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
      goal: goalType ? goalType : null,
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
        // Skip validation error for admin@yxis.com and continue to next page
        if (email === "admin@yxis.com") {
          console.log("⚠️ Skipping backend error for admin@yxis.com, proceeding to HealthProfile");
          navigation.navigate("HealthProfile");
          return;
        }

        const message =
          resultAction.payload && typeof resultAction.payload === "object"
            ? (resultAction.payload as any).message
            : (resultAction.payload as string);
        dispatch(showModal({ type: "error", message: message || "Something went wrong" }));
      }
    } catch (err) {
      console.error("Signup error:", err);
      // Skip error for admin@yxis.com
      if (email === "admin@yxis.com") {
        console.log("⚠️ Skipping error for admin@yxis.com, proceeding to HealthProfile");
        navigation.navigate("HealthProfile");
        return;
      }
      dispatch(showModal({ type: "error", message: "Something went wrong" }));
    }
  };

  const renderProgressBar = () => {
    return (
      <Animated.View
        style={styles.progressBarContainer}
        entering={FadeInDown.delay(100).springify()}
      >
        <View style={styles.progressBarBackground}>
          <Animated.View
            style={[
              styles.progressBarFill,
              progressAnimatedStyle,
              {
                shadowColor: Colors.primary,
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
          />
        </View>
        <Animated.Text
          style={styles.progressText}
          entering={FadeInUp.delay(200)}
        >
          Step {currentStep} of {totalSteps}
        </Animated.Text>
      </Animated.View>
    );
  };

  const renderOptionCard = (
    option: CardOption,
    isSelected: boolean,
    onPress: () => void,
    index: number
  ) => (
    <AnimatedCard
      key={option.value || option.label}
      option={option}
      isSelected={isSelected}
      onPress={onPress}
      index={index}
    />
  );

  // Toggle button with animation
  const AnimatedToggle = ({
    isActive,
    label,
    onPress,
    delay,
  }: {
    isActive: boolean;
    label: string;
    onPress: () => void;
    delay: number;
  }) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ scale: scale.value }],
    }));

    const handlePress = () => {
      scale.value = withSequence(
        withSpring(0.9, { damping: 10 }),
        withSpring(1, { damping: 10 })
      );
      onPress();
    };

    return (
      <Animated.View
        entering={FadeInUp.delay(delay).springify()}
        style={animatedStyle}
      >
        <TouchableOpacity
          style={[styles.toggleButton, isActive && styles.toggleButtonActive]}
          onPress={handlePress}
        >
          <Text
            style={[
              styles.toggleButtonText,
              isActive && styles.toggleButtonTextActive,
            ]}
          >
            {label}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  const renderStepContent = () => {
    const enteringAnim = direction === "forward"
      ? SlideInRight.springify().damping(15)
      : FadeInUp.springify().damping(15);

    const exitingAnim = direction === "forward"
      ? SlideOutLeft.springify().damping(15)
      : FadeOutUp.springify().damping(15);

    switch (currentStep) {
      case 1:
        return (
          <Animated.View
            key="step1"
            style={styles.stepContainer}
            entering={enteringAnim}
            exiting={exitingAnim}
          >
            <Animated.Text
              style={styles.stepEmoji}
              entering={BounceIn.delay(200)}
            >
              🎂
            </Animated.Text>
            <Animated.Text
              style={styles.stepTitle}
              entering={FadeInUp.delay(100).springify()}
            >
              When were you born?
            </Animated.Text>
            <Animated.Text
              style={styles.stepSubtitle}
              entering={FadeInUp.delay(150).springify()}
            >
              We use this to personalize your nutrition plan
            </Animated.Text>
            <Animated.View
              style={styles.inputGroup}
              entering={FadeInUp.delay(200).springify()}
            >
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
            </Animated.View>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View
            key="step2"
            style={styles.stepContainer}
            entering={enteringAnim}
            exiting={exitingAnim}
          >
            <Animated.Text
              style={styles.stepEmoji}
              entering={BounceIn.delay(200)}
            >
              ⚖️
            </Animated.Text>
            <Animated.Text
              style={styles.stepTitle}
              entering={FadeInUp.delay(100).springify()}
            >
              Your body metrics
            </Animated.Text>
            <Animated.Text
              style={styles.stepSubtitle}
              entering={FadeInUp.delay(150).springify()}
            >
              Help us calculate your ideal nutrition
            </Animated.Text>
            <Animated.View
              style={styles.inputGroup}
              entering={FadeInUp.delay(200).springify()}
            >
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
            </Animated.View>
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View
            key="step3"
            style={styles.stepContainer}
            entering={enteringAnim}
            exiting={exitingAnim}
          >
            <Animated.Text
              style={styles.stepEmoji}
              entering={BounceIn.delay(200)}
            >
              👤
            </Animated.Text>
            <Animated.Text
              style={styles.stepTitle}
              entering={FadeInUp.delay(100).springify()}
            >
              What's your biological sex?
            </Animated.Text>
            <Animated.Text
              style={styles.stepSubtitle}
              entering={FadeInUp.delay(150).springify()}
            >
              This helps us personalize your calorie needs
            </Animated.Text>
            <View style={styles.cardsContainer}>
              {genders.map((g, index) =>
                renderOptionCard(
                  g,
                  gender === g.value,
                  () => setGender(g.value as "M" | "F" | "O"),
                  index
                )
              )}
            </View>
          </Animated.View>
        );

      case 4:
        return (
          <Animated.View
            key="step4"
            style={styles.stepContainer}
            entering={enteringAnim}
            exiting={exitingAnim}
          >
            <Animated.Text
              style={styles.stepEmoji}
              entering={BounceIn.delay(200)}
            >
              🥗
            </Animated.Text>
            <Animated.Text
              style={styles.stepTitle}
              entering={FadeInUp.delay(100).springify()}
            >
              What's your food preference?
            </Animated.Text>
            <Animated.Text
              style={styles.stepSubtitle}
              entering={FadeInUp.delay(150).springify()}
            >
              We'll tailor meal suggestions for you
            </Animated.Text>
            <View style={styles.cardsContainer}>
              {dietOptions.map((diet, index) =>
                renderOptionCard(
                  diet,
                  dietPreference === diet.value,
                  () => setDietPreference(diet.value as "Veg" | "Non-Veg" | "Vegan"),
                  index
                )
              )}
            </View>
            <Animated.View
              style={styles.toggleQuestion}
              entering={FadeInUp.delay(400).springify()}
            >
              <Text style={styles.toggleLabel}>Currently on any diet plan?</Text>
              <View style={styles.toggleButtons}>
                <AnimatedToggle
                  isActive={onDiet === true}
                  label="Yes"
                  onPress={() => setOnDiet(true)}
                  delay={450}
                />
                <AnimatedToggle
                  isActive={onDiet === false}
                  label="No"
                  onPress={() => setOnDiet(false)}
                  delay={500}
                />
              </View>
            </Animated.View>
          </Animated.View>
        );

      case 5:
        return (
          <Animated.View
            key="step5"
            style={styles.stepContainer}
            entering={enteringAnim}
            exiting={exitingAnim}
          >
            <Animated.Text
              style={styles.stepEmoji}
              entering={BounceIn.delay(200)}
            >
              💪
            </Animated.Text>
            <Animated.Text
              style={styles.stepTitle}
              entering={FadeInUp.delay(100).springify()}
            >
              How active are you?
            </Animated.Text>
            <Animated.Text
              style={styles.stepSubtitle}
              entering={FadeInUp.delay(150).springify()}
            >
              This helps us estimate your daily calorie needs
            </Animated.Text>
            <View style={styles.cardsContainer}>
              {activityOptions.map((activity, index) =>
                renderOptionCard(
                  activity,
                  activityLevel === activity.value,
                  () => setActivityLevel(activity.value || null),
                  index
                )
              )}
            </View>
          </Animated.View>
        );

      case 6:
        return (
          <Animated.View
            key="step6"
            style={styles.stepContainer}
            entering={enteringAnim}
            exiting={exitingAnim}
          >
            <Animated.Text
              style={styles.stepEmoji}
              entering={BounceIn.delay(200)}
            >
              🌍
            </Animated.Text>
            <Animated.Text
              style={styles.stepTitle}
              entering={FadeInUp.delay(100).springify()}
            >
              What's your ethnicity?
            </Animated.Text>
            <Animated.Text
              style={styles.stepSubtitle}
              entering={FadeInUp.delay(150).springify()}
            >
              Helps us provide culturally relevant meal options
            </Animated.Text>
            <View style={styles.cardsContainer}>
              {ethnicityOptions.map((eth, index) =>
                renderOptionCard(
                  eth,
                  ethnicity === eth.value,
                  () => setEthnicity(eth.value || null),
                  index
                )
              )}
            </View>
          </Animated.View>
        );

      case 7:
        return (
          <Animated.View
            key="step7"
            style={styles.stepContainer}
            entering={enteringAnim}
            exiting={exitingAnim}
          >
            <Animated.Text
              style={styles.stepEmoji}
              entering={BounceIn.delay(200)}
            >
              ✈️
            </Animated.Text>
            <Animated.Text
              style={styles.stepTitle}
              entering={FadeInUp.delay(100).springify()}
            >
              How often do you travel?
            </Animated.Text>
            <Animated.Text
              style={styles.stepSubtitle}
              entering={FadeInUp.delay(150).springify()}
            >
              We'll suggest portable meal options
            </Animated.Text>
            <View style={styles.cardsContainer}>
              {travelFrequencyOptions.map((travel, index) =>
                renderOptionCard(
                  travel,
                  travelPercentage === travel.value,
                  () => setTravelPercentage(travel.value || ""),
                  index
                )
              )}
            </View>
          </Animated.View>
        );

      case 8:
        return (
          <Animated.View
            key="step8"
            style={styles.stepContainer}
            entering={enteringAnim}
            exiting={exitingAnim}
          >
            <Animated.Text
              style={styles.stepEmoji}
              entering={BounceIn.delay(200)}
            >
              🎯
            </Animated.Text>
            <Animated.Text
              style={styles.stepTitle}
              entering={FadeInUp.delay(100).springify()}
            >
              What's your fitness goal?
            </Animated.Text>
            <Animated.Text
              style={styles.stepSubtitle}
              entering={FadeInUp.delay(150).springify()}
            >
              Let's create your personalized plan
            </Animated.Text>
            <View style={styles.cardsContainer}>
              {goalOptions.map((goal, index) =>
                renderOptionCard(
                  goal,
                  goalType === goal.value,
                  () => setGoalType(goal.value as "LOSE" | "GAIN" | "MAINTAIN"),
                  index
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

          <Animated.View
            style={styles.buttonContainer}
            entering={FadeInUp.delay(300).springify()}
          >
            <Button
              title={currentStep === totalSteps ? "Complete Setup" : "Continue"}
              onPress={handleContinue}
              loading={loading}
              style={styles.continueButton}
            />
          </Animated.View>
        </View>
      </ScrollContainer>
    </>
  );
};

export default PersonalDetailsScreen;
