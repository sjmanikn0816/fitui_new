// utils/promptValidator.ts

interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  suggestions: string[];
}

interface HealthConditions {
  diabetes_type1_type2?: boolean;
  hypertension?: boolean;
  cancer?: boolean;
  immune_disorder?: boolean;
  neurological_health?: boolean;
  food_allergies?: string[];
}

/**
 * Validates user prompt against health conditions to prevent unsafe requests
 */
export const validatePromptSafety = (
  prompt: string,
  healthConditions: HealthConditions
): ValidationResult => {
  const warnings: string[] = [];
  const suggestions: string[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // Check for hypertension conflicts
  if (healthConditions.hypertension) {
    const highSodiumKeywords = [
      'salty', 'sodium', 'salt', 'processed', 'canned', 
      'pickled', 'bacon', 'sausage', 'ham', 'deli meat',
      'fast food', 'restaurant', 'takeout'
    ];
    
    const hasHighSodiumRequest = highSodiumKeywords.some(keyword => 
      lowerPrompt.includes(keyword)
    );
    
    if (hasHighSodiumRequest) {
      warnings.push('Your request may include high-sodium foods that could worsen hypertension');
      suggestions.push('Try: "Low-sodium heart-healthy meals with fresh herbs and spices"');
      suggestions.push('Consider DASH diet-friendly options');
    }
  }

  // Check for diabetes conflicts
  if (healthConditions.diabetes_type1_type2) {
    const highSugarKeywords = [
      'sweet', 'sugar', 'candy', 'dessert', 'cake', 
      'cookie', 'ice cream', 'soda', 'juice', 'refined carbs'
    ];
    
    const hasHighSugarRequest = highSugarKeywords.some(keyword => 
      lowerPrompt.includes(keyword)
    );
    
    if (hasHighSugarRequest) {
      warnings.push('Your request may include high-sugar foods that could affect blood glucose');
      suggestions.push('Try: "Low-glycemic meals with complex carbohydrates and fiber"');
      suggestions.push('Consider diabetic-friendly alternatives');
    }
  }

  // Check for food allergy conflicts
  if (healthConditions.food_allergies && healthConditions.food_allergies.length > 0) {
    const allergens = healthConditions.food_allergies.map(a => a.toLowerCase());
    const hasAllergenRequest = allergens.some(allergen => 
      lowerPrompt.includes(allergen)
    );
    
    if (hasAllergenRequest) {
      warnings.push('Your request includes foods you\'re allergic to');
      suggestions.push(`Avoid: ${healthConditions.food_allergies.join(', ')}`);
    }
  }

  // Check for immune disorder conflicts
  if (healthConditions.immune_disorder) {
    const riskyFoodKeywords = [
      'raw', 'undercooked', 'rare', 'sushi', 'oyster',
      'unpasteurized', 'soft cheese', 'deli meat'
    ];
    
    const hasRiskyFoodRequest = riskyFoodKeywords.some(keyword => 
      lowerPrompt.includes(keyword)
    );
    
    if (hasRiskyFoodRequest) {
      warnings.push('Your request may include foods that pose infection risks for immune disorders');
      suggestions.push('Try: "Well-cooked, safe meals for immune support"');
      suggestions.push('Avoid raw or undercooked foods');
    }
  }

  return {
    isValid: warnings.length === 0,
    warnings,
    suggestions
  };
};

/**
 * Gets safe prompt alternatives based on health conditions
 */
export const getSafePromptAlternatives = (
  healthConditions: HealthConditions
): string[] => {
  const alternatives: string[] = [];

  if (healthConditions.hypertension) {
    alternatives.push('Low-sodium heart-healthy meals');
    alternatives.push('DASH diet-compliant dishes');
  }

  if (healthConditions.diabetes_type1_type2) {
    alternatives.push('Low-glycemic balanced meals');
    alternatives.push('Diabetic-friendly recipes with complex carbs');
  }

  if (healthConditions.cancer) {
    alternatives.push('Nutrient-dense anti-inflammatory meals');
    alternatives.push('Gentle, easy-to-digest foods');
  }

  if (healthConditions.immune_disorder) {
    alternatives.push('Well-cooked immune-boosting meals');
    alternatives.push('Safe, infection-risk-free foods');
  }

  // Default alternatives
  if (alternatives.length === 0) {
    alternatives.push('Balanced, nutritious meals');
    alternatives.push('Healthy home-cooked recipes');
  }

  return alternatives;
};