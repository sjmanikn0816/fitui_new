// components/ui/LoaderModal.tsx
import React from "react";
import {
  Modal,
  View,
  ActivityIndicator,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Colors } from "@/constants/Colors";

const { width, height } = Dimensions.get("window");

const Loading = ({ visible, message = "Loading..." }) => {
  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.message}>{message}</Text>
      </View>
    </Modal>
  );
};

export default Loading;

const styles = StyleSheet.create({
  overlay: {
    width,
    height,
    backgroundColor: "rgba(0,0,0,0.6)", // dimmed background
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: 0,
  },
  message: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
  },
});
