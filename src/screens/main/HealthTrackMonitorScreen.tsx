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
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
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
import Svg, { Path, Circle, Rect, Defs, LinearGradient as SvgLinearGradient, Stop, Line, Text as SvgText } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

// Advanced color palette for dark mode cards
const CARD_COLORS = {
  // Weight card - Purple/Blue
  weightPrimary: "#8B5CF6",
  weightSecondary: "#6366F1",
  weightGlow: "rgba(139, 92, 246, 0.3)",
  weightBg: ["#1e1b4b", "#312e81"],

  // Calories card - Orange/Red
  caloriesPrimary: "#F97316",
  caloriesSecondary: "#EF4444",
  caloriesGlow: "rgba(249, 115, 22, 0.3)",
  caloriesBg: ["#431407", "#7c2d12"],

  // Status card - Green/Teal
  statusPrimary: "#10B981",
  statusSecondary: "#14B8A6",
  statusGlow: "rgba(16, 185, 129, 0.3)",
  statusBg: ["#064e3b", "#065f46"],

  // Common
  cardBorder: "rgba(255, 255, 255, 0.1)",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.7)",
  textMuted: "rgba(255, 255, 255, 0.5)",
};

// Mini Line Graph Component for weight trend
const MiniLineGraph = ({ data, color, width = 100, height = 35 }: { data: number[], color: string, width?: number, height?: number }) => {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const padding = 2;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = padding + (height - padding * 2) - ((val - minVal) / range) * (height - padding * 2);
    return `${x},${y}`;
  }).join(" ");

  const areaPath = `M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id={`lineGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      <Path d={areaPath} fill={`url(#lineGrad-${color.replace('#', '')})`} />
      <Path d={`M ${points}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      {/* Current point indicator */}
      <Circle cx={width - padding} cy={padding + (height - padding * 2) - ((data[data.length - 1] - minVal) / range) * (height - padding * 2)} r="3" fill={color} />
    </Svg>
  );
};

// Circular Progress Ring
const ProgressRing = ({ progress, size = 70, strokeWidth = 6, color, bgColor = "rgba(255,255,255,0.1)" }: { progress: number, size?: number, strokeWidth?: number, color: string, bgColor?: string }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (Math.min(progress, 100) / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={bgColor}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${circumference} ${circumference}`}
        strokeDashoffset={strokeDashoffset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </Svg>
  );
};

// BMI Progress Bar Component
const BMIProgressBar = ({ bmi, width = 120 }: { bmi: number, width?: number }) => {
  // BMI categories: Underweight <18.5, Normal 18.5-24.9, Overweight 25-29.9, Obese 30+
  const getBMICategory = (val: number) => {
    if (val < 18.5) return { label: "Underweight", color: "#60A5FA" };
    if (val < 25) return { label: "Healthy", color: "#10B981" };
    if (val < 30) return { label: "Overweight", color: "#FBBF24" };
    return { label: "Obese", color: "#EF4444" };
  };

  const category = getBMICategory(bmi);
  const position = Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100); // Scale BMI 15-40 to 0-100%

  return (
    <View style={{ width }}>
      <View style={{ flexDirection: "row", height: 6, borderRadius: 3, overflow: "hidden" }}>
        <View style={{ flex: 1, backgroundColor: "#60A5FA" }} />
        <View style={{ flex: 1.5, backgroundColor: "#10B981" }} />
        <View style={{ flex: 1, backgroundColor: "#FBBF24" }} />
        <View style={{ flex: 1, backgroundColor: "#EF4444" }} />
      </View>
      <View style={{ position: "absolute", left: `${position}%`, top: -2, marginLeft: -4 }}>
        <View style={{ width: 8, height: 10, backgroundColor: "#fff", borderRadius: 2 }} />
      </View>
      <Text style={{ color: category.color, fontSize: 10, fontWeight: "600", marginTop: 4 }}>{category.label}</Text>
    </View>
  );
};

