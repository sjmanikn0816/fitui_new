import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface DeliveryMethod {
  id: string;
  label: string;
  selected: boolean;
}

interface DeliveryMethodSelectorProps {
  title: string;
  methods: DeliveryMethod[];
  onMethodSelect: (methodId: string) => void;
}

const DeliveryMethodSelector: React.FC<DeliveryMethodSelectorProps> = ({
  title,
  methods,
  onMethodSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.methodsContainer}>
        {methods.map((method) => (
          <TouchableOpacity
            key={method.id}
            onPress={() => onMethodSelect(method.id)}
            style={[
              styles.methodButton,
              method.selected ? styles.selectedMethod : styles.unselectedMethod,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.methodText,
                method.selected ? styles.selectedMethodText : styles.unselectedMethodText,
              ]}
            >
              {method.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 12,
  },
  methodsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  methodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
  },
  selectedMethod: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  unselectedMethod: {
    backgroundColor: Colors.bgCard,
    borderColor: Colors.borderDark,
  },
  methodText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedMethodText: {
    color: Colors.bgPrimary,
  },
  unselectedMethodText: {
    color: Colors.textSecondary,
  },
});

export default DeliveryMethodSelector;