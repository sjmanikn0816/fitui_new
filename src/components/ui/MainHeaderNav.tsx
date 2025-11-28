import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  showBackButton?: boolean; // NEW → control back button
  onSkipPress?: () => void; // NEW → skip button handler
}

const MainHeader: React.FC<HeaderProps> = ({
  title,
  subtitle,
  onBackPress,
  showBackButton = false, // default false
  onSkipPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Back Button (optional) */}
        {showBackButton && (
          <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
        )}

        {/* Title & Subtitle */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>

        {/* Skip Button (always shown if handler is passed) */}
        {onSkipPress && (
          <TouchableOpacity onPress={onSkipPress} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray800,
    borderBottomWidth: 0,
    borderBottomColor: 'transparent',
    paddingTop: 40,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  skipButton: {
    padding: 4,
    marginLeft: 8,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.primary,
  },
});

export default MainHeader;
