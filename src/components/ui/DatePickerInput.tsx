import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import Input from "./Input";

interface Props {
  dob: Date | null;
  setDob: (date: Date) => void;
}

const DatePickerField: React.FC<Props> = ({ dob, setDob }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false); // hide picker on Android after selecting
    }
    if (selectedDate) {
      setDob(selectedDate);
    }
  };

  return (
    <View style={{ marginVertical: 8 }}>
      <Text style={{ fontSize: 14, fontWeight: "500", marginBottom: 4 }}>
        Date of Birth <Text style={{ color: "red" }}>*</Text>
      </Text>
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Input
          pointerEvents="none"
          editable={false}
          style={{
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 8,
            padding: 12,
            color: dob ? "#000" : "#999",
          }}
          placeholder="Select Date of Birth"
          value={dob ? dob.toLocaleDateString() : ""}
        />
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={dob || new Date(2000, 0, 1)}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          maximumDate={new Date()}
          onChange={handleChange}
        />
      )}
    </View>
  );
};

export default DatePickerField;
