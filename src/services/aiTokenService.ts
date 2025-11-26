// aiTokenService.ts
import axios from "axios";
import * as base from "./base";
import { Config } from "@/constants/config";

const AI_TOKEN_URL = `https://api.y-xis.com/auth/token`;
const AI_AUTH_HEADER =
  "Bearer fitai_live_MC--wD-w6R2V4UAbOn3G3z8OMDDwBw5mOFEMgnoNCY8";
const USER_ID = "test@example.com";
const REFRESH_INTERVAL = 10 * 60 * 1000;

let refreshIntervalId: ReturnType<typeof setInterval> | null = null;

const fetchAIToken = async (): Promise<string | null> => {
  try {
    const response = await axios.post(
      AI_TOKEN_URL,
      { user_id: USER_ID },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: AI_AUTH_HEADER,
        },
        timeout: 10000,
      }
    );

    const access_token = response.data.access_token;
    console.log("✅ Fetched AI access token:", access_token);

    base.setToken(access_token);
    return access_token;
  } catch (error) {
    console.error("❌ Failed to fetch AI token:", error);
    return null; // Do NOT throw — prevents crash
  }
};

// Start automatic refresh safely
export const startTokenRefresh = async () => {
  await fetchAIToken(); // initial fetch

  if (refreshIntervalId) clearInterval(refreshIntervalId);

  refreshIntervalId = setInterval(async () => {
    await fetchAIToken();
  }, REFRESH_INTERVAL);

  console.log("🔄 AI Token auto-refresh started");
};

// Stop refresh
export const stopTokenRefresh = () => {
  if (refreshIntervalId) {
    clearInterval(refreshIntervalId);
    refreshIntervalId = null;
    console.log("⏹️ AI Token auto-refresh stopped");
  }
};

// Get current token
export const getToken = (): string => base.token;
