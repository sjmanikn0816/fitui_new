// src/redux/slices/goalCustomizationSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@/redux/store";
import { Config } from "@/constants/config";
import { Endpoints } from "@/constants/endpoints";
import aiApi from "@/services/aiApi";

interface GoalCustomizationPayload {
  birth_year: number;
  birth_month: number;
  weight_lbs: number;
  height_feet: number;
  height_inches: number;
  biological_sex: string;
  activity_level: string;
  food_preference: string;
  target_weight_lbs: number;
  target_weeks: number;
  weight_goal: string;
}

interface GoalCustomizationResponse {
  success: boolean;
  message?: string;
  weight_goal?: string;
  target_weight_lbs?: number;
  target_calories?: number;
  macro_breakdown?: {
    protein: { grams: number; calories: number; percentage: number };
    carbohydrates: { grams: number; calories: number; percentage: number };
    fat: { grams: number; calories: number; percentage: number };
  };
  timeline_details?: {
    daily_calorie_deficit: number;
    estimated_end_date: string;
    estimated_weeks_to_goal: number;
    expected_weekly_loss_lbs: number;
    weekly_deficit: number;
    weight_to_lose_lbs: number;
  };
  nutrition_targets?: {
    calories: number;
    carbs_g: number;
    fat_g: number;
    fiber_g: number;
    protein_g: number;
    sodium_mg: number;
  };
  wellness_guidance?: {
    long_term_sustainability?: string[];
    mental_health?: string[];
    sleep_and_recovery?: string[];
    stress_management?: string[];
  };
  safety_warnings?: string[];
}

interface GoalCustomizationState {
  customization: GoalCustomizationResponse | null;
  loading: boolean;
  error: string | null;
}

export const fetchGoalCustomization = createAsyncThunk<
  GoalCustomizationResponse,
  GoalCustomizationPayload,
  { state: RootState }
>(
  "goalCustomization/fetch",
  async (payload, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const userId =
        state.auth?.user?.userId ||
        state.auth?.user?.userId;

      if (!userId) {
        console.warn("⚠️ No userId found in auth state — cannot save nutrition goal");
      }

      const response = await aiApi.post<GoalCustomizationResponse>(
        Endpoints.GOAL.GOAL_CUSTOMIZATION,
        payload
      );

      if (response.status < 200 || response.status >= 300) {
        const errorMsg =
          (response.data && (response.data as any).message) ||
          "Failed to fetch goal customization";
        return thunkAPI.rejectWithValue(errorMsg);
      }

      const data: GoalCustomizationResponse = response.data;
      console.log("📦 Goal Customization Response:", data);

      // Save to backend if userId exists
      if (userId) {
        try {
          const saveResponse = await fetch(
            `${Config.API_BASE_URL}/addNutritionGoal?userId=${userId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            }
          );

          if (!saveResponse.ok) {
            const err = await saveResponse.text();
            console.warn("⚠️ Failed to store nutrition goal:", err);
          } else {
            console.log("✅ Nutrition goal stored successfully for user:", userId);
          }
        } catch (storageErr: any) {
          console.error("Storage API error:", storageErr.message);
        }
      }

      return data;
    } catch (error: any) {
      console.error("❌ fetchGoalCustomization error:", error);
      return thunkAPI.rejectWithValue(error.message || "Network error");
    }
  }
);


const initialState: GoalCustomizationState = {
  customization: null,
  loading: false,
  error: null,
};

const goalCustomizationSlice = createSlice({
  name: "goalCustomization",
  initialState,
  reducers: {
    clearCustomization: (state) => {
      state.customization = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoalCustomization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGoalCustomization.fulfilled,
        (state, action: PayloadAction<GoalCustomizationResponse>) => {
          state.loading = false;
          state.customization = action.payload;
        }
      )
      .addCase(fetchGoalCustomization.rejected, (state, action: any) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch customization";
      });
  },
});

export const { clearCustomization } = goalCustomizationSlice.actions;
export default goalCustomizationSlice.reducer;
