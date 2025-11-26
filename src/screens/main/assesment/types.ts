export interface Timeline {
  approach_name: string;
  target_weight_lbs: number;
  weight_change_lbs: number;
  timeline_weeks: number;
  weekly_rate: number;
  weight_goal: string;
  weight_loss_rate?: string;
  difficulty_level: string;
  focus_areas?: string[];
  expected_outcomes?: string[];
  nutrition_emphasis?: string;
  exercise_emphasis?: string;
}

export interface UserAssessment {
  current_bmi: number;
  bmi_category: string;
  health_risk_level: string;
  medical_supervision_recommended: boolean;
}

export interface SafetyAssessment {
  risk_level: string;
  user_category?: string;
  recommendations_allowed?: boolean;
  requires_professional_guidance?: boolean;
}

export interface Assessment {
  success: boolean;
  weight_lbs: number;
  age: number;
  tdee: number;
  bmr: number;
  user_assessment: UserAssessment;
  safety_assessment?: SafetyAssessment;
  recommended_timeline?: Timeline;
  available_timelines?: Timeline[];
  important_notes?: string[];
}

export interface MacroBreakdown {
  protein: { grams: number; percentage: number };
  carbohydrates: { grams: number; percentage: number };
  fat: { grams: number; percentage: number };
}

export interface NutritionTargets {
  fiber_g: number;
  sodium_mg: number;
}

export interface TimelineDetails {
  weight_to_lose_lbs?: number;
  weight_to_gain_lbs?: number;
  weight_to_maintain_lbs?: number;
  expected_weekly_loss_lbs?: number;
  expected_weekly_gain_lbs?: number;
  expected_weekly_maintain_lbs?: number;
  estimated_end_date: string;
}

export interface WellnessGuidance {
  mental_health: string[];
  sleep_and_recovery: string[];
  stress_management: string[];
  long_term_sustainability: string[];
}

export interface Customization {
  success: boolean;
  target_calories: number;
  calorie_adjustment: number;
  weight_lbs: number;
  target_weight_lbs: number;
  macro_breakdown: MacroBreakdown;
  nutrition_targets: NutritionTargets;
  timeline_details: TimelineDetails;
  wellness_guidance: WellnessGuidance;
  safety_assessment: { risk_level: string };
  goal?: string;
}