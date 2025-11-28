// components/ui/HeaderWithSubtitle.tsx
import React from "react";
import { View, Text, StyleSheet, Platform, Dimensions } from "react-native";
import { Colors } from "@/constants/Colors";

const { width } = Dimensions.get("window");

interface HeaderWithSubtitleProps {
  subtitle?: string;
  title: string;
}

const HeaderWithSubtitle: React.FC<HeaderWithSubtitleProps> = ({
  subtitle,
  title,
}) => {
  return (
    <View style={styles.container}>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    justifyContent: "center",
    paddingVertical: Platform.OS === "ios" ? 2 : 0,
  },
  subtitle: {
    fontSize: width > 400 ? 13 : 11,
    color: Colors.emerald,
    fontWeight: "600",
    lineHeight: 15,
    marginBottom: 1,
  },
  title: {
    fontSize: width > 400 ? 18 : 16,
    color: Colors.textPrimary,
    fontWeight: "800",
    lineHeight: 20,
  },
});

export default HeaderWithSubtitle;
