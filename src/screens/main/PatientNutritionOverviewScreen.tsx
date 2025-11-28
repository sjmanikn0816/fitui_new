import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
  TextInput,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { verticalScale } from "@/utils/responsive";
import Svg, { Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

// ============================================
// THEME CONFIGURATION - Premium Dark Theme
// ============================================
const Theme = {
  // Backgrounds
  bgPrimary: "#0D0D0F",
  bgCard: "rgba(255, 255, 255, 0.05)",
  bgCardHover: "rgba(255, 255, 255, 0.08)",
  bgInput: "rgba(255, 255, 255, 0.08)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textMuted: "rgba(255, 255, 255, 0.4)",
  textLabel: "rgba(255, 255, 255, 0.5)",

  // Accent Colors
  emerald: "#10B981",
  emeraldLight: "#34D399",
  amber: "#F59E0B",
  amberLight: "#FBBF24",
  blue: "#3B82F6",
  blueLight: "#60A5FA",
  pink: "#EC4899",
  pinkLight: "#F472B6",
  purple: "#8B5CF6",
  cyan: "#06B6D4",
  orange: "#F97316",
  red: "#EF4444",

  // Borders
  border: "rgba(255, 255, 255, 0.08)",
  borderLight: "rgba(255, 255, 255, 0.05)",

  // Gradients
  cardGradient: ["rgba(255, 255, 255, 0.08)", "rgba(255, 255, 255, 0.02)"],
  emeraldGradient: ["#10B981", "#059669"],
  amberGradient: ["rgba(245, 158, 11, 0.2)", "rgba(234, 88, 12, 0.1)"],
};

// ============================================
// TYPES (Same as original)
// ============================================
interface WeightGoalProgress {
  ExpectedWeightLoss_lbs: number;
  ActualWeightLoss_lbs: number;
  ProgressPercent: number;
  GoalStatus: string;
}

interface DailyEntry {
  Date: string;
  Weight_lbs: number;
  CaloriesIntake: {
    Breakfast: number;
    Lunch: number;
    Dinner: number;
    Snacks: number;
    Total: number;
  };
  CaloriesBurned: {
    BMR: number;
    Exercise: number;
    Total: number;
  };
  NetCalories: number;
  BMI: number;
  WeightGoalProgress: {
    CurrentDeficit: number;
    ExpectedWeightChange_lbs: number;
    GoalStatus: string;
  };
}

interface TrackingSummary {
  Daily: DailyEntry[];
  Weekly: {
    WeekStart: string;
    WeekEnd: string;
    AverageWeight_lbs: number;
    AverageCaloriesIntake: number;
    AverageCaloriesBurned: number;
    AverageNetCalories: number;
    BMI_Average: number;
    WeightGoalProgress: WeightGoalProgress;
  };
  Monthly: {
    Month: string;
    StartWeight_lbs: number;
    EndWeight_lbs: number;
    AverageCaloriesIntake: number;
    AverageCaloriesBurned: number;
    AverageNetCalories: number;
    BMI_Start: number;
    BMI_End: number;
    WeightGoalProgress: WeightGoalProgress;
  };
}

interface GoalInfo {
  GoalType: string;
  TargetWeight_lbs: number;
  TargetDuration_weeks: number;
  TargetWeeklyLoss_lbs: number;
  StartDate: string;
}

interface Patient {
  UserID: string;
  Description: string;
  Age: number;
  Height_cm: number;
  Gender: string;
  Weight_lbs: number;
  Diet: string;
  SpecialDiet: string;
  ExerciseRoutine: string;
  HealthApp: string;
  TrackingFrequency: string;
  SleepTracking: string;
  WaterTracking: string;
  BodyFatPercentage: string;
  MedicalCondition: string;
  Smoker: string;
  Ethnicity: string;
  Goal: GoalInfo;
  Tracking: TrackingSummary;
}

interface Props {
  route?: {
    params?: {
      patients?: Patient[];
    };
  };
}

// ============================================
// MOCK DATA (Same as original)
// ============================================
const MOCK_DATA: Patient[] = [
  {
    UserID: "U001",
    Description: "Middle-aged male, fitness focused",
    Age: 40,
    Height_cm: 185,
    Gender: "Male",
    Weight_lbs: 187.4,
    Diet: "Non-Veg",
    SpecialDiet: "No",
    ExerciseRoutine: "Gym 4x/week",
    HealthApp: "Google Fit",
    TrackingFrequency: "Daily",
    SleepTracking: "Yes",
    WaterTracking: "Yes",
    BodyFatPercentage: "<5%",
    MedicalCondition: "No",
    Smoker: "No",
    Ethnicity: "Asian",
    Goal: {
      GoalType: "Weight Loss",
      TargetWeight_lbs: 171.9,
      TargetDuration_weeks: 12,
      TargetWeeklyLoss_lbs: 1.3,
      StartDate: "2025-11-01",
    },
    Tracking: {
      Daily: [
        {
          Date: "2025-11-12",
          Weight_lbs: 186.3,
          CaloriesIntake: {
            Breakfast: 400,
            Lunch: 650,
            Dinner: 600,
            Snacks: 200,
            Total: 1850,
          },
          CaloriesBurned: {
            BMR: 1800,
            Exercise: 500,
            Total: 2300,
          },
          NetCalories: -450,
          BMI: 24.7,
          WeightGoalProgress: {
            CurrentDeficit: -450,
            ExpectedWeightChange_lbs: -0.13,
            GoalStatus: "On Track",
          },
        },
      ],
      Weekly: {
        WeekStart: "2025-11-10",
        WeekEnd: "2025-11-16",
        AverageWeight_lbs: 186.8,
        AverageCaloriesIntake: 1900,
        AverageCaloriesBurned: 2300,
        AverageNetCalories: -400,
        BMI_Average: 24.8,
        WeightGoalProgress: {
          ExpectedWeightLoss_lbs: -1.1,
          ActualWeightLoss_lbs: -1.3,
          ProgressPercent: 120,
          GoalStatus: "Ahead of Target",
        },
      },
      Monthly: {
        Month: "November 2025",
        StartWeight_lbs: 187.4,
        EndWeight_lbs: 185.2,
        AverageCaloriesIntake: 1950,
        AverageCaloriesBurned: 2250,
        AverageNetCalories: -300,
        BMI_Start: 24.8,
        BMI_End: 24.5,
        WeightGoalProgress: {
          ExpectedWeightLoss_lbs: -5.3,
          ActualWeightLoss_lbs: -2.2,
          ProgressPercent: 42,
          GoalStatus: "Slightly Behind",
        },
      },
    },
  },
];

// ============================================
// CIRCULAR PROGRESS COMPONENT
// ============================================
interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number;
  max: number;
  color: string;
  bgColor?: string;
  children?: React.ReactNode;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size,
  strokeWidth,
  progress,
  max,
  color,
  bgColor = "rgba(255, 255, 255, 0.08)",
  children,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;
  const percent = max > 0 ? Math.min(progress / max, 1) : 0;
  const strokeDashoffset = circumference * (1 - percent);

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bgColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={`${circumference}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform={`rotate(-90 ${center} ${center})`}
        />
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.circularCenter]}>
        {children}
      </View>
    </View>
  );
};

// ============================================
// DONUT CHART COMPONENT
// ============================================
interface DonutSegment {
  value: number;
  color: string;
  label: string;
}

interface DonutChartProps {
  size: number;
  strokeWidth: number;
  segments: DonutSegment[];
  total: number;
  centerValue: string;
  centerLabel: string;
}

const DonutChart: React.FC<DonutChartProps> = ({
  size,
  strokeWidth,
  segments,
  total,
  centerValue,
  centerLabel,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  let accumulatedOffset = 0;

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="rgba(255, 255, 255, 0.08)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {segments.map((segment, index) => {
          const percent = total > 0 ? segment.value / total : 0;
          const strokeLength = circumference * percent;
          const rotation = accumulatedOffset * 360 - 90;
          accumulatedOffset += percent;

          if (percent <= 0) return null;

          return (
            <Circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              stroke={segment.color}
              strokeWidth={strokeWidth}
              fill="none"
              strokeDasharray={`${strokeLength} ${circumference - strokeLength}`}
              strokeLinecap="round"
              transform={`rotate(${rotation} ${center} ${center})`}
            />
          );
        })}
      </Svg>
      <View style={[StyleSheet.absoluteFill, styles.circularCenter]}>
        <Text style={styles.chartCenterValue}>{centerValue}</Text>
        <Text style={styles.chartCenterLabel}>{centerLabel}</Text>
      </View>
    </View>
  );
};

// ============================================
// MACRO BAR COMPONENT
// ============================================
interface MacroBarProps {
  label: string;
  current: number;
  goal: number;
  color: string;
}

const MacroBar: React.FC<MacroBarProps> = ({ label, current, goal, color }) => {
  const percent = Math.min((current / goal) * 100, 100);

  return (
    <View style={styles.macroItem}>
      <View style={styles.macroHeader}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>
          {current}<Text style={styles.macroGoal}>/{goal}g</Text>
        </Text>
      </View>
      <View style={styles.macroTrack}>
        <View style={[styles.macroFill, { width: `${percent}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

// ============================================
// EDIT MODAL COMPONENT - Dark Theme
// ============================================
interface EditModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (intake: any, burned: any) => void;
  caloriesIntake: {
    Breakfast: number;
    Lunch: number;
    Dinner: number;
    Snacks: number;
    Total: number;
  };
  caloriesBurned: {
    BMR: number;
    Exercise: number;
    Total: number;
  };
}

const EditCaloriesModal: React.FC<EditModalProps> = ({
  visible,
  onClose,
  onSave,
  caloriesIntake,
  caloriesBurned,
}) => {
  const [intake, setIntake] = useState({
    Breakfast: caloriesIntake.Breakfast.toString(),
    Lunch: caloriesIntake.Lunch.toString(),
    Dinner: caloriesIntake.Dinner.toString(),
    Snacks: caloriesIntake.Snacks.toString(),
  });

  const [burned, setBurned] = useState({
    BMR: caloriesBurned.BMR.toString(),
    Exercise: caloriesBurned.Exercise.toString(),
  });

  React.useEffect(() => {
    if (visible) {
      setIntake({
        Breakfast: caloriesIntake.Breakfast.toString(),
        Lunch: caloriesIntake.Lunch.toString(),
        Dinner: caloriesIntake.Dinner.toString(),
        Snacks: caloriesIntake.Snacks.toString(),
      });
      setBurned({
        BMR: caloriesBurned.BMR.toString(),
        Exercise: caloriesBurned.Exercise.toString(),
      });
    }
  }, [visible, caloriesIntake, caloriesBurned]);

  const totalIntake =
    (parseInt(intake.Breakfast) || 0) +
    (parseInt(intake.Lunch) || 0) +
    (parseInt(intake.Dinner) || 0) +
    (parseInt(intake.Snacks) || 0);

  const totalBurned =
    (parseInt(burned.BMR) || 0) + (parseInt(burned.Exercise) || 0);

  const handleSave = () => {
    onSave(
      {
        Breakfast: parseInt(intake.Breakfast) || 0,
        Lunch: parseInt(intake.Lunch) || 0,
        Dinner: parseInt(intake.Dinner) || 0,
        Snacks: parseInt(intake.Snacks) || 0,
        Total: totalIntake,
      },
      {
        BMR: parseInt(burned.BMR) || 0,
        Exercise: parseInt(burned.Exercise) || 0,
        Total: totalBurned,
      }
    );
    onClose();
  };

  const intakeItems = [
    { key: "Breakfast", icon: "sunny-outline", color: Theme.amber, emoji: "🌅" },
    { key: "Lunch", icon: "sunny", color: Theme.orange, emoji: "☀️" },
    { key: "Dinner", icon: "moon-outline", color: Theme.purple, emoji: "🌙" },
    { key: "Snacks", icon: "sparkles", color: Theme.pink, emoji: "✨" },
  ];

  const burnedItems = [
    { key: "Exercise", icon: "fitness", color: Theme.emerald, emoji: "💪" },
    { key: "BMR", icon: "flame", color: Theme.orange, emoji: "🔥" },
  ];

  const renderInputRow = (
    item: { key: string; icon: string; color: string; emoji: string },
    value: string,
    onChange: (text: string) => void
  ) => (
    <View key={item.key} style={styles.modalInputRow}>
      <View style={[styles.modalIconBox, { backgroundColor: `${item.color}20` }]}>
        <Text style={{ fontSize: 20 }}>{item.emoji}</Text>
      </View>
      <Text style={styles.modalInputLabel}>{item.key}</Text>
      <View style={styles.modalInputContainer}>
        <TextInput
          style={styles.modalInput}
          value={value}
          onChangeText={(text) => onChange(text.replace(/[^0-9]/g, ""))}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={Theme.textMuted}
          selectTextOnFocus
        />
        <Text style={styles.modalInputUnit}>cal</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalDragHandle} />

          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Daily Calories</Text>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
              <Ionicons name="close-circle" size={28} color={Theme.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.modalScrollView}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={styles.modalSectionHeader}>
              <Text style={{ fontSize: 16 }}>🍎</Text>
              <Text style={styles.modalSectionTitle}>Calories Intake</Text>
            </View>

            {intakeItems.map((item) =>
              renderInputRow(
                item,
                intake[item.key as keyof typeof intake],
                (text) => setIntake({ ...intake, [item.key]: text })
              )
            )}

            <View style={styles.modalTotalRow}>
              <Text style={styles.modalTotalLabel}>Total Intake</Text>
              <Text style={[styles.modalTotalValue, { color: Theme.blue }]}>
                {totalIntake.toLocaleString()} cal
              </Text>
            </View>

            <View style={styles.modalDivider} />

            <View style={styles.modalSectionHeader}>
              <Text style={{ fontSize: 16 }}>🔥</Text>
              <Text style={styles.modalSectionTitle}>Calories Burned</Text>
            </View>

            {burnedItems.map((item) =>
              renderInputRow(
                item,
                burned[item.key as keyof typeof burned],
                (text) => setBurned({ ...burned, [item.key]: text })
              )
            )}

            <View style={styles.modalTotalRow}>
              <Text style={styles.modalTotalLabel}>Total Burned</Text>
              <Text style={[styles.modalTotalValue, { color: Theme.orange }]}>
                {totalBurned.toLocaleString()} cal
              </Text>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.modalCancelBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.modalCancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalSaveBtn}
              onPress={handleSave}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={Theme.emeraldGradient}
                style={styles.modalSaveBtnGradient}
              >
                <Text style={styles.modalSaveBtnText}>Save Changes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          <Text style={styles.modalSyncText}>Last synced: 2 minutes ago</Text>
        </View>
      </View>
    </Modal>
  );
};