// Mini Bar Chart for predictions
const MiniBarChart = ({ data, width = 100, height = 40, color }: { data: number[], width?: number, height?: number, color: string }) => {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data.map(Math.abs));
  const barWidth = (width - (data.length - 1) * 3) / data.length;

  return (
    <Svg width={width} height={height}>
      {data.map((val, idx) => {
        const barHeight = (Math.abs(val) / (maxVal || 1)) * (height - 10);
        const x = idx * (barWidth + 3);
        const y = val >= 0 ? height / 2 - barHeight : height / 2;
        const barColor = val >= 0 ? "#10B981" : "#EF4444";

        return (
          <Rect
            key={idx}
            x={x}
            y={y}
            width={barWidth}
            height={barHeight || 2}
            rx={2}
            fill={idx === data.length - 1 ? color : barColor}
            opacity={idx === data.length - 1 ? 1 : 0.6}
          />
        );
      })}
      <Line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    </Svg>
  );
};

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

        {/* Daily tab - Advanced Data Cards */}
        {activeTab === "today" && (
          <View style={styles.sectionSpace}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionHeader}>Today</Text>
              <Text style={styles.cardMeta}>{healthData.daily.date}</Text>
            </View>

            {/* Advanced Card 1: Current Weight (Purple/Blue Theme) */}
            <LinearGradient
              colors={CARD_COLORS.weightBg as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.advancedCard}
            >
              <View style={styles.advancedCardGlow} />
              <View style={styles.advancedCardHeader}>
                <View style={[styles.advancedCardIcon, { backgroundColor: CARD_COLORS.weightGlow }]}>
                  <MaterialCommunityIcons name="scale-bathroom" size={20} color={CARD_COLORS.weightPrimary} />
                </View>
                <Text style={styles.advancedCardTitle}>Current Weight</Text>
                <View style={styles.changeIndicator}>
                  <Ionicons name="arrow-up" size={12} color="#EF4444" />
                  <Text style={[styles.changeText, { color: "#EF4444" }]}>+0.5 lbs</Text>
                </View>
              </View>

              <View style={styles.advancedCardBody}>
                <View style={styles.mainMetric}>
                  <Text style={[styles.advancedCardValue, { color: CARD_COLORS.weightPrimary }]}>
                    {(healthData.user.weight * 2.205).toFixed(1)}
                  </Text>
                  <Text style={styles.advancedCardUnit}>lbs</Text>
                </View>
                <View style={styles.miniChartContainer}>
                  <Text style={styles.chartLabel}>7-Day Trend</Text>
                  <MiniLineGraph
                    data={[186.8, 186.5, 186.2, 186.0, 185.8, 186.1, 186.3]}
                    color={CARD_COLORS.weightPrimary}
                    width={100}
                    height={35}
                  />
                </View>
              </View>

              <View style={styles.advancedCardFooter}>
                <View style={styles.bmiContainer}>
                  <Text style={styles.bmiLabel}>BMI</Text>
                  <Text style={[styles.bmiValue, { color: CARD_COLORS.weightPrimary }]}>{healthData.user.bmi}</Text>
                </View>
                <BMIProgressBar bmi={healthData.user.bmi} width={140} />
              </View>
            </LinearGradient>

            {/* Advanced Card 2: Net Calories (Orange/Red Theme) */}
            <LinearGradient
              colors={CARD_COLORS.caloriesBg as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.advancedCard}
            >
              <View style={[styles.advancedCardGlow, { backgroundColor: CARD_COLORS.caloriesGlow }]} />
              <View style={styles.advancedCardHeader}>
                <View style={[styles.advancedCardIcon, { backgroundColor: CARD_COLORS.caloriesGlow }]}>
                  <MaterialCommunityIcons name="fire" size={20} color={CARD_COLORS.caloriesPrimary} />
                </View>
                <Text style={styles.advancedCardTitle}>Net Calories</Text>
                <View style={[styles.goalBadge, { backgroundColor: "rgba(16, 185, 129, 0.2)" }]}>
                  <Text style={[styles.goalBadgeText, { color: "#10B981" }]}>Goal: -500</Text>
                </View>
              </View>

              <View style={styles.advancedCardBody}>
                <View style={styles.calorieRingContainer}>
                  <ProgressRing
                    progress={90}
                    size={80}
                    strokeWidth={8}
                    color={CARD_COLORS.caloriesPrimary}
                  />
                  <View style={styles.ringCenter}>
                    <Text style={[styles.ringValue, { color: CARD_COLORS.caloriesPrimary }]}>-450</Text>
                    <Text style={styles.ringUnit}>kcal</Text>
                  </View>
                </View>
                <View style={styles.calorieDetails}>
                  <View style={styles.calorieRow}>
                    <View style={styles.calorieIconBox}>
                      <Ionicons name="restaurant" size={14} color={CARD_COLORS.caloriesPrimary} />
                    </View>
                    <View>
                      <Text style={styles.calorieLabel}>Intake</Text>
                      <Text style={[styles.calorieValue, { color: CARD_COLORS.caloriesPrimary }]}>1,800 kcal</Text>
                    </View>
                  </View>
                  <View style={styles.calorieRow}>
                    <View style={styles.calorieIconBox}>
                      <MaterialCommunityIcons name="lightning-bolt" size={14} color="#14B8A6" />
                    </View>
                    <View>
                      <Text style={styles.calorieLabel}>Burned</Text>
                      <Text style={[styles.calorieValue, { color: "#14B8A6" }]}>2,250 kcal</Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.calorieProgressBar}>
                <View style={styles.calorieBarBg}>
                  <LinearGradient
                    colors={[CARD_COLORS.caloriesPrimary, CARD_COLORS.caloriesSecondary]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.calorieBarFill, { width: "90%" }]}
                  />
                </View>
                <Text style={styles.calorieProgressText}>90% of daily deficit goal</Text>
              </View>
            </LinearGradient>

            {/* Advanced Card 3: Status (Green/Teal Theme) */}
            <LinearGradient
              colors={CARD_COLORS.statusBg as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.advancedCard}
            >
              <View style={[styles.advancedCardGlow, { backgroundColor: CARD_COLORS.statusGlow }]} />
              <View style={styles.advancedCardHeader}>
                <View style={[styles.advancedCardIcon, { backgroundColor: CARD_COLORS.statusGlow }]}>
                  <Ionicons name="checkmark-circle" size={20} color={CARD_COLORS.statusPrimary} />
                </View>
                <Text style={styles.advancedCardTitle}>Status</Text>
                <View style={[styles.statusBadge, { backgroundColor: "rgba(16, 185, 129, 0.3)" }]}>
                  <Ionicons name="checkmark" size={12} color={CARD_COLORS.statusPrimary} />
                  <Text style={[styles.statusBadgeText, { color: CARD_COLORS.statusPrimary }]}>On Track</Text>
                </View>
              </View>

              <View style={styles.advancedCardBody}>
                <View style={styles.statusMain}>
                  <View style={styles.statusIconLarge}>
                    <Ionicons name="trending-down" size={32} color={CARD_COLORS.statusPrimary} />
                  </View>
                  <View>
                    <Text style={styles.statusExpected}>Expected Today</Text>
                    <Text style={[styles.statusValue, { color: CARD_COLORS.statusPrimary }]}>-0.13 lbs</Text>
                  </View>
                </View>
                <View style={styles.predictionChart}>
                  <Text style={styles.chartLabel}>7-Day Prediction</Text>
                  <MiniBarChart
                    data={[-0.12, -0.15, -0.10, -0.14, -0.11, -0.13, -0.15]}
                    width={100}
                    height={40}
                    color={CARD_COLORS.statusPrimary}
                  />
                </View>
              </View>

              <View style={styles.advancedCardFooter}>
                <View style={styles.goalDateContainer}>
                  <Ionicons name="calendar" size={14} color={CARD_COLORS.textSecondary} />
                  <Text style={styles.goalDateLabel}>Target Date</Text>
                  <Text style={[styles.goalDateValue, { color: CARD_COLORS.statusPrimary }]}>Dec 30th</Text>
                </View>
                <View style={styles.daysRemaining}>
                  <Text style={styles.daysValue}>34</Text>
                  <Text style={styles.daysLabel}>days left</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Activity & Vitals Row */}
            <View style={styles.rowTwoColumn}>
              <View style={[styles.cardSection, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.sectionHeader}>Activity</Text>
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabel}>Active Minutes</Text>
                  <Text style={styles.metricValue}>
                    {healthData.daily.activeMinutes} min
                  </Text>
                </View>
                <View style={styles.listRowBetween}>
                  <Text style={styles.metricLabel}>Steps</Text>
                  <Text style={styles.metricValue}>
                    {healthData.daily.steps.toLocaleString()}
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

              <View style={[styles.cardSection, { flex: 1, marginLeft: 8 }]}>
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
                  <View style={[styles.insightIconBox, { backgroundColor: "#D1FAE5" }]}>
                    <Text style={styles.insightIcon}>💪</Text>
                  </View>
                  <View style={styles.insightTextBox}>
                    <Text style={styles.insightTitle}>Great Progress!</Text>
                    <Text style={styles.insightDesc}>
                      You're on track to reach your weight goal by Dec 30th
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.insightCard}>
                <View style={styles.insightRow}>
                  <View style={[styles.insightIconBox, { backgroundColor: "#FEF3C7" }]}>
                    <Text style={styles.insightIcon}>🔥</Text>
                  </View>
                  <View style={styles.insightTextBox}>
                    <Text style={styles.insightTitle}>Calorie Deficit Achieved</Text>
                    <Text style={styles.insightDesc}>
                      90% of your daily deficit goal - keep it up!
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Weekly tab - Advanced Cards */}
        {activeTab === "weekly" && (
          <View style={styles.sectionSpace}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionHeader}>Weekly Summary</Text>
              <Text style={styles.cardMeta}>{healthData.weekly.weekStart} - {healthData.weekly.weekEnd}</Text>
            </View>

            {/* Weekly Weight Progress Card */}
            <LinearGradient
              colors={CARD_COLORS.weightBg as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.advancedCard}
            >
              <View style={styles.advancedCardGlow} />
              <View style={styles.advancedCardHeader}>
                <View style={[styles.advancedCardIcon, { backgroundColor: CARD_COLORS.weightGlow }]}>
                  <MaterialCommunityIcons name="chart-line" size={20} color={CARD_COLORS.weightPrimary} />
                </View>
                <Text style={styles.advancedCardTitle}>Weight Progress</Text>
                <View style={styles.changeIndicator}>
                  <Ionicons name="arrow-down" size={12} color="#10B981" />
                  <Text style={[styles.changeText, { color: "#10B981" }]}>-0.8 lbs</Text>
                </View>
              </View>

              <View style={styles.advancedCardBody}>
                <View style={styles.weeklyStatsGrid}>
                  <View style={styles.weeklyStatItem}>
                    <Text style={styles.weeklyStatLabel}>Start</Text>
                    <Text style={[styles.weeklyStatValue, { color: CARD_COLORS.textSecondary }]}>187.1</Text>
                  </View>
                  <View style={styles.weeklyStatItem}>
                    <Text style={styles.weeklyStatLabel}>Current</Text>
                    <Text style={[styles.weeklyStatValue, { color: CARD_COLORS.weightPrimary }]}>186.3</Text>
                  </View>
                  <View style={styles.weeklyStatItem}>
                    <Text style={styles.weeklyStatLabel}>Goal</Text>
                    <Text style={[styles.weeklyStatValue, { color: "#10B981" }]}>175.0</Text>
                  </View>
                </View>
                <View style={styles.miniChartContainer}>
                  <Text style={styles.chartLabel}>Weekly Trend</Text>
                  <MiniLineGraph
                    data={[187.1, 186.9, 186.7, 186.5, 186.4, 186.2, 186.3]}
                    color={CARD_COLORS.weightPrimary}
                    width={110}
                    height={40}
                  />
                </View>
              </View>
            </LinearGradient>

            {/* Weekly Calories Card */}
            <LinearGradient
              colors={CARD_COLORS.caloriesBg as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.advancedCard}
            >
              <View style={[styles.advancedCardGlow, { backgroundColor: CARD_COLORS.caloriesGlow }]} />
              <View style={styles.advancedCardHeader}>
                <View style={[styles.advancedCardIcon, { backgroundColor: CARD_COLORS.caloriesGlow }]}>
                  <MaterialCommunityIcons name="fire" size={20} color={CARD_COLORS.caloriesPrimary} />
                </View>
                <Text style={styles.advancedCardTitle}>Calorie Summary</Text>
              </View>

              <View style={styles.advancedCardBody}>
                <View style={styles.weeklyCalorieStats}>
                  <View style={styles.weeklyCalorieStat}>
                    <ProgressRing progress={85} size={60} strokeWidth={5} color={CARD_COLORS.caloriesPrimary} />
                    <View style={styles.weeklyCalorieCenter}>
                      <Text style={[styles.weeklyCalorieValue, { color: CARD_COLORS.caloriesPrimary }]}>
                        {healthData.weekly.avgCalories}
                      </Text>
                    </View>
                    <Text style={styles.weeklyCalorieLabel}>Avg Burned</Text>
                  </View>
                  <View style={styles.weeklyCalorieStat}>
                    <ProgressRing progress={78} size={60} strokeWidth={5} color="#14B8A6" />
                    <View style={styles.weeklyCalorieCenter}>
                      <Text style={[styles.weeklyCalorieValue, { color: "#14B8A6" }]}>1,850</Text>
                    </View>
                    <Text style={styles.weeklyCalorieLabel}>Avg Intake</Text>
                  </View>
                  <View style={styles.weeklyCalorieStat}>
                    <ProgressRing progress={90} size={60} strokeWidth={5} color="#10B981" />
                    <View style={styles.weeklyCalorieCenter}>
                      <Text style={[styles.weeklyCalorieValue, { color: "#10B981" }]}>-3,150</Text>
                    </View>
                    <Text style={styles.weeklyCalorieLabel}>Net Deficit</Text>
                  </View>
                </View>
              </View>

              <View style={styles.calorieProgressBar}>
                <View style={styles.calorieBarBg}>
                  <LinearGradient
                    colors={[CARD_COLORS.caloriesPrimary, "#10B981"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.calorieBarFill, { width: "90%" }]}
                  />
                </View>
                <Text style={styles.calorieProgressText}>90% of weekly deficit goal achieved</Text>
              </View>
            </LinearGradient>

            {/* Weekly Activity Card */}
            <LinearGradient
              colors={CARD_COLORS.statusBg as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.advancedCard}
            >
              <View style={[styles.advancedCardGlow, { backgroundColor: CARD_COLORS.statusGlow }]} />
              <View style={styles.advancedCardHeader}>
                <View style={[styles.advancedCardIcon, { backgroundColor: CARD_COLORS.statusGlow }]}>
                  <Ionicons name="fitness" size={20} color={CARD_COLORS.statusPrimary} />
                </View>
                <Text style={styles.advancedCardTitle}>Activity Overview</Text>
                <View style={[styles.statusBadge, { backgroundColor: "rgba(16, 185, 129, 0.3)" }]}>
                  <Text style={[styles.statusBadgeText, { color: CARD_COLORS.statusPrimary }]}>{healthData.weekly.activeDays}/7 Active</Text>
                </View>
              </View>

              <View style={styles.advancedCardBody}>
                <View style={styles.activityStatsRow}>
                  <View style={styles.activityStatBox}>
                    <MaterialCommunityIcons name="walk" size={24} color={CARD_COLORS.statusPrimary} />
                    <Text style={styles.activityStatValue}>{healthData.weekly.avgSteps.toLocaleString()}</Text>
                    <Text style={styles.activityStatLabel}>Avg Steps</Text>
                  </View>
                  <View style={styles.activityStatBox}>
                    <MaterialCommunityIcons name="clock-fast" size={24} color="#14B8A6" />
                    <Text style={styles.activityStatValue}>{healthData.weekly.totalActiveMinutes}</Text>
                    <Text style={styles.activityStatLabel}>Total Min</Text>
                  </View>
                  <View style={styles.activityStatBox}>
                    <Ionicons name="heart" size={24} color="#EF4444" />
                    <Text style={styles.activityStatValue}>{healthData.weekly.avgHeartRate || 72}</Text>
                    <Text style={styles.activityStatLabel}>Avg BPM</Text>
                  </View>
                  <View style={styles.activityStatBox}>
                    <Ionicons name="moon" size={24} color="#8B5CF6" />
                    <Text style={styles.activityStatValue}>{healthData.weekly.avgSleep}</Text>
                    <Text style={styles.activityStatLabel}>Avg Sleep</Text>
                  </View>
                </View>
              </View>

              <View style={styles.advancedCardFooter}>
                <View style={styles.progressRow}>
                  <View style={styles.progressHeaderRow}>
                    <Text style={[styles.metricLabelBold, { color: CARD_COLORS.textSecondary }]}>Step Goal Progress</Text>
                    <Text style={[styles.metricValueHighlight, { color: CARD_COLORS.statusPrimary }]}>{weeklyProgressPercent}%</Text>
                  </View>
                  <View style={[styles.progressTrack, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
                    <LinearGradient
                      colors={[CARD_COLORS.statusPrimary, CARD_COLORS.statusSecondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressFill, { width: `${weeklyProgressPercent}%` }]}
                    />
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
        )}

        {/* Monthly tab - Advanced Cards */}
        {activeTab === "monthly" && (
          <View style={styles.sectionSpace}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.sectionHeader}>Monthly Overview</Text>
              <Text style={styles.cardMeta}>{healthData.monthly.month}</Text>
            </View>

            {/* Monthly Weight Journey Card */}
            <LinearGradient
              colors={CARD_COLORS.weightBg as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.advancedCard}
            >
              <View style={styles.advancedCardGlow} />
              <View style={styles.advancedCardHeader}>
                <View style={[styles.advancedCardIcon, { backgroundColor: CARD_COLORS.weightGlow }]}>
                  <MaterialCommunityIcons name="chart-timeline-variant" size={20} color={CARD_COLORS.weightPrimary} />
                </View>
                <Text style={styles.advancedCardTitle}>Weight Journey</Text>
                <View style={styles.changeIndicator}>
                  <Ionicons name="arrow-down" size={12} color="#10B981" />
                  <Text style={[styles.changeText, { color: "#10B981" }]}>-3.2 lbs</Text>
                </View>
              </View>

              <View style={styles.advancedCardBody}>
                <View style={styles.monthlyWeightStats}>
                  <View style={styles.monthlyWeightMain}>
                    <Text style={styles.monthlyWeightLabel}>Month Start</Text>
                    <Text style={[styles.monthlyWeightValue, { color: CARD_COLORS.textSecondary }]}>189.5 lbs</Text>
                  </View>
                  <View style={styles.monthlyWeightArrow}>
                    <Ionicons name="arrow-forward" size={20} color={CARD_COLORS.weightPrimary} />
                  </View>
                  <View style={styles.monthlyWeightMain}>
                    <Text style={styles.monthlyWeightLabel}>Current</Text>
                    <Text style={[styles.monthlyWeightValue, { color: CARD_COLORS.weightPrimary }]}>186.3 lbs</Text>
                  </View>
                  <View style={styles.monthlyWeightArrow}>
                    <Ionicons name="arrow-forward" size={20} color="#10B981" />
                  </View>
                  <View style={styles.monthlyWeightMain}>
                    <Text style={styles.monthlyWeightLabel}>Goal</Text>
                    <Text style={[styles.monthlyWeightValue, { color: "#10B981" }]}>175.0 lbs</Text>
                  </View>
                </View>
                <View style={styles.monthlyTrendChart}>
                  <Text style={styles.chartLabel}>30-Day Trend</Text>
                  <MiniLineGraph
                    data={[189.5, 189.2, 188.8, 188.5, 188.1, 187.8, 187.5, 187.2, 186.9, 186.5, 186.3]}
                    color={CARD_COLORS.weightPrimary}
                    width={130}
                    height={45}
                  />
                </View>
              </View>

              <View style={styles.monthlyProgressContainer}>
                <Text style={[styles.monthlyProgressLabel, { color: CARD_COLORS.textSecondary }]}>Goal Progress</Text>
                <View style={styles.monthlyProgressBar}>
                  <LinearGradient
                    colors={[CARD_COLORS.weightPrimary, "#10B981"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.monthlyProgressFill, { width: "22%" }]}
                  />
                </View>
                <Text style={[styles.monthlyProgressText, { color: CARD_COLORS.weightPrimary }]}>22% to goal (11.3 lbs remaining)</Text>
              </View>
            </LinearGradient>

            {/* Monthly Calories Card */}
            <LinearGradient
              colors={CARD_COLORS.caloriesBg as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.advancedCard}
            >
              <View style={[styles.advancedCardGlow, { backgroundColor: CARD_COLORS.caloriesGlow }]} />
              <View style={styles.advancedCardHeader}>
                <View style={[styles.advancedCardIcon, { backgroundColor: CARD_COLORS.caloriesGlow }]}>
                  <MaterialCommunityIcons name="fire" size={20} color={CARD_COLORS.caloriesPrimary} />
                </View>
                <Text style={styles.advancedCardTitle}>Calorie Analysis</Text>
              </View>

              <View style={styles.advancedCardBody}>
                <View style={styles.monthlyCalorieGrid}>
                  <View style={styles.monthlyCalorieBox}>
                    <View style={[styles.monthlyCalorieIconBg, { backgroundColor: "rgba(249, 115, 22, 0.2)" }]}>
                      <MaterialCommunityIcons name="fire" size={24} color={CARD_COLORS.caloriesPrimary} />
                    </View>
                    <Text style={styles.monthlyCalorieValue}>{healthData.monthly.avgCalories}</Text>
                    <Text style={styles.monthlyCalorieLabel}>Avg Burned/Day</Text>
                  </View>
                  <View style={styles.monthlyCalorieBox}>
                    <View style={[styles.monthlyCalorieIconBg, { backgroundColor: "rgba(20, 184, 166, 0.2)" }]}>
                      <Ionicons name="restaurant" size={24} color="#14B8A6" />
                    </View>
                    <Text style={styles.monthlyCalorieValue}>1,820</Text>
                    <Text style={styles.monthlyCalorieLabel}>Avg Intake/Day</Text>
                  </View>
                  <View style={styles.monthlyCalorieBox}>
                    <View style={[styles.monthlyCalorieIconBg, { backgroundColor: "rgba(16, 185, 129, 0.2)" }]}>
                      <Ionicons name="trending-down" size={24} color="#10B981" />
                    </View>
                    <Text style={styles.monthlyCalorieValue}>-13,500</Text>
                    <Text style={styles.monthlyCalorieLabel}>Total Deficit</Text>
                  </View>
                </View>
              </View>

              <View style={styles.calorieInsightBox}>
                <Ionicons name="bulb" size={16} color="#FBBF24" />
                <Text style={styles.calorieInsightText}>At this rate, you'll lose ~3.9 lbs this month</Text>
              </View>
            </LinearGradient>

            {/* Monthly Activity Summary Card */}
            <LinearGradient
              colors={CARD_COLORS.statusBg as [string, string]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.advancedCard}
            >
              <View style={[styles.advancedCardGlow, { backgroundColor: CARD_COLORS.statusGlow }]} />
              <View style={styles.advancedCardHeader}>
                <View style={[styles.advancedCardIcon, { backgroundColor: CARD_COLORS.statusGlow }]}>
                  <Ionicons name="trophy" size={20} color={CARD_COLORS.statusPrimary} />
                </View>
                <Text style={styles.advancedCardTitle}>Monthly Achievements</Text>
                <View style={[styles.statusBadge, { backgroundColor: "rgba(16, 185, 129, 0.3)" }]}>
                  <Text style={[styles.statusBadgeText, { color: CARD_COLORS.statusPrimary }]}>On Track</Text>
                </View>
              </View>

              <View style={styles.advancedCardBody}>
                <View style={styles.monthlyAchievementGrid}>
                  <View style={styles.achievementBox}>
                    <View style={[styles.achievementRing]}>
                      <ProgressRing progress={monthlyGoalProgress} size={50} strokeWidth={4} color={CARD_COLORS.statusPrimary} />
                      <View style={styles.achievementRingCenter}>
                        <Text style={styles.achievementRingValue}>{(healthData.monthly.totalSteps / 1000).toFixed(0)}K</Text>
                      </View>
                    </View>
                    <Text style={styles.achievementLabel}>Total Steps</Text>
                  </View>
                  <View style={styles.achievementBox}>
                    <View style={[styles.achievementRing]}>
                      <ProgressRing progress={(healthData.monthly.activeDays / 30) * 100} size={50} strokeWidth={4} color="#14B8A6" />
                      <View style={styles.achievementRingCenter}>
                        <Text style={styles.achievementRingValue}>{healthData.monthly.activeDays}</Text>
                      </View>
                    </View>
                    <Text style={styles.achievementLabel}>Active Days</Text>
                  </View>
                  <View style={styles.achievementBox}>
                    <View style={[styles.achievementRing]}>
                      <ProgressRing progress={85} size={50} strokeWidth={4} color="#8B5CF6" />
                      <View style={styles.achievementRingCenter}>
                        <Text style={styles.achievementRingValue}>{healthData.monthly.avgSleep}</Text>
                      </View>
                    </View>
                    <Text style={styles.achievementLabel}>Avg Sleep (hrs)</Text>
                  </View>
                  <View style={styles.achievementBox}>
                    <View style={[styles.achievementRing]}>
                      <ProgressRing progress={75} size={50} strokeWidth={4} color="#EF4444" />
                      <View style={styles.achievementRingCenter}>
                        <Text style={styles.achievementRingValue}>{healthData.monthly.avgHeartRate || 72}</Text>
                      </View>
                    </View>
                    <Text style={styles.achievementLabel}>Avg BPM</Text>
                  </View>
                </View>
              </View>

              <View style={styles.advancedCardFooter}>
                <View style={styles.progressRow}>
                  <View style={styles.progressHeaderRow}>
                    <Text style={[styles.metricLabelBold, { color: CARD_COLORS.textSecondary }]}>Monthly Goal Progress</Text>
                    <Text style={[styles.metricValueHighlight, { color: CARD_COLORS.statusPrimary }]}>{monthlyGoalProgress}%</Text>
                  </View>
                  <View style={[styles.progressTrack, { backgroundColor: "rgba(255,255,255,0.1)" }]}>
                    <LinearGradient
                      colors={[CARD_COLORS.statusPrimary, CARD_COLORS.statusSecondary]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={[styles.progressFill, { width: `${monthlyGoalProgress}%` }]}
                    />
                  </View>
                </View>
              </View>
            </LinearGradient>

            {/* Monthly Insights */}
            <View style={styles.cardSection}>
              <Text style={styles.sectionHeader}>Monthly Insights</Text>
              <View style={styles.insightCard}>
                <View style={styles.insightRow}>
                  <View style={[styles.insightIconBox, { backgroundColor: "#D1FAE5" }]}>
                    <Text style={styles.insightIcon}>🎯</Text>
                  </View>
                  <View style={styles.insightTextBox}>
                    <Text style={styles.insightTitle}>Excellent Consistency!</Text>
                    <Text style={styles.insightDesc}>
                      You've been active {healthData.monthly.activeDays} out of 30 days this month
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.insightCard}>
                <View style={styles.insightRow}>
                  <View style={[styles.insightIconBox, { backgroundColor: "#EDE9FE" }]}>
                    <Text style={styles.insightIcon}>📈</Text>
                  </View>
                  <View style={styles.insightTextBox}>
                    <Text style={styles.insightTitle}>Weight Loss Trend</Text>
                    <Text style={styles.insightDesc}>
                      You're losing weight at a healthy rate of ~0.8 lbs/week
                    </Text>
                  </View>
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

  // Advanced Card Styles
  advancedCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    overflow: "hidden",
    position: "relative",
  },
  advancedCardGlow: {
    position: "absolute",
    top: -50,
    right: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(139, 92, 246, 0.3)",
    opacity: 0.6,
  },
  advancedCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  advancedCardIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  advancedCardTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.3,
  },
  advancedCardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  advancedCardFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    paddingTop: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  advancedCardValue: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: -1,
  },
  advancedCardUnit: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.6)",
    marginLeft: 4,
    marginTop: 12,
  },
  mainMetric: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  miniChartContainer: {
    alignItems: "flex-end",
  },
  chartLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  changeIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  changeText: {
    fontSize: 12,
    fontWeight: "700",
    marginLeft: 2,
  },
  bmiContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  bmiLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  bmiValue: {
    fontSize: 24,
    fontWeight: "800",
  },

  // Calorie Card Styles
  calorieRingContainer: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    alignItems: "center",
  },
  ringValue: {
    fontSize: 22,
    fontWeight: "800",
  },
  ringUnit: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
  },
  calorieDetails: {
    flex: 1,
    marginLeft: 20,
  },
  calorieRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  calorieIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  calorieLabel: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  calorieValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  calorieProgressBar: {
    marginTop: 4,
  },
  calorieBarBg: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  calorieBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  calorieProgressText: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 6,
    textAlign: "center",
  },
  goalBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  goalBadgeText: {
    fontSize: 11,
    fontWeight: "600",
  },

  // Status Card Styles
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    marginLeft: 4,
  },
  statusMain: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIconLarge: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  statusExpected: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  predictionChart: {
    alignItems: "flex-end",
  },
  goalDateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalDateLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.5)",
    marginLeft: 6,
    marginRight: 8,
  },
  goalDateValue: {
    fontSize: 14,
    fontWeight: "700",
  },
  daysRemaining: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  daysValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  daysLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
  },

  // Weekly Card Styles
  weeklyStatsGrid: {
    flexDirection: "row",
    flex: 1,
  },
  weeklyStatItem: {
    flex: 1,
    alignItems: "center",
  },
  weeklyStatLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  weeklyStatValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  weeklyCalorieStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    flex: 1,
  },
  weeklyCalorieStat: {
    alignItems: "center",
    position: "relative",
  },
  weeklyCalorieCenter: {
    position: "absolute",
    top: 18,
    alignItems: "center",
  },
  weeklyCalorieValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  weeklyCalorieLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 8,
    textAlign: "center",
  },
  activityStatsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  activityStatBox: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 8,
  },
  activityStatValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 6,
  },
  activityStatLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 2,
  },

  // Monthly Card Styles
  monthlyWeightStats: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  monthlyWeightMain: {
    alignItems: "center",
    flex: 1,
  },
  monthlyWeightLabel: {
    fontSize: 10,
    color: "rgba(255, 255, 255, 0.5)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  monthlyWeightValue: {
    fontSize: 16,
    fontWeight: "800",
  },
  monthlyWeightArrow: {
    paddingHorizontal: 8,
  },
  monthlyTrendChart: {
    alignItems: "flex-end",
  },
  monthlyProgressContainer: {
    marginTop: 4,
  },
  monthlyProgressLabel: {
    fontSize: 11,
    marginBottom: 6,
  },
  monthlyProgressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
  },
  monthlyProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  monthlyProgressText: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
  },
  monthlyCalorieGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  monthlyCalorieBox: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  monthlyCalorieIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  monthlyCalorieValue: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  monthlyCalorieLabel: {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.5)",
    textAlign: "center",
    marginTop: 4,
  },
  calorieInsightBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(251, 191, 36, 0.15)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    marginTop: 12,
  },
  calorieInsightText: {
    fontSize: 12,
    color: "#FBBF24",
    marginLeft: 8,
    flex: 1,
  },
  monthlyAchievementGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  achievementBox: {
    flex: 1,
    alignItems: "center",
  },
  achievementRing: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  achievementRingCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  achievementRingValue: {
    fontSize: 12,
    fontWeight: "800",
    color: "#FFFFFF",
  },
  achievementLabel: {
    fontSize: 9,
    color: "rgba(255, 255, 255, 0.5)",
    marginTop: 6,
    textAlign: "center",
  },
});

export default HealthTrackMonitorScreen;
