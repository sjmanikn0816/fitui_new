// src/redux/slice/restaurantDetailSlice.ts
import { Config } from "@/constants/config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface Review {
  authorName: string;
  authorPhoto?: string;
  rating: number;
  text?: string;
  relativeTime?: string;
}

interface PostalAddress {
  regionCode?: string;
  postalCode?: string;
  administrativeArea?: string;
  locality?: string;
  addressLines?: string[];
}

interface RestaurantDetail {
  restaurantType?: string[];
  nationalPhoneNumber?: string;
  internationalPhoneNumber?: string;
  servesVegetarian?: boolean;
  reviews?: Review[];
  googleMapsUri?: string;
  openNow?: boolean;
  userRatingCount?: number;
  primaryType?: string;
  postalAddress?: PostalAddress;
}

interface RestaurantDetailState {
  data: RestaurantDetail | null;
  loading: boolean;
  error: string | null;
}

const initialState: RestaurantDetailState = {
  data: null,
  loading: false,
  error: null,
};


export const fetchRestaurantDetails = createAsyncThunk<
  RestaurantDetail,
  string
>("restaurantDetail/fetchByPlaceId", async (placeId, { rejectWithValue }) => {
  try {
    const response = await axios.get(
      `${Config.API_BASE_URL}/places/restaurantDetails/${placeId}`
    );
    return response.data;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch restaurant details"
    );
  }
});

const restaurantDetailSlice = createSlice({
  name: "restaurantDetail",
  initialState,
  reducers: {
    clearRestaurantDetail: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRestaurantDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchRestaurantDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRestaurantDetail } = restaurantDetailSlice.actions;
export default restaurantDetailSlice.reducer;
