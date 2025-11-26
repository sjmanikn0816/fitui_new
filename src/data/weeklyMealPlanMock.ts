// src/mock/mockWeeklyMealPlan.ts

export interface Nutrition {
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  fiber_g: number;
  sugar_g: number;
  sodium_mg: number;
  potassium_mg: number;
  calcium_mg: number;
  magnesium_mg: number;
  phosphorus_mg: number;
  iron_mg: number;
  zinc_mg: number;
  vitamin_a_mcg: number;
  vitamin_c_mg: number;
  vitamin_d_mcg: number;
  vitamin_e_mg: number;
  vitamin_k_mcg: number;
  vitamin_b6_mg: number;
  vitamin_b12_mcg: number;
  folate_mcg: number;
}

export interface MealOption {
  name: string;
  description: string;
  nutrition: Nutrition;
  prep_time_minutes: number;
  difficulty: string;
  ingredients: string[];
}

export interface DailyPlan {
  date: string;
  breakfast_options: MealOption[];
  lunch_options: MealOption[];
  dinner_options: MealOption[];
}

export interface WeeklyPlan {
  start_date: string;
  daily_plans: DailyPlan[];
}

export interface MockWeeklyMealPlan {
  success: boolean;
  message: string;
  plan_type: string;
  generated_at: string;
  weekly_plan: WeeklyPlan;
}

// -------------------------------------------------------------
// ✔ Final exported mock data (cleaned + structured + ready-to-use)
// -------------------------------------------------------------

