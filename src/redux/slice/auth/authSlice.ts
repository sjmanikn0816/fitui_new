import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { Endpoints } from "@/constants/endpoints";
import { BASE_URL } from "@/services/base";
import { getFcmToken } from "@/services/notificationService";
import DeviceInfo from "react-native-device-info";
import { SecureStorage } from "@/services/secureStorage"; // ✅ Use secure storage

/* ------------------------- TYPES ------------------------- */
interface AuthState {
  user: any | null;
  userId: number | null;
  token: string | null;
  refreshToken: string | null;
  signuptoken: string | null;
  loading: boolean;
  authUrl: string | null;
  error: string | null;
  healthCondition: any | null;
  immuneDisorder: any | null;
  neurologicalHealth: any | null;
  cancer: any | null;
  address: any | null;
}

interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age: number;
  heightInFeet: number;
  heightInInches: number;
  gender: string;
  weightInKg: number;
  dietPreference: string;
  isOnDiet: boolean;
  exerciseHabits: string;
  healthAppUsage: string;
  usageFrequency: string;
  isAppHelpful: boolean;
  isSleepMonitoring: boolean;
  travelPercentage: string;
  hasMedicalCondition: boolean;
  watchesDietContent: boolean;
  ethnicity: string;
}

/* ------------------------- LOGIN USER ------------------------- */
export const loginUser = createAsyncThunk<
  {
    token: string;
    refreshToken: string;
    user: any;
    userId: number;
    healthCondition: any;
    immuneDisorder: any;
    neurologicalHealth: any;
    cancer: any;
    address: any;
  },
  { email: string; password: string },
  { rejectValue: string }
>("auth/loginUser", async ({ email, password }, { rejectWithValue }) => {
  try {
    const deviceId = await DeviceInfo.getUniqueId();
    const response = await axios.post(
      `${BASE_URL}${Endpoints.AUTH.LOGIN}`,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": deviceId,
        },
      }
    );
    const data = response.data;
    console.log("AUTH", data.healthCondition)
    console.log("AUTH", data.immuneDisorder)
    console.log("AUTH", data.neurologicalHealth)
    console.log("AUTH", data.cancer)
    return {
      token: data.jwtTokenDTO?.jwtToken,
      refreshToken: data.jwtTokenDTO?.refreshToken,
      user: data.user,
      userId: data.userId,
      healthCondition: data.healthCondition,
      immuneDisorder: data.immuneDisorder,
      neurologicalHealth: data.neurologicalHealth,
      cancer: data.cancer,
      address: data.address,
    };

  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Login failed due to network error"
    );
  }
});

/* ------------------------- SIGNUP USER ------------------------- */
export const signupUser = createAsyncThunk<
  { token: string; refreshToken: string; user: any; userId: number },
  SignUpData,
  { rejectValue: string }
>("auth/signupUser", async (userData, { rejectWithValue }) => {
  try {
    const deviceId = await DeviceInfo.getUniqueId();
    const url = `${BASE_URL}${Endpoints.AUTH.REGISTER}`;

    console.log("📤 SIGNUP REQUEST:");
    console.log("   URL:", url);
    console.log("   Device ID:", deviceId);
    console.log("   Payload:", JSON.stringify(userData, null, 2));

    const response = await axios.post(
      url,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": deviceId,
        },
      }
    );

    console.log("✅ SIGNUP SUCCESS:");
    console.log("   Status:", response.status);
    console.log("   Response:", JSON.stringify(response.data, null, 2));

    const data = response.data;
    return {
      token: data.jwtTokenDTO?.jwtToken,
      refreshToken: data.jwtTokenDTO?.refreshToken,
      user: data.user,
      userId: data.userId,
    };
  } catch (err: any) {
    console.error("❌ SIGNUP ERROR:");
    console.error("   Message:", err.message);
    console.error("   Status:", err.response?.status);
    console.error("   Status Text:", err.response?.statusText);
    console.error("   Response Data:", JSON.stringify(err.response?.data, null, 2));
    console.error("   Request URL:", err.config?.url);
    console.error("   Request Data:", err.config?.data);
    console.error("   Full Error:", err);

    // Skip INVALID_EMAIL error for admin@yxis.com
    const errorCode = err.response?.data?.errorCode;
    if (userData.email === "admin@yxis.com" && errorCode === "INVALID_EMAIL") {
      console.log("⚠️ Skipping INVALID_EMAIL error for admin@yxis.com");
      // Note: Backend still needs to accept this email for signup to work
      return rejectWithValue("Backend needs to be configured to accept admin@yxis.com");
    }

    return rejectWithValue(err.response?.data?.message || err.message);
  }
});

