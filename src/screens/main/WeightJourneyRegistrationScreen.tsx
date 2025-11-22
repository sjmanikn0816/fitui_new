import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '@/redux/store/hooks';
import WeightJourneyService from '@/services/WeightJourneyService';
import { styles } from '@/screens/styles/WeightJourneyRegistrationStyles';
import { Colors } from '@/constants/Colors';
import DashboardHeader from '@/components/DashboardHeader';

interface FormData {
  goal: 'lose' | 'maintain' | 'gain' | null;
  targetWeight: string;
  startingWeight: string;
  currentWeight: string;
  weeksSinceStart: string;
  weightChangeRate: 'mild' | 'moderate' | 'aggressive' | 'extreme' | null;
  previousDailyCalories: string;
  adherenceRate: string;
  targetCompletion: string;
  timelineFlexibility: 'strict' | 'safety' | 'relaxed' | 'auto' | null;
  priority: 'safety' | 'speed' | 'balanced' | 'adherence' | null;
}

const WeightJourneyRegistrationScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const user = useAppSelector((state) => state.auth.user);
  const [formData, setFormData] = useState<FormData>({
    goal: null,
    targetWeight: '',
    startingWeight: '',
    currentWeight: '',
    weeksSinceStart: '',
    weightChangeRate: null,
    previousDailyCalories: '',
    adherenceRate: '',
    targetCompletion: '',
    timelineFlexibility: null,
    priority: null,
  });

  const goalOptions = [
    { id: 'lose', label: 'Lose Weight', icon: '📉' },
    { id: 'maintain', label: 'Maintain', icon: '📊' },
    { id: 'gain', label: 'Gain Weight', icon: '📈' },
  ];

  const weightChangeRates = [
    { id: 'mild', label: 'Mild', subtitle: 'Steady' },
    { id: 'moderate', label: 'Moderate', subtitle: 'Balanced' },
    { id: 'aggressive', label: 'Aggressive', subtitle: 'Fast' },
    { id: 'extreme', label: 'Extreme', subtitle: 'Maximum' },
  ];

  const timelineFlexibilityOptions = [
    { id: 'strict', label: 'Strict Deadline' },
    { id: 'safety', label: 'Safety First' },
    { id: 'relaxed', label: 'Relaxed' },
    { id: 'auto', label: 'Auto Adjust' },
  ];

  const priorityOptions = [
    { id: 'safety', label: 'Safety First' },
    { id: 'speed', label: 'Speed First' },
    { id: 'balanced', label: 'Balanced' },
    { id: 'adherence', label: 'Adherence First' },
  ];

  const updateFormData = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'goal', 'targetWeight', 'startingWeight', 'currentWeight', 
      'weeksSinceStart', 'weightChangeRate', 'previousDailyCalories', 
      'adherenceRate', 'targetCompletion', 'timelineFlexibility', 'priority'
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof FormData] || formData[field as keyof FormData] === '') {
        return false;
      }
    }
    return true;
  };

  const handleCompleteAllFields = async () => {
    if (!validateForm()) {
      Alert.alert('Incomplete Form', 'Please fill in all fields to continue.');
      return;
    }

    try {
      const payload = {
        goal: formData.goal!,
        targetWeight: Number(formData.targetWeight),
        startingWeight: Number(formData.startingWeight),
        currentWeight: Number(formData.currentWeight),
        weeksSinceStart: Number(formData.weeksSinceStart),
        weightChangeRate: formData.weightChangeRate!,
        previousDailyCalories: Number(formData.previousDailyCalories),
        adherenceRate: Number(formData.adherenceRate),
        targetCompletion: formData.targetCompletion,
        timelineFlexibility: formData.timelineFlexibility!,
        priority: formData.priority!,
      };

      const userId = user?.id || user?.userId || user;
      await WeightJourneyService.save(userId, payload);

      navigation.navigate('NutritionPlan', { registrationCompleted: true });
    } catch (e: any) {
      Alert.alert('Failed to save', e?.message || 'Please try again later.');
    }
  };

  const renderGoalSelection = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="flag" size={24} color={Colors.primary} />
        <Text style={styles.sectionTitle}>What's Your Goal?</Text>
      </View>
      <View style={styles.optionsRow}>
        {goalOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.goalOption,
              formData.goal === option.id && styles.selectedOption,
            ]}
            onPress={() => updateFormData('goal', option.id)}
          >
            <Text style={styles.goalIcon}>{option.icon}</Text>
            <Text style={[
              styles.goalLabel,
              formData.goal === option.id && styles.selectedOptionText,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderWeightInputs = () => (
    <View style={styles.section}>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Target Weight (lbs)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 150"
            value={formData.targetWeight}
            onChangeText={(text) => updateFormData('targetWeight', text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Starting Weight (lbs)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 180"
            value={formData.startingWeight}
            onChangeText={(text) => updateFormData('startingWeight', text)}
            keyboardType="numeric"
          />
        </View>
      </View>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Current Weight (lbs)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 175"
            value={formData.currentWeight}
            onChangeText={(text) => updateFormData('currentWeight', text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Weeks Since Start</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 4"
            value={formData.weeksSinceStart}
            onChangeText={(text) => updateFormData('weeksSinceStart', text)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderWeightChangeRate = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="flash" size={24} color="#FF9500" />
        <Text style={styles.sectionTitle}>Weight Change Rate</Text>
      </View>
      <View style={styles.optionsGrid}>
        {weightChangeRates.map((rate) => (
          <TouchableOpacity
            key={rate.id}
            style={[
              styles.rateOption,
              formData.weightChangeRate === rate.id && styles.selectedOption,
            ]}
            onPress={() => updateFormData('weightChangeRate', rate.id)}
          >
            <Text style={[
              styles.rateLabel,
              formData.weightChangeRate === rate.id && styles.selectedOptionText,
            ]}>
              {rate.label}
            </Text>
            <Text style={[
              styles.rateSubtitle,
              formData.weightChangeRate === rate.id && styles.selectedOptionText,
            ]}>
              {rate.subtitle}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderCaloriesAndAdherence = () => (
    <View style={styles.section}>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Previous Daily Calories</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 2000"
            value={formData.previousDailyCalories}
            onChangeText={(text) => updateFormData('previousDailyCalories', text)}
            keyboardType="numeric"
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Adherence Rate (%)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 85"
            value={formData.adherenceRate}
            onChangeText={(text) => updateFormData('adherenceRate', text)}
            keyboardType="numeric"
          />
        </View>
      </View>
    </View>
  );

  const renderTargetCompletion = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="calendar" size={24} color={Colors.primary} />
        <Text style={styles.sectionTitle}>Target Completion (weeks)</Text>
      </View>
      <TextInput
        style={styles.fullWidthInput}
        placeholder="e.g., 12"
        value={formData.targetCompletion}
        onChangeText={(text) => updateFormData('targetCompletion', text)}
        keyboardType="numeric"
      />
    </View>
  );

  const renderTimelineFlexibility = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="settings" size={24} color="#007AFF" />
        <Text style={styles.sectionTitle}>Timeline Flexibility</Text>
      </View>
      <View style={styles.optionsGrid}>
        {timelineFlexibilityOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.flexibilityOption,
              formData.timelineFlexibility === option.id && styles.selectedOption,
            ]}
            onPress={() => updateFormData('timelineFlexibility', option.id)}
          >
            <Text style={[
              styles.flexibilityLabel,
              formData.timelineFlexibility === option.id && styles.selectedOptionText,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderPriority = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Ionicons name="checkmark-circle" size={24} color="#34C759" />
        <Text style={styles.sectionTitle}>Your Priority</Text>
      </View>
      <View style={styles.optionsGrid}>
        {priorityOptions.map((option) => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.priorityOption,
              formData.priority === option.id && styles.selectedOption,
            ]}
            onPress={() => updateFormData('priority', option.id)}
          >
            <Text style={[
              styles.priorityLabel,
              formData.priority === option.id && styles.selectedOptionText,
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
        <DashboardHeader
        showTabs={false}
        customHeaderConfig={{
          backgroundColor: Colors.primary,
          title: "Your Weight Journey",
          subtitle: "Fitness Details",
          description: "Let's create your personalized path to success",
          titleColor: Colors.white,
          subtitleColor: Colors.white,
          descriptionColor: Colors.white,
        }}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {renderGoalSelection()}
        {renderWeightInputs()}
        {renderWeightChangeRate()}
        {renderCaloriesAndAdherence()}
        {renderTargetCompletion()}
        {renderTimelineFlexibility()}
        {renderPriority()}

        <TouchableOpacity
          style={[
            styles.completeButton,
            !validateForm() && styles.completeButtonDisabled,
          ]}
          onPress={handleCompleteAllFields}
          disabled={!validateForm()}
        >
          <Ionicons name="trophy" size={24} color="white" />
          <Text style={styles.completeButtonText}>Complete All Fields</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default WeightJourneyRegistrationScreen;
