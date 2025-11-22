import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, SafeAreaView, View, Text } from "react-native";
import NotificationToggle from "@/components/notification/NotificationToggle";
import DeliveryMethodSelector from "@/components/notification/DeliveryMethodSelector";
import { Colors } from "@/constants/Colors";
import messaging from "@react-native-firebase/messaging";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "@/redux/store/hooks";
import {
  foregroundListener,
  getFcmToken,
  requestUserPermission,
  setTopicSubscription,
  updateNotificationPreferences,
  updateDeliveryMethods,
  getNotifyDetail,
  NotificationPreferences,
} from "@/services/notificationService";
import { styles } from "./styles/NotificationScreenStyles";
import { useUserId } from "./useUserId";

const NotificationsScreen: React.FC = () => {
  const navigation = useNavigation();
  const userId = useUserId();

  const [allNotifications, setAllNotifications] = useState(false);
  const [mealReminders, setMealReminders] = useState(false);
  const [healthMetrics, setHealthMetrics] = useState(false);
  const [progressUpdates, setProgressUpdates] = useState(false);

  const [mealDeliveryMethods, setMealDeliveryMethods] = useState<any[]>([]);
  const [healthDeliveryMethods, setHealthDeliveryMethods] = useState<any[]>([]);
  const [progressDeliveryMethods, setProgressDeliveryMethods] = useState<any[]>(
    []
  );

  console.log(userId)

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const notifyData = await getNotifyDetail();
        const userPrefs = notifyData.find((item) => item.userId === userId);

        if (userPrefs) {
          setMealReminders(userPrefs.mealReminder);
          setHealthMetrics(userPrefs.healthMetricReminder);
          setProgressUpdates(userPrefs.progressUpdate);
          setAllNotifications(userPrefs.allNotification);
          setMealDeliveryMethods([
            { id: "push", label: "Push", selected: userPrefs.mealReminder },
            { id: "email", label: "Email", selected: false },
            { id: "sms", label: "SMS", selected: false },
          ]);
          setHealthDeliveryMethods([
            {
              id: "push",
              label: "Push",
              selected: userPrefs.healthMetricReminder,
            },
            { id: "email", label: "Email", selected: false },
            { id: "sms", label: "SMS", selected: false },
          ]);
          setProgressDeliveryMethods([
            { id: "push", label: "Push", selected: userPrefs.progressUpdate },
            { id: "email", label: "Email", selected: false },
            { id: "sms", label: "SMS", selected: false },
          ]);
        }
      } catch (err) {
        console.log("Error fetching notification preferences:", err);
      }
    };

    fetchPreferences();
  }, [userId]);

  const handleNotificationNavigation = (remoteMessage: any) => {
    const screen = remoteMessage.data?.screen;
    navigation.navigate(screen ?? ("LandingMain" as never));
  };

  useEffect(() => {
    requestUserPermission().then((enabled) => {
      if (enabled && userId) getFcmToken(userId);
    });

    const unsubscribeForeground = foregroundListener();
    const unsubscribeBackground = messaging().onNotificationOpenedApp(
      (remoteMessage) => {
        handleNotificationNavigation(remoteMessage);
      }
    );

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) handleNotificationNavigation(remoteMessage);
      });

    return () => {
      unsubscribeForeground();
      unsubscribeBackground();
    };
  }, [userId]);

  const handleAllNotificationsToggle = (value: boolean) => {
    setAllNotifications(value);
    setMealReminders(value);
    setHealthMetrics(value);
    setProgressUpdates(value);
  };

  useEffect(() => {
    setAllNotifications(mealReminders && healthMetrics && progressUpdates);
  }, [mealReminders, healthMetrics, progressUpdates]);

  useEffect(() => {
    if (!userId) return;

    const preferences: NotificationPreferences = {
      allNotification: allNotifications,
      mealReminder: mealReminders,
      healthMetricReminder: healthMetrics,
      progressUpdate: progressUpdates,
    };

    updateNotificationPreferences(userId, preferences);
    setTopicSubscription("meal_reminders", mealReminders);
    setTopicSubscription("health_metrics", healthMetrics);
    setTopicSubscription("progress_updates", progressUpdates);
  }, [allNotifications, mealReminders, healthMetrics, progressUpdates, userId]);

  const handleDeliveryMethodSelect = (
    methodId: string,
    setMethods: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setMethods((prev) => {
      const updated = prev.map((method) =>
        method.id === methodId
          ? { ...method, selected: !method.selected }
          : method
      );

      const payload = {
        meal: mealDeliveryMethods.filter((m) => m.selected).map((m) => m.id),
        health: healthDeliveryMethods
          .filter((m) => m.selected)
          .map((m) => m.id),
        progress: progressDeliveryMethods
          .filter((m) => m.selected)
          .map((m) => m.id),
      };
      updateDeliveryMethods(userId, payload);

      return updated;
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* Global Settings */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>⚙️ Global Settings</Text>
          </View>
          <View style={styles.card}>
            <NotificationToggle
              icon="notifications"
              title="All Notifications"
              description="Master switch for all app notifications"
              value={allNotifications}
              onValueChange={handleAllNotificationsToggle}
            />
          </View>
        </View>

        {/* Notification Types */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🔔 Notification Types</Text>

          {/* Meal Reminders */}
          <View style={styles.card}>
            <NotificationToggle
              icon="restaurant"
              title="Meal Reminders"
              description="Get notified when it's time for your planned meals"
              value={mealReminders}
              onValueChange={setMealReminders}
              showBorder
            />
            {mealReminders && (
              <DeliveryMethodSelector
                title="Delivery Methods:"
                methods={mealDeliveryMethods}
                onMethodSelect={(methodId) =>
                  handleDeliveryMethodSelect(methodId, setMealDeliveryMethods)
                }
              />
            )}
          </View>

          {/* Health Metric Reminders */}
          <View style={styles.card}>
            <NotificationToggle
              icon="favorite"
              title="Health Metric Reminders"
              description="Reminders to log blood sugar, weight and other metrics"
              value={healthMetrics}
              onValueChange={setHealthMetrics}
              showBorder
            />
            {healthMetrics && (
              <DeliveryMethodSelector
                title="Delivery Methods:"
                methods={healthDeliveryMethods}
                onMethodSelect={(methodId) =>
                  handleDeliveryMethodSelect(methodId, setHealthDeliveryMethods)
                }
              />
            )}
          </View>

          {/* Progress Updates */}
          <View style={styles.card}>
            <NotificationToggle
              icon="trending-up"
              title="Progress Updates"
              description="Weekly summaries of your health journey"
              value={progressUpdates}
              onValueChange={setProgressUpdates}
              showBorder
            />
            {progressUpdates && (
              <DeliveryMethodSelector
                title="Delivery Methods:"
                methods={progressDeliveryMethods}
                onMethodSelect={(methodId) =>
                  handleDeliveryMethodSelect(
                    methodId,
                    setProgressDeliveryMethods
                  )
                }
              />
            )}
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;
