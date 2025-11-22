import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { HealthCondition } from "@/types";
import { Endpoints } from "@/constants/endpoints";
import { RootState } from "@/redux/store";
import { use } from "react";
import api from "@/services/api";

const buildBody = (userId: number, conditions: HealthCondition[]) => {
  const body: any = { userId: userId };
  conditions.forEach((c) => {
    body[c.key] = c.selected;
  });
  return body;
};

interface HealthProfileState {
  loading: boolean;
  error: string | null;
}

const initialState: HealthProfileState = {
  loading: false,
  error: null,
};

// Submit general health conditions
export const submitHealthConditions = createAsyncThunk<
  any,
  HealthCondition[],
  { state: RootState; rejectValue: string }
>("healthProfile/submitHealthConditions", async (conditions, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
const userId = state.auth.user?.userId;

      console.log("Full auth state:", state.auth);
   
    if (!userId) throw new Error("User not logged in");

    const res = await api.post(`${Endpoints.HEALTH.ADD_HEALTH_CONDITION}`,
      buildBody(userId, conditions)
    );
    console.log(res.data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data || err.message || "Error"
    );
  }
});

// Submit immune disorders
export const submitImmuneDisorders = createAsyncThunk<
  any,
  HealthCondition[],
  { state: RootState; rejectValue: string }
>("healthProfile/submitImmuneDisorders", async (conditions, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
const userId = state.auth.user?.userId;

    if (!userId) throw new Error("User not logged in");

    const res = await api.post(
      `${Endpoints.HEALTH.ADD_IMMUNE_DISORDER}`,
      buildBody(userId, conditions)
    );
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data || err.message || "Error"
    );
  }
});

// Submit cancer conditions
export const submitCancerConditions = createAsyncThunk<
  any,
  HealthCondition[],
  { state: RootState; rejectValue: string }
>("healthProfile/submitCancerConditions", async (conditions, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
const userId = state.auth.user?.userId;

    if (!userId) throw new Error("User not logged in");

    const res = await api.post(
      `${Endpoints.HEALTH.ADD_CANCER}`,
      buildBody(userId, conditions)
    );
    console.log(res.data);
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data || err.message || "Error"
    );
  }
});

// Submit neurological & mental health conditions
export const submitNeurologicalAndMentalHealth = createAsyncThunk<
  any,
  HealthCondition[],
  { state: RootState; rejectValue: string }
>(
  "healthProfile/submitNeurologicalAndMentalHealth",
  async (conditions, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
const userId = state.auth.user?.userId;

      if (!userId) throw new Error("User not logged in");

      const res = await api.post(
        `${Endpoints.HEALTH.ADD_NEURO_MENTAL}`,
        buildBody(userId, conditions)
      );
      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || err.message || "Error"
      );
    }
  }
);

// Submit food allergies
export const submitFoodAllergies = createAsyncThunk<
  any,
  HealthCondition[],
  { state: RootState; rejectValue: string }
>("healthProfile/submitFoodAllergies", async (conditions, thunkAPI) => {
  try {
    const state = thunkAPI.getState();
const userId = state.auth.user?.id;


    if (!userId) throw new Error("User not logged in");

    const res = await api.post(
      `${Endpoints.HEALTH.ADD_FOOD_ALLERGIES}`,
      buildBody(userId, conditions)
    );
    return res.data;
  } catch (err: any) {
    return thunkAPI.rejectWithValue(
      err.response?.data || err.message || "Error"
    );
  }
});

// ------------------ Slice ------------------

const healthProfileSlice = createSlice({
  name: "healthProfile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    const handle = (thunk: any) => {
      builder
        .addCase(thunk.pending, (s) => {
          s.loading = true;
          s.error = null;
        })
        .addCase(thunk.fulfilled, (s) => {
          s.loading = false;
        })
        .addCase(thunk.rejected, (s, a) => {
          s.loading = false;
          s.error = a.payload as string;
        });
    };

    handle(submitHealthConditions);
    handle(submitImmuneDisorders);
    handle(submitCancerConditions);
    handle(submitNeurologicalAndMentalHealth);
    handle(submitFoodAllergies);
  },
});

export default healthProfileSlice.reducer;
