// restaurantSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "@/services/base";
import { Endpoints } from "@/constants/endpoints";

/** --------------------
 * TYPES
 -------------------- */
interface Review {
  authorName: string;
  authorPhoto?: string;
  rating: number;
  text?: string;
  relativeTime?: string;
}

export interface Restaurant {
  id: string | number;
  placeId: string | number; // ✅ Always have placeId
  name: string;
  address: string;
  photoUrl?: string;
  reviews?: Review[];
  rating?: number;
  badge?: string;
  dietType?: string;
  price?: string;
  distance?: number;
  phone?: string;
  hours?: string;
  website?: string;
  openNow?: boolean;
  googleMapsUri?: string;
  userRatingCount?: number;
}

interface RestaurantState {
  list: Restaurant[];
  selectedRestaurant: Restaurant | null;
  loading: boolean;
  detailLoading: boolean;
  error: string | null;
}

/** --------------------
 * INITIAL STATE
 -------------------- */
const initialState: RestaurantState = {
  list: [],
  selectedRestaurant: null,
  loading: false,
  detailLoading: false,
  error: null,
};

/** --------------------
 * TRANSFORM HELPERS
 -------------------- */
const transformReviews = (reviews: any[]): Review[] =>
  Array.isArray(reviews)
    ? reviews.map((review) => ({
        authorName: review.authorName || review.author_name || "Anonymous",
        authorPhoto: review.authorPhoto || review.author_photo || "",
        rating: review.rating || 0,
        text: review.text || review.review_text || "",
        relativeTime: review.relativeTime || review.relative_time || "",
      }))
    : [];

const transformRestaurant = (item: any, index = 0): Restaurant => {
  let cleanPath = "";
  if (item.photoUrl) {
    const apiIndex = item.photoUrl.indexOf("/api");
    if (apiIndex !== -1) cleanPath = item.photoUrl.substring(apiIndex + 4);
    else cleanPath = item.photoUrl.startsWith("/")
      ? item.photoUrl
      : `/${item.photoUrl}`;
  }

  const fullPhotoUrl =
    cleanPath && cleanPath.length > 0
      ? `${BASE_URL}${cleanPath}`
      : `https://images.unsplash.com/photo-1551218808-94e220e084d2?auto=format&fit=crop&w=800&q=60`;

  const distance = item.distance
    ? Math.round(item.distance)
    : Math.floor(Math.random() * 800) + 200;

  const address = 
    item.address ||
    item.formatted_address ||
    (item.postalAddress?.addressLines?.join(", ") + 
      (item.postalAddress?.locality ? `, ${item.postalAddress.locality}` : "") +
      (item.postalAddress?.administrativeArea ? `, ${item.postalAddress.administrativeArea}` : "") +
      (item.postalAddress?.postalCode ? ` - ${item.postalAddress.postalCode}` : "")) ||
    "Address not available";

  return {
    id: item.id || index,  // fallback id
    placeId: item.placeId || item.id || `generated-${index}`, // ✅ always have placeId
    name: item.name || `Restaurant ${index + 1}`,
    address,
    photoUrl: fullPhotoUrl,
    rating:
      item.rating ||
      item.userRating ||
      parseFloat((Math.random() * 4 + 1).toFixed(1)),
    reviews: transformReviews(item.reviews || []),
    badge: item.badge || "AI Verified",
    dietType:
      item.dietType ||
      (item.servesVegetarian
        ? "Veg"
        : index % 2 === 0
        ? "Veg"
        : "Non-Veg"),
    price: item.price || "$$",
    distance,
    phone:
      item.phone ||
      item.phoneNumber ||
      item.formatted_phone_number ||
      item.nationalPhoneNumber ||
      item.internationalPhoneNumber,
    hours: item.hours || item.opening_hours?.weekday_text?.join(", "),
    website: item.website,
    openNow: item.openNow ?? item.opening_hours?.open_now ?? false,
    googleMapsUri: item.googleMapsUri,
    userRatingCount: item.userRatingCount || item.reviews?.length || 0,
  };
};

/** --------------------
 * ASYNC THUNKS
 -------------------- */

// Fetch nearby restaurants
export const fetchNearbyRestaurants = createAsyncThunk(
  "restaurants/fetchNearby",
  async (
    { latitude, longitude }: { latitude: number; longitude: number },
    { rejectWithValue }
  ) => {
    try {
      const url = `${BASE_URL}${Endpoints.NERA_BY_RESTAURENT.GET_RESTAURENTS}?lat=${latitude}&lng=${longitude}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      const transformed = Array.isArray(data)
        ? data.map((item, i) => transformRestaurant(item, i))
        : [];

      return transformed;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch restaurants");
    }
  }
);

// Fetch restaurant details
export const fetchRestaurantDetails = createAsyncThunk(
  "restaurants/fetchDetails",
  async (placeId: string, { rejectWithValue }) => {
    try {
      const url = `${BASE_URL}/api/places/restaurantDetails/${placeId}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return transformRestaurant(data, 0);
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch details");
    }
  }
);

/** --------------------
 * SLICE
 -------------------- */
const restaurantSlice = createSlice({
  name: "restaurants",
  initialState,
  reducers: {
    clearRestaurants: (state) => {
      state.list = [];
      state.error = null;
    },
    clearSelectedRestaurant: (state) => {
      state.selectedRestaurant = null;
    },
    updateRestaurant: (state, action) => {
      const index = state.list.findIndex(
        (r) => r.id === action.payload.id
      );
      if (index !== -1) {
        state.list[index] = { ...state.list[index], ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNearbyRestaurants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNearbyRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNearbyRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchRestaurantDetails.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
      })
      .addCase(fetchRestaurantDetails.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedRestaurant = action.payload;
      })
      .addCase(fetchRestaurantDetails.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload as string;
      });
  },
});

/** --------------------
 * EXPORTS
 -------------------- */
export const {
  clearRestaurants,
  clearSelectedRestaurant,
  updateRestaurant,
} = restaurantSlice.actions;

export default restaurantSlice.reducer;
