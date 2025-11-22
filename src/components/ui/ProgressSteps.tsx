import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Spacing';
import { Typography } from '@/constants/Typography';
import { styles } from './styles/ProgressStepStyles';

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, totalSteps }) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, index) => {
        const stepNumber = index + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;
        
        return (
          <React.Fragment key={stepNumber}>
            <View
              style={[
                styles.step,
                isCompleted && styles.completedStep,
                isCurrent && styles.currentStep,
              ]}
            >
              {isCompleted ? (
                <MaterialIcons name="check" size={16} color={Colors.white} />
              ) : (
                <Text
                  style={[
                    styles.stepText,
                    isCurrent && styles.currentStepText,
                  ]}
                >
                  {stepNumber}
                </Text>
              )}
            </View>
            {index < totalSteps - 1 && (
              <View
                style={[
                  styles.connector,
                  isCompleted && styles.completedConnector,
                ]}
              />
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
};


export default ProgressSteps;