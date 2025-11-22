import { Colors } from '@/constants/Colors';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const AIRecommendationsSection = ({ onRecommendationPress }) => {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>AI Recommendations</Text>
        <TouchableOpacity 
          style={styles.doctorApprovedButton} 
          activeOpacity={0.7}
        >
          <Text style={styles.doctorApprovedText}>Doctor Approved</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.aiSubtitle}>
        Based on your profile, these recommendations focus on anti-inflammatory foods
      </Text>

      <TouchableOpacity 
        style={styles.aiRecommendationCard} 
        onPress={onRecommendationPress}
        activeOpacity={0.7}
      >
        <View style={styles.aiCardContent}>
          <View style={styles.aiHeader}>
            <View style={styles.aiIconContainer}>
              <Text style={styles.aiIcon}>🍎</Text>
            </View>
            <View style={styles.aiHeaderRight}>
              <Text style={styles.aiTitle}>Anti-Inflammatory Turmeric Bowl</Text>
              <Text style={styles.aiScore}>Match Score: 8.4/10</Text>
            </View>
          </View>
          
          <Text style={styles.aiDescription}>
            Designed to help manage inflammation and blood sugar
          </Text>

          <View style={styles.aiBenefits}>
            <Text style={styles.aiBenefit}>• Helps stabilize blood sugar</Text>
            <Text style={styles.aiBenefit}>• Reduces inflammation</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 16,
    paddingVertical: 12,
     
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
  },

     doctorApprovedButton: {
    backgroundColor: '#E0FDF4',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  doctorApprovedText: {
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  aiSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 20,
  },
  aiRecommendationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
       borderWidth:1,
        borderColor:Colors.gray200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  aiCardContent: {
    padding: 16,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  aiIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F0FDF4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  aiIcon: {
    fontSize: 20,
  },
  aiHeaderRight: {
    flex: 1,
  },
  aiTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  aiScore: {
    fontSize: 13,
    color: '#10B981',
    fontWeight: '500',
  },
  aiDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 12,
  },
  aiBenefits: {
    gap: 4,
  },
  aiBenefit: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
  },
});

export default AIRecommendationsSection;