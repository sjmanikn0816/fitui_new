// components/VoiceSearchSection.tsx
import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { scale } from "@/utils/responsive";

interface VoiceSearchSectionProps {
  disabled?: boolean;
  onVoiceResult: (text: string) => void;
}

const VoiceSearchSection: React.FC<VoiceSearchSectionProps> = ({
  disabled = false,
  onVoiceResult,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const pulse = new Animated.Value(1);

  // 🔊 When voice text comes
  useSpeechRecognitionEvent("result", (event) => {
    const last = event.results[event.results.length - 1];
    if (last?.transcript) {
      onVoiceResult(last.transcript);
    }
  });

  // 🎤 Start event
  useSpeechRecognitionEvent("start", () => {
    setIsRecording(true);
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.2, duration: 400, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 400, useNativeDriver: true }),
      ])
    ).start();
  });

  // 🛑 Stop event
  useSpeechRecognitionEvent("end", () => {
    setIsRecording(false);
    pulse.setValue(1);
  });

  // ❌ Error handler
  useSpeechRecognitionEvent("error", (event) => {
    console.log("Speech error", event.error, event.message);
    setIsRecording(false);
    pulse.setValue(1);
  });

  // 🚀 Start listening
  const startListening = async () => {
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) {
      console.log("Mic permission denied");
      return;
    }
    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
    });
  };

  // 🛑 Stop listening
  const stopListening = () => {
    ExpoSpeechRecognitionModule.stop();
  };

  const handlePress = () => {
    if (disabled) return;
    isRecording ? stopListening() : startListening();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Describe by Voice</Text>
      <TouchableOpacity
        style={[styles.micButton, disabled && { opacity: 0.4 }]}
        onPress={handlePress}
        disabled={disabled}
      >
        <Animated.View style={{ transform: [{ scale: pulse }] }}>
          <Ionicons
            name={isRecording ? "mic" : "mic-outline"}
            size={scale(36)}
            color={isRecording ? "red" : Colors.gray500}
          />
        </Animated.View>
      </TouchableOpacity>

      <View style={styles.waveContainer}>
        <MaterialCommunityIcons
          name="waveform"
          size={scale(24)}
          color={isRecording ? "red" : Colors.gray500}
        />
        {isRecording && <Text style={styles.listening}>Listening...</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.bgCard,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  micButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.bgCardHover,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: Colors.emerald,
    elevation: 3,
    shadowColor: Colors.emerald,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  micButtonActive: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  micButtonDisabled: {
    backgroundColor: Colors.bgCard,
    borderColor: Colors.borderDark,
  },
  micIconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  recordingIndicator: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  pulseRing: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: Colors.emerald,
    opacity: 0.3,
  },
  waveContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    gap: 6,
  },
  listening: {
    fontSize: 14,
    color: Colors.emerald,
    fontWeight: "500",
  },
});

export default VoiceSearchSection;