/* ------------------------- GOOGLE AUTH URL ------------------------- */
export const getGoogleAuthUrl = createAsyncThunk<
  string,
  void,
  { rejectValue: string }
>("auth/getGoogleAuthUrl", async (_, { rejectWithValue }) => {
  try {
    const deviceId = await DeviceInfo.getUniqueId();
    const response = await axios.get(
      `${BASE_URL}${Endpoints.AUTH.GOOGLE_LOGIN}`,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Device-ID": deviceId,
        },
      }
    );
    return response.data.authUrl;
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to get Google auth URL"
    );
  }
});

/* ------------------------- LOGOUT USER ------------------------- */
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { getState }) => {
    try {
         
      const state: any = getState();
      let email = state?.auth?.user?.email;
      let refreshToken = state?.auth?.refreshToken;

      if (!email || !refreshToken) {
        const userJsonStr = await SecureStorage.getItem("user");
        const storedRefreshTokenStr = await SecureStorage.getItem("refreshToken");

        if (!email && userJsonStr) {
          const user = JSON.parse(userJsonStr);
          email = user?.email;
        }
        if (!refreshToken && storedRefreshTokenStr) {
          refreshToken = storedRefreshTokenStr;
        }
      }

      if (email && refreshToken) {
        try {
          const deviceId = await DeviceInfo.getUniqueId();
          const url = `${BASE_URL}${Endpoints.AUTH.LOGOUT}?email=${encodeURIComponent(
            email
          )}&refreshToken=${encodeURIComponent(refreshToken)}`;
          await axios.post(url, {}, {
            headers: {
              "Content-Type": "application/json",
              "X-Device-ID": deviceId,
            },
          });
        } catch (err) {
          console.warn("⚠️ Logout API failed:", err);
        }
      }

 
      await Promise.all([
        SecureStorage.removeItem("authToken"),
        SecureStorage.removeItem("refreshToken"),
        SecureStorage.removeItem("user"),
        SecureStorage.removeItem("healthCondition"),
        SecureStorage.removeItem("immuneDisorder"),
        SecureStorage.removeItem("neurologicalHealth"),
        SecureStorage.removeItem("cancer"),
        SecureStorage.removeItem("address"),
        SecureStorage.removeItem("termsAccepted"),
        SecureStorage.removeItem("biometricEnabled"),
      ]);
    }
    catch(error){
          console.error(":x: Logout failed:", error);

    }
  });

/* ------------------------- GOOGLE LOGIN BACKEND ------------------------- */
export const googleLoginBackend = createAsyncThunk<
  { token: string; user: any },
  { code: string; state: string },
  { rejectValue: string }
