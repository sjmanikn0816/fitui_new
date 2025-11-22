import messaging from "@react-native-firebase/messaging";
import { Platform, Alert } from "react-native";
import axios from "axios";
import { BASE_URL } from "./base";
import { Endpoints } from "@/constants/endpoints";
import { Config } from "@/constants/config";

export async function requestUserPermission(): Promise<boolean> {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    console.log("Notification permission enabled:", enabled, authStatus);
    return enabled;
  } catch (error) {
    console.log("Error requesting notification permission:", error);
    return false;
  }
}

export async function getFcmToken(userId: number): Promise<string | null> {
  try {
    const token = await messaging().getToken();
    console.log("FCM Token:", token);

    if (token) {
      await sendTokenToBackend(token, userId);
    }

    return token;
  } catch (error) {
    console.log("Error getting FCM token:", error);
    return null;
  }
}

export async function sendTokenToBackend(fcmToken: string, userId: number) {
  try {
    await axios.post(`${Config.API_BASE_URL}${Endpoints.NOTIFICATION.POST_FCM}`, {
      userId,
      fcmToken,
      deviceType: Platform.OS.toUpperCase(),
    });
    console.log("FCM token sent to backend successfully");
  } catch (error) {
    console.log("Error sending FCM token to backend:", error);
  }
}

export function foregroundListener() {
  return messaging().onMessage(async (remoteMessage) => {
    Alert.alert(
      remoteMessage.notification?.title ?? "Notification",
      remoteMessage.notification?.body ?? ""
    );
  });
}

export function setTopicSubscription(topic: string, subscribe: boolean) {
  if (subscribe) {
    messaging()
      .subscribeToTopic(topic)
      .then(() => console.log(`Subscribed to topic: ${topic}`))
      .catch((err) => console.log(`Error subscribing to topic ${topic}:`, err));
  } else {
    messaging()
      .unsubscribeFromTopic(topic)
      .then(() => console.log(`Unsubscribed from topic: ${topic}`))
      .catch((err) =>
        console.log(`Error unsubscribing from topic ${topic}:`, err)
      );
  }
}

export interface NotificationPreferences {
  allNotification: boolean;
  mealReminder: boolean;
  healthMetricReminder: boolean;
  progressUpdate: boolean;
}

export async function updateNotificationPreferences(
  userId: number,
  preferences: NotificationPreferences
): Promise<NotificationPreferences | null> {
  try {
    const response = await axios.post(
      `${Config.API_BASE_URL}${Endpoints.NOTIFICATION.ENABLENOTIFY}`,
      {
        userId,
        ...preferences,
      }
    );
    console.log("Notification preferences updated:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error updating notification preferences:", error);
    return null;
  }
}

export async function updateDeliveryMethods(
  userId: number,
  deliveryMethods: {
    meal: string[];
    health: string[];
    progress: string[];
  }
) {
  try {
    await axios.post(`${Config.API_BASE_URL}/updateDeliveryMethods`, {
      userId,
      ...deliveryMethods,
    });
    console.log("Delivery methods updated successfully");
  } catch (error) {
    console.log("Error updating delivery methods:", error);
  }
}

export async function getNotifyDetail(): Promise<any[]> {
  try {
    const response = await axios.get(`${Config.API_BASE_URL}/getNotifyDetail`);
    console.log("Notification details fetched:", response.data);
    return response.data;
  } catch (error) {
    console.log("Error fetching notification details:", error);
    return [];
  }
}
