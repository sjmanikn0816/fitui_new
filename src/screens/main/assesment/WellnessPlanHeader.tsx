import React from "react";
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { scale, verticalScale, moderateScale } from "@/utils/responsive";

const COLORS = {
  primary: "#4F46E5",
  primaryLight: "#6366F1",
  white: "#FFFFFF",
};

export const FONT = {
  xs: moderateScale(12),
  sm: moderateScale(14),
  base:moderateScale(16),
  md: moderateScale(18),
  lg: moderateScale(20),
  xl: moderateScale(22),
  xxl: moderateScale(26),
  };


interface WellnessPlanHeaderProps {
  onMenuPress: () => void;
}

export const WellnessPlanHeader: React.FC<WellnessPlanHeaderProps> = ({ onMenuPress }) => {
  return (
    <View style={styles.headerCard}>
      <ImageBackground
        source={{ uri: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80" }}
        style={styles.headerImageBg}
        imageStyle={styles.headerImageStyle}
      >
        <LinearGradient
          colors={["rgba(79, 70, 229, 0.92)", "rgba(99, 102, 241, 0.90)"]}
          style={styles.headerOverlay}
        >
          <View style={styles.headerTopRow}>
            <View style={styles.headerTitleContainer}>
              <Text style={styles.headerTitle}>Your Wellness Plan</Text>
              <Text style={styles.headerSubtitle}>Personalized Assessment</Text>
            </View>
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
              <Ionicons name="ellipsis-horizontal" size={scale(20)} color={COLORS.white} />
            </TouchableOpacity>
          </View>
          <Text style={styles.headerDesc}>
            Timeline, nutrition targets & goal projections tailored for you
          </Text>
        </LinearGradient>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  headerCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: verticalScale(16),
  },
  headerImageBg: {
    width: "100%",
    minHeight: verticalScale(140),
  },
  headerImageStyle: {
    borderRadius: 20,
  },
  headerOverlay: {
    flex: 1,
    padding: scale(18),
    justifyContent: "flex-end",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  headerTitleContainer: {
    flex: 1,
    marginRight: scale(12),
  },
  headerTitle: {
    fontSize: FONT.xl,
    fontWeight: "800",
    color: COLORS.white,
  },
  headerSubtitle: {
    fontSize: FONT.sm,
    fontWeight: "700",
    color: "rgba(255,255,255,0.85)",
    marginTop: verticalScale(4),
  },
  menuButton: {
    padding: scale(8),
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: scale(50),
  },
  headerDesc: {
    fontSize: FONT.sm,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
    marginTop: verticalScale(12),
    lineHeight: FONT.sm * 1.5,
  },
});