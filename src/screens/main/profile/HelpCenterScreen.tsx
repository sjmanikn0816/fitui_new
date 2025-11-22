import DashboardHeader from "@/components/DashboardHeader";
import HelpOptionCard from "@/components/helpcenter/HelpOptionCard";
import MainHeader from "@/components/ui/MainHeaderNav";
import NotificationCard from "@/components/notification/NotificationCard";
import QuickMessageCard from "@/components/helpcenter/QuickMessageCard";

import { Colors } from "@/constants/Colors";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  SafeAreaView,
  View,
  Alert,
} from "react-native";

const HelpCenterScreen: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const handleBackPress = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      console.log("Back to Profile");
    }
  };

  const handleLiveChat = () => {
    Alert.alert("Live Chat", "Connecting you with our support team...");
  };

  const handlePhoneSupport = () => {
    Alert.alert("Phone Support", "Call our support hotline at 1-800-HEALTH");
  };

  const handleEmailSupport = () => {
    Alert.alert(
      "Email Support",
      "Send us a support email at support@healthapp.com"
    );
  };

  const handleVideoTutorials = () => {
    Alert.alert("Video Tutorials", "Watch step-by-step video guides");
  };

  const handleSendMessage = (message: string) => {
    Alert.alert("Message Sent", `Your message has been sent: "${message}"`);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <DashboardHeader
        showTabs={false}
        title="Need help?"
        subtitle="were Here for You"
        description="Find answers and get support for your nutrition journey"
        backgroundColor="#6366F1"
      /> */}
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {/* <NotificationCard
          title="We're Here for You"
          description="Find answers and get support for your nutrition journey"
          backgroundColor="#6366F1"
        /> */}

        {/* Get Help Section */}
        <View style={styles.section}>
          <View style={styles.helpGrid}>
            <View style={styles.helpRow}>
              <View style={styles.helpCard}>
                <HelpOptionCard
                  icon="chat"
                  title="Live Chat"
                  description="Get instant help from our support team"
                  onPress={handleLiveChat}
                  iconColor={Colors.success}
                />
              </View>
              <View style={styles.helpCard}>
                <HelpOptionCard
                  icon="phone"
                  title="Phone Support"
                  description="Call our support hotline"
                  onPress={handlePhoneSupport}
                  iconColor={Colors.info}
                />
              </View>
            </View>
            <View style={styles.helpRow}>
              <View style={styles.helpCard}>
                <HelpOptionCard
                  icon="email"
                  title="Email Support"
                  description="Send us a support email"
                  onPress={handleEmailSupport}
                  iconColor="#6366F1"
                />
              </View>
              <View style={styles.helpCard}>
                <HelpOptionCard
                  icon="play-circle-filled"
                  title="Video Tutorials"
                  description="Watch step-by-step video guides"
                  onPress={handleVideoTutorials}
                  iconColor={Colors.warning}
                />
              </View>
            </View>
          </View>
        </View>

        <QuickMessageCard onSendMessage={handleSendMessage} />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  helpGrid: {
    gap: 12,
  },
  helpRow: {
    flexDirection: "row",
    gap: 12,
  },
  helpCard: {
    flex: 1,
  },
  bottomSpacing: {
    height: 32,
  },
});

export default HelpCenterScreen;
