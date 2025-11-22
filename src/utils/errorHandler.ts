// utils/errorHandler.ts

export interface ErrorState {
  message: string;
  statusCode?: number;
  type: "auth" | "forbidden" | "server" | "network" | "safety" | "generic";
}

export interface SafetyInfo {
  suggestion?: string;
  safeAlternatives?: string[];
  requiredAction?: string;
  severity?: "critical" | "warning";
}

export interface ErrorHandlerResult {
  error: ErrorState;
  safetyInfo: SafetyInfo | null;
  shouldShowModal?: boolean;
  modalMessage?: string;
}

/**
 * Global error handler for API responses and network errors
 * @param response - API response object
 * @param err - Optional error object
 * @returns ErrorHandlerResult with error state and safety info
 */
export const handleApiError = (
  response: any,
  err?: any
): ErrorHandlerResult => {
  console.error("🔴 Error response:", response, err);

  let error: ErrorState;
  let safetyInfo: SafetyInfo | null = null;
  let shouldShowModal = false;
  let modalMessage = "";

  // Handle HTTP status codes
  if (response?.status_code || response?.statusCode) {
    const statusCode = response.status_code || response.statusCode;

    switch (statusCode) {
      case 401:
        error = {
          message: "Authentication failed. Please log in again.",
          statusCode: 401,
          type: "auth",
        };
        shouldShowModal = true;
        modalMessage = "Session expired. Please log in again.";
        break;

      case 403:
        // Safety-related forbidden
        const safetyMsg =
          response.message?.message ||
          response.message ||
          "Access forbidden. This request was blocked for safety reasons.";
        const requiredAction =
          response.message?.required_action ||
          "Please consult with a healthcare provider before proceeding.";

        error = {
          message: safetyMsg,
          statusCode: 403,
          type: "forbidden",
        };
        safetyInfo = {
          requiredAction,
          severity: response.message?.safety_level || "critical",
          suggestion: response.message?.suggestion,
          safeAlternatives: response.safe_alternatives || [],
        };
        break;

      case 404:
        error = {
          message: "The requested resource was not found.",
          statusCode: 404,
          type: "generic",
        };
        break;

      case 429:
        error = {
          message: "Too many requests. Please wait a moment and try again.",
          statusCode: 429,
          type: "generic",
        };
        break;

      case 500:
        error = {
          message:
            "Server error. Our team has been notified. Please try again later.",
          statusCode: 500,
          type: "server",
        };
        shouldShowModal = true;
        modalMessage =
          "Something went wrong on our end. Please try again later.";
        break;

      case 502:
      case 503:
      case 504:
        error = {
          message:
            "Service temporarily unavailable. Please try again in a few moments.",
          statusCode,
          type: "server",
        };
        break;

      default:
        error = {
          message: `An error occurred (Code: ${statusCode}). Please try again.`,
          statusCode,
          type: "generic",
        };
    }

    return { error, safetyInfo, shouldShowModal, modalMessage };
  }

  // Handle medical safety violations
  if (
    response?.rejection_reason === "medical_safety_violation" &&
    response?.validation_flags?.length > 0
  ) {
    const flag = response.validation_flags[0];

    error = {
      message: flag.message || "Medical safety concern detected.",
      type: "safety",
    };
    safetyInfo = {
      suggestion: flag.suggestion,
      safeAlternatives: response.safe_alternatives || [],
      severity: flag.severity || "critical",
    };

    return { error, safetyInfo, shouldShowModal, modalMessage };
  }

  // Handle network errors
  if (err?.message?.includes("network") || err?.message?.includes("fetch")) {
    error = {
      message:
        "Network connection issue. Please check your internet and try again.",
      type: "network",
    };

    return { error, safetyInfo, shouldShowModal, modalMessage };
  }

  // Generic error fallback
  const msg =
    response?.message ||
    err?.message ||
    JSON.stringify(response || err) ||
    "An unexpected error occurred. Please try again.";

  error = {
    message: typeof msg === "string" ? msg : JSON.stringify(msg),
    type: "generic",
  };

  return { error, safetyInfo, shouldShowModal, modalMessage };
};

/**
 * Custom hook for error handling in components
 */
export const useErrorHandler = () => {
  const handleError = (response: any, err?: any) => {
    return handleApiError(response, err);
  };

  return { handleError };
};

/**
 * Validation helper for weight goal safety
 */
export const isWeightGoalSafe = (
  currentWeightLbs: number,
  targetWeightLbs: number
): boolean => {
  const changePercent =
    Math.abs(targetWeightLbs - currentWeightLbs) / currentWeightLbs;
  return changePercent <= 0.3;
};

/**
 * Helper to map activity levels
 */
export const mapActivityLevel = (level: string): string => {
  if (!level) return "Active";
  const map: Record<string, string> = {
    rarely: "Active",
    "rarely/never": "Active",
    sometimes: "Somewhat Active",
    occasionally: "Somewhat Active",
    active: "Active",
    "very active": "Very Active",
    athletic: "Athletic",
    "pro athlete": "Pro Athlete",
  };
  return map[level.toLowerCase()] || "Active";
};

/**
 * Helper to map gender
 */
export const mapGender = (gender: string | null): string => {
  if (!gender) return "F";
  const g = gender.toLowerCase();
  if (g === "male" || g === "m") return "M";
  if (g === "female" || g === "f") return "F";
  return "O";
};

/**
 * Activity enum to string converter
 */
export const activityEnumToString: Record<string, string> = {
  NOT_ACTIVE: "Not Active",
  SOMEWHAT_ACTIVE: "Somewhat Active",
  ACTIVE: "Active",
  VERY_ACTIVE: "Very Active",
  EXTRA_ACTIVE: "Extra Active",
};
