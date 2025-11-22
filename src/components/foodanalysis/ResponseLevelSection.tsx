// components/ResponseLevelSection.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { verticalScale } from '@/utils/responsive';

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
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#333', marginBottom: 12 },
  detailDescription: { fontSize: 13, color: '#666', marginBottom: 12, lineHeight: 18 },
  responseLevelContainer: { gap: 12 ,paddingBottom:verticalScale(60)},
  responseLevelButton: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#E8E8E8',
    position: 'relative',
  },
  responseLevelButtonActive: { borderColor: '#FF6B35', backgroundColor: '#FFF5F2' },
  responseLevelContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  responseLevelTitle: { fontSize: 16, fontWeight: '700', color: '#333', flex: 1 },
  responseLevelTitleActive: { color: '#FF6B35' },
  responseLevelSubtitle: { fontSize: 12, color: '#666', position: 'absolute', bottom: -18, left: 48 },
  checkmark: { position: 'absolute', right: 16, top: '50%', transform: [{ translateY: -12 }] },
});

export default ResponseLevelSection;
