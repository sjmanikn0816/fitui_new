import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '@/redux/store';
import { token } from '@/services/base';
import { Config } from '@/constants/config';
import { Endpoints } from '@/constants/endpoints';
import aiApi from '@/services/aiApi';
// Type definitions for user payload
interface HealthConditions {
  [key: string]: boolean | null;
}
interface GoalAssessmentPayload {
  birth_year: number;
  birth_month: number;
  weight_lbs: number;
  height_feet: number;
  height_inches: number;
  biological_sex: string;
  activity_level: string;
  food_preference: string;
  primary_goal: string;
  health_conditions: HealthConditions;
}
// Type for API response (simplified)
interface GoalAssessmentResponse {
  success: boolean;
  user_assessment?: {
    current_bmi: number;
    bmi_category: string;
    health_risk_level: string;
  };
  bmr?: number;
  tdee?: number;
  recommended_timeline?: {
    target_weight_lbs: number;
    weight_change_lbs: number;
    timeline_weeks: number;
    weekly_rate: number;
    weight_loss_rate: string;
    focus_areas: string[];
    expected_outcomes: string[];
    nutrition_emphasis: string;
    exercise_emphasis: string;
  };
  important_notes?: string[];
  [key: string]: any; // allow extra fields
}
// Slice state
interface GoalAssessmentState {
  assessment: GoalAssessmentResponse | null;
  loading: boolean;
  error: string | null;
}
// Async thunk
export const fetchGoalAssessment = createAsyncThunk<
  GoalAssessmentResponse,
  GoalAssessmentPayload,
  { state: RootState }
>(
  'goalAssessment/fetch',
  async (payload, { rejectWithValue, getState }) => {
    try {
  const response = await aiApi.post(
        `${Endpoints.GOAL.GOAL_ASSESMENT}`, payload
      );
      const data: GoalAssessmentResponse = response.data;
      console.log(':inbox_tray: Goal Assessment Response:', data);
      if (response.status < 200 || response.status >= 300) {
        return rejectWithValue((data && (data as any).message) || 'Failed to fetch goal assessment');
      }
      return data;
    } catch (error: any) {
      console.error(':warning: Goal Assessment Error:', error);
      return rejectWithValue(error.message || 'Network error');
    }
  }
);
// Slice
const initialState: GoalAssessmentState = {
  assessment: null,
  loading: false,
  error: null,
};
const goalAssessmentSlice = createSlice({
  name: 'goalAssessment',
  initialState,
  reducers: {
    clearAssessment: (state) => {
      state.assessment = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoalAssessment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchGoalAssessment.fulfilled,
        (state, action: PayloadAction<GoalAssessmentResponse>) => {
          state.loading = false;
          state.assessment = action.payload || null;
        }
      )
      .addCase(
        fetchGoalAssessment.rejected,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.error = action.payload || 'Failed to fetch assessment';
        }
      );
  },
});
export const { clearAssessment } = goalAssessmentSlice.actions;
export default goalAssessmentSlice.reducer;







