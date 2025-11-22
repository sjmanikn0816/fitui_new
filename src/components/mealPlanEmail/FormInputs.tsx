// components/FormInputs.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

interface FormInputsProps {
  customerName: string;
  customerEmail: string;
  additionalNotes: string;
  onNameChange: (text: string) => void;
  onEmailChange: (text: string) => void;
  onNotesChange: (text: string) => void;
  disabled: boolean;
}

const FormInputs: React.FC<FormInputsProps> = ({
  customerName,
  customerEmail,
  additionalNotes,
  onNameChange,
  onEmailChange,
  onNotesChange,
  disabled,
}) => {
  return (
    <>
      <View style={styles.formSection}>
        <Text style={styles.label}>Customer Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter customer name"
          value={customerName}
          onChangeText={onNameChange}
          placeholderTextColor="#9ca3af"
          editable={!disabled}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>
          Customer Email <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="customer@example.com"
          value={customerEmail}
          onChangeText={onEmailChange}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="#9ca3af"
          editable={!disabled}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.label}>Additional Notes (Optional)</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Add any special instructions or notes..."
          value={additionalNotes}
          onChangeText={onNotesChange}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor="#9ca3af"
          editable={!disabled}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  formSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
  },
  textArea: {
    height: 100,
    paddingTop: 14,
  },
});

export default FormInputs;