export const mockWeeklyMealPlan: MockWeeklyMealPlan = {
  success: true,
  message: "Enhanced weekly meal plan generated with validation",
  plan_type: "weekly",
  generated_at: "2025-11-25T07:50:46.880180",

  weekly_plan: {
    start_date: "2025-11-25",
    daily_plans: [
      {
        date: "2025-11-25",
        breakfast_options: [
          {
            name: "Roasted Vegetable Hash",
            description:
              "Vegetarian breakfast dish with roasted vegetables and whole grains",
            nutrition: {
              calories: 750,
              protein_g: 17.5,
              carbs_g: 119.3,
              fat_g: 24.49,
              fiber_g: 20.44,
              sugar_g: 33.16,
              sodium_mg: 304.62,
              potassium_mg: 2718.32,
              calcium_mg: 209.86,
              magnesium_mg: 173.91,
              phosphorus_mg: 453.8,
              iron_mg: 5.76,
              zinc_mg: 2.87,
              vitamin_a_mcg: 1078.73,
              vitamin_c_mg: 340.48,
              vitamin_d_mcg: 0,
              vitamin_e_mg: 9.22,
              vitamin_k_mcg: 37.14,
              vitamin_b6_mg: 2.11,
              vitamin_b12_mcg: 0,
              folate_mcg: 277.41
            },
            prep_time_minutes: 20,
            difficulty: "Easy",
            ingredients: [
              "Sweet Potatoes",
              "Carrots",
              "Zucchini",
              "Red Bell Pepper",
              "Onion",
              "Olive Oil",
              "Salt",
              "Pepper",
              "Whole Wheat Bread"
            ]
          }
        ],

        lunch_options: [
          {
            name: "Roasted Vegetable Wrap",
            description:
              "Veggie-focused meal with roasted vegetables and lean beef for protein",
            nutrition: {
              calories: 1050,
              protein_g: 42.51,
              carbs_g: 30.54,
              fat_g: 86.6,
              fiber_g: 9.42,
              sugar_g: 19.41,
              sodium_mg: 759.49,
              potassium_mg: 1209.08,
              calcium_mg: 695.77,
              magnesium_mg: 92.91,
              phosphorus_mg: 775.46,
              iron_mg: 4.79,
              zinc_mg: 6.04,
              vitamin_a_mcg: 1238.33,
              vitamin_c_mg: 572.98,
              vitamin_d_mcg: 4.25,
              vitamin_e_mg: 18.04,
              vitamin_k_mcg: 35.33,
              vitamin_b6_mg: 1.44,
              vitamin_b12_mcg: 2.42,
              folate_mcg: 330.18
            },
            prep_time_minutes: 20,
            difficulty: "Easy",
            ingredients: [
              "Whole Wheat Tortilla",
              "Lean Beef Strips",
              "Roasted Red Bell Pepper",
              "Roasted Zucchini",
              "Roasted Eggplant",
              "Feta Cheese",
              "Olive Oil",
              "Salt",
              "Pepper"
            ]
          }
        ],

        dinner_options: [
          {
            name: "Stuffed Portobello Mushrooms",
            description:
              "Vegetarian meal rich in fiber and antioxidants",
            nutrition: {
              calories: 1200,
              protein_g: 52.52,
              carbs_g: 196.48,
              fat_g: 39.57,
              fiber_g: 75.81,
              sugar_g: 36.25,
              sodium_mg: 615.01,
              potassium_mg: 4956.74,
              calcium_mg: 432.87,
              magnesium_mg: 560.66,
              phosphorus_mg: 1219.74,
              iron_mg: 35.66,
              zinc_mg: 11.45,
              vitamin_a_mcg: 3316.03,
              vitamin_c_mg: 254.79,
              vitamin_d_mcg: 0.17,
              vitamin_e_mg: 45.59,
              vitamin_k_mcg: 120.01,
              vitamin_b6_mg: 3.96,
              vitamin_b12_mcg: 0.04,
              folate_mcg: 607.5
            },
            prep_time_minutes: 20,
            difficulty: "Easy",
            ingredients: [
              "Portobello Mushrooms",
              "Quinoa",
              "Black Beans",
              "Red Bell Pepper",
              "Onion",
              "Garlic",
              "Olive Oil",
              "Cumin",
              "Paprika",
              "Salt",
              "Pepper"
            ]
          }
        ]
      },
       {
        date: "2025-12-25",
        breakfast_options: [
          {
            name: "Roasted Vegetable Hash",
            description:
              "Vegetarian breakfast dish with roasted vegetables and whole grains",
            nutrition: {
              calories: 750,
              protein_g: 17.5,
              carbs_g: 119.3,
              fat_g: 24.49,
              fiber_g: 20.44,
              sugar_g: 33.16,
              sodium_mg: 304.62,
              potassium_mg: 2718.32,
              calcium_mg: 209.86,
              magnesium_mg: 173.91,
              phosphorus_mg: 453.8,
              iron_mg: 5.76,
              zinc_mg: 2.87,
              vitamin_a_mcg: 1078.73,
              vitamin_c_mg: 340.48,
              vitamin_d_mcg: 0,
              vitamin_e_mg: 9.22,
              vitamin_k_mcg: 37.14,
              vitamin_b6_mg: 2.11,
              vitamin_b12_mcg: 0,
              folate_mcg: 277.41
            },
            prep_time_minutes: 20,
            difficulty: "Easy",
            ingredients: [
              "Sweet Potatoes",
              "Carrots",
              "Zucchini",
              "Red Bell Pepper",
              "Onion",
              "Olive Oil",
              "Salt",
              "Pepper",
              "Whole Wheat Bread"
            ]
          }
        ],

        lunch_options: [
          {
            name: "Roasted Vegetable Wrap",
            description:
              "Veggie-focused meal with roasted vegetables and lean beef for protein",
            nutrition: {
              calories: 1050,
              protein_g: 42.51,
              carbs_g: 30.54,
              fat_g: 86.6,
              fiber_g: 9.42,
              sugar_g: 19.41,
              sodium_mg: 759.49,
              potassium_mg: 1209.08,
              calcium_mg: 695.77,
              magnesium_mg: 92.91,
              phosphorus_mg: 775.46,
              iron_mg: 4.79,
              zinc_mg: 6.04,
              vitamin_a_mcg: 1238.33,
              vitamin_c_mg: 572.98,
              vitamin_d_mcg: 4.25,
              vitamin_e_mg: 18.04,
              vitamin_k_mcg: 35.33,
              vitamin_b6_mg: 1.44,
              vitamin_b12_mcg: 2.42,
              folate_mcg: 330.18
            },
            prep_time_minutes: 20,
            difficulty: "Easy",
            ingredients: [
              "Whole Wheat Tortilla",
              "Lean Beef Strips",
              "Roasted Red Bell Pepper",
              "Roasted Zucchini",
              "Roasted Eggplant",
              "Feta Cheese",
              "Olive Oil",
              "Salt",
              "Pepper"
            ]
          }
        ],

        dinner_options: [
          {
            name: "Stuffed Portobello Mushrooms",
            description:
              "Vegetarian meal rich in fiber and antioxidants",
            nutrition: {
              calories: 1200,
              protein_g: 52.52,
              carbs_g: 196.48,
              fat_g: 39.57,
              fiber_g: 75.81,
              sugar_g: 36.25,
              sodium_mg: 615.01,
              potassium_mg: 4956.74,
              calcium_mg: 432.87,
              magnesium_mg: 560.66,
              phosphorus_mg: 1219.74,
              iron_mg: 35.66,
              zinc_mg: 11.45,
              vitamin_a_mcg: 3316.03,
              vitamin_c_mg: 254.79,
              vitamin_d_mcg: 0.17,
              vitamin_e_mg: 45.59,
              vitamin_k_mcg: 120.01,
              vitamin_b6_mg: 3.96,
              vitamin_b12_mcg: 0.04,
              folate_mcg: 607.5
            },
            prep_time_minutes: 20,
            difficulty: "Easy",
            ingredients: [
              "Portobello Mushrooms",
              "Quinoa",
              "Black Beans",
              "Red Bell Pepper",
              "Onion",
              "Garlic",
              "Olive Oil",
              "Cumin",
              "Paprika",
              "Salt",
              "Pepper"
            ]
          }
        ]
      },
        {
        date: "2025-13-25",
        breakfast_options: [
          {
            name: "Roasted Vegetable Hash",
            description:
              "Vegetarian breakfast dish with roasted vegetables and whole grains",
            nutrition: {
              calories: 750,
              protein_g: 17.5,
              carbs_g: 119.3,
              fat_g: 24.49,
              fiber_g: 20.44,
              sugar_g: 33.16,
              sodium_mg: 304.62,
              potassium_mg: 2718.32,
              calcium_mg: 209.86,
              magnesium_mg: 173.91,
              phosphorus_mg: 453.8,
              iron_mg: 5.76,
              zinc_mg: 2.87,
              vitamin_a_mcg: 1078.73,
              vitamin_c_mg: 340.48,
              vitamin_d_mcg: 0,
              vitamin_e_mg: 9.22,
              vitamin_k_mcg: 37.14,
              vitamin_b6_mg: 2.11,
              vitamin_b12_mcg: 0,
              folate_mcg: 277.41
            },
            prep_time_minutes: 20,
            difficulty: "Easy",
            ingredients: [
              "Sweet Potatoes",
              "Carrots",
              "Zucchini",
              "Red Bell Pepper",
              "Onion",
              "Olive Oil",
              "Salt",
              "Pepper",
              "Whole Wheat Bread"
            ]
          }
        ],

        lunch_options: [
          {
            name: "Roasted Vegetable Wrap",
            description:
              "Veggie-focused meal with roasted vegetables and lean beef for protein",
            nutrition: {
              calories: 1050,
              protein_g: 42.51,
              carbs_g: 30.54,
              fat_g: 86.6,
              fiber_g: 9.42,
              sugar_g: 19.41,
              sodium_mg: 759.49,
              potassium_mg: 1209.08,
              calcium_mg: 695.77,
              magnesium_mg: 92.91,
              phosphorus_mg: 775.46,
              iron_mg: 4.79,
              zinc_mg: 6.04,
              vitamin_a_mcg: 1238.33,
              vitamin_c_mg: 572.98,
              vitamin_d_mcg: 4.25,
              vitamin_e_mg: 18.04,
              vitamin_k_mcg: 35.33,
              vitamin_b6_mg: 1.44,
              vitamin_b12_mcg: 2.42,
              folate_mcg: 330.18
            },
            prep_time_minutes: 20,
            difficulty: "Easy",
            ingredients: [
              "Whole Wheat Tortilla",
              "Lean Beef Strips",
              "Roasted Red Bell Pepper",
              "Roasted Zucchini",
              "Roasted Eggplant",
              "Feta Cheese",
              "Olive Oil",
              "Salt",
              "Pepper"
            ]
          }
        ],

        dinner_options: [
          {
            name: "Stuffed Portobello Mushrooms",
            description:
              "Vegetarian meal rich in fiber and antioxidants",
            nutrition: {
              calories: 1200,
              protein_g: 52.52,
              carbs_g: 196.48,
              fat_g: 39.57,
              fiber_g: 75.81,
              sugar_g: 36.25,
              sodium_mg: 615.01,
              potassium_mg: 4956.74,
              calcium_mg: 432.87,
              magnesium_mg: 560.66,
              phosphorus_mg: 1219.74,
              iron_mg: 35.66,
              zinc_mg: 11.45,
              vitamin_a_mcg: 3316.03,
              vitamin_c_mg: 254.79,
              vitamin_d_mcg: 0.17,
              vitamin_e_mg: 45.59,
              vitamin_k_mcg: 120.01,
              vitamin_b6_mg: 3.96,
              vitamin_b12_mcg: 0.04,
              folate_mcg: 607.5
            },
            prep_time_minutes: 20,
            difficulty: "Easy",
            ingredients: [
              "Portobello Mushrooms",
              "Quinoa",
              "Black Beans",
              "Red Bell Pepper",
              "Onion",
              "Garlic",
              "Olive Oil",
              "Cumin",
              "Paprika",
              "Salt",
              "Pepper"
            ]
          }
        ]
      }
    ]
    
  }
};
