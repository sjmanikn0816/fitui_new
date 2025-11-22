import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  RefreshControl,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import HealthService, {
  HealthData,
  HealthPermissionStatus,
} from "@/services/HealthService";
import HealthDataCacheService, {
  HealthMetrics,
} from "@/services/HealthDataCacheService";
import { useNavigation } from "@react-navigation/native";
import { verticalScale } from "@/utils/responsive";

const { width: screenWidth } = Dimensions.get("window");

interface HealthTrackUser {
  name: string;
  description: string;
  age: number;
  height: number;
  weight: number;
  bmi: number;
}

interface HealthGoal {
  type: string;
  targetSteps: number;
  targetCalories: number;
  targetHeartRate: number;
  startDate: string;
}

interface DailyHealthSnapshot {
  date: string;
  steps: number;
  calories: number;
  heartRate: number;
  activeMinutes: number;
  waterIntake: number;
  sleepHours: number;
  bloodPressure: string;
  bloodSugar: number;
  status: string;
}

interface WeeklyHealthSnapshot {
  weekStart: string;
  weekEnd: string;
  avgSteps: number;
  avgCalories: number;
  avgHeartRate: number;
  activeDays: number;
  totalActiveMinutes: number;
  avgSleep: number;
}

interface MonthlyHealthSnapshot {
  month: string;
  totalSteps: number;
  avgCalories: number;
  avgHeartRate: number;
  activeDays: number;
  totalActiveMinutes: number;
  avgSleep: number;
  weightChange: number;
}

interface HealthTrackData {
  user: HealthTrackUser;
  goal: HealthGoal;
  daily: DailyHealthSnapshot;
  weekly: WeeklyHealthSnapshot;
  monthly: MonthlyHealthSnapshot;
}

const formatDateISO = (date: Date): string => date.toISOString().split("T")[0];

const getDateDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const getMonthLabel = (date: Date): string =>
  date.toLocaleString(undefined, { month: "long", year: "numeric" });

const deriveDailyStatus = (steps: number, goal: number): string => {
  if (steps >= goal) return "On Track";
  if (steps === 0) return "Syncing...";
  if (steps >= goal * 0.6) return "Almost there";
  return "Keep moving";
};

const mapHealthDataToCacheMetrics = (data: HealthData): HealthMetrics => ({
  steps: data.steps ?? 0,
  calories: data.calories ?? 0,
  heartRate: data.heartRate ?? 0,
  activeMinutes: data.activeMinutes ?? 0,
  timestamp: new Date().toISOString(),
  date: data.date,
  distance: data.distance ?? 0,
  spo2: data.spo2 ?? 0,
});

const buildWeeklySummaryFromMetrics = (
  metrics: HealthMetrics[],
  defaults: WeeklyHealthSnapshot
): WeeklyHealthSnapshot => {
  if (!metrics.length) {
    return defaults;
  }

  const totalSteps = metrics.reduce(
    (sum, entry) => sum + (entry.steps ?? 0),
    0
  );
  const totalCalories = metrics.reduce(
    (sum, entry) => sum + (entry.calories ?? 0),
    0
  );
  const totalHeartRate = metrics.reduce(
    (sum, entry) => sum + (entry.heartRate ?? 0),
    0
  );
  const totalActiveMinutes = metrics.reduce(
    (sum, entry) => sum + (entry.activeMinutes ?? 0),
    0
  );
  const activeDays = metrics.filter(
    (entry) => (entry.steps ?? 0) > 0 || (entry.activeMinutes ?? 0) > 0
  ).length;

  return {
    ...defaults,
    weekStart: metrics[metrics.length - 1].date,
    weekEnd: metrics[0].date,
    avgSteps: Math.round(totalSteps / metrics.length),
    avgCalories: Math.round(totalCalories / metrics.length),
    avgHeartRate: Math.round(totalHeartRate / metrics.length),
    activeDays,
    totalActiveMinutes,
  };
};

