import React from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import { Colors } from "@/constants/Colors";
import { Check } from "lucide-react-native";
import { styles } from "../../styles/PersonalDetailsStyles";

interface CardOption {
  label: string;
  icon?: React.ReactNode;
  value?: string;
}

interface ToggleCardSelectorProps {
  label: string;
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  selectedValue: string | null;
  setSelectedValue: (val: string | null) => void;
  options: CardOption[] | string[];
  required?: boolean;
}

export const ToggleCardSelector: React.FC<ToggleCardSelectorProps> = ({
  label,
  enabled,
  setEnabled,
  selectedValue,
  setSelectedValue,
  options,
  required = false,
}) => {
  const handleSwitch = (val: boolean) => {
    setEnabled(val);
    if (!val) setSelectedValue(null);
  };

  const normalizedOptions: CardOption[] = options.map((opt) =>
    typeof opt === "string" ? { label: opt, value: opt } : opt
  );

  return (
    <View style={styles.Activitylevel}>
      <View style={[styles.switchRow, !enabled && styles.switchRowDisabled]}>
        <Text style={[styles.label, !enabled && styles.labelDisabled]}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>

        <Switch
          thumbColor={enabled ? Colors.primary : Colors.gray400}
          trackColor={{ false: Colors.gray300, true: Colors.primaryLight }}
          value={enabled}
          onValueChange={handleSwitch}
        />
      </View>

      {enabled && (
        <View style={styles.cardList}>
          {normalizedOptions.map((option) => {
            const optionValue = option.value || option.label;
            const active = selectedValue === optionValue;

            return (
              <TouchableOpacity
                key={optionValue}
                style={[
                  styles.activityCard,
                  active && styles.activityCardActive,
                ]}
            onPress={() => setSelectedValue(optionValue)}

                activeOpacity={0.7}
              >
                <View style={styles.activityCardContent}>
                  {option.icon && (
                    <View
                      style={[
                        styles.iconContainer,
                        active && styles.iconContainerActive,
                      ]}
                    >
                      {option.icon}
                    </View>
                  )}

                  <Text
                    style={[
                      styles.activityCardText,
                      active && styles.activityCardTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </View>

                {/* {active && (
                  <View style={styles.checkmarkContainer}>
                    <View style={styles.checkboxChecked}>
                      <Check size={16} color="#fff" strokeWidth={3} />
                    </View>
                  </View>
                )} */}
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};
