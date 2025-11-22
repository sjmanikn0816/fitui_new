import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { AuthStackParamList } from "../../navigation/AuthNavigator";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Logo from "../../components/ui/Logo";

import { Colors } from "@/constants/Colors";
import { useAppDispatch, useAppSelector } from "@/redux/store/hooks";
import { RootState } from "@/redux/store";
import { signupUser } from "@/redux/slice/auth/authSlice";
import MainHeader from "@/components/ui/MainHeaderNav";
import ScrollContainer from "@/components/ui/ScrollContainer";
import { styles } from "@/screens/styles/PersonalDetailsStyles";
import { ToggleCardSelector } from "./components/ToggleCardSelector";
import ProgressSteps from "./components/ProgressSteps";
import { scale, verticalScale } from "@/utils/responsive";
import Dropdown from "@/components/ui/Dropdown";
import { showModal } from "@/redux/slice/modalSlice";

import {
  Activity,
  ZapOff,
  Zap,
  Flame,
  Globe,
  Target,
  Clock,
  Briefcase,
  Plane,
  Calendar,
} from "lucide-react-native";
import { Linking } from "react-native";

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

  const [exerciseHabits, setExerciseHabits] = useState<string | null>(null);
  const [activityLevel, setActivityLevel] = useState<string | null>(null);
  const [ethnicity, setEthnicity] = useState<string | null>(null);
  const [travelPercentage, setTravelPercentage] = useState("");
  const [medicalCondition, setMedicalCondition] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [goalType, setGoalType] = useState<"LOSE" | "GAIN" | "MAINTAIN" | null>(
    null
  );
  const [targetWeight, setTargetWeight] = useState("");
  const [targetCalories, setTargetCalories] = useState("");

  const [showExerciseHabits, setShowExerciseHabits] = useState(false);
  const [showActivityLevel, setShowActivityLevel] = useState(true);
  const [showEthnicity, setShowEthnicity] = useState(true);
  const [showTravelFrequency, setShowTravelFrequency] = useState(true);
  const [showGoal, setShowGoal] = useState(true);

  const dispatch = useAppDispatch();
  const { loading, user } = useAppSelector((state: RootState) => state.auth);
  console.log("User in PersonalDetailsScreen:", user);

  const genders: ("M" | "F" | "O")[] = ["M", "F", "O"];
  const dietOptions: ("Veg" | "Non-Veg" | "Vegan")[] = [
    "Veg",
    "Non-Veg",
    "Vegan",
  ];

  const exerciseOptions: string[] = ["Rarely", "Sometimes", "Regularly"];
  const activityOptions: CardOption[] = [
    {
      label: "Not Active",
      icon: <ZapOff size={24} color={Colors.primary} />,
      value: "NOT_ACTIVE",
    },
    {
      label: "Somewhat Active",
      icon: <Activity size={24} color={Colors.primary} />,
      value: "SOMEWHAT_ACTIVE",
    },
    {
      label: "Active",
      icon: <Zap size={24} color={Colors.primary} />,
      value: "ACTIVE",
    },
    {
      label: "Very Active",
      icon: <Flame size={24} color={Colors.primary} />,
      value: "VERY_ACTIVE",
    },
    {
      label: "Extra Active",
      icon: <Flame size={24} color={Colors.primary} />,
      value: "EXTRA_ACTIVE",
    },
  ];
  const ethnicityOptions: CardOption[] = [
    {
      label: "Asian",
      icon: <Globe size={24} color={Colors.primary} />,
      value: "Asian",
    },
    {
      label: "Black",
      icon: <Globe size={24} color={Colors.primary} />,
      value: "Black",
    },
    {
      label: "White",
      icon: <Globe size={24} color={Colors.primary} />,
      value: "White",
    },
    {
      label: "Hispanic",
      icon: <Globe size={24} color={Colors.primary} />,
      value: "Hispanic",
    },
    {
      label: "Mixed",
      icon: <Globe size={24} color={Colors.primary} />,
      value: "Mixed",
    },
    {
      label: "Other",
      icon: <Globe size={24} color={Colors.primary} />,
      value: "Other",
    },
  ];

  const travelFrequencyOptions: CardOption[] = [
    {
      label: "Daily",
      icon: <Plane size={24} color={Colors.primary} />,
      value: "Daily",
    },
    {
      label: "Weekly",
      icon: <Calendar size={24} color={Colors.primary} />,
      value: "Weekly",
    },
    {
      label: "Monthly",
      icon: <Briefcase size={24} color={Colors.primary} />,
      value: "Monthly",
    },
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

  // Goal options with icons
  const goalOptions: CardOption[] = [
    {
      label: "Loss",
      icon: <Activity size={24} color={Colors.primary} />,
      value: "Lose",
    },
    {
      label: "Gain",
      icon: <Zap size={24} color={Colors.primary} />,
      value: "Gain",
    },
    {
      label: "Maintain",
      icon: <Target size={24} color={Colors.primary} />,
      value: "Maintain",
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

  const age = (() => {
    if (!birthYear || !birthMonth) return 0;
    const today = new Date();
    const year = parseInt(birthYear);
    const month = parseInt(birthMonth);

    if (isNaN(year) || isNaN(month)) return 0;

    let calculatedAge = today.getFullYear() - year;
    const monthDiff = today.getMonth() + 1 - month;

    if (monthDiff < 0) {
      calculatedAge--;
    }
    return calculatedAge;
  })();

  const inchesOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i} in`,
    value: i.toString(),
  }));

  const totalSteps = 6;
  let currentStep = 1;
  if (exerciseHabits) currentStep = 2;
  if (activityLevel) currentStep = 3;
  if (travelPercentage) currentStep = 4;
  if (ethnicity) currentStep = 5;
  if (goalType) currentStep = 6;
  const backendActivityLevel = activityOptions.find(
    (opt) => opt.value === activityLevel
  )?.value;

  const handleContinue = async () => {
    if (
      !birthYear ||
      !birthMonth ||
      !heightFeet ||
      !heightInches ||
      !weight ||
      !gender ||
      !dietPreference ||
      onDiet === null
    ) {
      dispatch(
        showModal({
          type: "error",
          message: "Please fill in all required basic information",
        })
      );
      return;
    }

    if (!activityLevel || !ethnicity || !travelPercentage || !goalType) {
      dispatch(
        showModal({
          type: "error",
          message: "Please complete all required activity sections (Activity Level, Ethnicity, Travel Frequency, and Goal)",
        })
      );
      return;
    }

    if (age < 13) {
      dispatch(
        showModal({
          type: "error",
          message: "You must be at least 13 years old to use this app.",
        })
      );
      return;
    }

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
      exerciseHabits: exerciseHabits || null,
      healthAppUsage: null,
      usageFrequency: null,
      isAppHelpful: true,
      isSleepMonitoring: false,
      targetCalories: targetCalories || null,
      targetWeight: targetWeight || null,
      travelPercentage,
      hasMedicalCondition: medicalCondition ? true : false,
      watchesDietContent: false,
      ethnicity,
      goal: goalType ? goalType.toUpperCase() : null,
      birthMonth,
      birthYear,
      activityLevel: backendActivityLevel,
      timeZone:
        Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata",
    };

    // if (password) {
    //   payload.password = password;
    // }

    // if (appJwt) {
    //   payload.appJwt = appJwt;
    // }
    // if (refreshToken) {
    //   payload.refreshToken = refreshToken;
    // }

    console.log("Final signup payload:", payload);

    try {
      const resultAction = await dispatch(signupUser(payload));
      if (signupUser.fulfilled.match(resultAction)) {
        navigation.navigate("HealthProfile");
      } else {
        const message =
          resultAction.payload && typeof resultAction.payload === "object"
            ? (resultAction.payload as any).message
            : (resultAction.payload as string);

        dispatch(
          showModal({
            type: "error",
            message: message || "Something went wrong",
          })
        );
      }
    } catch (err) {
      console.error("Signup error:", err);
      navigation.navigate("HealthProfile");
      dispatch(showModal({ type: "error", message: "Something went wrong" }));
    }
  };

  // Auto-enable goal section when all prerequisites are met
  useEffect(() => {
    if (exerciseHabits && activityLevel && travelPercentage && ethnicity) {
      setShowGoal(true);
    }
  }, [exerciseHabits, activityLevel, travelPercentage, ethnicity]);

  return (
    <>
      <MainHeader
        title=""
        showBackButton={true}
        onBackPress={() => {
          navigation.goBack();
        }}
      />

      <ScrollContainer>
        <View style={styles.header}>
          <Logo />
        </View>

        <ProgressSteps totalSteps={totalSteps} currentStep={currentStep} />

        <View style={styles.content}>
          <Text style={styles.title}>Personal Details</Text>
          <Text style={styles.subtitle1}>
            AI will personalize your nutrition recommendations
          </Text>
          <Text style={styles.subtitle2}>
            Help us create your personalized nutrition plan with some basic
            information
          </Text>

          <View style={styles.form}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Dropdown
                  label="Birth Year"
                  placeholder="Select Year"
                  items={yearOptions}
                  selectedValue={birthYear}
                  onSelect={(value) => setBirthYear(value.toString())}
                  required
                />
              </View>

              <View style={styles.column}>
                <Dropdown
                  label="Birth Month"
                  placeholder="Select Month"
                  items={monthOptions}
                  selectedValue={birthMonth}
                  onSelect={(value) => setBirthMonth(value.toString())}
                  required
                />
              </View>
            </View>

            <Input
              label="Pounds(lbs)"
              value={weight}
              onChangeText={setWeight}
              keyboardType="numeric"
              placeholder="Pounds"
              required
            />

            <View style={styles.row}>
              <View style={styles.column}>
                <Dropdown
                  label="Height (Feet)"
                  placeholder="Select Feet"
                  items={feetOptions}
                  selectedValue={heightFeet}
                  onSelect={(value) => setHeightFeet(value.toString())}
                  required
                />
              </View>
              <View style={styles.column}>
                <Dropdown
                  label="Inches"
                  placeholder="Select Inches"
                  items={inchesOptions}
                  selectedValue={heightInches}
                  onSelect={(value) => setHeightInches(value.toString())}
                  required
                />
              </View>
            </View>

            <View style={styles.sexContainer}>
              <Text style={styles.label}>
                What's your biological sex{" "}
                <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.sexButtons}>
                {genders.map((sex) => (
                  <TouchableOpacity
                    key={sex}
                    style={[
                      styles.sexButton,
                      gender === sex && styles.sexButtonActive,
                    ]}
                    onPress={() => setGender(sex)}
                  >
                    <Text
                      style={[
                        styles.sexButtonText,
                        gender === sex && styles.sexButtonTextActive,
                      ]}
                    >
                      {sex}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.sexContainer}>
              <Text style={styles.label}>
                Food Preference <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.sexButtons}>
                {dietOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.sexButton,
                      dietPreference === option && styles.sexButtonActive,
                    ]}
                    onPress={() => setDietPreference(option)}
                  >
                    <Text
                      style={[
                        styles.sexButtonText,
                        dietPreference === option && styles.sexButtonTextActive,
                      ]}
                    >
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.sexContainer}>
              <Text style={styles.label}>
                Currently on any Diet plan? e.g. Keto, Intermittent Fasting
              </Text>
              <View style={styles.sexButtons}>
                <TouchableOpacity
                  style={[
                    styles.sexButton,
                    onDiet === true && styles.sexButtonActive,
                  ]}
                  onPress={() => setOnDiet(true)}
                >
                  <Text
                    style={[
                      styles.sexButtonText,
                      onDiet === true && styles.sexButtonTextActive,
                    ]}
                  >
                    Yes
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.sexButton,
                    onDiet === false && styles.sexButtonActive,
                  ]}
                  onPress={() => setOnDiet(false)}
                >
                  <Text
                    style={[
                      styles.sexButtonText,
                      onDiet === false && styles.sexButtonTextActive,
                    ]}
                  >
                    No
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <ToggleCardSelector
              label="Activity Level"
              enabled={showActivityLevel}
              setEnabled={setShowActivityLevel}
              selectedValue={activityLevel}
              setSelectedValue={setActivityLevel}
              options={activityOptions}
              required={true}
            />

            <ToggleCardSelector
              label="Ethnicity"
              enabled={showEthnicity}
              setEnabled={setShowEthnicity}
              selectedValue={ethnicity}
              setSelectedValue={setEthnicity}
              options={ethnicityOptions}
              required={true}
            />

            <ToggleCardSelector
              label="Travel Frequency"
              enabled={showTravelFrequency}
              setEnabled={setShowTravelFrequency}
              selectedValue={travelPercentage}
              setSelectedValue={setTravelPercentage}
              options={travelFrequencyOptions}
              required={true}
            />

            <ToggleCardSelector
              label="Goal"
              enabled={showGoal}
              setEnabled={setShowGoal}
              selectedValue={goalType}
              setSelectedValue={(value) =>
                setGoalType(value as "LOSE" | "Gain" | "Maintain")
              }
              options={goalOptions}
              required={true}
            />
            {/* 
            {goalType && (
              <View style={{ marginTop: 10 }}>
                <Input
                  label="Target Weight (lbs)"
                  value={targetWeight}
                  onChangeText={setTargetWeight}
                  keyboardType="numeric"
                  placeholder="140"
                  required
                />
                <Input
                  label="Target Calories (optional)"
                  value={targetCalories}
                  onChangeText={setTargetCalories}
                  keyboardType="numeric"
                  placeholder="500"
                />
              </View>
            )} */}

            {/* <Input
              label="Medical Condition"
              value={medicalCondition}
              onChangeText={setMedicalCondition}
              placeholder="Optional"
            /> */}
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: "auto",
              marginBottom: verticalScale(16),
              gap: scale(12),
            }}
          >
            <Button
              title="Back"
              onPress={() => navigation.goBack()}
              variant="outline"
              style={{ flex: 0.3 }}
              textStyle={styles.backText}
            />
            <Button
              title="Complete Personal Details"
              onPress={handleContinue}
              loading={loading}
              style={{ flex: 1.5, backgroundColor: Colors.primary }}
            />
          </View>
        </View>
      </ScrollContainer>
    </>
  );
};

export default PersonalDetailsScreen;
