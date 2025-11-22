export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age?: number;
  biologicalSex?: 'M' | 'F' | 'O';
  activityLevel?: ActivityLevel;
  healthConditions?: HealthCondition[];
  foodAllergies?: string[];
}
export interface HeaderConfig {
  backgroundColor: string;
  title: string;
  subtitle: string;
  description: string;
  // Optional custom text colors
  titleColor?: string;
  subtitleColor?: string;
  descriptionColor?: string;
}

export interface HealthCondition {
  id: string;
  name: string;
   key: string;      
  selected: boolean;
}

export interface NutritionPlan {
  id: string;
  name: string;
  week: number;
  status: 'active' | 'completed' | 'upcoming';
}

export interface Recipe {
  id: string;
  name: string;
  matchScore: number;
  description: string;
  benefits: string[];
  isNew: boolean;
}

export interface MealPlan {
  breakfast: number;
  lunch: number;
  dinner: number;
  snacks: number;
}

export type ActivityLevel = 'Sedentary' | 'Light' | 'Moderate' | 'Very Active';

export enum HealthConditionEnum {
  PRE_DIABETES = 'pre-diabetes',
  TYPE_2_DIABETES = 'type-2-diabetes',
  HYPERTENSION = 'hypertension',
  HIGH_CHOLESTEROL = 'high-cholesterol'
}


 export type NavTab = 'meals' | 'track' | 'recipes' | string;

 export interface MomItScreensprops {
  navTab: NavTab;
}

 export interface ConsultationType {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  price: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  rating: string;
  reviews: string;
  experience: string;
  nextSlot: string;
  image: string;
}


 export type DineInScreenProps = {
  navTab?: string;
};

 export type TabId = "make-it" | "go-shop" | "dine-in" | "mom-it"|"Goal-customization";


  export interface DashboardHeaderProps {
   activeTab: TabId;
   onTabChange: (tabId: TabId) => void;
   userName?: string;
   userAge?: string | number;
 }