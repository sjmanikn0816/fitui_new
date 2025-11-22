import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";

export const HeightInput: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
}> = ({ label, value, onChange, options }) => {
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontWeight: "bold", marginBottom: 4 }}>{label}</Text>
      <TouchableOpacity
        onPress={() => setShowDropdown(!showDropdown)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          padding: 8,
          borderRadius: 8,
        }}
      >
        <Text>{value || "Select or type..."}</Text>
      </TouchableOpacity>

      {showDropdown && (
        <View
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            marginTop: 4,
            maxHeight: 150,
          }}
        >
          <FlatList
            data={[...options, "Custom"]}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => {
                  if (item === "Custom") {
                    onChange("");
                  } else {
                    onChange(item);
                  }
                  setShowDropdown(false);
                }}
                style={{ padding: 8 }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {value === "" && (
        <TextInput
          placeholder="Enter value"
          keyboardType="numeric"
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            padding: 8,
            marginTop: 4,
            borderRadius: 8,
          }}
          value={value}
          onChangeText={onChange}
        />
      )}
    </View>
  );
};

