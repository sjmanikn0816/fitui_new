import {
  API_BASE_URL,
  CLIENT_ID,
  REDIRECT_URL,
  GOOGLE_SCOPES_EMAIL,
  GOOGLE_SCOPES_PROFILE,
  GOOGLE_AUTH,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  APPLE_REDIRECT_URL,
  SSO_REDIRECT_URL,
  AI_BASE_URL,
  BEARES_CLIENT,
} from "@env";

// Debug: Log environment variables on load
console.log("🔧 ENV CONFIG LOADED:");
console.log("   API_BASE_URL:", API_BASE_URL || "❌ UNDEFINED");
console.log("   AI_BASE_URL:", AI_BASE_URL || "❌ UNDEFINED");

/**
 * Application Configuration
 * All configuration values are loaded from environment variables
 * See .env.example for required environment variables
 */
export const Config = {
  // API Base URLs
  API_BASE_URL,
  AI_BASE_URL,

  // OAuth & Authentication
  CLIENT_ID,
  REDIRECT_URL,
  SSO_REDIRECT_URL,

  // Google OAuth
  GOOGLE_AUTH,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_SCOPES_EMAIL,
  GOOGLE_SCOPES_PROFILE,

  // Apple OAuth
  APPLE_REDIRECT_URL,

  // Other
  BEARES_CLIENT,
} as const;