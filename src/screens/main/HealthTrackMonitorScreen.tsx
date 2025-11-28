import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  RefreshControl,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import HealthService, {
  HealthData,
  HealthPermissionStatus,
} from "@/services/HealthService";
import HealthDataCacheService, {
  HealthMetrics,
} from "@/services/HealthDataCacheService";
import { useNavigation } from "@react-navigation/native";
import { verticalScale } from "@/utils/responsive";
import Svg, { Path, Circle, Defs, LinearGradient as SvgLinearGradient, Stop, Line } from "react-native-svg";

const { width: screenWidth } = Dimensions.get("window");

// ============================================
// THEME CONFIGURATION - Premium Dark Theme
// ============================================
const Theme = {
  // Backgrounds
  bgPrimary: "#0A0A0C",
  bgCard: "rgba(255, 255, 255, 0.04)",
  bgCardHover: "rgba(255, 255, 255, 0.08)",
  bgCardAccent: "rgba(255, 255, 255, 0.06)",

  // Text
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255, 255, 255, 0.75)",
  textMuted: "rgba(255, 255, 255, 0.45)",
  textLabel: "rgba(255, 255, 255, 0.55)",

  // Accent Colors
  blue: "#60A5FA",
  blueLight: "#93C5FD",
  blueDark: "#2563EB",
  emerald: "#34D399",
  emeraldLight: "#6EE7B7",
  emeraldDark: "#059669",
  amber: "#FBBF24",
  amberLight: "#FCD34D",
  orange: "#FB923C",
  red: "#F87171",
  redLight: "#FCA5A5",
  purple: "#A78BFA",
  purpleLight: "#C4B5FD",
  cyan: "#22D3EE",
  pink: "#F472B6",

  // Borders
  border: "rgba(255, 255, 255, 0.08)",
  borderLight: "rgba(255, 255, 255, 0.04)",

  // Gradients
  blueGradient: ["#1E40AF", "#3B82F6"],
  emeraldGradient: ["#047857", "#10B981"],
  redGradient: ["#991B1B", "#EF4444"],
  orangeGradient: ["#92400E", "#F59E0B"],
  purpleGradient: ["#5B21B6", "#8B5CF6"],
};

// ============================================
// TYPES (Same as original)
// ============================================
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

// ============================================
// HELPER FUNCTIONS (Same as original)
// ============================================
const formatDateISO = (date: Date): string => date.toISOString().split("T")[0];

const getDateDaysAgo = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date;
};

const getMonthLabel = (date: Date): string =>
  date.toLocaleString(undefined, { month: "long", year: "numeric" });

const deriveDailyStatus = (steps: number, goal: number): string => {
  if (steps >= goal) return "Goal Reached";
  if (steps === 0) return "Syncing...";
  if (steps >= goal * 0.75) return "Almost There";
  if (steps >= goal * 0.5) return "Keep Going";
  return "Get Moving";
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
  if (!metrics.length) return defaults;

  const totalSteps = metrics.reduce((sum, entry) => sum + (entry.steps ?? 0), 0);
  const totalCalories = metrics.reduce((sum, entry) => sum + (entry.calories ?? 0), 0);
  const totalHeartRate = metrics.reduce((sum, entry) => sum + (entry.heartRate ?? 0), 0);
  const totalActiveMinutes = metrics.reduce((sum, entry) => sum + (entry.activeMinutes ?? 0), 0);
  const activeDays = metrics.filter((entry) => (entry.steps ?? 0) > 0 || (entry.activeMinutes ?? 0) > 0).length;

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
  if (!metrics.length) return defaults;

  const totalSteps = metrics.reduce((sum, entry) => sum + (entry.steps ?? 0), 0);
  const totalCalories = metrics.reduce((sum, entry) => sum + (entry.calories ?? 0), 0);
  const totalHeartRate = metrics.reduce((sum, entry) => sum + (entry.heartRate ?? 0), 0);
  const totalActiveMinutes = metrics.reduce((sum, entry) => sum + (entry.activeMinutes ?? 0), 0);
  const activeDays = metrics.filter((entry) => (entry.steps ?? 0) > 0 || (entry.activeMinutes ?? 0) > 0).length;
  const referenceDate = new Date(metrics[0].date);
  const monthLabel = isNaN(referenceDate.getTime()) ? defaults.month : getMonthLabel(referenceDate);

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
      steps: 7842,
      calories: 1650,
      heartRate: 72,
      activeMinutes: 45,
      waterIntake: 6,
      sleepHours: 7.5,
      bloodPressure: "120/80",
      bloodSugar: 95,
      status: "On Track",
    },
    weekly: {
      weekStart: formatDateISO(weekStart),
      weekEnd: formatDateISO(today),
      avgSteps: 8234,
      avgCalories: 1720,
      avgHeartRate: 74,
      activeDays: 5,
      totalActiveMinutes: 285,
      avgSleep: 7.2,
    },
    monthly: {
      month: getMonthLabel(today),
      totalSteps: 245000,
      avgCalories: 1680,
      avgHeartRate: 73,
      activeDays: 22,
      totalActiveMinutes: 1240,
      avgSleep: 7.1,
      weightChange: -1.2,
    },
  };
};

// ============================================
// CHART COMPONENTS
// ============================================

