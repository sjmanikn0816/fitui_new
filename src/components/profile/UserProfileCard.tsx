import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';


interface UserProfileCardProps {
  name: string;
  email: string;
  isVerified?: boolean;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ 
  name, 
  email, 
  isVerified = false 
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.avatar}>
          <MaterialIcons name="person" size={32} color={Colors.white} />
        </View>
        <View style={styles.userInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{name}</Text>
            {isVerified && (
              <View style={styles.verifiedBadge}>
                <MaterialIcons name="verified" size={16} color={Colors.white} />
                <Text style={styles.verifiedText}>Verified Account</Text>
              </View>
            )}
          </View>
          <Text style={styles.email}>{email}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    // Box shadow for Android
    elevation: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  avatar: {
    width: 64,
    height: 64,
    backgroundColor: Colors.primary,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    marginRight: 8,
  },
  verifiedBadge: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
  },
  verifiedText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.white,
    marginLeft: 4,
  },
  email: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
});

export default UserProfileCard;