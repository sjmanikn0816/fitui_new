import React from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { styles } from "../styles/ProfileeditScreenStyles";
import Dropdown from "@/components/ui/Dropdown";

interface BasicAndPhysicalInfoProps {
  profileData: any;
  loading: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
}

const BasicAndPhysicalInfo: React.FC<BasicAndPhysicalInfoProps> = ({
  profileData,
  loading,
  onInputChange,
}) => {
  const genderOptions = [
    { label: "Male", value: "M" },
    { label: "Female", value: "F" },
    { label: "Other", value: "O" },
  ];

  const ethnicityOptions = [
    { label: "Asian", value: "Asian" },
    { label: "Black", value: "Black" },
    { label: "White", value: "White" },
    { label: "Hispanic", value: "Hispanic" },
    { label: "Mixed", value: "Mixed" },
    { label: "Other", value: "Other" },
  ];

  const feetOptions = Array.from({ length: 8 }, (_, i) => ({
    label: `${i + 4} ft`,
    value: (i + 4).toString(),
  }));

  const inchesOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i} in`,
    value: i.toString(),
  }));

  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}`,
    value: (i + 1).toString(),
  }));

  return (
    <>
      {/* Basic Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="person" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}> Basic Information</Text>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>First Name</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.firstName}
              onChangeText={(text) => onInputChange("firstName", text)}
              placeholder="First name"
              editable={!loading}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Last Name</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.lastName}
              onChangeText={(text) => onInputChange("lastName", text)}
              placeholder="Last name"
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email Address</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.email}
            onChangeText={(text) => onInputChange("email", text)}
            placeholder="Email address"
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.phone ? String(profileData.phone) : ""}
            onChangeText={(text) => onInputChange("phone", text)}
            placeholder="Phone number"
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Age</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.age ? String(profileData.age) : ""}
            onChangeText={(text) => onInputChange("age", text)}
            placeholder="Age"
            keyboardType="numeric"
            editable={!loading}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Dropdown
              label="Birth Month"
              placeholder="Select Month"
              items={monthOptions}
              selectedValue={profileData.birthMonth?.toString() || ""}
              onSelect={(value) => onInputChange("birthMonth", value.toString())}
            />
          </View>

          <View style={styles.inputContainer}>
            <Dropdown
              label="Birth Year"
              placeholder="Select Year"
              items={Array.from({ length: new Date().getFullYear() - 1929 }, (_, i) => {
                const year = 1930 + i;
                return { label: year.toString(), value: year.toString() };
              })}
              selectedValue={profileData.birthYear?.toString() || ""}
              onSelect={(value) => onInputChange("birthYear", value.toString())}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Dropdown
            label="Gender"
            placeholder="Select Gender"
            items={genderOptions}
            selectedValue={profileData.gender}
            onSelect={(value) => onInputChange("gender", value.toString())}
          />
        </View>

        <View style={styles.inputContainer}>
          <Dropdown
            label="Ethnicity"
            placeholder="Select Ethnicity"
            items={ethnicityOptions}
            selectedValue={profileData.ethnicity}
            onSelect={(value) => onInputChange("ethnicity", value.toString())}
          />
        </View>
      </View>

      {/* Physical Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="fitness" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}> Physical Information</Text>
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Dropdown
              label="Height (Feet)"
              placeholder="Select Feet"
              items={feetOptions}
              selectedValue={profileData.heightInFeet?.toString() || ""}
              onSelect={(value) => onInputChange("heightInFeet", value.toString())}
            />
          </View>

          <View style={styles.inputContainer}>
            <Dropdown
              label="Height (Inches)"
              placeholder="Select Inches"
              items={inchesOptions}
              selectedValue={profileData.heightInInches?.toString() || ""}
              onSelect={(value) => onInputChange("heightInInches", value.toString())}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Weight (lbs)</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.weightInLbs ? String(profileData.weightInLbs) : ""}
            onChangeText={(text) => onInputChange("weightInLbs", text)}
            placeholder="Weight in lbs"
            keyboardType="numeric"
            editable={!loading}
          />
        </View>
      </View>
    </>
  );
};

export default BasicAndPhysicalInfo;