// Circular Progress Ring
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
        <Defs>
          <SvgLinearGradient id={`grad-${color.replace('#', '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={color} stopOpacity="1" />
            <Stop offset="100%" stopColor={color} stopOpacity="0.6" />
          </SvgLinearGradient>
        </Defs>
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
          stroke={`url(#grad-${color.replace('#', '')})`}
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

// Mini Sparkline Chart
interface SparklineProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
  filled?: boolean;
}

const Sparkline: React.FC<SparklineProps> = ({ data, color, width = 100, height = 40, filled = true }) => {
  if (!data || data.length < 2) return null;

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;
  const padding = 4;

  const points = data.map((val, idx) => {
    const x = padding + (idx / (data.length - 1)) * (width - padding * 2);
    const y = padding + (height - padding * 2) - ((val - minVal) / range) * (height - padding * 2);
    return { x, y };
  });

  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  const areaD = `${pathD} L ${points[points.length - 1].x},${height - padding} L ${points[0].x},${height - padding} Z`;

  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id={`sparkGrad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      {filled && <Path d={areaD} fill={`url(#sparkGrad-${color.replace('#', '')})`} />}
      <Path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="4" fill={color} />
      <Circle cx={points[points.length - 1].x} cy={points[points.length - 1].y} r="6" fill={color} opacity="0.3" />
    </Svg>
  );
};

// Mini Bar Chart
interface MiniBarChartProps {
  data: number[];
  color: string;
  width?: number;
  height?: number;
}

const MiniBarChart: React.FC<MiniBarChartProps> = ({ data, color, width = 100, height = 40 }) => {
  if (!data || data.length === 0) return null;

  const maxVal = Math.max(...data);
  const barWidth = (width - (data.length - 1) * 4) / data.length;
  const padding = 2;

  return (
    <Svg width={width} height={height}>
      {data.map((val, idx) => {
        const barHeight = Math.max((val / maxVal) * (height - padding * 2), 4);
        const x = idx * (barWidth + 4);
        const y = height - padding - barHeight;
        const isLast = idx === data.length - 1;

        return (
          <React.Fragment key={idx}>
            <Defs>
              <SvgLinearGradient id={`barGrad-${idx}`} x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0%" stopColor={color} stopOpacity={isLast ? 1 : 0.6} />
                <Stop offset="100%" stopColor={color} stopOpacity={isLast ? 0.8 : 0.3} />
              </SvgLinearGradient>
            </Defs>
            <Path
              d={`M ${x + 3} ${y + 3} L ${x + barWidth - 3} ${y + 3} Q ${x + barWidth} ${y + 3} ${x + barWidth} ${y + 6} L ${x + barWidth} ${height - padding} L ${x} ${height - padding} L ${x} ${y + 6} Q ${x} ${y + 3} ${x + 3} ${y + 3}`}
              fill={`url(#barGrad-${idx})`}
            />
          </React.Fragment>
        );
      })}
    </Svg>
  );
};

// ============================================
// METRIC CARD COMPONENT
// ============================================
interface MetricCardProps {
  icon: string;
  iconColor: string;
  iconBg: string;
  label: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  trend?: number;
  sparkData?: number[];
  sparkColor?: string;
  progress?: number;
  progressMax?: number;
  progressColor?: string;
  children?: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({
  icon,
  iconColor,
  iconBg,
  label,
  value,
  unit,
  subtitle,
  trend,
  sparkData,
  sparkColor,
  progress,
  progressMax,
  progressColor,
  children,
}) => {
  return (
    <View style={styles.metricCard}>
      <View style={styles.metricCardHeader}>
        <View style={[styles.metricIconBox, { backgroundColor: iconBg }]}>
          <MaterialCommunityIcons name={icon as any} size={20} color={iconColor} />
        </View>
        <Text style={styles.metricLabel}>{label}</Text>
        {trend !== undefined && (
          <View style={[styles.trendBadge, { backgroundColor: trend >= 0 ? 'rgba(52, 211, 153, 0.15)' : 'rgba(248, 113, 113, 0.15)' }]}>
            <Ionicons
              name={trend >= 0 ? "trending-up" : "trending-down"}
              size={12}
              color={trend >= 0 ? Theme.emerald : Theme.red}
            />
            <Text style={[styles.trendText, { color: trend >= 0 ? Theme.emerald : Theme.red }]}>
              {Math.abs(trend)}%
            </Text>
          </View>
        )}
      </View>

      <View style={styles.metricCardBody}>
        <View style={styles.metricValueContainer}>
          <Text style={[styles.metricValue, { color: iconColor }]}>{value}</Text>
          {unit && <Text style={styles.metricUnit}>{unit}</Text>}
        </View>
        {sparkData && sparkColor && (
          <Sparkline data={sparkData} color={sparkColor} width={90} height={36} />
        )}
      </View>

      {subtitle && <Text style={styles.metricSubtitle}>{subtitle}</Text>}

      {progress !== undefined && progressMax !== undefined && progressColor && (
        <View style={styles.metricProgressContainer}>
          <View style={styles.metricProgressTrack}>
            <LinearGradient
              colors={[progressColor, `${progressColor}80`]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.metricProgressFill, { width: `${Math.min((progress / progressMax) * 100, 100)}%` }]}
            />
          </View>
          <Text style={styles.metricProgressText}>
            {Math.round((progress / progressMax) * 100)}% of goal
          </Text>
        </View>
      )}

      {children}
    </View>
  );
};

// ============================================
// MAIN SCREEN COMPONENT
// ============================================
const HealthTrackMonitorScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"today" | "weekly" | "monthly">("today");
  const [healthData, setHealthData] = useState<HealthTrackData>(createInitialHealthTrackData());
  const [permissionStatus, setPermissionStatus] = useState<HealthPermissionStatus | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string | null>(null);
  const navigation = useNavigation();

  // Original fetch functions
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
      setError(err instanceof Error ? err.message : "Unable to load health data");
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
      setError(err instanceof Error ? err.message : "Unable to connect to health services");
    } finally {
      setIsInitializing(false);
    }
  }, [fetchHealthMetrics]);

  useEffect(() => {
    initializeHealthAccess();
  }, [initializeHealthAccess]);

  // Calculations
  const stepsProgress = Math.round((healthData.daily.steps / healthData.goal.targetSteps) * 100);
  const caloriesProgress = Math.round((healthData.daily.calories / healthData.goal.targetCalories) * 100);
  const weeklyProgressPercent = Math.min(Math.round((healthData.weekly.avgSteps / healthData.goal.targetSteps) * 100), 100);
  const monthlyGoalProgress = Math.min(Math.round((healthData.monthly.totalSteps / (healthData.goal.targetSteps * 30)) * 100), 100);

  const lastSyncDisplay = lastUpdatedAt
    ? new Date(lastUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : "Pending";

  const handleMenuPress = () => {
    navigation.navigate("AllScreensMenu" as never);
  };

  // Mock sparkline data
  const stepsSparkData = [6200, 7500, 8100, 5800, 9200, 7800, healthData.daily.steps];
  const heartRateSparkData = [68, 72, 75, 70, 74, 71, healthData.daily.heartRate];
  const caloriesSparkData = [1500, 1720, 1680, 1590, 1750, 1620, healthData.daily.calories];
  const weeklyBarData = [0.6, 0.8, 0.75, 0.5, 0.9, 0.7, 0.85].map(v => v * healthData.goal.targetSteps);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.bgPrimary} />

      {/* Light Ambient Background */}
      <View style={styles.ambientBg}>
        <LinearGradient
          colors={["rgba(96, 165, 250, 0.05)", "transparent"]}
          style={styles.ambientOrb1}
        />
        <LinearGradient
          colors={["rgba(248, 113, 113, 0.04)", "transparent"]}
          style={styles.ambientOrb2}
        />
        <LinearGradient
          colors={["rgba(52, 211, 153, 0.03)", "transparent"]}
          style={styles.ambientOrb3}
        />
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isInitializing || isRefreshing}
            onRefresh={permissionStatus?.granted ? fetchHealthMetrics : initializeHealthAccess}
            colors={[Theme.blue]}
            tintColor={Theme.blue}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>HEALTH DASHBOARD</Text>
              <Text style={styles.userName}>{healthData.user.name}</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconBtn} onPress={handleMenuPress}>
                <Ionicons name="ellipsis-horizontal" size={20} color={Theme.textSecondary} />
              </TouchableOpacity>
              <View style={styles.avatarContainer}>
                <LinearGradient colors={Theme.blueGradient} style={styles.avatar}>
                  <Ionicons name="person" size={20} color="#fff" />
                </LinearGradient>
                <View style={styles.onlineIndicator} />
              </View>
            </View>
          </View>

          {/* Quick Stats Row */}
          <View style={styles.quickStatsRow}>
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{healthData.user.age}</Text>
              <Text style={styles.quickStatLabel}>Age</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{healthData.user.height}</Text>
              <Text style={styles.quickStatLabel}>Height (cm)</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Text style={styles.quickStatValue}>{healthData.user.weight}</Text>
              <Text style={styles.quickStatLabel}>Weight (kg)</Text>
            </View>
            <View style={styles.quickStatDivider} />
            <View style={styles.quickStat}>
              <Text style={[styles.quickStatValue, { color: Theme.emerald }]}>{healthData.user.bmi}</Text>
              <Text style={styles.quickStatLabel}>BMI</Text>
            </View>
          </View>
        </View>

        {/* Error Banner */}
        {error && (
          <View style={styles.errorBanner}>
            <Ionicons name="alert-circle" size={20} color={Theme.red} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              onPress={permissionStatus?.granted ? fetchHealthMetrics : initializeHealthAccess}
              style={styles.errorBtn}
            >
              <Text style={styles.errorBtnText}>
                {permissionStatus?.granted ? "Retry" : "Grant Access"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Goals Card */}
        <View style={styles.goalsCard}>
          <View style={styles.goalsHeader}>
            <View style={styles.goalsIconBox}>
              <MaterialCommunityIcons name="target" size={20} color={Theme.emerald} />
            </View>
            <Text style={styles.goalsTitle}>Daily Goals</Text>
            <View style={styles.syncBadge}>
              <View style={styles.syncDot} />
              <Text style={styles.syncText}>Synced {lastSyncDisplay}</Text>
            </View>
          </View>

          <View style={styles.goalsGrid}>
            <View style={styles.goalItem}>
              <CircularProgress size={56} strokeWidth={5} progress={healthData.daily.steps} max={healthData.goal.targetSteps} color={Theme.blue}>
                <MaterialCommunityIcons name="walk" size={18} color={Theme.blue} />
              </CircularProgress>
              <Text style={styles.goalValue}>{healthData.goal.targetSteps.toLocaleString()}</Text>
              <Text style={styles.goalLabel}>Steps</Text>
            </View>
            <View style={styles.goalItem}>
              <CircularProgress size={56} strokeWidth={5} progress={healthData.daily.calories} max={healthData.goal.targetCalories} color={Theme.orange}>
                <MaterialCommunityIcons name="fire" size={18} color={Theme.orange} />
              </CircularProgress>
              <Text style={styles.goalValue}>{healthData.goal.targetCalories}</Text>
              <Text style={styles.goalLabel}>Calories</Text>
            </View>
            <View style={styles.goalItem}>
              <CircularProgress size={56} strokeWidth={5} progress={healthData.daily.heartRate} max={healthData.goal.targetHeartRate} color={Theme.red}>
                <MaterialCommunityIcons name="heart-pulse" size={18} color={Theme.red} />
              </CircularProgress>
              <Text style={styles.goalValue}>{healthData.goal.targetHeartRate}</Text>
              <Text style={styles.goalLabel}>Max BPM</Text>
            </View>
            <View style={styles.goalItem}>
              <CircularProgress size={56} strokeWidth={5} progress={healthData.daily.activeMinutes} max={60} color={Theme.emerald}>
                <MaterialCommunityIcons name="clock-fast" size={18} color={Theme.emerald} />
              </CircularProgress>
              <Text style={styles.goalValue}>60</Text>
              <Text style={styles.goalLabel}>Active Min</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {[
            { key: "today", label: "Today" },
            { key: "weekly", label: "This Week" },
            { key: "monthly", label: "This Month" },
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
            {/* Main Metrics Row */}
            <View style={styles.mainMetricsRow}>
              {/* Steps Card - Large */}
              <View style={[styles.heroCard, { flex: 1.2 }]}>
                <LinearGradient
                  colors={["rgba(96, 165, 250, 0.15)", "rgba(96, 165, 250, 0.02)"]}
                  style={styles.heroCardGradient}
                >
                  <View style={styles.heroCardHeader}>
                    <View style={[styles.heroIconBox, { backgroundColor: "rgba(96, 165, 250, 0.2)" }]}>
                      <MaterialCommunityIcons name="walk" size={24} color={Theme.blue} />
                    </View>
                    <View style={styles.heroCardTitleContainer}>
                      <Text style={styles.heroCardTitle}>Steps</Text>
                      <Text style={styles.heroCardDate}>{healthData.daily.date}</Text>
                    </View>
                  </View>

                  <View style={styles.heroValueContainer}>
                    <Text style={[styles.heroValue, { color: Theme.blue }]}>
                      {healthData.daily.steps.toLocaleString()}
                    </Text>
                    <View style={styles.heroTrendBadge}>
                      <Ionicons name="trending-up" size={14} color={Theme.emerald} />
                      <Text style={styles.heroTrendText}>+12%</Text>
                    </View>
                  </View>

                  <View style={styles.heroChartContainer}>
                    <Sparkline data={stepsSparkData} color={Theme.blue} width={screenWidth * 0.35} height={50} />
                  </View>

                  <View style={styles.heroProgressContainer}>
                    <View style={styles.heroProgressHeader}>
                      <Text style={styles.heroProgressLabel}>Daily Goal</Text>
                      <Text style={styles.heroProgressValue}>{stepsProgress}%</Text>
                    </View>
                    <View style={styles.heroProgressTrack}>
                      <LinearGradient
                        colors={[Theme.blue, Theme.blueLight]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.heroProgressFill, { width: `${Math.min(stepsProgress, 100)}%` }]}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* Heart Rate Card */}
              <View style={[styles.heroCard, { flex: 0.8 }]}>
                <LinearGradient
                  colors={["rgba(248, 113, 113, 0.15)", "rgba(248, 113, 113, 0.02)"]}
                  style={styles.heroCardGradient}
                >
                  <View style={styles.heroCardHeader}>
                    <View style={[styles.heroIconBox, { backgroundColor: "rgba(248, 113, 113, 0.2)" }]}>
                      <MaterialCommunityIcons name="heart-pulse" size={22} color={Theme.red} />
                    </View>
                    <View style={styles.liveIndicator}>
                      <View style={styles.liveDot} />
                      <Text style={styles.liveText}>Live</Text>
                    </View>
                  </View>

                  <View style={styles.heartRateContainer}>
                    <CircularProgress
                      size={90}
                      strokeWidth={8}
                      progress={healthData.daily.heartRate}
                      max={180}
                      color={Theme.red}
                    >
                      <Text style={[styles.heartRateValue, { color: Theme.red }]}>
                        {healthData.daily.heartRate}
                      </Text>
                      <Text style={styles.heartRateUnit}>bpm</Text>
                    </CircularProgress>
                  </View>

                  <View style={styles.heartRateStats}>
                    <View style={styles.heartRateStat}>
                      <Ionicons name="arrow-down" size={12} color={Theme.emerald} />
                      <Text style={styles.heartRateStatLabel}>Rest</Text>
                      <Text style={[styles.heartRateStatValue, { color: Theme.emerald }]}>62</Text>
                    </View>
                    <View style={styles.heartRateStat}>
                      <Ionicons name="arrow-up" size={12} color={Theme.red} />
                      <Text style={styles.heartRateStatLabel}>Peak</Text>
                      <Text style={[styles.heartRateStatValue, { color: Theme.red }]}>142</Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            </View>

            {/* Secondary Metrics */}
            <View style={styles.secondaryMetricsGrid}>
              <MetricCard
                icon="fire"
                iconColor={Theme.orange}
                iconBg="rgba(251, 146, 60, 0.15)"
                label="Calories"
                value={healthData.daily.calories.toLocaleString()}
                unit="kcal"
                trend={8}
                sparkData={caloriesSparkData}
                sparkColor={Theme.orange}
                progress={healthData.daily.calories}
                progressMax={healthData.goal.targetCalories}
                progressColor={Theme.orange}
              />
              <MetricCard
                icon="clock-fast"
                iconColor={Theme.emerald}
                iconBg="rgba(52, 211, 153, 0.15)"
                label="Active Minutes"
                value={healthData.daily.activeMinutes}
                unit="min"
                trend={15}
                progress={healthData.daily.activeMinutes}
                progressMax={60}
                progressColor={Theme.emerald}
              >
                <View style={styles.activityBars}>
                  <MiniBarChart data={weeklyBarData} color={Theme.emerald} width={140} height={32} />
                </View>
              </MetricCard>
            </View>

            {/* Status & Vitals Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>TODAY'S STATUS</Text>
              <View style={styles.statusCard}>
                <View style={styles.statusHeader}>
                  <View style={[styles.statusIconBox, { backgroundColor: "rgba(52, 211, 153, 0.15)" }]}>
                    <Ionicons name="checkmark-circle" size={24} color={Theme.emerald} />
                  </View>
                  <View style={styles.statusInfo}>
                    <Text style={styles.statusLabel}>Goal Progress</Text>
                    <Text style={[styles.statusValue, { color: Theme.emerald }]}>{healthData.daily.status}</Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusBadgeText}>{stepsProgress}%</Text>
                  </View>
                </View>

                <View style={styles.vitalsGrid}>
                  <View style={styles.vitalItem}>
                    <MaterialCommunityIcons name="water" size={18} color={Theme.cyan} />
                    <Text style={styles.vitalLabel}>Water</Text>
                    <Text style={styles.vitalValue}>{healthData.daily.waterIntake} glasses</Text>
                  </View>
                  <View style={styles.vitalItem}>
                    <Ionicons name="moon" size={18} color={Theme.purple} />
                    <Text style={styles.vitalLabel}>Sleep</Text>
                    <Text style={styles.vitalValue}>{healthData.daily.sleepHours} hrs</Text>
                  </View>
                  <View style={styles.vitalItem}>
                    <MaterialCommunityIcons name="heart-pulse" size={18} color={Theme.red} />
                    <Text style={styles.vitalLabel}>BP</Text>
                    <Text style={styles.vitalValue}>{healthData.daily.bloodPressure}</Text>
                  </View>
                  <View style={styles.vitalItem}>
                    <MaterialCommunityIcons name="water-outline" size={18} color={Theme.pink} />
                    <Text style={styles.vitalLabel}>Sugar</Text>
                    <Text style={styles.vitalValue}>{healthData.daily.bloodSugar} mg/dL</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Insights Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionTitle}>INSIGHTS</Text>
              <View style={styles.insightsContainer}>
                <View style={styles.insightCard}>
                  <View style={[styles.insightIconBox, { backgroundColor: "rgba(52, 211, 153, 0.15)" }]}>
                    <Text style={styles.insightEmoji}>💪</Text>
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>Great Progress!</Text>
                    <Text style={styles.insightDesc}>You're 15% ahead of your weekly step goal</Text>
                  </View>
                </View>
                <View style={styles.insightCard}>
                  <View style={[styles.insightIconBox, { backgroundColor: "rgba(251, 191, 36, 0.15)" }]}>
                    <Text style={styles.insightEmoji}>🚶</Text>
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>Stay Active</Text>
                    <Text style={styles.insightDesc}>Try to reach 10,000 steps today</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Weekly Tab */}
        {activeTab === "weekly" && (
          <View style={styles.tabContent}>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>WEEKLY OVERVIEW</Text>
                <Text style={styles.sectionDate}>{healthData.weekly.weekStart} - {healthData.weekly.weekEnd}</Text>
              </View>

              {/* Weekly Summary Cards */}
              <View style={styles.weeklySummaryGrid}>
                <View style={styles.weeklySummaryCard}>
                  <LinearGradient
                    colors={["rgba(96, 165, 250, 0.12)", "rgba(96, 165, 250, 0.02)"]}
                    style={styles.weeklySummaryGradient}
                  >
                    <MaterialCommunityIcons name="walk" size={24} color={Theme.blue} />
                    <Text style={[styles.weeklySummaryValue, { color: Theme.blue }]}>
                      {healthData.weekly.avgSteps.toLocaleString()}
                    </Text>
                    <Text style={styles.weeklySummaryLabel}>Avg Steps/Day</Text>
                    <View style={styles.weeklySummaryTrend}>
                      <Ionicons name="trending-up" size={12} color={Theme.emerald} />
                      <Text style={styles.weeklySummaryTrendText}>+8%</Text>
                    </View>
                  </LinearGradient>
                </View>

                <View style={styles.weeklySummaryCard}>
                  <LinearGradient
                    colors={["rgba(251, 146, 60, 0.12)", "rgba(251, 146, 60, 0.02)"]}
                    style={styles.weeklySummaryGradient}
                  >
                    <MaterialCommunityIcons name="fire" size={24} color={Theme.orange} />
                    <Text style={[styles.weeklySummaryValue, { color: Theme.orange }]}>
                      {healthData.weekly.avgCalories.toLocaleString()}
                    </Text>
                    <Text style={styles.weeklySummaryLabel}>Avg Cal/Day</Text>
                    <View style={styles.weeklySummaryTrend}>
                      <Ionicons name="trending-up" size={12} color={Theme.emerald} />
                      <Text style={styles.weeklySummaryTrendText}>+5%</Text>
                    </View>
                  </LinearGradient>
                </View>

                <View style={styles.weeklySummaryCard}>
                  <LinearGradient
                    colors={["rgba(248, 113, 113, 0.12)", "rgba(248, 113, 113, 0.02)"]}
                    style={styles.weeklySummaryGradient}
                  >
                    <MaterialCommunityIcons name="heart-pulse" size={24} color={Theme.red} />
                    <Text style={[styles.weeklySummaryValue, { color: Theme.red }]}>
                      {healthData.weekly.avgHeartRate || 74}
                    </Text>
                    <Text style={styles.weeklySummaryLabel}>Avg BPM</Text>
                    <View style={styles.weeklySummaryTrend}>
                      <Ionicons name="remove" size={12} color={Theme.textMuted} />
                      <Text style={[styles.weeklySummaryTrendText, { color: Theme.textMuted }]}>Stable</Text>
                    </View>
                  </LinearGradient>
                </View>

                <View style={styles.weeklySummaryCard}>
                  <LinearGradient
                    colors={["rgba(52, 211, 153, 0.12)", "rgba(52, 211, 153, 0.02)"]}
                    style={styles.weeklySummaryGradient}
                  >
                    <Ionicons name="fitness" size={24} color={Theme.emerald} />
                    <Text style={[styles.weeklySummaryValue, { color: Theme.emerald }]}>
                      {healthData.weekly.activeDays}/7
                    </Text>
                    <Text style={styles.weeklySummaryLabel}>Active Days</Text>
                    <View style={styles.weeklySummaryTrend}>
                      <Ionicons name="checkmark" size={12} color={Theme.emerald} />
                      <Text style={styles.weeklySummaryTrendText}>On Track</Text>
                    </View>
                  </LinearGradient>
                </View>
              </View>

              {/* Weekly Progress Card */}
              <View style={styles.weeklyProgressCard}>
                <View style={styles.weeklyProgressHeader}>
                  <Text style={styles.weeklyProgressTitle}>Step Goal Progress</Text>
                  <Text style={[styles.weeklyProgressPercent, { color: Theme.emerald }]}>{weeklyProgressPercent}%</Text>
                </View>
                <View style={styles.weeklyProgressTrack}>
                  <LinearGradient
                    colors={[Theme.emerald, Theme.emeraldLight]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.weeklyProgressFill, { width: `${weeklyProgressPercent}%` }]}
                  />
                </View>
                <View style={styles.weeklyProgressStats}>
                  <View style={styles.weeklyProgressStat}>
                    <Text style={styles.weeklyProgressStatLabel}>Total Minutes</Text>
                    <Text style={styles.weeklyProgressStatValue}>{healthData.weekly.totalActiveMinutes}</Text>
                  </View>
                  <View style={styles.weeklyProgressStat}>
                    <Text style={styles.weeklyProgressStatLabel}>Avg Sleep</Text>
                    <Text style={styles.weeklyProgressStatValue}>{healthData.weekly.avgSleep} hrs</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Monthly Tab */}
        {activeTab === "monthly" && (
          <View style={styles.tabContent}>
            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>MONTHLY OVERVIEW</Text>
                <Text style={styles.sectionDate}>{healthData.monthly.month}</Text>
              </View>

              {/* Monthly Hero Card */}
              <View style={styles.monthlyHeroCard}>
                <LinearGradient
                  colors={["rgba(96, 165, 250, 0.15)", "rgba(52, 211, 153, 0.08)"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.monthlyHeroGradient}
                >
                  <View style={styles.monthlyHeroHeader}>
                    <View>
                      <Text style={styles.monthlyHeroLabel}>Total Steps</Text>
                      <Text style={[styles.monthlyHeroValue, { color: Theme.blue }]}>
                        {(healthData.monthly.totalSteps / 1000).toFixed(0)}K
                      </Text>
                    </View>
                    <Sparkline
                      data={[180000, 195000, 210000, 225000, 240000, healthData.monthly.totalSteps]}
                      color={Theme.blue}
                      width={120}
                      height={50}
                    />
                  </View>

                  <View style={styles.monthlyHeroProgress}>
                    <View style={styles.monthlyHeroProgressHeader}>
                      <Text style={styles.monthlyHeroProgressLabel}>Monthly Goal</Text>
                      <Text style={styles.monthlyHeroProgressValue}>{monthlyGoalProgress}%</Text>
                    </View>
                    <View style={styles.monthlyHeroProgressTrack}>
                      <LinearGradient
                        colors={[Theme.blue, Theme.emerald]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[styles.monthlyHeroProgressFill, { width: `${monthlyGoalProgress}%` }]}
                      />
                    </View>
                  </View>
                </LinearGradient>
              </View>

              {/* Monthly Stats Grid */}
              <View style={styles.monthlyStatsGrid}>
                <View style={styles.monthlyStat}>
                  <View style={[styles.monthlyStatIcon, { backgroundColor: "rgba(251, 146, 60, 0.15)" }]}>
                    <MaterialCommunityIcons name="fire" size={20} color={Theme.orange} />
                  </View>
                  <Text style={styles.monthlyStatValue}>{healthData.monthly.avgCalories}</Text>
                  <Text style={styles.monthlyStatLabel}>Avg Cal/Day</Text>
                </View>
                <View style={styles.monthlyStat}>
                  <View style={[styles.monthlyStatIcon, { backgroundColor: "rgba(248, 113, 113, 0.15)" }]}>
                    <MaterialCommunityIcons name="heart-pulse" size={20} color={Theme.red} />
                  </View>
                  <Text style={styles.monthlyStatValue}>{healthData.monthly.avgHeartRate}</Text>
                  <Text style={styles.monthlyStatLabel}>Avg BPM</Text>
                </View>
                <View style={styles.monthlyStat}>
                  <View style={[styles.monthlyStatIcon, { backgroundColor: "rgba(52, 211, 153, 0.15)" }]}>
                    <Ionicons name="fitness" size={20} color={Theme.emerald} />
                  </View>
                  <Text style={styles.monthlyStatValue}>{healthData.monthly.activeDays}</Text>
                  <Text style={styles.monthlyStatLabel}>Active Days</Text>
                </View>
                <View style={styles.monthlyStat}>
                  <View style={[styles.monthlyStatIcon, { backgroundColor: "rgba(167, 139, 250, 0.15)" }]}>
                    <Ionicons name="moon" size={20} color={Theme.purple} />
                  </View>
                  <Text style={styles.monthlyStatValue}>{healthData.monthly.avgSleep}</Text>
                  <Text style={styles.monthlyStatLabel}>Avg Sleep (hrs)</Text>
                </View>
              </View>

              {/* Monthly Insights */}
              <View style={styles.insightsContainer}>
                <View style={styles.insightCard}>
                  <View style={[styles.insightIconBox, { backgroundColor: "rgba(52, 211, 153, 0.15)" }]}>
                    <Text style={styles.insightEmoji}>🎯</Text>
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>Excellent Consistency!</Text>
                    <Text style={styles.insightDesc}>
                      Active {healthData.monthly.activeDays} out of 30 days this month
                    </Text>
                  </View>
                </View>
                <View style={styles.insightCard}>
                  <View style={[styles.insightIconBox, { backgroundColor: "rgba(96, 165, 250, 0.15)" }]}>
                    <Text style={styles.insightEmoji}>📈</Text>
                  </View>
                  <View style={styles.insightContent}>
                    <Text style={styles.insightTitle}>Step Goal Progress</Text>
                    <Text style={styles.insightDesc}>
                      Completed {monthlyGoalProgress}% of your monthly step goal
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Additional Info */}
        <View style={styles.additionalInfoCard}>
          <Text style={styles.sectionTitle}>TRACKING SETTINGS</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Water Tracking</Text>
              <Text style={styles.infoValue}>Daily</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Sleep Tracking</Text>
              <Text style={styles.infoValue}>Enabled</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Activity Level</Text>
              <Text style={styles.infoValue}>Moderate</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Last Sync</Text>
              <Text style={styles.infoValue}>{lastSyncDisplay}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    top: -50,
    right: -30,
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  ambientOrb2: {
    position: "absolute",
    top: 320,
    left: -70,
    width: 160,
    height: 160,
    borderRadius: 80,
  },
  ambientOrb3: {
    position: "absolute",
    bottom: 200,
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
    marginBottom: 24,
  },
  headerLeft: {},
  greeting: {
    fontSize: 11,
    letterSpacing: 2,
    color: Theme.textMuted,
    marginBottom: 4,
  },
  userName: {
    fontSize: 28,
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
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Theme.emerald,
    borderWidth: 2,
    borderColor: Theme.bgPrimary,
  },

  // Quick Stats
  quickStatsRow: {
    flexDirection: "row",
    backgroundColor: Theme.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  quickStat: {
    flex: 1,
    alignItems: "center",
  },
  quickStatValue: {
    fontSize: 20,
    fontWeight: "600",
    color: Theme.textPrimary,
  },
  quickStatLabel: {
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    backgroundColor: Theme.border,
    marginHorizontal: 8,
  },

  // Error Banner
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(248, 113, 113, 0.2)",
    marginBottom: 16,
    gap: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: Theme.red,
  },
  errorBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: Theme.red,
    borderRadius: 8,
  },
  errorBtnText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#fff",
  },

  // Goals Card
  goalsCard: {
    backgroundColor: Theme.bgCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Theme.border,
    marginBottom: 20,
  },
  goalsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  goalsIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  goalsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.textPrimary,
    flex: 1,
  },
  syncBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.bgCardHover,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  syncDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.emerald,
  },
  syncText: {
    fontSize: 11,
    color: Theme.textMuted,
  },
  goalsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  goalItem: {
    alignItems: "center",
  },
  goalValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.textPrimary,
    marginTop: 8,
  },
  goalLabel: {
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 2,
  },

  // Tabs
  tabsContainer: {
    flexDirection: "row",
    backgroundColor: Theme.bgCard,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
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

  // Circular Progress
  circularCenter: {
    justifyContent: "center",
    alignItems: "center",
  },

  // Main Metrics Row
  mainMetricsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  // Hero Card
  heroCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Theme.border,
  },
  heroCardGradient: {
    padding: 18,
  },
  heroCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  heroIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  heroCardTitleContainer: {
    flex: 1,
  },
  heroCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.textPrimary,
  },
  heroCardDate: {
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 2,
  },
  heroValueContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  heroValue: {
    fontSize: 36,
    fontWeight: "300",
    letterSpacing: -1,
  },
  heroTrendBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginLeft: 10,
    marginBottom: 6,
  },
  heroTrendText: {
    fontSize: 12,
    fontWeight: "600",
    color: Theme.emerald,
    marginLeft: 4,
  },
  heroChartContainer: {
    marginBottom: 16,
  },
  heroProgressContainer: {
    marginTop: 8,
  },
  heroProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  heroProgressLabel: {
    fontSize: 12,
    color: Theme.textMuted,
  },
  heroProgressValue: {
    fontSize: 12,
    fontWeight: "600",
    color: Theme.textSecondary,
  },
  heroProgressTrack: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  heroProgressFill: {
    height: "100%",
    borderRadius: 3,
  },

  // Heart Rate Card
  liveIndicator: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(248, 113, 113, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Theme.red,
    marginRight: 6,
  },
  liveText: {
    fontSize: 11,
    fontWeight: "600",
    color: Theme.red,
  },
  heartRateContainer: {
    alignItems: "center",
    marginVertical: 12,
  },
  heartRateValue: {
    fontSize: 28,
    fontWeight: "300",
  },
  heartRateUnit: {
    fontSize: 10,
    color: Theme.textMuted,
    marginTop: -2,
  },
  heartRateStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 8,
  },
  heartRateStat: {
    alignItems: "center",
  },
  heartRateStatLabel: {
    fontSize: 10,
    color: Theme.textMuted,
    marginTop: 2,
  },
  heartRateStatValue: {
    fontSize: 14,
    fontWeight: "600",
  },

  // Secondary Metrics Grid
  secondaryMetricsGrid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  // Metric Card
  metricCard: {
    flex: 1,
    backgroundColor: Theme.bgCard,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  metricCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  metricIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  metricLabel: {
    fontSize: 13,
    color: Theme.textSecondary,
    flex: 1,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  trendText: {
    fontSize: 10,
    fontWeight: "600",
    marginLeft: 2,
  },
  metricCardBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 8,
  },
  metricValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  metricValue: {
    fontSize: 26,
    fontWeight: "300",
  },
  metricUnit: {
    fontSize: 12,
    color: Theme.textMuted,
    marginLeft: 4,
  },
  metricSubtitle: {
    fontSize: 11,
    color: Theme.textMuted,
    marginBottom: 8,
  },
  metricProgressContainer: {
    marginTop: 8,
  },
  metricProgressTrack: {
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 2,
    overflow: "hidden",
  },
  metricProgressFill: {
    height: "100%",
    borderRadius: 2,
  },
  metricProgressText: {
    fontSize: 10,
    color: Theme.textMuted,
    marginTop: 6,
  },
  activityBars: {
    marginTop: 8,
  },

  // Section Container
  sectionContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 11,
    letterSpacing: 2,
    color: Theme.textMuted,
    marginBottom: 12,
  },
  sectionDate: {
    fontSize: 12,
    color: Theme.textMuted,
  },

  // Status Card
  statusCard: {
    backgroundColor: Theme.bgCard,
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  statusIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  statusInfo: {
    flex: 1,
  },
  statusLabel: {
    fontSize: 12,
    color: Theme.textMuted,
  },
  statusValue: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: "rgba(52, 211, 153, 0.15)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 16,
    fontWeight: "700",
    color: Theme.emerald,
  },
  vitalsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  vitalItem: {
    alignItems: "center",
  },
  vitalLabel: {
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 6,
  },
  vitalValue: {
    fontSize: 13,
    fontWeight: "600",
    color: Theme.textPrimary,
    marginTop: 2,
  },

  // Insights
  insightsContainer: {
    gap: 12,
  },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Theme.bgCard,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  insightIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  insightEmoji: {
    fontSize: 20,
  },
  insightContent: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.textPrimary,
    marginBottom: 2,
  },
  insightDesc: {
    fontSize: 12,
    color: Theme.textMuted,
    lineHeight: 16,
  },

  // Weekly Summary
  weeklySummaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 16,
  },
  weeklySummaryCard: {
    flex: 1,
    minWidth: "45%",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Theme.border,
  },
  weeklySummaryGradient: {
    padding: 16,
    alignItems: "center",
  },
  weeklySummaryValue: {
    fontSize: 24,
    fontWeight: "300",
    marginTop: 10,
  },
  weeklySummaryLabel: {
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 4,
  },
  weeklySummaryTrend: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    backgroundColor: "rgba(52, 211, 153, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  weeklySummaryTrendText: {
    fontSize: 10,
    fontWeight: "600",
    color: Theme.emerald,
    marginLeft: 4,
  },

  // Weekly Progress Card
  weeklyProgressCard: {
    backgroundColor: Theme.bgCard,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Theme.border,
  },
  weeklyProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  weeklyProgressTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.textPrimary,
  },
  weeklyProgressPercent: {
    fontSize: 18,
    fontWeight: "700",
  },
  weeklyProgressTrack: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 16,
  },
  weeklyProgressFill: {
    height: "100%",
    borderRadius: 4,
  },
  weeklyProgressStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  weeklyProgressStat: {},
  weeklyProgressStatLabel: {
    fontSize: 11,
    color: Theme.textMuted,
  },
  weeklyProgressStatValue: {
    fontSize: 16,
    fontWeight: "600",
    color: Theme.textPrimary,
    marginTop: 2,
  },

  // Monthly Hero Card
  monthlyHeroCard: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: Theme.border,
    marginBottom: 16,
  },
  monthlyHeroGradient: {
    padding: 20,
  },
  monthlyHeroHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthlyHeroLabel: {
    fontSize: 12,
    color: Theme.textMuted,
  },
  monthlyHeroValue: {
    fontSize: 42,
    fontWeight: "200",
    marginTop: 4,
  },
  monthlyHeroProgress: {},
  monthlyHeroProgressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  monthlyHeroProgressLabel: {
    fontSize: 12,
    color: Theme.textMuted,
  },
  monthlyHeroProgressValue: {
    fontSize: 14,
    fontWeight: "600",
    color: Theme.textSecondary,
  },
  monthlyHeroProgressTrack: {
    height: 6,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 3,
    overflow: "hidden",
  },
  monthlyHeroProgressFill: {
    height: "100%",
    borderRadius: 3,
  },

  // Monthly Stats Grid
  monthlyStatsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 20,
  },
  monthlyStat: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: Theme.bgCard,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Theme.borderLight,
  },
  monthlyStatIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  monthlyStatValue: {
    fontSize: 22,
    fontWeight: "600",
    color: Theme.textPrimary,
  },
  monthlyStatLabel: {
    fontSize: 11,
    color: Theme.textMuted,
    marginTop: 4,
  },

  // Additional Info Card
  additionalInfoCard: {
    backgroundColor: Theme.bgCard,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Theme.border,
    marginBottom: 20,
  },
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
});

export default HealthTrackMonitorScreen;