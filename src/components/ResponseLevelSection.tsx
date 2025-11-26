// components/ResponseLevelSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface ResponseLevelSectionProps {
  responseLevel: 'quick' | 'detailed';
  setResponseLevel: (level: 'quick' | 'detailed') => void;
}

const ResponseLevelSection: React.FC<ResponseLevelSectionProps> = ({ responseLevel, setResponseLevel }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Analysis Detail Level</Text>
      <Text style={styles.detailDescription}>
        Choose how detailed you want your nutritional analysis
      </Text>

      <View style={styles.responseLevelContainer}>
        {[
          {
            key: 'quick',
            icon: 'flash',
            title: 'Quick',
            subtitle: 'Basic calories & macros',
          },
          {
            key: 'detailed',
            icon: 'analytics',
            title: 'Detailed',
            subtitle: 'Food breakdown + nutrients',
          },
        ].map(level => (
          <TouchableOpacity
            key={level.key}
            style={[
              styles.responseLevelButton,
              responseLevel === level.key && styles.responseLevelButtonActive,
            ]}
            onPress={() => setResponseLevel(level.key as 'quick' | 'detailed')}
          >
            <View style={styles.responseLevelContent}>
              <Ionicons
                name={level.icon}
                size={24}
                color={responseLevel === level.key ? '#FF6B35' : '#666'}
              />
              <Text
                style={[
                  styles.responseLevelTitle,
                  responseLevel === level.key && styles.responseLevelTitleActive,
                ]}
              >
                {level.title}
              </Text>
              {/* <Text style={styles.responseLevelSubtitle}>{level.subtitle}</Text> */}
            </View>
            {responseLevel === level.key && (
              <View style={styles.checkmark}>
                <Ionicons name="checkmark-circle" size={24} color="#FF6B35" />
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  detailDescription: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 12,
    lineHeight: 18,
  },
  responseLevelContainer: {
    gap: 12,
  },
  responseLevelButton: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    position: 'relative',
  },
  responseLevelButtonActive: {
    borderColor: '#FF6B35',
    backgroundColor: '#FFF5F2',
    shadowColor: '#FF6B35',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  responseLevelContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  responseLevelTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    flex: 1,
  },
  responseLevelTitleActive: {
    color: '#FF6B35',
  },
  responseLevelSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    position: 'absolute',
    bottom: -18,
    left: 48,
  },
  checkmark: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -12 }],
  },
});

export default ResponseLevelSection;
