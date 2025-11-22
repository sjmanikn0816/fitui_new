import React, { useEffect, useState } from "react";
import { useAppSelector } from "@/redux/store/hooks";
import { SecureStorage } from "@/services/secureStorage";

export function useUserId() {
  const reduxUserId = useAppSelector((state) => state.auth.userId);
  
  const [userId, setUserId] = useState<number | null>(reduxUserId ?? null);

  useEffect(() => {
    const loadUserIdFromStorage = async () => {
      if (!reduxUserId) {
        try {
          const userJson = await SecureStorage.getItem("user");
          const user = userJson ? JSON.parse(userJson) : null;
          if (user?.userId) {
            setUserId(user.userId);
          } else {
            console.log("⚠️ No user ID found in AsyncStorage");
          }
        } catch (error) {
          console.log("Error loading user from AsyncStorage:", error);
        }
      }
    };

    loadUserIdFromStorage();
  }, [reduxUserId]);

  return userId ?? 49; // optional fallback (e.g. guest)
}
