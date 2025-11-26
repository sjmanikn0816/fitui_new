// components/TextInputSection.tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface TextInputSectionProps {
  query: string;
  setQuery: (value: string) => void;
  disabled: boolean;
}

const TextInputSection: React.FC<TextInputSectionProps> = ({ query, setQuery, disabled }) => {
  const examples = [
    '1 cup oatmeal with berries',
    'Grilled chicken salad',
    '2 eggs and toast',
    'Protein smoothie',
  ];

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Or Type What You Ate</Text>
      </View>
      <TextInput
        style={[styles.textInput, disabled && styles.textInputDisabled]}
        placeholder="E.g., Two scrambled eggs, one slice whole wheat toast, glass of orange juice"
        placeholderTextColor="#999"
        value={query}
        onChangeText={setQuery}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        editable={!disabled}
      />
      <Text style={styles.hint}>
        Be as specific as possible with portions and preparation methods
      </Text>

      {/* Quick Examples */}
      <View style={styles.examplesContainer}>
        <Text style={styles.exampleTitle}>Quick Examples</Text>
        <View style={styles.exampleChips}>
          {examples.map((example, index) => (
            <Text
              key={index}
              style={[styles.exampleChip, disabled && styles.disabledChip]}
              onPress={() => !disabled && setQuery(example)}
            >
              {example}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#374151',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  textInputDisabled: {
    backgroundColor: '#F3F4F6',
    opacity: 0.6,
  },
  hint: {
    marginTop: 8,
    fontSize: 12,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  examplesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  exampleTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  exampleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  exampleChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#FF6B35',
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  disabledChip: {
    opacity: 0.4,
  },
});

export default TextInputSection;
