import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';


interface SignOutButtonProps {
  onPress: () => void;
}

const SignOutButton: React.FC<SignOutButtonProps> = ({ onPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={onPress}
        style={styles.button}
        activeOpacity={0.7}
      >
        <MaterialIcons name="logout" size={20} color={Colors.error} />
        <Text style={styles.text}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
  },
  button: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.error,
    marginLeft: 8,
  },
});

export default SignOutButton;