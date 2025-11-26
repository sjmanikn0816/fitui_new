import React, { useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Modal,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { modalStyles } from "./styles/PicketModalStyles";


interface Props {
  visible: boolean;
  onClose: () => void;
  slideAnim: Animated.Value;
  setSelectedImageUri: (uri: string | null) => void;
}

const ImagePickerModal: React.FC<Props> = ({
  visible,
  onClose,
  slideAnim,
  setSelectedImageUri,
}) => {
  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 50,
        friction: 8,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 1000,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const requestPermission = async () => {
    if (Platform.OS !== "web") {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (cameraStatus !== "granted" || mediaStatus !== "granted") {
        Alert.alert("Permissions required", "Camera and gallery access are needed.");
        return false;
      }
    }
    return true;
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImageUri(uri);
      onClose();
    }
  };

  const pickFromCamera = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedImageUri(uri);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <TouchableOpacity style={modalStyles.backdrop} activeOpacity={1} onPress={onClose} />

        <Animated.View
          style={[
            modalStyles.bottomSheet,
            { transform: [{ translateY: slideAnim }] },
          ]}
        >
          <View style={modalStyles.handleBar} />
          <Text style={modalStyles.title}>Upload Food Image</Text>
          <Text style={modalStyles.subtitle}>Choose a source to analyze your meal</Text>

          <View style={modalStyles.optionsContainer}>
            <TouchableOpacity style={modalStyles.option} onPress={pickFromCamera}>
              <View style={[modalStyles.iconContainer, { backgroundColor: "#FF6B6B" }]}>
                <Ionicons name="camera" size={28} color="#FFF" />
              </View>
              <Text style={modalStyles.optionText}>Camera</Text>
              <Text style={modalStyles.optionSubtext}>Take a photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={modalStyles.option} onPress={pickFromGallery}>
              <View style={[modalStyles.iconContainer, { backgroundColor: "#4ECDC4" }]}>
                <Ionicons name="images" size={28} color="#FFF" />
              </View>
              <Text style={modalStyles.optionText}>Gallery</Text>
              <Text style={modalStyles.optionSubtext}>Choose from library</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={modalStyles.cancelButton} onPress={onClose}>
            <Text style={modalStyles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ImagePickerModal;
