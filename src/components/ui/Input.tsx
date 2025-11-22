import React from "react";
import {
  View,
  Text,
  TextInput,
  TextInputProps,
  StyleProp,
  ViewStyle,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { styles } from "./styles/InputStyles";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  required,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}

      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={Colors.gray400}
        {...textInputProps}
      />

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default Input;
