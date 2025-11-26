// components/QuickActionButton.tsx
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { Colors } from "../../constants/Colors";
import { styles } from "../styles/QucikActionButtonStyles";

interface QuickActionButtonProps {
  title: string;
  subtitle?: string;
  color?: string;
  textColor?: string;
  icon?: string;
  onPress?: () => void;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  title,
  subtitle,
  color = Colors.primary,
  textColor = Colors.white,
  icon,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.quickActionButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      {icon && <Text style={styles.quickActionIcon}>{icon}</Text>}
      <Text style={[styles.quickActionTitle, { color: textColor }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.quickActionSubtitle, { color: textColor }]}>
          {subtitle}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default QuickActionButton;
