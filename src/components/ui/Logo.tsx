import React from "react";
import { View, Image } from "react-native";
import { styles } from "./styles/LogoStyles";

interface LogoProps {
  size?: "small" | "medium" | "large";
}

const Logo: React.FC<LogoProps> = ({ size = "medium" }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("./../../../assets/textfitAI.png")} // ✅ relative path
        style={styles.logoImage}
      />
    </View>
  );
};

export default Logo;
