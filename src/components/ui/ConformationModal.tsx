import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "src/redux/store";
import { hideConfirmation } from "src/redux/slice/conformationSlice";
import { Colors } from "@/constants/Colors";

const ConfirmationModal: React.FC = () => {
  const dispatch = useDispatch();
  const { isOpen, title, message, onConfirm, onCancel } = useSelector(
    (state: RootState) => state.confirmation
  );

  if (!isOpen) {
    return null;
  }

  const handleConfirm = () => {
    if (onConfirm) {
      try {
        onConfirm();
      } catch (err) {
        console.error("Error in confirmation onConfirm callback:", err);
      }
    }
    dispatch(hideConfirmation());
  };
  const icon = require('../icons/warning.png');

  const handleCancel = () => {
    if (onCancel) {
      try {
        onCancel();
      } catch (err) {
        console.error("Error in confirmation onCancel callback:", err);
      }
    }
    dispatch(hideConfirmation());
  };

  return (
    <Modal
      isVisible={isOpen}
      animationIn="zoomIn"
      animationOut="zoomOut"
      backdropOpacity={0.5}
      onBackdropPress={handleCancel}
      onBackButtonPress={handleCancel}
    >
      <View style={styles.modalBox}>
        <Image source={icon} style={styles.icon} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.confirmButton]} onPress={handleConfirm}>
            <Text style={styles.buttonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBox: {
    width: "100%",
    padding: 20,
    borderRadius: 16,
    backgroundColor: Colors.bgCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: Colors.textPrimary,
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: Colors.textSecondary,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: Colors.bgCardHover,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  confirmButton: {
    backgroundColor: Colors.emerald,
  },
  buttonText: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  icon: {
    width: 30,
    height: 30,
    position: "absolute",
    top: 20,
    left: 20,
  },
});

export default ConfirmationModal;
