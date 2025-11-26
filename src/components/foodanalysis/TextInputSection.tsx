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
      <Text style={styles.sectionTitle}>Describe Your Food</Text>
      <TextInput
        style={styles.textInput}
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
        <Text style={styles.sectionTitle}>Quick Examples</Text>
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
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  textInput: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#333',
    minHeight: 120,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  hint: { marginTop: 8, fontSize: 12, color: '#999', fontStyle: 'italic' },
  examplesContainer: { marginTop: 16 },
  exampleChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  exampleChip: {
    backgroundColor: '#FFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
    fontSize: 14,
    color: '#666',
  },
  disabledChip: { opacity: 0.5 },
});

export default TextInputSection;
