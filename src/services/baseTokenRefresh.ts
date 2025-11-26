import axios from "axios";
import { store } from "@/redux/store";
import { setAuthToken, logout } from "@/redux/slice/auth/authSlice";
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
     const userRaw = await SecureStorage.getItem("user");
     const userm = userRaw ? JSON.parse(userRaw) : null;

const email = userm?.email;

      const refreshToken = await SecureStorage.getItem("refreshToken");
      if (!email || !refreshToken) {
        console.warn("Missing email or refresh token — skipping refresh");
        return;
      }

      const deviceId = await DeviceInfo.getUniqueId();

      const response = await axios.post(
        `${Config.API_BASE_URL}${
          Endpoints.AUTH.REFRESH
        }?email=${email}&refreshToken=${refreshToken}`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            "X-Device-ID": deviceId,
          },
        }
      );

      const data = response.data;
      


      // Adjust to your backend structure
      const jwtToken = data.JWT?.jwtToken;
     
      const newRefreshToken = data.REFRESH?.refreshToken;
      
      const user = data.User.userDetail;
      
     await SecureStorage.setItem("user",JSON.stringify(user))
      if (jwtToken && newRefreshToken && user) {

        await SecureStorage.setItem("authToken", jwtToken);
        await SecureStorage.setItem("refreshToken", newRefreshToken);
        await SecureStorage.setItem("user",JSON.stringify(user))


        store.dispatch(
          setAuthToken({
            token: jwtToken,
            refreshToken: newRefreshToken,
            user:user
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
  }, 1000 *60*12);
};

export const stopbaseTokenRefresh = () => {
  if (refreshInterval) {
    clearInterval(refreshInterval);
    refreshInterval = null;
    console.log("🛑 Token refresh stopped");
  }
};
