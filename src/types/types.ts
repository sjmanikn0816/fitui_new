export interface Nutrition {
  calories?: number;
  protein_g?: number;
  carbs_g?: number;
  fat_g?: number;
  fiber_g?: number;
  sugar_g?: number;
  vitamin_c_mg?: number;
  vitamin_a_mcg?: number;
  potassium_mg?: number;
  calcium_mg?: number;
  iron_mg?: number;
}

export interface Ingredient {
  ingredient: string;
  quantity: string;
  preparation?: string;
}

export interface Recipe {
  description?: string;
  ingredients_detailed?: Ingredient[];
  instructions?: string[];
}

export interface Meal {
  name: string;
  description?: string;
  prep_time_minutes?: number;
  difficulty?: string;
  nutrition?: Nutrition;
  nutrition_score?: number;
  recipe?: Recipe;
  health_benefits?: string;
}

export interface DailyPlan {
  breakfast_options?: Meal[];
  lunch_options?: Meal[];
  dinner_options?: Meal[];
}

export interface GenerationMetadata {
  program_name?: string;
  week_number?: number;
  nutrition_targets?: Nutrition;
}

export interface MealPlan {
  generation_metadata?: GenerationMetadata;
  daily_plan?: DailyPlan;
  weekly_plan?: DailyPlan;
  monthly_plan?: DailyPlan;
}
