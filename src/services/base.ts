import { Config } from "@/constants/config";

// Export BASE_URL from Config for backward compatibility
export const BASE_URL = Config.API_BASE_URL;

// Log the BASE_URL on import for debugging
console.log("🔧 BASE_URL loaded:", BASE_URL || "❌ UNDEFINED - Check .env file");
