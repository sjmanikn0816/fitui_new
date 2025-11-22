import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ImageBackground, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { verticalScale } from "@/utils/responsive";

const { width: screenWidth } = Dimensions.get('window');

// Types based on provided JSON shape
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

// Simple mock fallback so screen shows something even without params
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

const PatientNutritionOverviewScreen: React.FC<Props> = ({ route }) => {
  const patients = route?.params?.patients ?? MOCK_DATA;
  const patient = patients[0];

  const latestDaily = patient.Tracking.Daily[0];
  const weekly = patient.Tracking.Weekly;
  const monthly = patient.Tracking.Monthly;
const navigation=useNavigation()
  const [activeTab, setActiveTab] = useState<"today" | "weekly" | "monthly">("today");
const handleMenuPress = () => {

  navigation.navigate("AllScreensMenu");
};
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerCard}>
          <ImageBackground
            source={{ uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&q=80" }}
            style={styles.headerImageBg}
            imageStyle={styles.headerImageStyle}
          >
            <LinearGradient
              colors={["rgba(37, 99, 235, 0.93)", "rgba(20, 184, 166, 0.90)"]}
              style={styles.headerOverlay}
            >
              <View style={styles.headerTopRow}>
                <View>
                  <Text style={styles.titleWithBg}>Fitness Dashboard</Text>
                  <Text style={styles.subtitleWithBg}>{patient.Description}</Text>
                </View>
                
                <View style={styles.headerUserBox}>
                  <Text style={styles.headerUserLabelWithBg}>User ID</Text>
                  <Text style={styles.headerUserValueWithBg}>{patient.UserID}</Text>
                </View>
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

              <View style={styles.headerInfoRow}>
                <View style={styles.headerInfoItem}>
                  <Text style={styles.headerInfoLabelWithBg}>Age</Text>
                  <Text style={styles.headerInfoValueWithBg}>{patient.Age} yrs</Text>
                </View>
                <View style={styles.headerInfoItem}>
                  <Text style={styles.headerInfoLabelWithBg}>Height</Text>
                  <Text style={styles.headerInfoValueWithBg}>{patient.Height_cm} cm</Text>
                </View>
                <View style={styles.headerInfoItem}>
                  <Text style={styles.headerInfoLabelWithBg}>Current Weight</Text>
                  <Text style={styles.headerInfoValueWithBg}>{patient.Weight_lbs.toFixed(1)} lbs</Text>
                </View>
                <View style={styles.headerInfoItem}>
                  <Text style={styles.headerInfoLabelWithBg}>Body Fat</Text>
                  <Text style={styles.headerInfoValueWithBg}>{patient.BodyFatPercentage}</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {/* Goal section */}
        <LinearGradient
          colors={["#E5E7EB", "#D1D5DB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.goalCard}
        >
          <View style={styles.goalHeaderRow}>
            <MaterialCommunityIcons
              name="target"
              size={24}
              color="#374151"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.goalTitle}>Weight Loss Goal</Text>
          </View>
          <View style={styles.goalGridRow}>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Target Weight</Text>
              <Text style={styles.goalValue}>{patient.Goal.TargetWeight_lbs} lbs</Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Duration</Text>
              <Text style={styles.goalValue}>{patient.Goal.TargetDuration_weeks} weeks</Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Weekly Target</Text>
              <Text style={styles.goalValue}>{patient.Goal.TargetWeeklyLoss_lbs} lbs/week</Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Started</Text>
              <Text style={styles.goalValue}>{patient.Goal.StartDate}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Tabs container with underline style */}
        <View style={styles.tabsCard}>
          <View style={styles.tabBarRow}>
            <TouchableOpacity
              onPress={() => setActiveTab("today")}
              style={styles.tabBarButton}
            >
              <Text
                style={[
                  styles.tabBarLabel,
                  activeTab === "today" && styles.tabBarLabelActive,
                ]}
              >
                Daily Tracking
              </Text>
              {activeTab === "today" && <View style={styles.tabBarUnderline} />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("weekly")}
              style={styles.tabBarButton}
            >
              <Text
                style={[
                  styles.tabBarLabel,
                  activeTab === "weekly" && styles.tabBarLabelActive,
                ]}
              >
                Weekly Summary
              </Text>
              {activeTab === "weekly" && <View style={styles.tabBarUnderline} />}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setActiveTab("monthly")}
              style={styles.tabBarButton}
            >
              <Text
                style={[
                  styles.tabBarLabel,
                  activeTab === "monthly" && styles.tabBarLabelActive,
                ]}
              >
                Monthly Overview
              </Text>
              {activeTab === "monthly" && <View style={styles.tabBarUnderline} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily tab */}
        {activeTab === "today" && (
          <View style={styles.sectionSpace}>
            <View style={styles.cardSection}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.sectionHeader}>Today</Text>
                <Text style={styles.cardMeta}>{latestDaily.Date}</Text>
              </View>
              <View style={styles.statGridRow}>
                <View style={styles.statCard}>
                  <ImageBackground
                    source={{ uri: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=400&q=80" }}
                    style={styles.statImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={["rgba(139, 92, 246, 0.88)", "rgba(99, 102, 241, 0.85)"]}
                      style={styles.statOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Current Weight</Text>
                      <Text style={styles.statValueWithBg}>{latestDaily.Weight_lbs.toFixed(1)} lbs</Text>
                      <Text style={styles.statSubLabelWithBg}>BMI: {latestDaily.BMI.toFixed(1)}</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
                <View style={styles.statCard}>
                  <ImageBackground
                    source={{ uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80" }}
                    style={styles.statImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={["rgba(236, 72, 153, 0.88)", "rgba(251, 146, 60, 0.85)"]}
                      style={styles.statOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Net Calories</Text>
                      <Text style={styles.statValueWithBg}>{latestDaily.NetCalories}</Text>
                      <Text style={styles.statSubLabelWithBg}>Calorie Deficit</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
                <View style={styles.statCard}>
                  <ImageBackground
                    source={{ uri: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80" }}
                    style={styles.statImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={["rgba(16, 185, 129, 0.88)", "rgba(20, 184, 166, 0.85)"]}
                      style={styles.statOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Status</Text>
                      <Text style={styles.statValueSmallWithBg}>{latestDaily.WeightGoalProgress.GoalStatus}</Text>
                      <Text style={styles.statSubLabelWithBg}>Expected Δ: {latestDaily.WeightGoalProgress.ExpectedWeightChange_lbs} lbs</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              </View>
            </View>

            <View style={styles.rowTwoColumn}>
              <View style={[styles.cardSection, { flex: 1 }]}>
                <Text style={styles.sectionHeader}>Calories Intake</Text>
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabel}>Breakfast</Text>
                  <Text style={styles.metricValue}>{latestDaily.CaloriesIntake.Breakfast} cal</Text>
                </View>
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabel}>Lunch</Text>
                  <Text style={styles.metricValue}>{latestDaily.CaloriesIntake.Lunch} cal</Text>
                </View>
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabel}>Dinner</Text>
                  <Text style={styles.metricValue}>{latestDaily.CaloriesIntake.Dinner} cal</Text>
                </View>
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabel}>Snacks</Text>
                  <Text style={styles.metricValue}>{latestDaily.CaloriesIntake.Snacks} cal</Text>
                </View>
                <View style={styles.listRowDivider} />
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabelBold}>Total</Text>
                  <Text style={styles.metricValueHighlight}>{latestDaily.CaloriesIntake.Total} cal</Text>
                </View>
              </View>

              <View style={[styles.cardSection, { flex: 1 }]}>
                <Text style={styles.sectionHeader}>Calories Burned</Text>
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabel}>BMR</Text>
                  <Text style={styles.metricValue}>{latestDaily.CaloriesBurned.BMR} cal</Text>
                </View>
                <View style={styles.listRowBetween}>
                  <View style={styles.rowInlineCenter}>
                    <MaterialCommunityIcons
                      name="dumbbell"
                      size={14}
                      color="#16a34a"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.metricLabel}>Exercise</Text>
                  </View>
                  <Text style={styles.metricValue}>{latestDaily.CaloriesBurned.Exercise} cal</Text>
                </View>
                <View style={styles.listRowDivider} />
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabelBold}>Total</Text>
                  <Text style={[styles.metricValueHighlight, { color: "#16a34a" }]}>
                    {latestDaily.CaloriesBurned.Total} cal
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Weekly tab */}
        {activeTab === "weekly" && (
          <View style={styles.sectionSpace}>
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeader}>
                Week: {weekly.WeekStart} to {weekly.WeekEnd}
              </Text>
              <View style={styles.statGridRow}>
                <View style={styles.statCard}>
                  <ImageBackground
                    source={{ uri: "https://images.unsplash.com/photo-1611672585731-fa10603fb9e0?w=400&q=80" }}
                    style={styles.statImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={["rgba(139, 92, 246, 0.88)", "rgba(99, 102, 241, 0.85)"]}
                      style={styles.statOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Avg Weight</Text>
                      <Text style={styles.statValueWithBg}>{weekly.AverageWeight_lbs.toFixed(1)} lbs</Text>
                      <Text style={styles.statSubLabelWithBg}>BMI: {weekly.BMI_Average}</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
                <View style={styles.statCard}>
                  <ImageBackground
                    source={{ uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80" }}
                    style={styles.statImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={["rgba(236, 72, 153, 0.88)", "rgba(251, 146, 60, 0.85)"]}
                      style={styles.statOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Avg Intake</Text>
                      <Text style={styles.statValueWithBg}>{weekly.AverageCaloriesIntake}</Text>
                      <Text style={styles.statSubLabelWithBg}>per day</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
                <View style={styles.statCard}>
                  <ImageBackground
                    source={{ uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" }}
                    style={styles.statImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={["rgba(16, 185, 129, 0.88)", "rgba(20, 184, 166, 0.85)"]}
                      style={styles.statOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Avg Burned</Text>
                      <Text style={styles.statValueWithBg}>{weekly.AverageCaloriesBurned}</Text>
                      <Text style={styles.statSubLabelWithBg}>per day</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              </View>
            </View>

            <View style={styles.cardSection}>
              <Text style={styles.sectionHeader}>Weekly Progress</Text>
              <View style={styles.rowTwoColumnSimple}>
                <View>
                  <Text style={styles.metricLabel}>Expected Weight Loss</Text>
                  <Text style={styles.statValue}>{weekly.WeightGoalProgress.ExpectedWeightLoss_lbs} lbs</Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Actual Weight Loss</Text>
                  <Text style={styles.statValueAccent}>
                    {weekly.WeightGoalProgress.ActualWeightLoss_lbs} lbs
                  </Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressHeaderRow}>
                  <Text style={styles.metricLabelBold}>Progress</Text>
                  <Text style={styles.metricValueHighlight}>
                    {weekly.WeightGoalProgress.ProgressPercent}%
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${Math.min(
                          weekly.WeightGoalProgress.ProgressPercent,
                          100
                        )}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.statusPillRow}>
                <View style={styles.statusPillNeutral}>
                  <Text style={styles.statusPillText}>{weekly.WeightGoalProgress.GoalStatus}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Monthly tab */}
        {activeTab === "monthly" && (
          <View style={styles.sectionSpace}>
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeader}>{monthly.Month}</Text>
              <View style={styles.rowTwoColumnSimple}>
                <View>
                  <Text style={styles.metricLabel}>Start Weight</Text>
                  <Text style={styles.statValue}>{monthly.StartWeight_lbs} lbs</Text>
                  <Text style={styles.statSubLabel}>BMI: {monthly.BMI_Start}</Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>End Weight</Text>
                  <Text style={styles.statValueAccent}>{monthly.EndWeight_lbs} lbs</Text>
                  <Text style={styles.statSubLabel}>BMI: {monthly.BMI_End}</Text>
                </View>
              </View>
            </View>

            <View style={styles.statGridRow}>
              <View style={styles.statCard}>
                <ImageBackground
                  source={{ uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80" }}
                  style={styles.statImageBg}
                  imageStyle={styles.statImageStyle}
                >
                  <LinearGradient
                    colors={["rgba(236, 72, 153, 0.88)", "rgba(251, 146, 60, 0.85)"]}
                    style={styles.statOverlay}
                  >
                    <Text style={styles.statLabelWithBg}>Avg Daily Intake</Text>
                    <Text style={styles.statValueWithBg}>{monthly.AverageCaloriesIntake}</Text>
                    <Text style={styles.statSubLabelWithBg}>calories</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
              <View style={styles.statCard}>
                <ImageBackground
                  source={{ uri: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" }}
                  style={styles.statImageBg}
                  imageStyle={styles.statImageStyle}
                >
                  <LinearGradient
                    colors={["rgba(16, 185, 129, 0.88)", "rgba(20, 184, 166, 0.85)"]}
                    style={styles.statOverlay}
                  >
                    <Text style={styles.statLabelWithBg}>Avg Daily Burned</Text>
                    <Text style={styles.statValueWithBg}>{monthly.AverageCaloriesBurned}</Text>
                    <Text style={styles.statSubLabelWithBg}>calories</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
              <View style={styles.statCard}>
                <ImageBackground
                  source={{ uri: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&q=80" }}
                  style={styles.statImageBg}
                  imageStyle={styles.statImageStyle}
                >
                  <LinearGradient
                    colors={["rgba(59, 130, 246, 0.88)", "rgba(99, 102, 241, 0.85)"]}
                    style={styles.statOverlay}
                  >
                    <Text style={styles.statLabelWithBg}>Avg Net Calories</Text>
                    <Text style={styles.statValueWithBg}>{monthly.AverageNetCalories}</Text>
                    <Text style={styles.statSubLabelWithBg}>deficit</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
            </View>

            <View style={styles.cardSection}>
              <Text style={styles.sectionHeader}>Monthly Progress</Text>
              <View style={styles.rowTwoColumnSimple}>
                <View>
                  <Text style={styles.metricLabel}>Expected Weight Loss</Text>
                  <Text style={styles.statValue}>{monthly.WeightGoalProgress.ExpectedWeightLoss_lbs} lbs</Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Actual Weight Loss</Text>
                  <Text style={styles.statValueAccent}>
                    {monthly.WeightGoalProgress.ActualWeightLoss_lbs} lbs
                  </Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressHeaderRow}>
                  <Text style={styles.metricLabelBold}>Goal Progress</Text>
                  <Text style={styles.metricValueHighlight}>
                    {monthly.WeightGoalProgress.ProgressPercent}%
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {
                        width: `${monthly.WeightGoalProgress.ProgressPercent}%`,
                      },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.statusPillRow}>
                <View style={styles.statusPillNeutral}>
                  <Text style={styles.statusPillText}>{monthly.WeightGoalProgress.GoalStatus}</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Additional info */}
        <View style={[styles.cardSection, { marginTop: 8, marginBottom: 24 }]}> 
          <Text style={styles.sectionHeader}>Additional Information</Text>
          <View style={styles.headerInfoRow}>
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Diet Type</Text>
              <Text style={styles.headerInfoValue}>{patient.Diet}</Text>
            </View>
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Exercise Routine</Text>
              <Text style={styles.headerInfoValue}>{patient.ExerciseRoutine}</Text>
            </View>
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Health App</Text>
              <Text style={styles.headerInfoValue}>{patient.HealthApp}</Text>
            </View>
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Tracking Frequency</Text>
              <Text style={styles.headerInfoValue}>{patient.TrackingFrequency}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
      paddingBottom: verticalScale(60),
  },
  scrollArea: {
    flex: 1,
      // paddingBottom: verticalScale(60),
    
  },
  menuBar: {
  position: "absolute",
  top: 10,
  right: 10,
  flexDirection: "row",
  gap: 10,
  zIndex: 20,
},

menuButton: {
  padding: 8,
  backgroundColor: "rgba(255,255,255,0.20)",
  borderRadius: 12,
  backdropFilter: "blur(8px)",
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.25)",
  justifyContent: "center",
  alignItems: "center",

  // Shadow for modern look
  shadowColor: "#000",
  shadowOpacity: 0.2,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
},

  content: {
    padding: 16,
    paddingBottom: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: Colors.black,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.gray600,
    marginBottom: 16,
  },
  headerCard: {
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
    overflow: "hidden",
  },
  headerImageBg: {
    width: "100%",
  },
  headerImageStyle: {
    borderRadius: 16,
  },
  headerOverlay: {
    padding: 16,
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerUserBox: {
    alignItems: "flex-end",
  },
  headerUserLabel: {
    fontSize: 12,
    color: Colors.gray600,
  },
  headerUserValue: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  headerUserLabelWithBg: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  headerUserValueWithBg: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  headerInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 4,
  },
  headerInfoItem: {
    width: "48%",
    marginTop: 8,
  },
  headerInfoLabel: {
    fontSize: 12,
    color: Colors.gray600,
  },
  headerInfoValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.black,
  },
  headerInfoLabelWithBg: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
  },
  headerInfoValueWithBg: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  titleWithBg: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subtitleWithBg: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginBottom: 16,
  },
  goalCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  goalHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#374151",
  },
  goalGridRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  goalItem: {
    width: "48%",
    marginTop: 8,
  },
  goalLabel: {
    fontSize: 12,
    color: "#6B7280",
  },
  goalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },
  cardSection: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardSectionSmall: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 0,
    flex: 1,
    marginHorizontal: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.white,
    marginBottom: 4,
  },
  cardText: {
    fontSize: 14,
    color: Colors.white,
  },
  cardMetaLight: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
    marginTop: 4,
  },
  cardMeta: {
    fontSize: 12,
    color: Colors.gray600,
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 4,
  },
  tabsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingTop: 4,
  },
  tabBarRow: {
    flexDirection: "row",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.gray200,
  },
  tabBarButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabBarLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.gray600,
  },
  tabBarLabelActive: {
    color: Colors.primary,
  },
  tabBarUnderline: {
    marginTop: 6,
    height: 2,
    width: "60%",
    backgroundColor: Colors.primary,
    borderRadius: 999,
  },
  sectionSpace: {
    marginBottom: 12,
  },
  statGridRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statCard: {
    width: "32%",
    height: 140,
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    overflow: "hidden",
  },
  statLabel: {
    fontSize: 12,
    color: Colors.gray600,
  },
  statValue: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "700",
    color: Colors.black,
  },
  statValueSmall: {
    marginTop: 4,
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },
  statSubLabel: {
    marginTop: 4,
    fontSize: 12,
    color: Colors.gray500,
  },
  statImageBg: {
    width: "100%",
    height: "100%",
  },
  statImageStyle: {
    borderRadius: 12,
  },
  statOverlay: {
    padding: 12,
    flex: 1,
    justifyContent: "center",
  },
  statLabelWithBg: {
    fontSize: 13,
    color: "rgba(255,255,255,1)",
    fontWeight: "700",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  statValueWithBg: {
    marginTop: 4,
    fontSize: 26,
    fontWeight: "900",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
  },
  statValueSmallWithBg: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "900",
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
    letterSpacing: 0.5,
  },
  statSubLabelWithBg: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255,255,255,1)",
    fontWeight: "600",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowTwoColumn: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },
  rowTwoColumnSimple: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  rowThreeColumn: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  listRowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  listRowDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: Colors.gray200,
    marginVertical: 8,
  },
  metricLabelBold: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.gray800,
  },
  metricValueHighlight: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.primary,
  },
  statValueAccent: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "700",
    color: Colors.primary,
  },
  rowInlineCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressRow: {
    marginTop: 16,
  },
  progressHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  progressTrack: {
    width: "100%",
    height: 8,
    borderRadius: 999,
    backgroundColor: Colors.gray200,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#16a34a",
    borderRadius: 999,
  },
  statusPillRow: {
    marginTop: 12,
    flexDirection: "row",
  },
  statusPillNeutral: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#e0f2fe",
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0369a1",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  metricBox: {
    flex: 1,
    padding: 8,
  },
  metricBoxFull: {
    flex: 1,
    padding: 8,
    alignItems: "flex-start",
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.gray600,
  },
  metricValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.black,
  },
});

export default PatientNutritionOverviewScreen;
