export const Endpoints = {
  AUTH: {
    LOGIN: `/login`,
    REGISTER: `/userSignup`,
    GOOGLE_LOGIN: `/oauth/google/login`,
    GOOGLE_CALLBACK: `/oauth/google/callback`,
    APPLE_LOGIN: "/oauth/apple/login",
    REFRESH: "/refresh",
    LOGOUT: "/logout",
    EMAIL_EXIST:'/oauth/isEmailExists'
  },
  USER: {
    PROFILE: `/user/profile`,
    UPDATE: `/user/update`,
    EDIT_USER: `/updateProfile/`,
    CHANGE_PASSWORD: `/changePassword`,
    DELETE: `/user/`
  },
  HEALTH: {
    ADD_HEALTH_CONDITION: `/addHealthCondition`,
    ADD_IMMUNE_DISORDER: `/addImmuneAndAutoImmuneDisorder`,
    ADD_CANCER: `/addCancer`,
    ADD_NEURO_MENTAL: `/addNeurologicalAndMentalHealth`,
    ADD_FOOD_ALLERGIES: `/addFoodAllergies`,
  },
  MEAL: {
    SUGGEST: "/meal-plan/smart",
    DAILYPLAN: "/meal-plan",
    NUTRITION: "/nutrition-plan",
    MEAL_SUGGEST: "/meal-suggestions",
    ANALYSIS: "/food-analysis",
    SEND_MAIL: "/mail/send-pdf",
  },

  GOAL: {
    GOAL_ASSESMENT: "/goal-assessment",
    GOAL_CUSTOMIZATION: "/goal-customization",
    ADD_NUTRITION_GOAL: "/addNutritionGoal",
  },
  NOTIFICATION: {
    ENABLENOTIFY: "/enableNotify",
    POST_FCM: "/addFcmToken",
  },
  PLAN: {
    SAVE: "/smartMeal-plan",
  },
  NERA_BY_RESTAURENT: {
    GET_RESTAURENTS: "/places/nearby/restaurant",
  },
  WEIGHT_JOURNEY: {
    SAVE: `/weight-journey/user`,
  },
  TERMS_CONDTION: "/compliance/terms",
};
