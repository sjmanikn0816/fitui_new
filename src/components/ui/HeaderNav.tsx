import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Logo from "./Logo";
import { Colors } from "@/constants/Colors";
import { Typography } from "@/constants/Typography";

interface HeaderNavProps {
  onBack?: () => void;
  title?: string;
  showLogo?: boolean;
  onSkip?: () => void;
}

const HeaderNav: React.FC<HeaderNavProps> = ({ onBack, title, showLogo = true, onSkip }) => {
  return (
    <View style={styles.header}>
      {onBack && (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
      )}

      {/* Center: Title or Logo */}
      <View style={styles.centerContainer}>
        {title ? <Text style={styles.title}>{title}</Text> : showLogo && <Logo size="large" />}
      </View>

      {/* Skip Button */}
      {onSkip && (
        <TouchableOpacity style={styles.skipButton} onPress={onSkip}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default HeaderNav;
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: Platform.OS === "ios" ? 90 : 70,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 30 : 0,
    backgroundColor: Colors.bgPrimary,
    borderBottomColor: Colors.borderDark,
    borderBottomWidth: 1,
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  backButton: {
    position: "absolute",
    left: 16,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 60,
  },
  title: {
    ...Typography.h3,
    color: Colors.textPrimary,
    fontWeight: "600",
    textAlign: "center",
  },
  skipButton: {
    position: "absolute",
    right: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  skipText: {
    color: Colors.emerald,
    fontSize: 16,
    fontWeight: "500",
  },
});