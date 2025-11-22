// src/services/secureStorage.ts
import EncryptedStorage from "react-native-encrypted-storage";

export const SecureStorage = {
  setItem: async (key: string, value: any) => {
    try {
      await EncryptedStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.log("Storage SET error:", err);
    }
  },

  getItem: async (key: string) => {
    try {
      const data = await EncryptedStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.log("Storage GET error:", err);
      return null;
    }
  },

  removeItem: async (key: string) => {
    try {
      await EncryptedStorage.removeItem(key);
    } catch (err) {
      console.log("Storage REMOVE error:", err);
    }
  },

  clearAll: async () => {
    try {
      await EncryptedStorage.clear();
    } catch (err) {
      console.log("Storage CLEAR error:", err);
    }
  },
};
