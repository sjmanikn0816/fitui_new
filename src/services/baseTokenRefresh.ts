import axios from "axios";
import { store } from "@/redux/store";
import { setAuthToken, logout } from "@/redux/slice/auth/authSlice";
import { BASE_URL } from "./base";
import { Endpoints } from "@/constants/endpoints";
import DeviceInfo from "react-native-device-info";
import { Config } from "@/constants/config";
import { SecureStorage } from "./secureStorage";

let refreshInterval: NodeJS.Timeout | null = null;

export const startbaseTokenRefresh = () => {
  if (refreshInterval) return;

  refreshInterval = setInterval(async () => {
    try {
      const state = store.getState();
      const email = JSON.parse((await SecureStorage.getItem("user")) || "{}");

      console.log(email.email);
      const refreshToken = await SecureStorage.getItem("refreshToken");
      console.log("refresh", refreshToken);
      if (!email || !refreshToken) {
        console.warn("Missing email or refresh token — skipping refresh");
        return;
      }

      const deviceId = await DeviceInfo.getUniqueId();

      const response = await axios.post(
        `${Config.API_BASE_URL}${
          Endpoints.AUTH.REFRESH
        }?email=${encodeURIComponent(email)}&refreshToken=${encodeURIComponent(
          refreshToken
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            "X-Device-ID": deviceId,
          },
        }
      );

      const data = response.data;
      console.log(data);
      // Adjust to your backend structure
      const jwtToken = data.jwtTokenDTO?.jwtToken;
      const newRefreshToken = data.jwtTokenDTO?.refreshToken;
      const user = data.user;

      if (jwtToken && newRefreshToken) {
        await SecureStorage.setItem("authToken", jwtToken);
        await SecureStorage.setItem("refreshToken", newRefreshToken);

        if (user) {
          await SecureStorage.setItem("user", JSON.stringify(user));
        }

        store.dispatch(
          setAuthToken({
            token: jwtToken,
            refreshToken: newRefreshToken,
            user: user,
          })
        );

        console.log("🔄 Token refreshed successfully");
      } else {
        console.warn("⚠️ Token refresh failed: Missing tokens in response");
      }
    } catch (err: any) {
      console.warn(
        "❌ Token refresh failed:",
        err?.response?.data || err.message
      );
    }
  }, 1000 * 60 * 5);
};

export const stopbaseTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    console.log("🛑 Token refresh stopped");
  }
};
