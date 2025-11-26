import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import Switch from '../ui/Swicth';


interface NotificationToggleProps {
  icon: keyof typeof MaterialIcons.glyphMap;
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  showBorder?: boolean;
}

const NotificationToggle: React.FC<NotificationToggleProps> = ({
  icon,
  title,
  description,
  value,
  onValueChange,
  showBorder = false,
}) => {
  return (
    <View style={[styles.container, showBorder && styles.containerBorder]}>
      <View style={styles.leftContent}>
        <MaterialIcons name={icon} size={24} color={Colors.textLight} />
        <View style={styles.textContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  containerBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  textContent: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default NotificationToggle;