// StatusModal.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';

import Modal from 'react-native-modal';



type ModalType = 'success' | 'error' | 'info';

interface StatusModalProps {
  isVisible: boolean;
  type: ModalType;
  message: string;
  title?: string;             // optional override for title
  onClose: () => void;
  loading?: boolean;
  autoDismiss?: boolean;
  dismissDelayMs?: number;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const StatusModal: React.FC<StatusModalProps> = ({
  isVisible,
  type,
  title,
  message,
  onClose,
  loading = false,
  autoDismiss = false,
  dismissDelayMs = 2000,
}) => {
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isVisible && autoDismiss && !loading) {
      timer = setTimeout(() => {
        onClose();
      }, dismissDelayMs);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isVisible, autoDismiss, loading, dismissDelayMs, onClose]);
const getIcon = () => {
    switch (type) {
      case 'success':
        return require('../../components/icons/checked.png');
      case 'error':
        return require('../../components/icons/warning.png');
      case 'info':
        return require('../../components/icons/information.png');
      default:
        return null;
    }
  };


  const getTitleText = () => {
    if (title) return title;
    switch (type) {
      case 'success':
        return 'Success';
      case 'error':
        return 'Error';
      case 'info':
      default:
        return 'Info';
    }
  };

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return '#2ecc71';// green
      case 'error':
        return '#e74c3c'; // red
      case 'info':
        return '#3498db'; // blue
      default:
        return '#333';
    }
  };

  return (
    <Modal
      isVisible={isVisible}
      backdropOpacity={0.5}
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      useNativeDriver={true}
      hideModalContentWhileAnimating={true}
      animationIn="zoomIn"
      animationOut="zoomOut"
      style={styles.modalWrapper}
    >
      <View
        style={[
          styles.modalContainer,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            style={styles.spinner}
          />
        ) : (
          <>
            <Image source={getIcon()} style={styles.icon} />
            <Text style={styles.title}>{getTitleText()}</Text>

            <Text style={styles.message}>{message}</Text>
            <TouchableOpacity style={[styles.button, { backgroundColor: getBorderColor() }]} onPress={onClose}>
              <Text style={styles.buttonText}>OK</Text>

            </TouchableOpacity>
          </>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
  },
  modalContainer: {
    width: SCREEN_WIDTH * 0.8,
    backgroundColor: 'white',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: 'regular',
    marginBottom: 20,
    color: '#555',
    textAlign: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 90,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  spinner: {
    marginVertical: 20,
  },
  icon: {
    width: 30,
    height: 30,
    position: "absolute",
    top: 20,
    left: 20,
  },

});

export default StatusModal;
