import React from "react";
import { View, Text, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { styles } from "../styles/ProfileeditScreenStyles";

interface AddressAndContactInfoProps {
  profileData: any;
  loading: boolean;
  onInputChange: (field: string, value: string | boolean) => void;
}

const AddressAndContactInfo: React.FC<AddressAndContactInfoProps> = ({
  profileData,
  loading,
  onInputChange,
}) => {
  return (
    <>
      {/* Address Information Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="location" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}> Address Information</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Street Address</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.streetAddress}
            onChangeText={(text) => onInputChange("streetAddress", text)}
            placeholder="Street address"
            editable={!loading}
          />
        </View>

        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>City</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.city}
              onChangeText={(text) => onInputChange("city", text)}
              placeholder="City"
              editable={!loading}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>State</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.state}
              onChangeText={(text) => onInputChange("state", text)}
              placeholder="State"
              editable={!loading}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>ZIP</Text>
            <TextInput
              style={styles.textInput}
              value={profileData.zip}
              onChangeText={(text) => onInputChange("zip", text)}
              placeholder="ZIP"
              editable={!loading}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>COUNTRY</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.country}
            onChangeText={(text) => onInputChange("country", text)}
            placeholder="COUNTRY"
            editable={!loading}
          />
        </View>
      </View>

      {/* Emergency Contact Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Ionicons name="call" size={18} color={Colors.primary} />
          <Text style={styles.sectionTitle}> Emergency Contact</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contact Name</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.emergencyContactName}
            onChangeText={(text) => onInputChange("emergencyContactName", text)}
            placeholder="Emergency contact name"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Contact Phone</Text>
          <TextInput
            style={styles.textInput}
            value={profileData.emergencyContactPhone}
            onChangeText={(text) => onInputChange("emergencyContactPhone", text)}
            placeholder="Emergency contact phone"
            keyboardType="phone-pad"
            editable={!loading}
          />
        </View>
      </View>
    </>
  );
};

export default AddressAndContactInfo;