const buildMonthlySummaryFromMetrics = (
  metrics: HealthMetrics[],
  defaults: MonthlyHealthSnapshot
): MonthlyHealthSnapshot => {
  if (!metrics.length) {
    return defaults;
  }

  const totalSteps = metrics.reduce(
    (sum, entry) => sum + (entry.steps ?? 0),
    0
  );
  const totalCalories = metrics.reduce(
    (sum, entry) => sum + (entry.calories ?? 0),
    0
  );
  const totalHeartRate = metrics.reduce(
    (sum, entry) => sum + (entry.heartRate ?? 0),
    0
  );
  const totalActiveMinutes = metrics.reduce(
    (sum, entry) => sum + (entry.activeMinutes ?? 0),
    0
  );
  const activeDays = metrics.filter(
    (entry) => (entry.steps ?? 0) > 0 || (entry.activeMinutes ?? 0) > 0
  ).length;
  const referenceDate = new Date(metrics[0].date);
  const monthLabel = isNaN(referenceDate.getTime())
    ? defaults.month
    : getMonthLabel(referenceDate);

  return {
    ...defaults,
    month: monthLabel,
    totalSteps,
    avgCalories: Math.round(totalCalories / metrics.length),
    avgHeartRate: Math.round(totalHeartRate / metrics.length),
    activeDays,
    totalActiveMinutes,
  };
};

const createInitialHealthTrackData = (): HealthTrackData => {
  const today = new Date();
  const weekStart = getDateDaysAgo(6);
  const goalStart = getDateDaysAgo(30);

  return {
    user: {
      name: "Your Health",
      description: "Track & Monitor",
      age: 28,
      height: 170,
      weight: 68.5,
      bmi: 23.7,
    },
    goal: {
      type: "Active Lifestyle",
      targetSteps: 10000,
      targetCalories: 2000,
      targetHeartRate: 120,
      startDate: formatDateISO(goalStart),
    },
    daily: {
      date: formatDateISO(today),
      steps: 0,
      calories: 0,
      heartRate: 0,
      activeMinutes: 0,
      waterIntake: 0,
      sleepHours: 0,
      bloodPressure: "--/--",
      bloodSugar: 0,
      status: "Sync data",
    },
    weekly: {
      weekStart: formatDateISO(weekStart),
      weekEnd: formatDateISO(today),
      avgSteps: 0,
      avgCalories: 0,
      avgHeartRate: 0,
      activeDays: 0,
      totalActiveMinutes: 0,
      avgSleep: 0,
    },
    monthly: {
      month: getMonthLabel(today),
      totalSteps: 0,
      avgCalories: 0,
      avgHeartRate: 0,
      activeDays: 0,
      totalActiveMinutes: 0,
      avgSleep: 0,
      weightChange: 0,
    },
  };
};

const HealthTrackMonitorScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"today" | "weekly" | "monthly">(
    "today"
  );
  const [healthData, setHealthData] = useState<HealthTrackData>(
    createInitialHealthTrackData()
  );
  const [permissionStatus, setPermissionStatus] =
    useState<HealthPermissionStatus | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const navigation = useNavigation();
  const fetchHealthMetrics = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);

    try {
      const todayData = await HealthService.getHealthData(new Date());
      await HealthDataCacheService.cacheHealthData(
        todayData.date,
        mapHealthDataToCacheMetrics(todayData)
      );
      await HealthDataCacheService.cleanupOldCache();

      const [weeklyMetrics, monthlyMetrics] = await Promise.all([
        HealthDataCacheService.getMetricsForRange(7),
        HealthDataCacheService.getMetricsForRange(30),
      ]);

      setHealthData((prev) => ({
        ...prev,
        daily: {
          ...prev.daily,
          date: todayData.date,
          steps: todayData.steps ?? 0,
          calories: todayData.calories ?? 0,
          heartRate: todayData.heartRate ?? 0,
          activeMinutes: todayData.activeMinutes ?? 0,
          status: deriveDailyStatus(todayData.steps ?? 0, prev.goal.targetSteps),
    },
        weekly: buildWeeklySummaryFromMetrics(weeklyMetrics, prev.weekly),
        monthly: buildMonthlySummaryFromMetrics(monthlyMetrics, prev.monthly),
      }));

      setLastUpdatedAt(new Date().toISOString());
    } catch (err) {
      console.error("❌ Failed to fetch health data:", err);
      setError(
        err instanceof Error ? err.message : "Unable to load health data"
      );
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const initializeHealthAccess = useCallback(async () => {
    setIsInitializing(true);

    try {
      const permission = await HealthService.initializeHealthServices();
      setPermissionStatus(permission);

      if (permission.granted) {
        await fetchHealthMetrics();
      } else {
        setError(permission.message);
      }
    } catch (err) {
      console.error("❌ Failed to initialize health services:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to health services"
      );
    } finally {
      setIsInitializing(false);
    }
  }, [fetchHealthMetrics]);

  useEffect(() => {
    initializeHealthAccess();
  }, [initializeHealthAccess]);

  const weeklyProgressPercent = Math.min(
    Math.max(
      Math.round(
        healthData.goal.targetSteps
          ? (healthData.weekly.avgSteps /
              Math.max(healthData.goal.targetSteps, 1)) *
              100
          : 0
      ),
      0
    ),
    100
  );

  const monthlyGoalProgress = Math.min(
    Math.max(
      Math.round(
        healthData.goal.targetSteps
          ? (healthData.monthly.totalSteps /
              Math.max(healthData.goal.targetSteps * 30, 1)) *
              100
          : 0
      ),
      0
    ),
    100
  );

  const lastSyncDisplay = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleTimeString()
    : "Pending";
  const handleMenuPress = (screen) => {
    navigation.navigate("AllScreensMenu");
  };
  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isInitializing || isRefreshing}
            onRefresh={
              permissionStatus?.granted
                ? fetchHealthMetrics
                : initializeHealthAccess
            }
            colors={["#10B981"]}
          />
        }
      >
        {/* Header */}
        <View style={styles.headerCard}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
            }}
            style={styles.headerImageBg}
            imageStyle={styles.headerImageStyle}
          >
            <LinearGradient
              colors={["rgba(59, 130, 246, 0.93)", "rgba(99, 102, 241, 0.90)"]}
              style={styles.headerOverlay}
            >
              <View style={styles.headerTopRow}>
                <View>
                  <Text style={styles.titleWithBg}>Your Health</Text>
                  <Text style={styles.subtitleWithBg}>
                    Track & Monitor Progress
                  </Text>
                </View>
                <View style={styles.headerUserBox}>
                  <Text style={styles.headerUserLabelWithBg}>BMI</Text>
                  <Text style={styles.headerUserValueWithBg}>
                    {healthData.user.bmi}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={handleMenuPress}
                  style={{
                    padding: 8,
                    backgroundColor: "rgba(255,255,255,0.15)",
                    borderRadius: 50,
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.25)",
                  }}
                >
         <Ionicons name="ellipsis-horizontal" size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              <View style={styles.headerInfoRow}>
                <View style={styles.headerInfoItem}>
                  <Text style={styles.headerInfoLabelWithBg}>Age</Text>
                  <Text style={styles.headerInfoValueWithBg}>
                    {healthData.user.age} yrs
                  </Text>
                </View>
                <View style={styles.headerInfoItem}>
                  <Text style={styles.headerInfoLabelWithBg}>Height</Text>
                  <Text style={styles.headerInfoValueWithBg}>
                    {healthData.user.height} cm
                  </Text>
                </View>
                <View style={styles.headerInfoItem}>
                  <Text style={styles.headerInfoLabelWithBg}>Weight</Text>
                  <Text style={styles.headerInfoValueWithBg}>
                    {healthData.user.weight} kg
                  </Text>
                </View>
                <View style={styles.headerInfoItem}>
                  <Text style={styles.headerInfoLabelWithBg}>Status</Text>
                  <Text style={styles.headerInfoValueWithBg}>Active</Text>
                </View>
              </View>
            </LinearGradient>
          </ImageBackground>
        </View>

        {error && (
          <View style={styles.errorBanner}>
            <Text style={styles.errorBannerText}>{error}</Text>
            <TouchableOpacity
              onPress={
                permissionStatus?.granted
                  ? fetchHealthMetrics
                  : initializeHealthAccess
              }
              style={styles.errorBannerButton}
            >
              <Text style={styles.errorBannerAction}>
                {permissionStatus?.granted ? "Retry" : "Grant Access"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Goal section - Green gradient banner like Fitness Dashboard */}
        <LinearGradient
          colors={["#E5E7EB", "#D1D5DB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.goalCard}
        >
          <View style={styles.goalHeaderRow}>
            <MaterialCommunityIcons
              name="heart-pulse"
              size={24}
              color="#374151"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.goalTitle}>Health Goals</Text>
          </View>
          <View style={styles.goalGridRow}>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Daily Steps</Text>
              <Text style={styles.goalValue}>
                {healthData.goal.targetSteps.toLocaleString()}
              </Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Target Calories</Text>
              <Text style={styles.goalValue}>
                {healthData.goal.targetCalories} kcal
              </Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Heart Rate</Text>
              <Text style={styles.goalValue}>
                {healthData.goal.targetHeartRate} bpm
              </Text>
            </View>
            <View style={styles.goalItem}>
              <Text style={styles.goalLabel}>Started</Text>
              <Text style={styles.goalValue}>{healthData.goal.startDate}</Text>
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
              {activeTab === "weekly" && (
                <View style={styles.tabBarUnderline} />
              )}
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
              {activeTab === "monthly" && (
                <View style={styles.tabBarUnderline} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily tab */}
        {activeTab === "today" && (
          <View style={styles.sectionSpace}>
            <View style={styles.cardSection}>
              <View style={styles.cardHeaderRow}>
                <Text style={styles.sectionHeader}>Today</Text>
                <Text style={styles.cardMeta}>{healthData.daily.date}</Text>
              </View>
              <View style={styles.trackingRow}>
                <View style={styles.trackingCard}>
                  <ImageBackground
                    source={{ uri: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&q=80" }}
                    style={styles.trackingImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={["rgba(59, 130, 246, 0.88)", "rgba(37, 99, 235, 0.85)"]}
                      style={styles.trackingOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Steps</Text>
                      <Text style={styles.statValueWithBg}>
                        {healthData.daily.steps.toLocaleString()}
                      </Text>
                      <Text style={styles.statSubLabelWithBg}>steps today</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
                <View style={styles.trackingCard}>
                  <ImageBackground
                    source={{ uri: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&q=80" }}
                    style={styles.trackingImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={["rgba(239, 68, 68, 0.88)", "rgba(220, 38, 38, 0.85)"]}
                      style={styles.trackingOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Heart Rate</Text>
                      <Text style={styles.statValueWithBg}>
                        {healthData.daily.heartRate}
                      </Text>
                      <Text style={styles.statSubLabelWithBg}>bpm</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
                <View style={styles.trackingCard}>
                  <ImageBackground
                    source={{ uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80" }}
                    style={styles.trackingImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={["rgba(16, 185, 129, 0.88)", "rgba(5, 150, 105, 0.85)"]}
                      style={styles.trackingOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Status</Text>
                      <Text style={styles.statValueSmallWithBg}>
                        {healthData.daily.status}
                      </Text>
                      <Text style={styles.statSubLabelWithBg}>
                        goal progress
                      </Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              </View>
            </View>

            <View style={styles.rowTwoColumn}>
              <View style={[styles.cardSection]}>
                <Text style={styles.sectionHeader}>Activity</Text>
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabel}>Active Minutes</Text>
                  <Text style={styles.metricValue}>
                    {healthData.daily.activeMinutes} min
                  </Text>
                </View>
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabel}>Calories Burned</Text>
                  <Text style={styles.metricValue}>
                    {healthData.daily.calories} kcal
                  </Text>
                </View>
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabel}>Water Intake</Text>
                  <Text style={styles.metricValue}>
                    {healthData.daily.waterIntake} glasses
                  </Text>
                </View>
                <View style={styles.listRowDivider} />
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabelBold}>Sleep</Text>
                  <Text style={styles.metricValueHighlight}>
                    {healthData.daily.sleepHours} hrs
                  </Text>
                </View>
              </View>

              <View style={[styles.cardSection]}>
                <Text style={styles.sectionHeader}>Vitals</Text>
                <View style={styles.listRowBetween}>
                  <View style={styles.rowInlineCenter}>
                    <MaterialCommunityIcons
                      name="heart-pulse"
                      size={14}
                      color="#EF4444"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.metricLabel}>Blood Pressure</Text>
                  </View>
                  <Text style={styles.metricValue}>
                    {healthData.daily.bloodPressure}
                  </Text>
                </View>
                <View style={styles.listRowBetween}>
                  <View style={styles.rowInlineCenter}>
                    <MaterialCommunityIcons
                      name="water"
                      size={14}
                      color="#3B82F6"
                      style={{ marginRight: 4 }}
                    />
                    <Text style={styles.metricLabel}>Blood Sugar</Text>
                  </View>
                  <Text style={styles.metricValue}>
                    {healthData.daily.bloodSugar} mg/dL
                  </Text>
                </View>
                <View style={styles.listRowDivider} />
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabelBold}>Heart Rate</Text>
                  <Text
                    style={[styles.metricValueHighlight, { color: "#EF4444" }]}
                  >
                    {healthData.daily.heartRate} bpm
                  </Text>
                </View>
              </View>
            </View>

            {/* Health Insights */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeader}>Health Insights</Text>
              <View style={styles.insightCard}>
                <View style={styles.insightRow}>
                  <View style={styles.insightIconBox}>
                    <Text style={styles.insightIcon}>💪</Text>
                  </View>
                  <View style={styles.insightTextBox}>
                    <Text style={styles.insightTitle}>Great Progress!</Text>
                    <Text style={styles.insightDesc}>
                      You're 15% ahead of your weekly step goal
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.insightCard}>
                <View style={styles.insightRow}>
                  <View style={styles.insightIconBox}>
                    <Text style={styles.insightIcon}>🚶</Text>
                  </View>
                  <View style={styles.insightTextBox}>
                    <Text style={styles.insightTitle}>Stay Active</Text>
                    <Text style={styles.insightDesc}>
                      Try to reach 10,000 steps today to meet your goal
                    </Text>
                  </View>
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
                Week: {healthData.weekly.weekStart} to{" "}
                {healthData.weekly.weekEnd}
              </Text>
              <View style={styles.statGridRow}>
                <View style={styles.statCard}>
                  <ImageBackground
                    source={{
                      uri: "https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&q=80",
                    }}
                    style={styles.statImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={[
                        "rgba(59, 130, 246, 0.88)",
                        "rgba(37, 99, 235, 0.85)",
                      ]}
                      style={styles.statOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Avg Steps</Text>
                      <Text style={styles.statValueWithBg}>
                        {healthData.weekly.avgSteps.toLocaleString()}
                      </Text>
                      <Text style={styles.statSubLabelWithBg}>per day</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
                <View style={styles.statCard}>
                  <ImageBackground
                    source={{
                      uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
                    }}
                    style={styles.statImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={[
                        "rgba(236, 72, 153, 0.88)",
                        "rgba(251, 146, 60, 0.85)",
                      ]}
                      style={styles.statOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Avg Calories</Text>
                      <Text style={styles.statValueWithBg}>
                        {healthData.weekly.avgCalories}
                      </Text>
                      <Text style={styles.statSubLabelWithBg}>burned/day</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
                <View style={styles.statCard}>
                  <ImageBackground
                    source={{
                      uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
                    }}
                    style={styles.statImageBg}
                    imageStyle={styles.statImageStyle}
                  >
                    <LinearGradient
                      colors={[
                        "rgba(16, 185, 129, 0.88)",
                        "rgba(5, 150, 105, 0.85)",
                      ]}
                      style={styles.statOverlay}
                    >
                      <Text style={styles.statLabelWithBg}>Active Days</Text>
                      <Text style={styles.statValueWithBg}>
                        {healthData.weekly.activeDays}/7
                      </Text>
                      <Text style={styles.statSubLabelWithBg}>this week</Text>
                    </LinearGradient>
                  </ImageBackground>
                </View>
              </View>
            </View>

            <View style={styles.cardSection}>
              <Text style={styles.sectionHeader}>Weekly Progress</Text>
              <View style={styles.rowTwoColumnSimple}>
                <View>
                  <Text style={styles.metricLabel}>Total Active Minutes</Text>
                  <Text style={styles.statValue}>
                    {healthData.weekly.totalActiveMinutes} min
                  </Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Avg Sleep</Text>
                  <Text style={styles.statValueAccent}>
                    {healthData.weekly.avgSleep} hrs
                  </Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressHeaderRow}>
                  <Text style={styles.metricLabelBold}>Step Goal Progress</Text>
                  <Text style={styles.metricValueHighlight}>
                    {weeklyProgressPercent}%
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${weeklyProgressPercent}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.statusPillRow}>
                <View style={styles.statusPillNeutral}>
                  <Text style={styles.statusPillText}>On Track</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Monthly tab */}
        {activeTab === "monthly" && (
          <View style={styles.sectionSpace}>
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeader}>
                {healthData.monthly.month}
              </Text>
              <View style={styles.rowTwoColumnSimple}>
                <View>
                  <Text style={styles.metricLabel}>Total Steps</Text>
                  <Text style={styles.statValue}>
                    {(healthData.monthly.totalSteps / 1000).toFixed(0)}K
                  </Text>
                  <Text style={styles.statSubLabel}>this month</Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Weight Change</Text>
                  <Text style={styles.statValueAccent}>
                    {healthData.monthly.weightChange} kg
                  </Text>
                  <Text style={styles.statSubLabel}>from start</Text>
                </View>
              </View>
            </View>

            <View style={styles.statGridRow}>
              <View style={styles.statCard}>
                <ImageBackground
                  source={{
                    uri: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&q=80",
                  }}
                  style={styles.statImageBg}
                  imageStyle={styles.statImageStyle}
                >
                  <LinearGradient
                    colors={[
                      "rgba(236, 72, 153, 0.88)",
                      "rgba(251, 146, 60, 0.85)",
                    ]}
                    style={styles.statOverlay}
                  >
                    <Text style={styles.statLabelWithBg}>Avg Calories</Text>
                    <Text style={styles.statValueWithBg}>
                      {healthData.monthly.avgCalories}
                    </Text>
                    <Text style={styles.statSubLabelWithBg}>per day</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
              <View style={styles.statCard}>
                <ImageBackground
                  source={{
                    uri: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&q=80",
                  }}
                  style={styles.statImageBg}
                  imageStyle={styles.statImageStyle}
                >
                  <LinearGradient
                    colors={[
                      "rgba(16, 185, 129, 0.88)",
                      "rgba(5, 150, 105, 0.85)",
                    ]}
                    style={styles.statOverlay}
                  >
                    <Text style={styles.statLabelWithBg}>Active Days</Text>
                    <Text style={styles.statValueWithBg}>
                      {healthData.monthly.activeDays}/30
                    </Text>
                    <Text style={styles.statSubLabelWithBg}>days</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
              <View style={styles.statCard}>
                <ImageBackground
                  source={{
                    uri: "https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&q=80",
                  }}
                  style={styles.statImageBg}
                  imageStyle={styles.statImageStyle}
                >
                  <LinearGradient
                    colors={[
                      "rgba(239, 68, 68, 0.88)",
                      "rgba(220, 38, 38, 0.85)",
                    ]}
                    style={styles.statOverlay}
                  >
                    <Text style={styles.statLabelWithBg}>Avg Sleep</Text>
                    <Text style={styles.statValueWithBg}>
                      {healthData.monthly.avgSleep}
                    </Text>
                    <Text style={styles.statSubLabelWithBg}>hours</Text>
                  </LinearGradient>
                </ImageBackground>
              </View>
            </View>

            <View style={styles.cardSection}>
              <Text style={styles.sectionHeader}>Monthly Progress</Text>
              <View style={styles.rowTwoColumnSimple}>
                <View>
                  <Text style={styles.metricLabel}>Total Active Minutes</Text>
                  <Text style={styles.statValue}>
                    {healthData.monthly.totalActiveMinutes} min
                  </Text>
                </View>
                <View>
                  <Text style={styles.metricLabel}>Avg Heart Rate</Text>
                  <Text style={styles.statValueAccent}>
                    {healthData.monthly.avgHeartRate} bpm
                  </Text>
                </View>
              </View>

              <View style={styles.progressRow}>
                <View style={styles.progressHeaderRow}>
                  <Text style={styles.metricLabelBold}>
                    Monthly Goal Progress
                  </Text>
                  <Text style={styles.metricValueHighlight}>
                    {monthlyGoalProgress}%
                  </Text>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      { width: `${monthlyGoalProgress}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.statusPillRow}>
                <View style={styles.statusPillNeutral}>
                  <Text style={styles.statusPillText}>Good Progress</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Additional info */}
        <View style={[styles.cardSection, { marginTop: 8, marginBottom: 24 }]}>
          <Text style={styles.sectionHeader}>Health Tracking</Text>
          <View style={styles.headerInfoRow}>
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Water Tracking</Text>
              <Text style={styles.headerInfoValue}>Daily</Text>
            </View>
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Sleep Tracking</Text>
              <Text style={styles.headerInfoValue}>Enabled</Text>
            </View>
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Activity Level</Text>
              <Text style={styles.headerInfoValue}>Moderate</Text>
            </View>
            <View style={styles.headerInfoItem}>
              <Text style={styles.headerInfoLabel}>Last Sync</Text>
              <Text style={styles.headerInfoValue}>{lastSyncDisplay}</Text>
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
  },
  scrollArea: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: verticalScale(60),
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
    color: "#10B981",
  },
  headerUserLabelWithBg: {
    fontSize: 12,
    color: "rgba(255,255,255,0.9)",
  },
  headerUserValueWithBg: {
    fontSize: 22,
    fontWeight: "800",
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
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#FCA5A5",
    marginBottom: 16,
  },
  errorBannerText: {
    flex: 1,
    color: "#B91C1C",
    fontSize: 13,
    marginRight: 12,
  },
  errorBannerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: "#EF4444",
  },
  errorBannerAction: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
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
    padding: verticalScale(8),
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
    color: "#10B981",
  },
  tabBarUnderline: {
    marginTop: 6,
    height: 2,
    width: "60%",
    backgroundColor: "#10B981",
    borderRadius: 999,
  },
  sectionSpace: {
    marginBottom: 12,
  },
  trackingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  trackingCard: {
    flex: 1,
    marginRight: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  trackingImageBg: {
    width: "100%",
    height: 120,
  },
  trackingOverlay: {
    padding: 12,
    flex: 1,
    justifyContent: "center",
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
    justifyContent: "space-between",
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
    color: "#10B981",
  },
  statValueAccent: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: "700",
    color: "#10B981",
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
    backgroundColor: "#D1FAE5",
  },
  statusPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#047857",
  },
  metricLabel: {
    fontSize: 12,
    color: Colors.gray600,
  },
  metricValue: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.black,
  },

  // Health Insights matching Fitness Dashboard insight cards
  insightCard: {
    backgroundColor: Colors.gray100,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  insightRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  insightIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  insightIcon: {
    fontSize: 20,
  },
  insightTextBox: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.black,
    marginBottom: 4,
  },
  insightDesc: {
    fontSize: 13,
    color: Colors.gray600,
    lineHeight: 18,
  },
});

export default HealthTrackMonitorScreen;