// ============================================
// MAIN SCREEN COMPONENT
// ============================================
const PatientNutritionOverviewScreen: React.FC<Props> = ({ route }) => {
  const patients = route?.params?.patients ?? MOCK_DATA;
  const [patient] = useState(patients[0]);
  const [latestDaily, setLatestDaily] = useState(patient.Tracking.Daily[0]);
  const weekly = patient.Tracking.Weekly;
  const monthly = patient.Tracking.Monthly;
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState<"today" | "weekly" | "monthly">("today");
  const [editModalVisible, setEditModalVisible] = useState(false);

  const handleMenuPress = () => {
    navigation.navigate("AllScreensMenu" as never);
  };

  const handleSaveCalories = (intake: any, burned: any) => {
    const netCalories = intake.Total - burned.Total;
    setLatestDaily({
      ...latestDaily,
      CaloriesIntake: intake,
      CaloriesBurned: burned,
      NetCalories: netCalories,
    });
  };

  // Calculate progress
  const startWeight = patient.Weight_lbs;
  const currentWeight = latestDaily.Weight_lbs;
  const targetWeight = patient.Goal.TargetWeight_lbs;
  const weightLost = startWeight - currentWeight;
  const totalToLose = startWeight - targetWeight;
  const progressPercent = Math.round((weightLost / totalToLose) * 100);

  // Intake segments for donut chart
  const intakeSegments = [
    { value: latestDaily.CaloriesIntake.Breakfast, color: Theme.amber, label: "Breakfast" },
    { value: latestDaily.CaloriesIntake.Lunch, color: Theme.orange, label: "Lunch" },
    { value: latestDaily.CaloriesIntake.Dinner, color: Theme.purple, label: "Dinner" },
    { value: latestDaily.CaloriesIntake.Snacks, color: Theme.emerald, label: "Snacks" },
  ];

  // Meals data
  const meals = [
    { id: 1, name: "Breakfast", time: "7:30 AM", calories: latestDaily.CaloriesIntake.Breakfast, emoji: "🌅" },
    { id: 2, name: "Lunch", time: "12:30 PM", calories: latestDaily.CaloriesIntake.Lunch, emoji: "☀️" },
    { id: 3, name: "Dinner", time: "7:00 PM", calories: latestDaily.CaloriesIntake.Dinner, emoji: "🌙" },
    { id: 4, name: "Snacks", time: "Throughout", calories: latestDaily.CaloriesIntake.Snacks, emoji: "✨" },
  ];

  // Activities data
  const activities = [
    { name: "Exercise", calories: latestDaily.CaloriesBurned.Exercise, duration: "45 min", emoji: "💪" },
    { name: "BMR", calories: latestDaily.CaloriesBurned.BMR, duration: "24 hrs", emoji: "🔥" },
  ];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.bgPrimary} />

      {/* Light Ambient Background */}
      <View style={styles.ambientBg}>
        <LinearGradient
          colors={["rgba(16, 185, 129, 0.05)", "transparent"]}
          style={styles.ambientOrb1}
        />
        <LinearGradient
          colors={["rgba(245, 158, 11, 0.04)", "transparent"]}
          style={styles.ambientOrb2}
        />
        <LinearGradient
          colors={["rgba(139, 92, 246, 0.03)", "transparent"]}
          style={styles.ambientOrb3}
        />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>GOOD MORNING</Text>
              <Text style={styles.userName}>{patient.Description.split(',')[0]}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleMenuPress}>
                <Ionicons name="notifications-outline" size={20} color={Theme.textSecondary} />
              </TouchableOpacity>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{patient.UserID.charAt(0)}</Text>
              </View>
            </View>
          </View>

          {/* Streak Badge */}
          <View style={styles.streakBadge}>
            <Text style={styles.streakEmoji}>🔥</Text>
            <Text style={styles.streakText}>12 Day Streak</Text>
          </View>
        </View>

        {/* Weight Journey Card */}
        <View style={styles.glassCard}>
          <View style={styles.glassCardGlow} />
          <View style={styles.weightCardContent}>
            <View style={styles.weightInfo}>
              <Text style={styles.sectionLabel}>WEIGHT JOURNEY</Text>
              <View style={styles.weightValueRow}>
                <Text style={styles.weightNumber}>{currentWeight.toFixed(1)}</Text>
                <Text style={styles.weightUnit}>lbs</Text>
              </View>
              <View style={styles.weightChange}>
                <Text style={styles.changePositive}>↓ {weightLost.toFixed(1)} lbs</Text>
                <Text style={styles.changeLabel}>from start</Text>
              </View>
            </View>

            <CircularProgress
              size={100}
              strokeWidth={8}
              progress={progressPercent}
              max={100}
              color={Theme.emerald}
            >
              <Text style={styles.progressPercent}>{progressPercent}%</Text>
              <Text style={styles.progressLabel}>TO GOAL</Text>
            </CircularProgress>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>TARGET</Text>
              <Text style={styles.statValue}>{targetWeight}<Text style={styles.statUnit}> lbs</Text></Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>WEEKLY</Text>
              <Text style={styles.statValue}>-{patient.Goal.TargetWeeklyLoss_lbs}<Text style={styles.statUnit}> lbs</Text></Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>REMAINING</Text>
              <Text style={styles.statValue}>{(currentWeight - targetWeight).toFixed(1)}<Text style={styles.statUnit}> lbs</Text></Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {[
            { key: "today", label: "Today" },
            { key: "weekly", label: "This Week" },
            { key: "monthly", label: "Insights" },
          ].map((tab) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === tab.key && styles.tabActive]}
              onPress={() => setActiveTab(tab.key as any)}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today Tab */}
        {activeTab === "today" && (
          <View style={styles.tabContent}>
            {/* Energy Balance Card */}
            <View style={styles.glassCard}>
              <View style={styles.energyHeader}>
                <Text style={styles.sectionLabel}>ENERGY BALANCE</Text>
                <Text style={styles.dateText}>{formatDate(latestDaily.Date)}</Text>
              </View>

              <View style={styles.energyRingContainer}>
                <CircularProgress
                  size={160}
                  strokeWidth={12}
                  progress={Math.abs(latestDaily.NetCalories)}
                  max={500}
                  color={latestDaily.NetCalories < 0 ? Theme.emerald : Theme.amber}
                >
                  <Text style={[styles.energyValue, { color: latestDaily.NetCalories < 0 ? Theme.emerald : Theme.amber }]}>
                    {latestDaily.NetCalories}
                  </Text>
                  <Text style={styles.energyLabel}>NET CALORIES</Text>
                </CircularProgress>
              </View>

              {/* Calorie Cards */}
              <View style={styles.calorieGrid}>
                <View style={styles.calorieCard}>
                  <View style={styles.calorieCardHeader}>
                    <View style={[styles.calorieIcon, { backgroundColor: "rgba(59, 130, 246, 0.2)" }]}>
                      <Ionicons name="add" size={18} color={Theme.blue} />
                    </View>
                    <Text style={styles.calorieCardLabel}>Calories Intake</Text>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => setEditModalVisible(true)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="pencil" size={14} color={Theme.textMuted} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.calorieCardValue}>
                    {latestDaily.CaloriesIntake.Total.toLocaleString()}
                    <Text style={styles.calorieCardUnit}> cal</Text>
                  </Text>
                  {/* Intake Breakdown */}
                  <View style={styles.calorieBreakdown}>
                    <View style={styles.breakdownItem}>
                      <View style={[styles.breakdownDot, { backgroundColor: Theme.amber }]} />
                      <Text style={styles.breakdownLabel}>Breakfast</Text>
                      <Text style={styles.breakdownValue}>{latestDaily.CaloriesIntake.Breakfast} cal</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <View style={[styles.breakdownDot, { backgroundColor: Theme.orange }]} />
                      <Text style={styles.breakdownLabel}>Lunch</Text>
                      <Text style={styles.breakdownValue}>{latestDaily.CaloriesIntake.Lunch} cal</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <View style={[styles.breakdownDot, { backgroundColor: Theme.purple }]} />
                      <Text style={styles.breakdownLabel}>Dinner</Text>
                      <Text style={styles.breakdownValue}>{latestDaily.CaloriesIntake.Dinner} cal</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <View style={[styles.breakdownDot, { backgroundColor: Theme.emerald }]} />
                      <Text style={styles.breakdownLabel}>Snacks</Text>
                      <Text style={styles.breakdownValue}>{latestDaily.CaloriesIntake.Snacks} cal</Text>
                    </View>
                  </View>
                </View>

                {/* Net Calories Summary */}
                <View style={styles.netCaloriesBox}>
                  <View style={styles.netCaloriesContent}>
                    <Text style={styles.netCaloriesLabel}>Net Calories</Text>
                    <Text style={[
                      styles.netCaloriesValue,
                      { color: latestDaily.NetCalories < 0 ? Theme.emerald : Theme.red }
                    ]}>
                      {latestDaily.NetCalories}
                    </Text>
                    <Text style={styles.netCaloriesUnit}>cal</Text>
                  </View>
                  <View style={styles.netCaloriesIndicator}>
                    <Text style={styles.netCaloriesStatus}>
                      {latestDaily.NetCalories < 0 ? "Calorie Deficit" : "Calorie Surplus"}
                    </Text>
                    <Ionicons
                      name={latestDaily.NetCalories < 0 ? "arrow-down" : "arrow-up"}
                      size={14}
                      color={latestDaily.NetCalories < 0 ? Theme.emerald : Theme.red}
                    />
                  </View>
                </View>

                <View style={styles.calorieCard}>
                  <View style={styles.calorieCardHeader}>
                    <View style={[styles.calorieIcon, { backgroundColor: "rgba(249, 115, 22, 0.2)" }]}>
                      <Ionicons name="flame" size={18} color={Theme.orange} />
                    </View>
                    <Text style={styles.calorieCardLabel}>Calories Burned</Text>
                    <TouchableOpacity
                      style={styles.editBtn}
                      onPress={() => setEditModalVisible(true)}
                      activeOpacity={0.7}
                    >
                      <MaterialCommunityIcons name="pencil" size={14} color={Theme.textMuted} />
                    </TouchableOpacity>
                  </View>
                  <Text style={styles.calorieCardValue}>
                    {latestDaily.CaloriesBurned.Total.toLocaleString()}
                    <Text style={styles.calorieCardUnit}> cal</Text>
                  </Text>
                  {/* Burned Breakdown */}
                  <View style={styles.calorieBreakdown}>
                    <View style={styles.breakdownItem}>
                      <MaterialCommunityIcons name="run-fast" size={12} color={Theme.emerald} />
                      <Text style={styles.breakdownLabel}>Exercise</Text>
                      <Text style={styles.breakdownValue}>{latestDaily.CaloriesBurned.Exercise}</Text>
                    </View>
                    <View style={styles.breakdownItem}>
                      <MaterialCommunityIcons name="fire" size={12} color={Theme.orange} />
                      <Text style={styles.breakdownLabel}>BMR</Text>
                      <Text style={styles.breakdownValue}>{latestDaily.CaloriesBurned.BMR}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

            {/* Macros Card */}
            <View style={styles.glassCard}>
              <Text style={styles.sectionLabel}>MACRONUTRIENTS</Text>
              <View style={styles.macrosContainer}>
                <MacroBar label="Protein" current={95} goal={120} color={Theme.blue} />
                <MacroBar label="Carbohydrates" current={180} goal={200} color={Theme.amber} />
                <MacroBar label="Fat" current={65} goal={70} color={Theme.pink} />
              </View>
            </View>

            {/* Meals Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>TODAY'S MEALS</Text>
              {meals.map((meal) => (
                <TouchableOpacity key={meal.id} style={styles.mealCard} activeOpacity={0.7}>
                  <View style={styles.mealInfo}>
                    <View style={styles.mealIcon}>
                      <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                    </View>
                    <View>
                      <Text style={styles.mealName}>{meal.name}</Text>
                      <Text style={styles.mealTime}>{meal.time}</Text>
                    </View>
                  </View>
                  <View style={styles.mealCalories}>
                    <Text style={styles.mealCaloriesValue}>{meal.calories}</Text>
                    <Text style={styles.mealCaloriesUnit}>cal</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            {/* Activities Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>ACTIVITIES</Text>
              <View style={styles.activityGrid}>
                {activities.map((activity, index) => (
                  <View key={index} style={styles.activityCard}>
                    <Text style={styles.activityEmoji}>{activity.emoji}</Text>
                    <Text style={styles.activityName}>{activity.name}</Text>
                    <Text style={styles.activityDuration}>{activity.duration}</Text>
                    <Text style={styles.activityCalories}>-{activity.calories}<Text style={styles.activityCaloriesUnit}> cal</Text></Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Status Card */}
            <View style={styles.statusCard}>
              <View style={styles.statusHeader}>
                <Text style={styles.sectionLabel}>GOAL STATUS</Text>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{latestDaily.WeightGoalProgress.GoalStatus}</Text>
                </View>
              </View>
              <Text style={styles.statusExpected}>
                Expected Δ: {latestDaily.WeightGoalProgress.ExpectedWeightChange_lbs} lbs today
              </Text>
            </View>
          </View>
        )}

        {/* Weekly Tab */}
        {activeTab === "weekly" && (
          <View style={styles.tabContent}>
            <View style={styles.glassCard}>
              <Text style={styles.sectionLabel}>WEEKLY SUMMARY</Text>
              <Text style={styles.dateRange}>{weekly.WeekStart} to {weekly.WeekEnd}</Text>

              <View style={styles.weeklyStatsGrid}>
                <View style={styles.weeklyStatCard}>
                  <Text style={styles.weeklyStatLabel}>Avg Weight</Text>
                  <Text style={styles.weeklyStatValue}>{weekly.AverageWeight_lbs.toFixed(1)}<Text style={styles.weeklyStatUnit}> lbs</Text></Text>
                  <Text style={styles.weeklyStatSub}>BMI: {weekly.BMI_Average}</Text>
                </View>
                <View style={styles.weeklyStatCard}>
                  <Text style={styles.weeklyStatLabel}>Avg Intake</Text>
                  <Text style={styles.weeklyStatValue}>{weekly.AverageCaloriesIntake.toLocaleString()}<Text style={styles.weeklyStatUnit}> cal</Text></Text>
                  <Text style={styles.weeklyStatSub}>per day</Text>
                </View>
                <View style={styles.weeklyStatCard}>
                  <Text style={styles.weeklyStatLabel}>Avg Burned</Text>
                  <Text style={styles.weeklyStatValue}>{weekly.AverageCaloriesBurned.toLocaleString()}<Text style={styles.weeklyStatUnit}> cal</Text></Text>
                  <Text style={styles.weeklyStatSub}>per day</Text>
                </View>
              </View>
            </View>

            <View style={styles.glassCard}>
              <Text style={styles.sectionLabel}>WEEKLY PROGRESS</Text>

              <View style={styles.progressComparison}>
                <View style={styles.progressCompareItem}>
                  <Text style={styles.progressCompareLabel}>Expected Loss</Text>
                  <Text style={styles.progressCompareValue}>{weekly.WeightGoalProgress.ExpectedWeightLoss_lbs} lbs</Text>
                </View>
                <View style={styles.progressCompareItem}>
                  <Text style={styles.progressCompareLabel}>Actual Loss</Text>
                  <Text style={[styles.progressCompareValue, { color: Theme.emerald }]}>
                    {weekly.WeightGoalProgress.ActualWeightLoss_lbs} lbs
                  </Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarHeader}>
                  <Text style={styles.progressBarLabel}>Progress</Text>
                  <Text style={styles.progressBarPercent}>{weekly.WeightGoalProgress.ProgressPercent}%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${Math.min(weekly.WeightGoalProgress.ProgressPercent, 100)}%` }]} />
                </View>
              </View>

              <View style={styles.statusBadgeLarge}>
                <Text style={styles.statusBadgeLargeText}>{weekly.WeightGoalProgress.GoalStatus}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Monthly Tab */}
        {activeTab === "monthly" && (
          <View style={styles.tabContent}>
            <View style={styles.glassCard}>
              <Text style={styles.sectionLabel}>{monthly.Month.toUpperCase()}</Text>

              <View style={styles.monthlyWeightRow}>
                <View style={styles.monthlyWeightItem}>
                  <Text style={styles.monthlyWeightLabel}>Start Weight</Text>
                  <Text style={styles.monthlyWeightValue}>{monthly.StartWeight_lbs}<Text style={styles.monthlyWeightUnit}> lbs</Text></Text>
                  <Text style={styles.monthlyWeightBmi}>BMI: {monthly.BMI_Start}</Text>
                </View>
                <View style={styles.monthlyWeightArrow}>
                  <Ionicons name="arrow-forward" size={24} color={Theme.emerald} />
                </View>
                <View style={styles.monthlyWeightItem}>
                  <Text style={styles.monthlyWeightLabel}>End Weight</Text>
                  <Text style={[styles.monthlyWeightValue, { color: Theme.emerald }]}>{monthly.EndWeight_lbs}<Text style={styles.monthlyWeightUnit}> lbs</Text></Text>
                  <Text style={styles.monthlyWeightBmi}>BMI: {monthly.BMI_End}</Text>
                </View>
              </View>
            </View>

            <View style={styles.insightGrid}>
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>AVG DAILY INTAKE</Text>
                <Text style={styles.insightValue}>{monthly.AverageCaloriesIntake.toLocaleString()}</Text>
                <Text style={styles.insightUnit}>calories</Text>
              </View>
              <View style={styles.insightCard}>
                <Text style={styles.insightLabel}>AVG DAILY BURNED</Text>
                <Text style={styles.insightValue}>{monthly.AverageCaloriesBurned.toLocaleString()}</Text>
                <Text style={styles.insightUnit}>calories</Text>
              </View>
              <View style={[styles.insightCard, styles.insightCardWide]}>
                <Text style={styles.insightLabel}>AVG NET CALORIES</Text>
                <Text style={[styles.insightValue, { color: Theme.emerald }]}>{monthly.AverageNetCalories}</Text>
                <Text style={styles.insightUnit}>deficit per day</Text>
              </View>
            </View>

            <View style={styles.glassCard}>
              <Text style={styles.sectionLabel}>MONTHLY PROGRESS</Text>

              <View style={styles.progressComparison}>
                <View style={styles.progressCompareItem}>
                  <Text style={styles.progressCompareLabel}>Expected Loss</Text>
                  <Text style={styles.progressCompareValue}>{monthly.WeightGoalProgress.ExpectedWeightLoss_lbs} lbs</Text>
                </View>
                <View style={styles.progressCompareItem}>
                  <Text style={styles.progressCompareLabel}>Actual Loss</Text>
                  <Text style={[styles.progressCompareValue, { color: Theme.amber }]}>
                    {monthly.WeightGoalProgress.ActualWeightLoss_lbs} lbs
                  </Text>
                </View>
              </View>

              <View style={styles.progressBarContainer}>
                <View style={styles.progressBarHeader}>
                  <Text style={styles.progressBarLabel}>Goal Progress</Text>
                  <Text style={styles.progressBarPercent}>{monthly.WeightGoalProgress.ProgressPercent}%</Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, styles.progressBarFillAmber, { width: `${monthly.WeightGoalProgress.ProgressPercent}%` }]} />
                </View>
              </View>

              <View style={[styles.statusBadgeLarge, styles.statusBadgeAmber]}>
                <Text style={styles.statusBadgeLargeTextAmber}>{monthly.WeightGoalProgress.GoalStatus}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Additional Info */}
        <View style={styles.glassCard}>
          <Text style={styles.sectionLabel}>ADDITIONAL INFORMATION</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Diet Type</Text>
              <Text style={styles.infoValue}>{patient.Diet}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Exercise</Text>
              <Text style={styles.infoValue}>{patient.ExerciseRoutine}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Health App</Text>
              <Text style={styles.infoValue}>{patient.HealthApp}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Tracking</Text>
              <Text style={styles.infoValue}>{patient.TrackingFrequency}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <EditCaloriesModal
        visible={editModalVisible}
        onClose={() => setEditModalVisible(false)}
        onSave={handleSaveCalories}
        caloriesIntake={latestDaily.CaloriesIntake}
        caloriesBurned={latestDaily.CaloriesBurned}
      />
    </View>
  );
};

// ============================================
// STYLES
// ============================================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Theme.bgPrimary,
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: verticalScale(100),
  },

  // Ambient Background
  ambientBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
  },
  ambientOrb1: {
    position: "absolute",
    top: -60,
    right: -40,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  ambientOrb2: {
    position: "absolute",
    top: 350,
    left: -70,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  ambientOrb3: {
    position: "absolute",
    bottom: 180,
    right: -50,
    width: 140,
    height: 140,
    borderRadius: 70,
  },


  // Header
  header: {
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: 11,
    letterSpacing: 2,
    color: Theme.textMuted,
    marginBottom: 4,
  },
  userName: {
    fontSize: 26,
    fontWeight: "300",
    color: Theme.textPrimary,
    letterSpacing: -0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.bgCard,
    borderWidth: 1,
    borderColor: Theme.border,
    justifyContent: "center",
    alignItems: "center",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Theme.emerald,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.textPrimary,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 50,
    backgroundColor: "rgba(245, 158, 11, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(245, 158, 11, 0.2)",
    gap: 8,
  },
  streakEmoji: {
    fontSize: 16,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#FCD34D",
  },

  // Glass Card
  glassCard: {
    backgroundColor: Theme.bgCard,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: Theme.border,
    padding: 20,
    marginBottom: 16,
    overflow: "hidden",
  },
  glassCardGlow: {
    position: "absolute",
    top: 0,
    right: 0,
    width: 150,
    height: 150,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 75,
    transform: [{ translateX: 50 }, { translateY: -50 }],
  },

  // Weight Card
  weightCardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  weightInfo: {
    flex: 1,
  },
  sectionLabel: {
    fontSize: 10,
    letterSpacing: 2,
    color: Theme.textMuted,
    marginBottom: 12,
  },
  weightValueRow: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 6,
  },
  weightNumber: {
    fontSize: 44,
    fontWeight: "200",
    color: Theme.textPrimary,
    letterSpacing: -2,
  },
  weightUnit: {
    fontSize: 18,
    color: Theme.textMuted,
  },
  weightChange: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    gap: 8,
  },
  changePositive: {
    fontSize: 14,
    fontWeight: "500",
    color: Theme.emerald,
  },
  changeLabel: {
    fontSize: 14,
    color: Theme.textMuted,
  },

  // Circular Progress
  circularCenter: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressPercent: {
    fontSize: 22,
    fontWeight: "300",
    color: Theme.textPrimary,
  },
  progressLabel: {
    fontSize: 8,
    letterSpacing: 1,
    color: Theme.textMuted,
    marginTop: 2,
  },
  chartCenterValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Theme.textPrimary,
  },
  chartCenterLabel: {
    fontSize: 9,
    color: Theme.textMuted,
    marginTop: 2,
  },

  // Stats Row
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: Theme.borderLight,
  },
  statItem: {},
  statLabel: {
    fontSize: 9,
    letterSpacing: 1.5,
    color: Theme.textMuted,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "300",
    color: Theme.textPrimary,
  },
  statUnit: {
    fontSize: 12,
    color: Theme.textMuted,
  },

  // Tabs
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Theme.bgCard,
    borderRadius: 16,
    padding: 6,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 12,
  },
  tabActive: {
    backgroundColor: Theme.textPrimary,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
    color: Theme.textMuted,
  },
  tabTextActive: {
    color: Theme.bgPrimary,
  },

  // Tab Content
  tabContent: {},

  // Energy Card
  energyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  dateText: {
    fontSize: 14,
    color: Theme.textMuted,
  },
  energyRingContainer: {
    alignItems: "center",
    marginBottom: 24,
  },
  energyValue: {
    fontSize: 36,
    fontWeight: "300",
  },
  energyLabel: {
    fontSize: 10,
    letterSpacing: 1.5,
    color: Theme.textMuted,
    marginTop: 4,
  },

  // Calorie Grid
  calorieGrid: {
    flexDirection: "column",
    gap: 12,
  },
  calorieCard: {
    backgroundColor: Theme.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  calorieCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  calorieIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  calorieCardLabel: {
    fontSize: 12,
    color: Theme.textMuted,
    flex: 1,
  },
  calorieCardValue: {
    fontSize: 24,
    fontWeight: "300",
    color: Theme.textPrimary,
  },
  calorieCardUnit: {
    fontSize: 14,
    color: Theme.textMuted,
  },
  editBtn: {
    padding: 6,
    backgroundColor: Theme.bgCardHover,
    borderRadius: 8,
    marginLeft: "auto",
  },
  calorieBreakdown: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Theme.borderLight,
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    gap: 8,
  },
  breakdownDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  breakdownLabel: {
    fontSize: 12,
    color: Theme.textMuted,
    flex: 1,
  },
  breakdownValue: {
    fontSize: 12,
    fontWeight: "600",
    color: Theme.textSecondary,
  },

  // Net Calories Box
  netCaloriesBox: {
    backgroundColor: Theme.bgCardHover,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.border,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  netCaloriesContent: {
    alignItems: "flex-start",
  },
  netCaloriesLabel: {
    fontSize: 11,
    color: Theme.textMuted,
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  netCaloriesValue: {
    fontSize: 28,
    fontWeight: "300",
  },
  netCaloriesUnit: {
    fontSize: 12,
    color: Theme.textMuted,
    marginTop: 2,
  },
  netCaloriesIndicator: {
    alignItems: "center",
    gap: 4,
  },
  netCaloriesStatus: {
    fontSize: 11,
    color: Theme.emerald,
    fontWeight: "500",
  },

  // Macros
  macrosContainer: {
    gap: 16,
  },
  macroItem: {},
  macroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 14,
    color: Theme.textSecondary,
  },
  macroValue: {
    fontSize: 14,
    fontWeight: "500",
    color: Theme.textPrimary,
  },
  macroGoal: {
    color: Theme.textMuted,
  },
  macroTrack: {
    height: 8,
    backgroundColor: Theme.bgCard,
    borderRadius: 10,
    overflow: "hidden",
  },
  macroFill: {
    height: "100%",
    borderRadius: 10,
  },

  // Meals Section
  sectionContainer: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 10,
    letterSpacing: 2,
    color: Theme.textMuted,
    marginBottom: 12,
  },
  mealCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Theme.bgCard,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  mealInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  mealIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Theme.bgCardHover,
    justifyContent: "center",
    alignItems: "center",
  },
  mealEmoji: {
    fontSize: 22,
  },
  mealName: {
    fontSize: 15,
    fontWeight: "500",
    color: Theme.textPrimary,
    marginBottom: 2,
  },
  mealTime: {
    fontSize: 13,
    color: Theme.textMuted,
  },
  mealCalories: {
    alignItems: "flex-end",
  },
  mealCaloriesValue: {
    fontSize: 20,
    fontWeight: "300",
    color: Theme.textPrimary,
  },
  mealCaloriesUnit: {
    fontSize: 12,
    color: Theme.textMuted,
  },

  // Activities
  activityGrid: {
    flexDirection: "row",
    gap: 12,
  },
  activityCard: {
    flex: 1,
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.15)",
  },
  activityEmoji: {
    fontSize: 22,
    marginBottom: 8,
  },
  activityName: {
    fontSize: 14,
    fontWeight: "500",
    color: Theme.textPrimary,
    marginBottom: 2,
  },
  activityDuration: {
    fontSize: 12,
    color: Theme.textMuted,
    marginBottom: 10,
  },
  activityCalories: {
    fontSize: 18,
    fontWeight: "300",
    color: Theme.emerald,
  },
  activityCaloriesUnit: {
    fontSize: 12,
  },

  // Status Card
  statusCard: {
    backgroundColor: "rgba(16, 185, 129, 0.1)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.15)",
  },
  statusHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statusBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 50,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Theme.emerald,
  },
  statusExpected: {
    fontSize: 14,
    color: Theme.textSecondary,
  },

  // Weekly Tab Styles
  dateRange: {
    fontSize: 14,
    color: Theme.textSecondary,
    marginBottom: 20,
  },
  weeklyStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  weeklyStatCard: {
    flex: 1,
    minWidth: "30%",
    backgroundColor: Theme.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  weeklyStatLabel: {
    fontSize: 11,
    color: Theme.textMuted,
    marginBottom: 6,
  },
  weeklyStatValue: {
    fontSize: 18,
    fontWeight: "300",
    color: Theme.textPrimary,
  },
  weeklyStatUnit: {
    fontSize: 12,
    color: Theme.textMuted,
  },
  weeklyStatSub: {
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 4,
  },

  // Progress Comparison
  progressComparison: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  progressCompareItem: {},
  progressCompareLabel: {
    fontSize: 12,
    color: Theme.textMuted,
    marginBottom: 4,
  },
  progressCompareValue: {
    fontSize: 20,
    fontWeight: "300",
    color: Theme.textPrimary,
  },

  // Progress Bar
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBarLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Theme.textSecondary,
  },
  progressBarPercent: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.emerald,
  },
  progressBarTrack: {
    height: 8,
    backgroundColor: Theme.bgCard,
    borderRadius: 10,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Theme.emerald,
    borderRadius: 10,
  },
  progressBarFillAmber: {
    backgroundColor: Theme.amber,
  },

  // Status Badge Large
  statusBadgeLarge: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  statusBadgeLargeText: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.emerald,
  },
  statusBadgeAmber: {
    backgroundColor: "rgba(245, 158, 11, 0.15)",
  },
  statusBadgeLargeTextAmber: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.amber,
  },

  // Monthly Tab Styles
  monthlyWeightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  monthlyWeightItem: {
    flex: 1,
  },
  monthlyWeightLabel: {
    fontSize: 12,
    color: Theme.textMuted,
    marginBottom: 4,
  },
  monthlyWeightValue: {
    fontSize: 22,
    fontWeight: "300",
    color: Theme.textPrimary,
  },
  monthlyWeightUnit: {
    fontSize: 14,
    color: Theme.textMuted,
  },
  monthlyWeightBmi: {
    fontSize: 12,
    color: Theme.textMuted,
    marginTop: 4,
  },
  monthlyWeightArrow: {
    paddingHorizontal: 16,
  },

  // Insight Grid
  insightGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  insightCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Theme.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  insightCardWide: {
    minWidth: "100%",
  },
  insightLabel: {
    fontSize: 9,
    letterSpacing: 1,
    color: Theme.textMuted,
    marginBottom: 8,
  },
  insightValue: {
    fontSize: 24,
    fontWeight: "300",
    color: Theme.textPrimary,
  },
  insightUnit: {
    fontSize: 12,
    color: Theme.textMuted,
    marginTop: 4,
  },

  // Info Grid
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  infoItem: {
    width: "50%",
    marginTop: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: Theme.textMuted,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: Theme.textPrimary,
  },

  // Modal Styles - Dark Theme
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "flex-end",
  },
  modalContainer: {
    backgroundColor: "#1A1A1E",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 12,
    paddingHorizontal: 20,
    paddingBottom: 34,
    maxHeight: "85%",
  },
  modalDragHandle: {
    width: 40,
    height: 4,
    backgroundColor: Theme.textMuted,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Theme.textPrimary,
  },
  modalCloseBtn: {
    padding: 4,
  },
  modalScrollView: {
    maxHeight: 400,
  },
  modalSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    marginTop: 4,
    gap: 10,
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: Theme.textSecondary,
  },
  modalInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.bgCard,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  modalIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  modalInputLabel: {
    fontSize: 15,
    color: Theme.textSecondary,
    fontWeight: "500",
    flex: 1,
  },
  modalInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.bgCardHover,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  modalInput: {
    backgroundColor: "transparent",
    color: Theme.textPrimary,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "right",
    minWidth: 50,
    paddingVertical: 0,
  },
  modalInputUnit: {
    fontSize: 13,
    color: Theme.textMuted,
    marginLeft: 4,
  },
  modalTotalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 4,
    backgroundColor: Theme.bgCardHover,
    borderRadius: 12,
    marginTop: 4,
  },
  modalTotalLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: Theme.textSecondary,
    flex: 1,
  },
  modalTotalValue: {
    fontSize: 17,
    fontWeight: "700",
  },
  modalDivider: {
    height: 1,
    backgroundColor: Theme.border,
    marginVertical: 16,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    gap: 12,
  },
  modalCancelBtn: {
    flex: 1,
    backgroundColor: Theme.bgCard,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.border,
  },
  modalCancelBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.textSecondary,
  },
  modalSaveBtn: {
    flex: 1,
    borderRadius: 14,
    overflow: "hidden",
  },
  modalSaveBtnGradient: {
    paddingVertical: 14,
    alignItems: "center",
  },
  modalSaveBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: Theme.textPrimary,
  },
  modalSyncText: {
    fontSize: 11,
    color: Theme.textMuted,
    textAlign: "center",
    marginTop: 16,
  },
});

export default PatientNutritionOverviewScreen;