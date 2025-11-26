import React, { useRef, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Animated,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ExpoSpeechRecognitionModule,
  useSpeechRecognitionEvent,
} from "expo-speech-recognition";
import { Colors } from "@/constants/Colors";
import { scale } from "@/utils/responsive";
import { styles as landingStyles } from "@/screens/styles/LandingScreenStyles";

interface Props {
  query: string;
  setQuery: (t: string) => void;
  loading: boolean;
}

const InputSection: React.FC<Props> = ({
  query,
  setQuery,
  loading,
}) => {
  const [inputHeight, setInputHeight] = React.useState(40);
  const [isRecording, setIsRecording] = React.useState(false);

  // 🔊 --- WAVE ANIMATION VALUE ---
  const waveAnim = useRef(new Animated.Value(1)).current;

  // 🔊 Animate waveform continuously
  const startWaveAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(waveAnim, {
          toValue: 1.4,
          duration: 350,
          useNativeDriver: true,
        }),
        Animated.timing(waveAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopWaveAnimation = () => {
    waveAnim.stopAnimation();
    waveAnim.setValue(1);
  };

  // 🔊 When results come
  useSpeechRecognitionEvent("result", (event) => {
    const last = event.results[event.results.length - 1];
    if (last?.transcript) {
      setQuery(last.transcript);
    }
  });

  // 🎤 Recording started
  useSpeechRecognitionEvent("start", () => {
    setIsRecording(true);
    startWaveAnimation();
  });

  // 🛑 Recording stopped
  useSpeechRecognitionEvent("end", () => {
    setIsRecording(false);
    stopWaveAnimation();
  });

  // ❌ Errors
  useSpeechRecognitionEvent("error", (event) => {
    console.log("Speech error:", event.error, event.message);
    setIsRecording(false);
    stopWaveAnimation();
  });

  // 🚀 Start recording
  const startListening = async () => {
    const perm = await ExpoSpeechRecognitionModule.requestPermissionsAsync();
    if (!perm.granted) {
      console.log("Microphone permission denied");
      return;
    }

    ExpoSpeechRecognitionModule.start({
      lang: "en-US",
      interimResults: true,
    });
  };

  // 🛑 Stop recording
  const stopListening = () => {
    ExpoSpeechRecognitionModule.stop();
  };

  return (
    <View style={landingStyles.inputRow}>
      <TextInput
        placeholder="Fancy a meal? Ask AI"
        placeholderTextColor={"#666"}
        value={query}
        onChangeText={setQuery}
        style={[landingStyles.input, { height: Math.max(40, inputHeight) }]}
        editable={!loading}
        multiline
        returnKeyType="done"
        onContentSizeChange={(e) =>
          setInputHeight(e.nativeEvent.contentSize.height)
        }
      />

      <View style={landingStyles.audioContainer}>
        <TouchableOpacity
          style={[landingStyles.micButton, loading && { opacity: 0.5 }]}
          onPress={isRecording ? stopListening : startListening}
          disabled={loading}
        >
          <Ionicons
            name={isRecording ? "mic-off" : "mic"}
            size={scale(18)}
            color={isRecording ? "red" : Colors.gray500}
          />
        </TouchableOpacity>

        {/* 🔥 Animated Waveform */}
        <Animated.View
          style={{
            transform: [{ scale: waveAnim }],
            marginLeft: scale(6),
          }}
        >
          <MaterialCommunityIcons
            name="waveform"
            size={scale(20)}
            color={isRecording ? "red" : Colors.gray500}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default InputSection;