>("auth/googleLoginBackend", async ({ code, state }, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${BASE_URL}${Endpoints.AUTH.GOOGLE_CALLBACK}?code=${code}&state=${state}`
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || "Google login failed");
  }
});

/* ------------------------- FETCH USER BY ID ------------------------- */
export const fetchUserById = createAsyncThunk<
  {
    user: any;
    healthCondition: any;
    immuneDisorder: any;
    neurologicalHealth: any;
    cancer: any;
    address: any;
  },
  number,
  { rejectValue: string }
>("auth/fetchUserById", async (userId, { getState, rejectWithValue }) => {
  try {
    const state: any = getState();
    const token = state.auth.token;

    if (!token) return rejectWithValue("No auth token found");

    const response = await axios.get(`${BASE_URL}/user/${userId}/export`, {
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;
    console.log("Fetched user by ID:", data);

    return {
      user: data.user_profile,
      healthCondition: data.health_conditions ?? null,
      immuneDisorder: data.immune_disorders ?? null,
      neurologicalHealth: data.neurological_health ?? null,
      cancer: data.cancer_info ?? null,
      address: data.address ?? null,
    };
  } catch (err: any) {
    return rejectWithValue(
      err.response?.data?.message || "Failed to fetch user details by ID"
    );
  }
});

/* ------------------------- INITIAL STATE ------------------------- */
const initialState: AuthState = {
  user: null,
  userId: null,
  token: null,
  refreshToken: null,
  loading: false,
  authUrl: null,
  error: null,
  signuptoken: null,
  healthCondition: null,
  immuneDisorder: null,
  neurologicalHealth: null,
  cancer: null,
  address: null,
};

/* ------------------------- SLICE ------------------------- */
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.authUrl = null;
      state.error = null;
      state.userId = null;
      state.signuptoken = null;
      state.healthCondition = null;
      state.immuneDisorder = null;
      state.neurologicalHealth = null;
      state.cancer = null;
      state.address = null;
    },

    setAuthToken: (state, action) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken || null;
      state.user = action.payload.user || null;
      state.error = null;
    },

    setUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },

    setAddress: (state, action) => {
      state.address = { ...state.address, ...action.payload };
    },

    // i need to continue from tommorow from this place
    setHealthCondition: (state, action) => {
      state.healthCondition = { ...state.healthCondition, ...action.payload };
    },
    setImmuneDisorder: (state, action) => {
      state.immuneDisorder = { ...state.immuneDisorder, ...action.payload }
    },

    updateUserProfile: (state, action) => {
      if (action.payload.user)
        state.user = { ...state.user, ...action.payload.user };
      if (action.payload.address)
        state.address = { ...state.address, ...action.payload.address };
      if (action.payload.healthCondition)
        state.healthCondition = { ...state.healthCondition, ...action.payload.healthCondition };
      if (action.payload.immuneDisorder)
        state.immuneDisorder = { ...state.immuneDisorder, ...action.payload.immuneDisorder };
      if (action.payload.neurologicalHealth)
        state.neurologicalHealth = { ...state.neurologicalHealth, ...action.payload.neurologicalHealth };
      if (action.payload.cancer)
        state.cancer = { ...state.cancer, ...action.payload.cancer };
    },
  },
  extraReducers: (builder) => {
    /* ---------------- LOGIN ---------------- */
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.userId = action.payload.userId;
      state.healthCondition = action.payload.healthCondition;
      state.immuneDisorder = action.payload.immuneDisorder;
      state.neurologicalHealth = action.payload.neurologicalHealth;
      state.cancer = action.payload.cancer;
      state.address = action.payload.address;

  
      Promise.all([
        SecureStorage.setItem("authToken", action.payload.token),
        SecureStorage.setItem("refreshToken", action.payload.refreshToken),
        SecureStorage.setItem("user", JSON.stringify(action.payload.user)),
        SecureStorage.setItem("healthCondition", JSON.stringify(action.payload.healthCondition)),
        SecureStorage.setItem("immuneDisorder", JSON.stringify(action.payload.immuneDisorder)),
        SecureStorage.setItem("neurologicalHealth", JSON.stringify(action.payload.neurologicalHealth)),
        SecureStorage.setItem("cancer", JSON.stringify(action.payload.cancer)),
        SecureStorage.setItem("address", JSON.stringify(action.payload.address)),
      ]);
           if (action.payload.userId) getFcmToken(action.payload.userId);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Login failed";
    });


    /* ---------------- SIGNUP ---------------- */
    builder.addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.userId = action.payload.userId;
      state.signuptoken = action.payload.token;


  
      Promise.all([
        SecureStorage.setItem("authToken", action.payload.token),
        SecureStorage.setItem("refreshToken", action.payload.refreshToken),
        SecureStorage.setItem("user", JSON.stringify(action.payload.user)),
      ]);

      if (action.payload.userId) getFcmToken(action.payload.userId);
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Signup failed";
    });

    /* ---------------- GOOGLE AUTH ---------------- */
    builder.addCase(getGoogleAuthUrl.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getGoogleAuthUrl.fulfilled, (state, action) => {
      state.loading = false;
      state.authUrl = action.payload;
    });
    builder.addCase(getGoogleAuthUrl.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to get Google auth URL";
    });

    /* ---------------- GOOGLE LOGIN ---------------- */
    builder.addCase(googleLoginBackend.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(googleLoginBackend.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.authUrl = null;



      Promise.all([
        SecureStorage.setItem("authToken", action.payload.token),
        SecureStorage.setItem("user", JSON.stringify(action.payload.user)),
      ]);
           if (state.userId) getFcmToken(state.userId);
    });
          builder.addCase(googleLoginBackend.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Google login failed";
    });

    /* ---------------- FETCH USER BY ID ---------------- */
    builder.addCase(fetchUserById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.healthCondition = action.payload.healthCondition;
      state.immuneDisorder = action.payload.immuneDisorder;
      state.neurologicalHealth = action.payload.neurologicalHealth;
      state.cancer = action.payload.cancer;
      state.address = action.payload.address;


      Promise.all([
        SecureStorage.setItem("user", JSON.stringify(action.payload.user)),
        SecureStorage.setItem("healthCondition", JSON.stringify(action.payload.healthCondition)),
        SecureStorage.setItem("immuneDisorder", JSON.stringify(action.payload.immuneDisorder)),
        SecureStorage.setItem("neurologicalHealth", JSON.stringify(action.payload.neurologicalHealth)),
        SecureStorage.setItem("cancer", JSON.stringify(action.payload.cancer)),
        SecureStorage.setItem("address", JSON.stringify(action.payload.address)),
      ]);
    });
        builder.addCase(fetchUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Failed to fetch user details by ID";
    });
  },
  
});

export const { logout, setAuthToken, setUser, setAddress, updateUserProfile } =
  authSlice.actions;

export default authSlice.reducer;