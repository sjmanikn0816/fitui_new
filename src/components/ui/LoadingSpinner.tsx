import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  Animated
} from 'react-native';

interface LoadingSpinnerProps {
  message?: string;
  visible: boolean;
  size?: 'small' | 'large' | number;
  color?: string;
  backgroundColor?: string;
  overlayColor?: string;
  showContainer?: boolean;
  containerStyle?: ViewStyle;
  messageStyle?: TextStyle;
  testID?: string;
  animationDuration?: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  visible,
  size = 'large',
  color = '#007AFF',
  backgroundColor = 'white',
  overlayColor = 'rgba(0, 0, 0, 0.4)',
  showContainer = true,
  containerStyle = {},
  messageStyle = {},
  testID = 'loading-spinner',
  animationDuration = 200,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, fadeAnim, animationDuration]);

  if (!visible) return null;

  const spinnerContent = (
    <View style={styles.contentContainer}>
      <ActivityIndicator
        size={size}
        color={color}
        testID={`${testID}-indicator`}
      />
      {message && (
        <Text
          style={[styles.message, messageStyle]}
          testID={`${testID}-message`}
        >
          {message}
        </Text>
      )}
    </View>
  );

  return (
    <Animated.View
      style={[
        styles.overlay,
        { backgroundColor: overlayColor, opacity: fadeAnim }
      ]}
      testID={testID}
      pointerEvents="box-none"
    >
      {showContainer ? (
        <View
          style={[
            styles.spinnerContainer,
            { backgroundColor },
            containerStyle
          ]}
          testID={`${testID}-container`}
        >
          {spinnerContent}
        </View>
      ) : (
        spinnerContent
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  spinnerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    borderRadius: 12,
    minWidth: 120,
    minHeight: 120,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,

    elevation: 8,
  },
  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    marginTop: 16,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    fontWeight: '500',
    maxWidth: 200,
    lineHeight: 22,
  },
});

export default LoadingSpinner;