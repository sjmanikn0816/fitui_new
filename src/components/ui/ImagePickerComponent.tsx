// components/ImagePickerSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface ImagePickerSectionProps {
  selectedImageUri: string | null;
  setSelectedImageUri: (uri: string | null) => void;
  setQuery: (query: string) => void;
}

const ImagePickerSection: React.FC<ImagePickerSectionProps> = ({ selectedImageUri, setSelectedImageUri, setQuery }) => {
  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to take photos.');
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Photo library permission is needed.');
      return false;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    if (!(await requestCameraPermission())) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageUri(result.assets[0].base64 || result.assets[0].uri);
      setQuery('');
    }
  };

  const handlePickImage = async () => {
    if (!(await requestMediaLibraryPermission())) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImageUri(result.assets[0].base64 || result.assets[0].uri);
      setQuery('');
    }
  };

  const handleRemoveImage = () => setSelectedImageUri(null);

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Add Photo</Text>

      {selectedImageUri ? (
        <View style={styles.imagePreviewContainer}>
          <Image
            source={{ uri: selectedImageUri.startsWith('data:') ? selectedImageUri : `data:image/jpeg;base64,${selectedImageUri}` }}
            style={styles.imagePreview}
          />
          <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
            <Ionicons name="close-circle" size={32} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.imageButtonsContainer}>
          <TouchableOpacity style={styles.imageButton} onPress={handleTakePhoto}>
            <Ionicons name="camera" size={32} color="#FF6B35" />
            <Text style={styles.imageButtonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.imageButton} onPress={handlePickImage}>
            <Ionicons name="images" size={32} color="#FF6B35" />
            <Text style={styles.imageButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  imageButtonsContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  imageButton: { flex: 1, backgroundColor: '#FFF', borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 2, borderColor: '#FF6B35', borderStyle: 'dashed' },
  imageButtonText: { marginTop: 8, fontSize: 14, fontWeight: '600', color: '#333', textAlign: 'center' },
  imagePreviewContainer: { position: 'relative', borderRadius: 12, overflow: 'hidden' },
  imagePreview: { width: '100%', height: 250, borderRadius: 12 },
  removeImageButton: { position: 'absolute', top: 10, right: 10, backgroundColor: '#FFF', borderRadius: 16 },
});

export default ImagePickerSection;
