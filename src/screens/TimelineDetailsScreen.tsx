import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { verticalScale } from "@/utils/responsive";
import { SecureStorage } from "@/services/secureStorage";

export const TimelineDetailsScreen = ({ route, navigation }) => {
  const { timeline, assessment } = route.params;

  const formatText = (text) =>
    text
      ? text
          .split("_")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ")
      : "";

  const handleStartPlan = async () => {
    try {
      // ✅ Save completion flag
      await SecureStorage.setItem("goalAssessmentComplete", "true");

      const targetCalories = Math.round(
        assessment.tdee - timeline.weekly_rate * 500
      );

      // ✅ Navigate to main screen with plan data
      navigation.navigate("LandingMain", {
        assessment,
        selectedTimeline: timeline,
        tdee: assessment.tdee,
        targetCalories,
        targetWeight: timeline.target_weight_lbs,
      });
    } catch (err) {
      console.error("Error starting plan:", err);
    }
  };

  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <LinearGradient
        colors={["#3b82f6", "#8b5cf6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Ionicons name="analytics-outline" size={40} color="#fff" />
        <Text style={styles.headerTitle}>
          {formatText(timeline.approach_name)}
        </Text>
        <Text style={styles.headerSubtitle}>
          {timeline.timeline_weeks} Weeks Plan
        </Text>
      </LinearGradient>

      {/* ===== SCROLL CONTENT ===== */}
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ===== STATS ===== */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Stats</Text>
          <View style={styles.statItem}>
            <Ionicons name="trophy-outline" size={20} color="#10b981" />
            <Text style={styles.statText}>
              Target Weight: {timeline.target_weight_lbs} lbs
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trending-down-outline" size={20} color="#f59e0b" />
            <Text style={styles.statText}>
              Weekly Rate: {timeline.weekly_rate} lbs/week
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="analytics-outline" size={20} color="#8b5cf6" />
            <Text style={styles.statText}>
              Total Change: {Math.abs(timeline.weight_change_lbs)} lbs
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame-outline" size={20} color="#ef4444" />
            <Text style={styles.statText}>
              Daily Deficit: {Math.round(timeline.weekly_rate * 500)} cal/day
            </Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="restaurant-outline" size={20} color="#06b6d4" />
            <Text style={styles.statText}>
              Target Calories: {Math.round(
                assessment.tdee - timeline.weekly_rate * 500
              )}{" "}
              cal/day
            </Text>
          </View>
        </View>

        {/* ===== FOCUS AREAS ===== */}
        {timeline.focus_areas?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Focus Areas</Text>
            {timeline.focus_areas.map((area, i) => (
              <View key={i} style={styles.tag}>
                <Text style={styles.tagText}>{formatText(area)}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== EXPECTED OUTCOMES ===== */}
        {timeline.expected_outcomes?.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expected Outcomes</Text>
            {timeline.expected_outcomes.map((outcome, i) => (
              <View key={i} style={[styles.tag, styles.outcomeTag]}>
                <Text style={[styles.tagText, styles.outcomeText]}>
                  {formatText(outcome)}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ===== EMPHASIS ===== */}
        <View style={[styles.section, { marginBottom: 100 }]}>
          <Text style={styles.sectionTitle}>Program Focus</Text>
          <View style={styles.focusRow}>
            <Ionicons name="nutrition-outline" size={20} color="#8b5cf6" />
            <Text style={styles.focusText}>
              Nutrition: {formatText(timeline.nutrition_emphasis)}
            </Text>
          </View>
          <View style={styles.focusRow}>
            <Ionicons name="barbell-outline" size={20} color="#f59e0b" />
            <Text style={styles.focusText}>
              Exercise: {formatText(timeline.exercise_emphasis)}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* ===== FIXED BOTTOM BUTTON ===== */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.startButton} onPress={handleStartPlan}>
          <LinearGradient
            colors={["#3b82f6", "#8b5cf6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>Start This Plan</Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  scrollContent: { paddingBottom: verticalScale(60) },
  bottomBar: {
   position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 8,
    paddingBottom: Platform.OS === 'ios' ? 34 : 100,


    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),

  },
  header: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 36,
    alignItems: "center",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: { elevation: 6 },
    }),
  },
  backButton: {
    position: "absolute",
    top: Platform.OS === "ios" ? 60 : 40,
    left: 20,
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#fff",
    marginTop: 12,
  },
  headerSubtitle: { fontSize: 16, color: "#e0e7ff", marginTop: 4 },
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginTop: 20,
    padding: 20,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
      },
      android: { elevation: 2 },
    }),
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1e293b",
    marginBottom: 16,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  statText: { fontSize: 15, color: "#334155", fontWeight: "500" },
  tag: {
    backgroundColor: "#eff6ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  tagText: { fontSize: 13, color: "#1e40af", fontWeight: "600" },
  outcomeTag: { backgroundColor: "#dcfce7" },
  outcomeText: { color: "#166534" },
  focusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  focusText: { fontSize: 15, color: "#334155", fontWeight: "500" },
  startButton: {
    flex:2,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    backgroundColor: "#fff",
  },
  startButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  startButtonText: { fontSize: 16, color: "#fff", fontWeight: "700" },
});
