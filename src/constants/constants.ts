import { moderateScale } from "@/utils/responsive";

export const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#6366F1",
  white: "#FFFFFF",
  background: "#F8F9FA",
  cardBg: "#FFFFFF",
  textPrimary: "#1F2937",
  textSecondary: "#6B7280",
  textTertiary: "#9CA3AF",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",

  statAge: { bg: "#DBEAFE", text: "#2563EB" },
  statWeight: { bg: "#F3E8FF", text: "#9333EA" },
  statBMI: { bg: "#DCFCE7", text: "#16A34A" },
  statTDEE: { bg: "#FED7AA", text: "#EA580C" },
};

export const FONT = {
  xs: moderateScale(10),
  sm: moderateScale(12),
  base: moderateScale(14),
  lg: moderateScale(16),
  xl: moderateScale(18),
  xxl: moderateScale(22),
  xxxl: moderateScale(28),
};

export const ACTIVITY_LEVELS = [
  { id: "NOT_ACTIVE", label: "Not Active" },
  { id: "SOMEWHAT_ACTIVE", label: "Somewhat Active" },
  { id: "ACTIVE", label: "Active" },
  { id: "VERY_ACTIVE", label: "Very Active" },
  { id: "EXTRA_ACTIVE", label: "Athletic" },
  { id: "PRO_ATHLETE", label: "Pro Athlete" },
];

export const GOAL_MAP: Record<string, string> = {
  LOSE: "lose_weight",
  GAIN: "gain_weight",
  MAINTAIN: "lifestyle_management",
};

export const WEIGHT_GOAL_MAP: Record<string, string> = {
  LOSE: "lose",
  GAIN: "gain",
  MAINTAIN: "lifestyle_management",
};