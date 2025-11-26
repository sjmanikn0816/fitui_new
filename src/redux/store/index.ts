import { configureStore } from "@reduxjs/toolkit";
import authSlice from "../slice/auth/authSlice";
import mealPlanReducer from "../slice/mealPlanSlice";
import healthProfileReducer from "../slice/healthProfileSlice";
import modalReducer from "../slice/modalSlice";
import confirmationReducer from "../slice/conformationSlice";
import restaurantReducer from "../slice/restaurantSlice";
import profileReducer from "../slice/profileSlice";
import goalAssessmentSlice from "../slice/goalAssessmentSlice";
import goalCustomizeSlice from "../slice/goalCustomizationSlice";
import addgoalCustomizeSlice from "../slice/nutritionGoalSlice";
import changePasswordReducer from "../slice/changePasswordSlice"
import restaurantDetailReducer from "../slice/restaurantDetailSlice";

export const store = configureStore({ 
  reducer: {
    auth: authSlice,
    mealPlan: mealPlanReducer,
    healthProfile: healthProfileReducer,
    modal: modalReducer,
    confirmation: confirmationReducer,
    restaurants: restaurantReducer,
    profile: profileReducer,
    changePassword: changePasswordReducer,
   goalAssessment: goalAssessmentSlice,
    goalCustomization: goalCustomizeSlice,
  addNutritionGoal: addgoalCustomizeSlice,
    restaurantDetail: restaurantDetailReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
