import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "@/services/api";
import { Endpoints } from "@/constants/endpoints";
import aiApi from "@/services/aiApi";
import { Config } from "@/constants/config";

// ----------------- Async Thunks -----------------

// Fetch Meal Plan WITH prompt (/meal-suggest endpoint)
export const fetchMealPlan = createAsyncThunk(
  "mealPlan/fetchMealPlan",
  async (payload: any, { rejectWithValue, getState }) => {
    try {
      const state = getState() as any;

      // 1️⃣ Get AI meal plan
      const response = await aiApi.post(Endpoints.MEAL.SUGGEST, payload);
      console.log("📦 Meal Plan Response:", response.data);

      if (response.data === false) {
        return rejectWithValue(response.data);
      }

      // Keep original object (not string)
      const mealPlan = response.data;
   const mealPlandata = response.data.meal_plan;
      // Get User ID
      const userId = state?.auth?.user?.userId;

      // 2️⃣ Save Smart Meal Plan → send real object
    await saveSmartMealPlanAPI(userId, mealPlan);

      // 3️⃣ Return EXACTLY what user requested
      return response.data.meal_plan || response.data;

    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);


// ⬇️ Updated to send userId in params, mealPlan in body
const saveSmartMealPlanAPI = async (userId: number, mealPlan: any) => {
  const response = await api.post(
    `/smartMeal-plan?userId=${userId}`,
    mealPlan,
    {
      headers: { "Content-Type": "application/json" }
    }
  );

  console.log("📥 Smart Meal Saved:", response.data);
  return response.data;  // return full saved meal plan
};



// Fetch Meal Plan WITHOUT prompt (/meal-plan endpoint)
export const fetchMealPlanSimple = createAsyncThunk(
  "mealPlan/fetchMealPlanSimple",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await aiApi.post(Endpoints.MEAL.DAILYPLAN, payload);
      console.log("📦 fetchMealPlanSimple response:", JSON.stringify(response.data, null, 2));
      
      // Handle API response structure
      if (response.data.success === false) {
        return rejectWithValue(response.data);
      }
      
      // Return the actual meal plan data
      return response.data.meal_plan || response.data;
    } catch (error: any) {
      console.error("❌ fetchMealPlanSimple error:", error.response?.data || error.message);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ----------------- Send Meal Plan Email -----------------
export const sendMealPlanEmail = createAsyncThunk(
  "mealPlanEmail/send",
  async (
    payload: { mealPlan: any; name: string; email: string; description?: string; pdfUri?: string },
    thunkAPI
  ) => {
    try {
      const formData = new FormData();
      formData.append("mealPlan", JSON.stringify(payload.mealPlan));
      formData.append("name", payload.name);
      formData.append("email", payload.email);
      if (payload.description) formData.append("description", payload.description);

      if (payload.pdfUri) {
        const fileName = payload.pdfUri.split("/").pop();
        formData.append("file", {
          uri: payload.pdfUri,
          name: fileName,
          type: "application/pdf",
        } as any);
      }

      const response = await axios.post(
        `${Config.API_BASE_URL}${Endpoints.MEAL.SEND_MAIL}`, 
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("Send Meal Plan Email Error:", error.response?.data || error.message);
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchFoodAnalysis = createAsyncThunk(
  "mealPlan/fetchFoodAnalysis",
  async (payload: string | any, { rejectWithValue, getState }) => {
    try {
      const analysisResponse = await aiApi.post(Endpoints.MEAL.ANALYSIS, payload);

      const state = getState() as any;
      const userId = state?.auth?.user?.userId;

      if (userId) {
        try {
          await axios.post(
            `${Config.API_BASE_URL}/food-analysis`,
            { ...analysisResponse.data, userId },
            {
              headers: { "Content-Type": "application/json" },
              timeout: 5000
            }
          );
          console.log('Successfully saved food analysis to local API');
        } catch (error) {
          console.error('Failed to save food analysis:', error);
        }
      }

      return analysisResponse.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchMealSuggestions = createAsyncThunk(
  "mealPlan/fetchMealSuggestions",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await aiApi.post(
        `${Endpoints.MEAL.MEAL_SUGGEST}`,
        payload,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Save Meal Plan to backend (/api/plans)
export const saveMealPlan = createAsyncThunk(
  "mealPlan/saveMealPlan",
  async (
    payload: { mealPlan: any; metadata?: any },
    thunkAPI
  ) => {
    try {
      const state: any = thunkAPI.getState();
      const authUser = state?.auth?.user;
      const userId = authUser?.user?.id || authUser?.id || authUser?.userId;

      const originalPlan = payload?.mealPlan || payload;
      const generationMetadata = {
        ...(originalPlan?.generation_metadata || {}),
        user_id: String(userId || ""),
        request_timestamp:
          (originalPlan?.generation_metadata || {}).request_timestamp ||
          new Date().toISOString(),
      };

      const body = {
        ...originalPlan,
        generation_metadata: generationMetadata,
      };

      const response = await api.post(Endpoints.PLAN.SAVE, body);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || error.message);
    }
  }
);

// ----------------- Slice -----------------
interface MealPlanState {
  data: any | null;
  
  foodAnalysis: any | null;
  suggestions: any | null;
  loading: boolean;
  error: string | null;
  emailLoading: boolean;
  emailSuccess: boolean;
  emailError: string | null;
}

const initialState: MealPlanState = {
  data: null,
  foodAnalysis: null,
  suggestions: null,
  loading: false,
  error: null,
  emailLoading: false,
  emailSuccess: false,
  emailError: null,
};

const mealPlanSlice = createSlice({
  name: "mealPlan",
  initialState,
  reducers: {
    resetEmailState: (state) => {
      state.emailLoading = false;
      state.emailSuccess = false;
      state.emailError = null;
    },
    clearFoodAnalysis: (state) => {
      state.foodAnalysis = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // 🔹 Meal Plan WITH prompt
    builder
      .addCase(fetchMealPlan.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealPlan.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchMealPlan.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        // Handle error object or string
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else if (action.payload && typeof action.payload === 'object') {
          state.error = (action.payload as any)?.message || 
                       (action.payload as any)?.error || 
                       'Failed to fetch meal plan';
        } else {
          state.error = 'An error occurred';
        }
      });

    // 🔹 Meal Plan WITHOUT prompt (Simple)
    builder
      .addCase(fetchMealPlanSimple.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealPlanSimple.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchMealPlanSimple.rejected, (state, action) => {
        state.loading = false;
        state.data = null;
        // Handle error object or string
        if (typeof action.payload === 'string') {
          state.error = action.payload;
        } else if (action.payload && typeof action.payload === 'object') {
          state.error = (action.payload as any)?.message || 
                       (action.payload as any)?.error || 
                       'Failed to fetch meal plan';
        } else {
          state.error = 'An error occurred';
        }
      });

    // 🔹 Food Analysis
    builder
      .addCase(fetchFoodAnalysis.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFoodAnalysis.fulfilled, (state, action) => {
        state.loading = false;
        state.foodAnalysis = action.payload;
      })
      .addCase(fetchFoodAnalysis.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔹 Meal Suggestions
    builder
      .addCase(fetchMealSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMealSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload;
      })
      .addCase(fetchMealSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // 🔹 Send Email
    builder
      .addCase(sendMealPlanEmail.pending, (state) => {
        state.emailLoading = true;
        state.emailSuccess = false;
        state.emailError = null;
      })
      .addCase(sendMealPlanEmail.fulfilled, (state) => {
        state.emailLoading = false;
        state.emailSuccess = true;
      })
      .addCase(sendMealPlanEmail.rejected, (state, action) => {
        state.emailLoading = false;
        state.emailError = action.payload as string;
      });

    // 🔹 Save Meal Plan
    builder
      .addCase(saveMealPlan.pending, (state) => {
        state.error = null;
      })
      .addCase(saveMealPlan.fulfilled, (state) => {
        // no-op; backend persists the plan
      })
      .addCase(saveMealPlan.rejected, (state, action) => {
        state.error = action.payload as string;
      });
      
  },
});

export const { resetEmailState, clearFoodAnalysis, clearError } = mealPlanSlice.actions;
export default mealPlanSlice.reducer;