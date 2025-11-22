import React from "react";
import { View, Text, TextInput, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { styles } from "../styles/ProfileeditScreenStyles";
import Dropdown from "@/components/ui/Dropdown";

interface HealthAndFitnessInfoProps {
  profileData: any;
  loading: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
}

const HealthAndFitnessInfo: React.FC<HealthAndFitnessInfoProps> = ({
  profileData,
  loading,
  onInputChange,
}) => {
  const dietPreferenceOptions = [
    { label: "Vegetarian", value: "Veg" },
    { label: "Non-Vegetarian", value: "Non-Veg" },
    { label: "Vegan", value: "Vegan" },
  ];

  const activityLevelOptions = [
    { label: "Not Active", value: "NOT_ACTIVE" },
    { label: "Somewhat Active", value: "SOMEWHAT_ACTIVE" },
    { label: "Active", value: "ACTIVE" },
    { label: "Very Active", value: "VERY_ACTIVE" },
    { label: "Extra Active", value: "EXTRA_ACTIVE" },
  ];

  const goalOptions = [
    { label: "Lose Weight", value: "LOSS" },
    { label: "Gain Weight", value: "GAIN" },
    { label: "Maintain Weight", value: "MAINTAIN" },
  ];

  const usageFrequencyOptions = [
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "Rarely", value: "Rarely" },
  ];

  const travelFrequencyOptions = [
    { label: "Daily", value: "Daily" },
    { label: "Weekly", value: "Weekly" },
    { label: "Monthly", value: "Monthly" },
    { label: "A few times a year", value: "A few times a year" },
    { label: "Rarely/Never", value: "Rarely/Never" },
  ];

  return (
    <>
      {/* Health & Fitness Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="nutrition" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}> Health & Fitness</Text>
        </View>

        <View style={styles.inputContainer}>
          <Dropdown
            label="Diet Preference"
            placeholder="Select Diet Preference"
            items={dietPreferenceOptions}
            selectedValue={profileData.dietPreference}
            onSelect={(value) => onInputChange("dietPreference", value.toString())}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Currently on a Diet?</Text>
          </View>
          <Switch
            value={profileData.isOnDiet}
            onValueChange={(value) => onInputChange("isOnDiet", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Exercise Habits</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.exerciseHabits}
            onChangeText={(text) => onInputChange("exerciseHabits", text)}
            placeholder="e.g., Running, Gym, Soccer"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Dropdown
            label="Activity Level"
            placeholder="Select Activity Level"
            items={activityLevelOptions}
            selectedValue={profileData.activityLevel}
            onSelect={(value) => onInputChange("activityLevel", value.toString())}
          />
        </View>

        <View style={styles.inputContainer}>
          <Dropdown
            label="Fitness Goal"
            placeholder="Select Goal"
            items={goalOptions}
            selectedValue={profileData.goal}
            onSelect={(value) => onInputChange("goal", value.toString())}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Has Medical Condition?</Text>
          </View>
          <Switch
            value={profileData.hasMedicalCondition}
            onValueChange={(value) => onInputChange("hasMedicalCondition", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>
      </View>

      {/* Health Conditions Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="medical" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}> Health Conditions</Text>
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Pre-Diabetes</Text>
          </View>
          <Switch
            value={profileData.preDiabetes}
            onValueChange={(value) => onInputChange("preDiabetes", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Diabetes</Text>
          </View>
          <Switch
            value={profileData.diabetes}
            onValueChange={(value) => onInputChange("diabetes", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>High or Abnormal Cholesterol</Text>
          </View>
          <Switch
            value={profileData.highOrAbnormalCholesterol}
            onValueChange={(value) => onInputChange("highOrAbnormalCholesterol", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Depression</Text>
          </View>
          <Switch
            value={profileData.depression}
            onValueChange={(value) => onInputChange("depression", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Sleep Apnea</Text>
          </View>
          <Switch
            value={profileData.sleepApnea}
            onValueChange={(value) => onInputChange("sleepApnea", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Obesity</Text>
          </View>
          <Switch
            value={profileData.obesity}
            onValueChange={(value) => onInputChange("obesity", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Hypertension</Text>
          </View>
          <Switch
            value={profileData.hypertension}
            onValueChange={(value) => onInputChange("hypertension", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Asthma</Text>
          </View>
          <Switch
            value={profileData.asthma}
            onValueChange={(value) => onInputChange("asthma", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Kidney Disease</Text>
          </View>
          <Switch
            value={profileData.kidneyDisease}
            onValueChange={(value) => onInputChange("kidneyDisease", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Liver Disease</Text>
          </View>
          <Switch
            value={profileData.liverDisease}
            onValueChange={(value) => onInputChange("liverDisease", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Migraines</Text>
          </View>
          <Switch
            value={profileData.migraines}
            onValueChange={(value) => onInputChange("migraines", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>
      </View>

      {/* Immune Disorder Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="medical" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}> Immune Disorders</Text>
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>HIV or AIDS</Text>
          </View>
          <Switch
            value={profileData.hivOrAids}
            onValueChange={(value) => onInputChange("hivOrAids", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Thyroid Disorders</Text>
          </View>
          <Switch
            value={profileData.thyroidDisorders}
            onValueChange={(value) => onInputChange("thyroidDisorders", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Rheumatoid Arthritis</Text>
          </View>
          <Switch
            value={profileData.rheumatoidArthritis}
            onValueChange={(value) => onInputChange("rheumatoidArthritis", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Crohn's Disease</Text>
          </View>
          <Switch
            value={profileData.crohnsDisease}
            onValueChange={(value) => onInputChange("crohnsDisease", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>
      </View>

      {/* Neurological Health Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="medical" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}> Neurological Health</Text>
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Epilepsy</Text>
          </View>
          <Switch
            value={profileData.epilepsy}
            onValueChange={(value) => onInputChange("epilepsy", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Multiple Sclerosis</Text>
          </View>
          <Switch
            value={profileData.multipleSclerosis}
            onValueChange={(value) => onInputChange("multipleSclerosis", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Parkinson's Disease</Text>
          </View>
          <Switch
            value={profileData.parkInSonsDisease}
            onValueChange={(value) => onInputChange("parkInSonsDisease", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Alzheimer's Disease</Text>
          </View>
          <Switch
            value={profileData.alzhemersDisease}
            onValueChange={(value) => onInputChange("alzhemersDisease", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Anxiety Disorders</Text>
          </View>
          <Switch
            value={profileData.anxietyDisorders}
            onValueChange={(value) => onInputChange("anxietyDisorders", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Bipolar Disorder</Text>
          </View>
          <Switch
            value={profileData.bipolarDisorder}
            onValueChange={(value) => onInputChange("bipolarDisorder", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Schizophrenia</Text>
          </View>
          <Switch
            value={profileData.schizophrenia}
            onValueChange={(value) => onInputChange("schizophrenia", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>
      </View>

      {/* Cancer Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="medical" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}> Cancer</Text>
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Any Type of Cancer</Text>
          </View>
          <Switch
            value={profileData.anyTypeOfCancer}
            onValueChange={(value) => onInputChange("anyTypeOfCancer", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Leukemia</Text>
          </View>
          <Switch
            value={profileData.leukemia}
            onValueChange={(value) => onInputChange("leukemia", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>
      </View>

      {/* App Usage Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="phone-portrait" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}> App Usage & Habits</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Health App Usage</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.healthAppUsage}
            onChangeText={(text) => onInputChange("healthAppUsage", text)}
            placeholder="e.g., Nike Run Club, MyFitnessPal"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Dropdown
            label="Usage Frequency"
            placeholder="Select Frequency"
            items={usageFrequencyOptions}
            selectedValue={profileData.usageFrequency}
            onSelect={(value) => onInputChange("usageFrequency", value.toString())}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Is App Helpful?</Text>
          </View>
          <Switch
            value={profileData.isAppHelpful}
            onValueChange={(value) => onInputChange("isAppHelpful", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Sleep Monitoring Enabled?</Text>
          </View>
          <Switch
            value={profileData.isSleepMonitoring}
            onValueChange={(value) => onInputChange("isSleepMonitoring", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.switchContainer}>
          <View style={styles.switchLabelContainer}>
            <Text style={styles.inputLabel}>Watches Diet Content?</Text>
          </View>
          <Switch
            value={profileData.watchesDietContent}
            onValueChange={(value) => onInputChange("watchesDietContent", value)}
            trackColor={{ false: "#D1D5DB", true: Colors.primary }}
            thumbColor="#FFFFFF"
            disabled={loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Dropdown
            label="Travel Frequency"
            placeholder="Select Travel Frequency"
            items={travelFrequencyOptions}
            selectedValue={profileData.travelPercentage}
            onSelect={(value) => onInputChange("travelPercentage", value.toString())}
          />
        </View>
      </View>
    </>
  );
};

export default HealthAndFitnessInfo;