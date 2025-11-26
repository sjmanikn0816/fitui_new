// utils/safetyErrorHandler.ts
export interface SafetyError {
  type: 'medical_safety_violation' | 'safety_blocked' | 'generic';
  message: string;
  suggestion?: string;
  safeAlternatives?: string[];
  requiredAction?: string;
  severity?: 'critical' | 'warning';
}

export const parseSafetyError = (response: any): SafetyError => {
  // Handle 403 safety block
  if (response.error_type === "http_error" && response.status_code === 403) {
    return {
      type: 'safety_blocked',
      message: response.message?.message || "Meal plan generation blocked for safety reasons",
      requiredAction: response.message?.required_action || "Please consult with a healthcare provider",
      severity: response.message?.safety_level || 'critical'
    };
  }
  
  // Handle validation rejection with medical safety violation
  if (response.rejection_reason === "medical_safety_violation" && response.validation_flags?.length > 0) {
    const flag = response.validation_flags[0];
    return {
      type: 'medical_safety_violation',
      message: flag.message,
      suggestion: flag.suggestion,
      safeAlternatives: response.safe_alternatives || [],
      severity: flag.severity || 'critical'
    };
  }
  

  return {
    type: 'generic',
    message: typeof response?.message === "string" 
      ? response.message 
      : JSON.stringify(response?.message || response),
    severity: 'warning'
  };
};

export const formatSafetyMessage = (error: SafetyError): string => {
  let message = error.message;
  
  if (error.suggestion) {
    message += `\n\n${error.suggestion}`;
  }
  
  if (error.safeAlternatives && error.safeAlternatives.length > 0) {
    message += `\n\nSafe alternatives:\n• ${error.safeAlternatives.join("\n• ")}`;
  }
  
  if (error.requiredAction) {
    message += `\n\n${error.requiredAction}`;
  }
  
  return message;
};