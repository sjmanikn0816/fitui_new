// src/redux/slices/nutritionGoalSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { Config } from '@/constants/config';
import { token } from '@/services/base';
import { Endpoints } from '@/constants/endpoints';

// Payload for adding nutrition goal
interface AddNutritionGoalPayload {
  birth_year: number;
  birth_month: number;
  weight_lbs: number;
  height_feet: number;
  height_inches: number;
  biological_sex: string;
  activity_level: string;
  food_preference: string;
  target_weight_lbs: number;
  target_weeks?: number;
  weight_goal: string;
}

// Response structure from API
interface NutritionGoalResponse {
  success: boolean;
  message?: string;
  age?: number;
  bmr?: number;
  tdee?: number;
  calculated_at?: string;
  calorie_adjustment?: number;
  weight_goal?: string;
  target_weight_lbs?: number;
  target_calories?: number;
  macro_breakdown?: {
    protein: {
      grams: number;
      calories: number;
      percentage: number;
    };
    carbohydrates: {
      grams: number;
      calories: number;
      percentage: number;
    };
    fat: {
      grams: number;
      calories: number;
      percentage: number;
    };
  };
  nutrition_targets?: {
    calories: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
    protein_g: number;
    sodium_mg: number;
  };
  timeline_details?: {
    daily_calorie_deficit: number;
    estimated_end_date: string;
    estimated_weeks_to_goal: number;
    expected_weekly_loss_lbs: number;
    weekly_deficit: number;
    weight_to_lose_lbs: number;
  } | null;
  nutritional_recommendations?: {
    food_quality?: string[];
    hydration?: string[];
    macronutrient_focus?: string[];
    meal_timing?: string[];
    micronutrients?: string[];
  };
  wellness_guidance?: {
    long_term_sustainability?: string[];
    mental_health?: string[];
    physical_activity?: string[];
    sleep_and_recovery?: string[];
    stress_management?: string[];
  };
  safety_assessment?: {
    blocked_features?: string[];
    recommendations_allowed?: boolean;
    required_professional_consultation?: string[];
    requires_professional_guidance?: boolean;
    risk_level?: string;
    user_category?: string;
  };
  safety_warnings?: string[];
  timestamp?: string;
  target_validity?: any;
  important_notes?: any;
  warnings?: any;
}

interface NutritionGoalState {
  goalData: NutritionGoalResponse | null;
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

// Async thunk for adding nutrition goal
export const addNutritionGoal = createAsyncThunk<
  NutritionGoalResponse,
  AddNutritionGoalPayload
>(
  'nutritionGoal/add',
  async (payload, { rejectWithValue }) => {
    try {
      const response = await fetch(`${Config.AI_BASE_URL}${Endpoints.GOAL.ADD_NUTRITION_GOAL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data: NutritionGoalResponse = await response.json();

      console.log('Nutrition Goal Response:', data);

      if (!response.ok) {
        return rejectWithValue(data.message || 'Failed to add nutrition goal');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const initialState: NutritionGoalState = {
  goalData: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

const nutritionGoalSlice = createSlice({
  name: 'nutritionGoal',
  initialState,
  reducers: {
    clearNutritionGoal: (state) => {
      state.goalData = null;
      state.loading = false;
      state.error = null;
      state.lastUpdated = null;
    },
    updateNutritionGoal: (state, action: PayloadAction<NutritionGoalResponse>) => {
      state.goalData = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addNutritionGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        addNutritionGoal.fulfilled,
        (state, action: PayloadAction<NutritionGoalResponse>) => {
          state.loading = false;
          state.goalData = action.payload;
          state.lastUpdated = new Date().toISOString();
          state.error = null;
        }
      )
      .addCase(addNutritionGoal.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || 'Failed to add nutrition goal';
      });
  },
});

// Selectors
export const selectNutritionGoal = (state: RootState) => state.addNutritionGoal.goalData;
export const selectNutritionGoalLoading = (state: RootState) => state.addNutritionGoal.loading;
export const selectNutritionGoalError = (state: RootState) => state.addNutritionGoal.error;
export const selectMacroBreakdown = (state: RootState) => state.addNutritionGoal.goalData?.macro_breakdown;
export const selectNutritionTargets = (state: RootState) => state.addNutritionGoal.goalData?.nutrition_targets;
export const selectWellnessGuidance = (state: RootState) => state.addNutritionGoal.goalData?.wellness_guidance;
export const selectTargetCalories = (state: RootState) => state.addNutritionGoal.goalData?.target_calories;
export const selectWeightGoal = (state: RootState) => state.addNutritionGoal.goalData?.weight_goal;

export const { clearNutritionGoal, updateNutritionGoal } = nutritionGoalSlice.actions;
export default nutritionGoalSlice.reducer;