import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

interface Props {
  customerName: string;
  setCustomerName: (text: string) => void;
  customerEmail: string;
  setCustomerEmail: (text: string) => void;
  additionalNotes: string;
  setAdditionalNotes: (text: string) => void;
  loading: boolean;
}

const EmailForm: React.FC<Props> = ({
  customerName,
  setCustomerName,
  customerEmail,
  setCustomerEmail,
  additionalNotes,
  setAdditionalNotes,
  loading,
}) => (
  <>
    <View style={styles.section}>
      <Text style={styles.label}>Customer Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter name"
        value={customerName}
        onChangeText={setCustomerName}
        editable={!loading}
      />
    </View>

    <View style={styles.section}>
      <Text style={styles.label}>
        Customer Email <Text style={{ color: "#ef4444" }}>*</Text>
      </Text>
      <TextInput
        style={styles.input}
        placeholder="customer@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
        value={customerEmail}
        onChangeText={setCustomerEmail}
        editable={!loading}
      />
    </View>

    <View style={styles.section}>
      <Text style={styles.label}>Additional Notes (Optional)</Text>
      <TextInput
        style={[styles.input, { height: 100 }]}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        placeholder="Add notes..."
        value={additionalNotes}
        onChangeText={setAdditionalNotes}
        editable={!loading}
      />
    </View>
  </>
);

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#111827",
    backgroundColor: "#f9fafb",
  },
});

export default EmailForm;
