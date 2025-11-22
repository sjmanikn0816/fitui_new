import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { HealthCondition } from "@/types";
import { styles } from "@/screens/styles/HealthProfileScreenStyles";

interface Props {
  title: string;
  subtitle?: string;
  enabled: boolean;
  setEnabled: (val: boolean) => void;
  conditions: HealthCondition[];
  setConditions: React.Dispatch<React.SetStateAction<HealthCondition[]>>;
}

const ConditionSelector: React.FC<Props> = ({
  title,
  subtitle,
  enabled,
  setEnabled,
  conditions,
  setConditions,
}) => {
  const toggleCondition = (id: string) => {
    setConditions((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, selected: !c.selected } : c
      )
    );
  };

  return (
<View style={styles.section}>
  <Text style={styles.sectionTitle}>{title}</Text>

  <View style={styles.switchRow}>
    {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}

    <Switch
      value={enabled}
      onValueChange={setEnabled}
      trackColor={{
        false: Colors.gray300,
        true: Colors.primaryLight,
      }}
      thumbColor={enabled ? Colors.primary : Colors.gray400}
    />
  </View>

  {enabled && (
    <View style={styles.cardList}>
      {conditions.map((c) => (
        <TouchableOpacity
          key={c.id}
          style={[
            styles.conditionCard,
            c.selected && styles.conditionCardActive,
          ]}
          onPress={() => toggleCondition(c.id)}
        >
          <MaterialIcons
            name={c.selected ? "check-box" : "check-box-outline-blank"}
            size={22}
            color={c.selected ? Colors.primary : Colors.gray500}
            style={{ marginRight: 10 }}
          />
          <Text
            style={[
              styles.conditionCardText,
              c.selected && styles.conditionCardTextActive,
            ]}
          >
            {c.name}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
</View>

  );
};

export default ConditionSelector;

  