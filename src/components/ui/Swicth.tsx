


// components/Switch.tsx
import { Colors } from '@/constants/Colors';
import React from 'react';
import { TouchableOpacity, View, StyleSheet, Animated } from 'react-native';


interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  trackColor?: {
    false?: string;
    true?: string;
  };
  thumbColor?: {
    false?: string;
    true?: string;
  };
}

const Switch: React.FC<SwitchProps> = ({
  value,
  onValueChange,
  trackColor = { false: Colors.gray300, true: Colors.success },
  thumbColor = { false: Colors.white, true: Colors.white }
}) => {
  const animatedValue = React.useRef(new Animated.Value(value ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [value, animatedValue]);

  const handlePress = () => {
    onValueChange(!value);
  };

  const thumbPosition = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 22],
  });

  const backgroundColor = value ? trackColor.true : trackColor.false;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[styles.track, { backgroundColor }]}
    >
      <Animated.View
        style={[
          styles.thumb,
          {
            backgroundColor: value ? thumbColor.true : thumbColor.false,
            transform: [{ translateX: thumbPosition }],
          },
        ]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  track: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    position: 'relative',
  },
  thumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    position: 'absolute',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default Switch;