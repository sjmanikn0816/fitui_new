import React from "react";
import { View, Text } from "react-native";
import { styles } from "./styles/LogoStyles";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ size = "medium" }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.logoText}>fitAI</Text>
    </View>
  );
};

export default Logo;
