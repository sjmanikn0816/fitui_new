import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface Props {
  analysisResult: any;
  onClose: () => void;
}

const AnalysisResultBox: React.FC<Props> = ({ analysisResult, onClose }) => {
  return (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        margin: 20,
        padding: 15,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: Colors.yellow,
      }}
    >
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <Text
          style={{
            color: Colors.yellow,
            fontWeight: "bold",
            fontSize: 16,
            marginRight: 8,
          }}
        >
          🤖 AI Food Analysis
        </Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close-circle" size={20} color={Colors.yellow} />
        </TouchableOpacity>
      </View>

      <Text style={{ color: Colors.white, lineHeight: 20 }}>
        {typeof analysisResult === "object"
          ? JSON.stringify(analysisResult, null, 2)
          : String(analysisResult)}
      </Text>
    </View>
  );
};

export default AnalysisResultBox;
