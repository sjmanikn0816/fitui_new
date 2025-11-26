import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';


interface NotificationCardProps {
  title: string;
  description: string;
  backgroundColor?: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  description,
  backgroundColor = Colors.primary,
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.white,
    opacity: 0.9,
  },
});

export default NotificationCard;

// components/NotificationToggle.tsx