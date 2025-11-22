import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { styles } from "../../styles/PersonalDetailsStyles";

interface ProgressStepsProps {
  totalSteps: number;
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ totalSteps, currentStep }) => {
  return (
    <View style={styles.progressStepsContainer}>
      {[...Array(totalSteps)].map((_, index) => {
        const isCompleted = index + 1 < currentStep; 
        const isActive = index + 1 === currentStep; 

        return (
          <View key={index} style={styles.stepWrapper}>
            <View
              style={[
                styles.stepCircle,
                (isCompleted || isActive) && styles.stepCircleActive,
              ]}
            >
              <Text
                style={[
                  styles.stepNumber,
                  (isCompleted || isActive) && styles.stepNumberActive,
                ]}
              >
                {isCompleted ? "✓" : index + 1}
              </Text>
            </View>
            {index !== totalSteps - 1 && (
              <View
                style={[
                  styles.stepLine,
                  index + 1 < currentStep && styles.stepLineActive,
                ]}
              />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default ProgressSteps;
