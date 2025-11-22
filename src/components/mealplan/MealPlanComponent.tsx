// components/ClinicalComponent.tsx
import React from "react";
import { View, Text } from "react-native";
import { styles } from "../styles/ClinicalComponentStyles";

interface MealPlanComponentProps {
  title: string;
  value?: string | number;
  unit?: string;
  color?: string;
  isMainTitle?: boolean;
}

const MealPlanComponnent: React.FC<MealPlanComponentProps> = ({
  title,
  value,
  unit,
  color = "#000",
  isMainTitle = false,
}) => {
  return (
    <View
      style={[
        styles.clinicalCard,
        { borderLeftColor: color },
        isMainTitle && styles.clinicalCardMain,
      ]}
    >
      <Text
        style={[styles.clinicalTitle, isMainTitle && styles.clinicalTitleMain]}
      >
        {title}
      </Text>
      {!isMainTitle && (
        <View style={styles.clinicalValueContainer}>
          <Text style={[styles.clinicalValue, { color }]}>{value}</Text>
          <Text style={styles.clinicalUnit}>{unit}</Text>
        </View>
      )}
    </View>
  );
};

export default MealPlanComponnent;
