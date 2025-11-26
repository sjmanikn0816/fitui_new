import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  SlideInRight,
} from "react-native-reanimated";
import { Ionicons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import Svg, { Path, Circle, Line, Rect, Defs, LinearGradient as SvgLinearGradient, Stop } from "react-native-svg";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Futuristic color palette
const COLORS = {
  background: "#0a0e1a",
  cardBg: "#111827",
  cardBorder: "#1f2937",
  cyan: "#00d4ff",
  cyanGlow: "rgba(0, 212, 255, 0.3)",
  orange: "#ff6b35",
  orangeGlow: "rgba(255, 107, 53, 0.3)",
  lime: "#84cc16",
  limeGlow: "rgba(132, 204, 22, 0.3)",
  purple: "#a855f7",
  purpleGlow: "rgba(168, 85, 247, 0.3)",
  textPrimary: "#ffffff",
  textSecondary: "#94a3b8",
  textMuted: "#64748b",
};

// Mini Line Graph Component
const MiniLineGraph = ({ data, color, width = 80, height = 30 }: { data: number[], color: string, width?: number, height?: number }) => {
  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal || 1;

  const points = data.map((val, idx) => {
    const x = (idx / (data.length - 1)) * width;
    const y = height - ((val - minVal) / range) * height * 0.8 - height * 0.1;
    return `${x},${y}`;
  }).join(" ");

  return (
    <Svg width={width} height={height}>
      <Defs>
        <SvgLinearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <Stop offset="100%" stopColor={color} stopOpacity="0" />
        </SvgLinearGradient>
      </Defs>
      <Path
        d={`M 0,${height} L ${points} L ${width},${height} Z`}
        fill={`url(#grad-${color})`}
      />
      <Path
        d={`M ${points}`}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

// Animated Progress Ring
const ProgressRing = ({ progress, color, size = 60, strokeWidth = 4 }: { progress: number, color: string, size?: number, strokeWidth?: number }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#1f2937"
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

// Hexagonal Background Pattern
const HexPattern = () => (
  <View style={styles.hexPatternContainer}>
    {[...Array(15)].map((_, i) => (
      <View key={i} style={[styles.hexDot, {
        left: `${(i % 5) * 25}%`,
        top: `${Math.floor(i / 5) * 35}%`,
        opacity: 0.03 + (i % 3) * 0.02
      }]} />
    ))}
  </View>
);

// Daily Progress Card Component
const DailyProgressCard = ({
  title,
  value,
  unit,
  target,
  icon,
  color,
  glowColor,
  graphData,
  delay = 0
}: {
  title: string;
  value: number;
  unit: string;
  target: number;
  icon: string;
  color: string;
  glowColor: string;
  graphData: number[];
  delay?: number;
}) => {
  const progress = Math.min((value / target) * 100, 100);
  const pulseAnim = useSharedValue(1);

  useEffect(() => {
    pulseAnim.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseAnim.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.duration(600).delay(delay).easing(Easing.bezier(0.25, 0.1, 0.25, 1))}
      style={styles.progressCard}
    >
      <LinearGradient
        colors={[COLORS.cardBg, "#0d1117"]}
        style={styles.progressCardGradient}
      >
        {/* Glow effect */}
        <View style={[styles.cardGlow, { backgroundColor: glowColor }]} />

        {/* Header */}
        <View style={styles.progressCardHeader}>
          <Animated.View style={[styles.iconContainer, { backgroundColor: glowColor }, pulseStyle]}>
            <MaterialCommunityIcons name={icon as any} size={20} color={color} />
          </Animated.View>
          <Text style={styles.progressCardTitle}>{title}</Text>
        </View>

        {/* Value */}
        <View style={styles.valueContainer}>
          <Text style={[styles.progressValue, { color }]}>{value.toLocaleString()}</Text>
          <Text style={styles.progressUnit}>{unit}</Text>
        </View>

        {/* Progress bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBarBg}>
            <LinearGradient
              colors={[color, glowColor]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressBarFill, { width: `${progress}%` }]}
            />
          </View>
          <Text style={styles.progressTarget}>{Math.round(progress)}%</Text>
        </View>

        {/* Mini graph */}
        <View style={styles.miniGraphContainer}>
          <MiniLineGraph data={graphData} color={color} width={100} height={25} />
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Calorie Balance Gauge Component
const CalorieBalanceGauge = ({ intake, burned }: { intake: number, burned: number }) => {
  const total = intake + burned;
  const intakePercent = (intake / total) * 100;
  const balance = intake - burned;

  const animProgress = useSharedValue(0);

  useEffect(() => {
    animProgress.value = withDelay(400, withTiming(1, { duration: 1200, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }));
  }, []);

  return (
    <Animated.View
      entering={FadeInUp.duration(600).delay(300).easing(Easing.bezier(0.25, 0.1, 0.25, 1))}
      style={styles.calorieCard}
    >
      <LinearGradient
        colors={[COLORS.cardBg, "#0d1117"]}
        style={styles.calorieCardGradient}
      >
        <View style={[styles.cardGlow, { backgroundColor: COLORS.orangeGlow, top: -20, right: -20 }]} />

        <Text style={styles.sectionTitle}>Calorie Balance</Text>

        {/* Main gauge */}
        <View style={styles.gaugeContainer}>
          <View style={styles.gaugeBg}>
            {/* Intake segment (orange) */}
            <LinearGradient
              colors={[COLORS.orange, "#ff8f5a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gaugeSegment, { width: `${intakePercent}%` }]}
            />
            {/* Burned segment (cyan) */}
            <LinearGradient
              colors={[COLORS.cyan, "#5ce1ff"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.gaugeSegment, { width: `${100 - intakePercent}%` }]}
            />
          </View>

          {/* Center indicator */}
          <View style={styles.gaugeIndicator}>
            <View style={styles.indicatorLine} />
          </View>
        </View>

        {/* Labels */}
        <View style={styles.gaugeLabels}>
          <View style={styles.gaugeLabelItem}>
            <View style={[styles.labelDot, { backgroundColor: COLORS.orange }]} />
            <Text style={styles.labelText}>Intake</Text>
            <Text style={[styles.labelValue, { color: COLORS.orange }]}>{intake.toLocaleString()}</Text>
          </View>

          <View style={styles.balanceDisplay}>
            <Text style={styles.balanceLabel}>Balance</Text>
            <Text style={[styles.balanceValue, { color: balance >= 0 ? COLORS.lime : COLORS.cyan }]}>
              {balance >= 0 ? "+" : ""}{balance.toLocaleString()} cal
            </Text>
          </View>

          <View style={styles.gaugeLabelItem}>
            <View style={[styles.labelDot, { backgroundColor: COLORS.cyan }]} />
            <Text style={styles.labelText}>Burned</Text>
            <Text style={[styles.labelValue, { color: COLORS.cyan }]}>{burned.toLocaleString()}</Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

// Macro Nutrient Card
const MacroCard = ({
  name,
  current,
  target,
  unit,
  color,
  icon,
  delay = 0
}: {
  name: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  icon: string;
  delay?: number;
}) => {
  const progress = Math.min((current / target) * 100, 100);

  return (
    <Animated.View
      entering={SlideInRight.duration(500).delay(delay).easing(Easing.bezier(0.25, 0.1, 0.25, 1))}
      style={styles.macroCard}
    >
      <LinearGradient
        colors={[COLORS.cardBg, "#0d1117"]}
        style={styles.macroCardGradient}
      >
        <View style={styles.macroHeader}>
          <View style={[styles.macroIcon, { backgroundColor: `${color}20` }]}>
            <Feather name={icon as any} size={16} color={color} />
          </View>
          <Text style={styles.macroName}>{name}</Text>
        </View>

        <View style={styles.macroProgressRing}>
          <ProgressRing progress={progress} color={color} size={50} strokeWidth={4} />
          <View style={styles.macroRingCenter}>
            <Text style={[styles.macroPercent, { color }]}>{Math.round(progress)}%</Text>
          </View>
        </View>

        <Text style={styles.macroValue}>{current}{unit}</Text>
        <Text style={styles.macroTarget}>/ {target}{unit}</Text>
      </LinearGradient>
    </Animated.View>
  );
};

// Quick Stats Row
const QuickStatsRow = () => (
  <Animated.View
    entering={FadeIn.duration(600).delay(600)}
    style={styles.quickStatsRow}
  >
    <View style={styles.quickStat}>
      <Ionicons name="water" size={18} color={COLORS.cyan} />
      <Text style={styles.quickStatValue}>2.4L</Text>
      <Text style={styles.quickStatLabel}>Water</Text>
    </View>
    <View style={styles.quickStatDivider} />
    <View style={styles.quickStat}>
      <Ionicons name="heart" size={18} color="#ef4444" />
      <Text style={styles.quickStatValue}>72</Text>
      <Text style={styles.quickStatLabel}>BPM</Text>
    </View>
    <View style={styles.quickStatDivider} />
    <View style={styles.quickStat}>
      <MaterialCommunityIcons name="fire" size={18} color={COLORS.orange} />
      <Text style={styles.quickStatValue}>7</Text>
      <Text style={styles.quickStatLabel}>Streak</Text>
    </View>
  </Animated.View>
);

const FuturisticStatsScreen = () => {
  // Sample data - in production, this would come from props/state
  const dailyProgress = {
    steps: { value: 8432, target: 10000, data: [2100, 4300, 6200, 7800, 8432, 6100, 8200] },
    activity: { value: 45, target: 60, data: [20, 35, 42, 38, 45, 30, 55] },
    sleep: { value: 7.2, target: 8, data: [6.5, 7.1, 6.8, 7.5, 7.2, 8.1, 6.9] },
  };

  const calorieData = {
    intake: 1850,
    burned: 2100,
  };

  const macros = {
    protein: { current: 95, target: 120 },
    carbs: { current: 180, target: 250 },
    fat: { current: 55, target: 70 },
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      <HexPattern />

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <Animated.View
          entering={FadeInDown.duration(500)}
          style={styles.header}
        >
          <View>
            <Text style={styles.headerGreeting}>Good Morning</Text>
            <Text style={styles.headerTitle}>Your Stats</Text>
          </View>
          <View style={styles.headerRight}>
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>LIVE</Text>
            </View>
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <QuickStatsRow />

        {/* Daily Progress Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Progress</Text>
          <View style={styles.progressGrid}>
            <DailyProgressCard
              title="Steps"
              value={dailyProgress.steps.value}
              unit="steps"
              target={dailyProgress.steps.target}
              icon="walk"
              color={COLORS.cyan}
              glowColor={COLORS.cyanGlow}
              graphData={dailyProgress.steps.data}
              delay={100}
            />
            <DailyProgressCard
              title="Activity"
              value={dailyProgress.activity.value}
              unit="min"
              target={dailyProgress.activity.target}
              icon="lightning-bolt"
              color={COLORS.orange}
              glowColor={COLORS.orangeGlow}
              graphData={dailyProgress.activity.data}
              delay={200}
            />
            <DailyProgressCard
              title="Sleep"
              value={dailyProgress.sleep.value}
              unit="hrs"
              target={dailyProgress.sleep.target}
              icon="power-sleep"
              color={COLORS.purple}
              glowColor={COLORS.purpleGlow}
              graphData={dailyProgress.sleep.data}
              delay={300}
            />
          </View>
        </View>

        {/* Calorie Balance */}
        <CalorieBalanceGauge intake={calorieData.intake} burned={calorieData.burned} />

        {/* Macronutrients */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Macronutrients</Text>
          <View style={styles.macroRow}>
            <MacroCard
              name="Protein"
              current={macros.protein.current}
              target={macros.protein.target}
              unit="g"
              color="#ef4444"
              icon="zap"
              delay={400}
            />
            <MacroCard
              name="Carbs"
              current={macros.carbs.current}
              target={macros.carbs.target}
              unit="g"
              color={COLORS.cyan}
              icon="droplet"
              delay={500}
            />
            <MacroCard
              name="Fat"
              current={macros.fat.current}
              target={macros.fat.target}
              unit="g"
              color={COLORS.orange}
              icon="sun"
              delay={600}
            />
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  hexPatternContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: "hidden",
  },
  hexDot: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.cyan,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  headerGreeting: {
    fontSize: 14,
    color: COLORS.textSecondary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 212, 255, 0.15)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0, 212, 255, 0.3)",
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.cyan,
    marginRight: 6,
  },
  liveText: {
    fontSize: 10,
    fontWeight: "700",
    color: COLORS.cyan,
    letterSpacing: 1,
  },
  quickStatsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  quickStat: {
    alignItems: "center",
  },
  quickStatValue: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 4,
  },
  quickStatLabel: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  quickStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: COLORS.cardBorder,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  progressGrid: {
    gap: 12,
  },
  progressCard: {
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
  },
  progressCardGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    position: "relative",
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    top: -30,
    right: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    opacity: 0.5,
  },
  progressCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  progressCardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textSecondary,
    letterSpacing: 0.5,
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 12,
  },
  progressValue: {
    fontSize: 32,
    fontWeight: "700",
  },
  progressUnit: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginLeft: 6,
  },
  progressBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  progressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: "#1f2937",
    borderRadius: 3,
    overflow: "hidden",
    flexDirection: "row",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  progressTarget: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginLeft: 10,
    minWidth: 35,
    textAlign: "right",
  },
  miniGraphContainer: {
    alignItems: "flex-end",
    marginTop: 4,
  },
  // Calorie Gauge Styles
  calorieCard: {
    marginBottom: 24,
    borderRadius: 16,
    overflow: "hidden",
  },
  calorieCardGradient: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    position: "relative",
    overflow: "hidden",
  },
  gaugeContainer: {
    marginVertical: 20,
    position: "relative",
  },
  gaugeBg: {
    height: 16,
    backgroundColor: "#1f2937",
    borderRadius: 8,
    overflow: "hidden",
    flexDirection: "row",
  },
  gaugeSegment: {
    height: "100%",
  },
  gaugeIndicator: {
    position: "absolute",
    top: -4,
    left: "50%",
    marginLeft: -1,
    alignItems: "center",
  },
  indicatorLine: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.textPrimary,
    borderRadius: 1,
  },
  gaugeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gaugeLabelItem: {
    alignItems: "center",
  },
  labelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginBottom: 4,
  },
  labelText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginBottom: 2,
  },
  labelValue: {
    fontSize: 16,
    fontWeight: "700",
  },
  balanceDisplay: {
    alignItems: "center",
    backgroundColor: "rgba(132, 204, 22, 0.1)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  balanceLabel: {
    fontSize: 10,
    color: COLORS.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  // Macro Styles
  macroRow: {
    flexDirection: "row",
    gap: 12,
  },
  macroCard: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  macroCardGradient: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    alignItems: "center",
  },
  macroHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  macroIcon: {
    width: 24,
    height: 24,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
  },
  macroName: {
    fontSize: 12,
    fontWeight: "600",
    color: COLORS.textSecondary,
  },
  macroProgressRing: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  macroRingCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  macroPercent: {
    fontSize: 12,
    fontWeight: "700",
  },
  macroValue: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
  macroTarget: {
    fontSize: 11,
    color: COLORS.textMuted,
  },
});

export default FuturisticStatsScreen;
