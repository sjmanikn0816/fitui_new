import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Dimensions,
  ActivityIndicator,
  Share,
  Platform
} from 'react-native';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { useAppDispatch, useAppSelector } from '@/redux/store/hooks';
import { fetchUserById } from '@/redux/slice/auth/authSlice';
const { width, height } = Dimensions.get('window');
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;

const scale = (size: number) => (width / guidelineBaseWidth) * size;
const verticalScale = (size: number) => (height / guidelineBaseHeight) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

// Professional White, Black, Gray Theme
const COLORS = {
  white: '#FFFFFF',      // Pure white
  black: '#000000',      // Pure black
  darkGray: '#2C2C2C',   // Dark gray
  mediumGray: '#666666', // Medium gray
  lightGray: '#E5E5E5',  // Light gray
  borderGray: '#CCCCCC'  // Border gray
};

const DataExportScreen = () => {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((state) => state.auth.user);
  const userId = useAppSelector((state) => state.auth.userId);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);

  // Get all the data from auth state
  const user = useAppSelector((state) => state.auth.user);
  const healthCondition = useAppSelector((state) => state.auth.healthCondition);
  const immuneDisorder = useAppSelector((state) => state.auth.immuneDisorder);
  const neurologicalHealth = useAppSelector((state) => state.auth.neurologicalHealth);
  const cancer = useAppSelector((state) => state.auth.cancer);
  const address = useAppSelector((state) => state.auth.address);

  const [expandedSections, setExpandedSections] = useState({
    profile: true,
    meals: false,
    privacy: false,
    health: false
  });
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (userId) {
      console.log("📥 Auto fetching user details for ID:", userId);
      dispatch(fetchUserById(userId));
    }
  }, [userId, dispatch]);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Prepare complete export data
  const getExportData = () => {
    return {
      user_profile: user,
      health_conditions: healthCondition,
      immune_disorders: immuneDisorder,
      neurological_health: neurologicalHealth,
      cancer_info: cancer,
      address: address,
      export_timestamp: new Date().toISOString(),
      export_purpose: "CCPA/GDPR Data Portability - Right to Know"
    };
  };

  const exportAsJSON = async () => {
    try {
      setExporting(true);
      const exportData = getExportData();
      const jsonData = JSON.stringify(exportData, null, 2);
      const fileName = `user_data_export_${new Date().getTime()}.json`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, jsonData, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export User Data',
          UTI: 'public.json'
        });
      } else {
        Alert.alert('Success', `Data exported to: ${fileUri}`);
      }
    } catch (err) {
      console.error('Export error:', err);
      Alert.alert('Export Failed', 'Could not export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportAsCSV = async () => {
    try {
      setExporting(true);
      let csvContent = "Category,Field,Value\n";
      
      // User Profile
      if (user) {
        Object.entries(user).forEach(([key, value]) => {
          csvContent += `User Profile,${key},"${value}"\n`;
        });
      }
      
      // Health Conditions
      if (healthCondition) {
        Object.entries(healthCondition).forEach(([key, value]) => {
          csvContent += `Health Conditions,${key},"${value}"\n`;
        });
      }

      // Immune Disorders
      if (immuneDisorder) {
        Object.entries(immuneDisorder).forEach(([key, value]) => {
          csvContent += `Immune Disorders,${key},"${value}"\n`;
        });
      }

      // Neurological Health
      if (neurologicalHealth) {
        Object.entries(neurologicalHealth).forEach(([key, value]) => {
          csvContent += `Neurological Health,${key},"${value}"\n`;
        });
      }

      // Cancer Info
      if (cancer) {
        Object.entries(cancer).forEach(([key, value]) => {
          csvContent += `Cancer Info,${key},"${value}"\n`;
        });
      }

      // Address
      if (address) {
        Object.entries(address).forEach(([key, value]) => {
          csvContent += `Address,${key},"${value}"\n`;
        });
      }
      
      csvContent += `Export Info,timestamp,${new Date().toISOString()}\n`;

      const fileName = `user_data_export_${new Date().getTime()}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/csv',
          dialogTitle: 'Export User Data as CSV',
          UTI: 'public.comma-separated-values-text'
        });
      } else {
        Alert.alert('Success', `Data exported to: ${fileUri}`);
      }
    } catch (err) {
      console.error('Export error:', err);
      Alert.alert('Export Failed', 'Could not export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const exportAsPDF = async () => {
    try {
      setExporting(true);
      
      // Generate HTML content for PDF
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; color: #000; background: #fff; }
            h1 { color: #000; border-bottom: 3px solid #000; padding-bottom: 10px; }
            h2 { color: #000; margin-top: 30px; border-bottom: 1px solid #ccc; padding-bottom: 8px; }
            .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e5e5e5; }
            .label { flex: 1; color: #666; font-weight: 600; }
            .value { flex: 1; color: #000; font-weight: 700; text-align: right; }
            .header { text-align: center; margin-bottom: 30px; }
            .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Data Export Report</h1>
            <p>CCPA/GDPR Compliance Export</p>
            <p>Generated: ${new Date().toLocaleString()}</p>
          </div>
          
          <h2>Personal Information</h2>
          <div class="info-row"><div class="label">Name:</div><div class="value">${user?.firstName || ''} ${user?.lastName || ''}</div></div>
          <div class="info-row"><div class="label">Email:</div><div class="value">${user?.email || 'N/A'}</div></div>
          <div class="info-row"><div class="label">Age:</div><div class="value">${user?.age || 'N/A'} years</div></div>
          <div class="info-row"><div class="label">Gender:</div><div class="value">${user?.gender === 'M' ? 'Male' : user?.gender === 'F' ? 'Female' : 'N/A'}</div></div>
          <div class="info-row"><div class="label">Height:</div><div class="value">${user?.heightInFeet || 0}'${user?.heightInInches || 0}"</div></div>
          <div class="info-row"><div class="label">Weight:</div><div class="value">${user?.weightInLbs || 'N/A'} lbs</div></div>
          <div class="info-row"><div class="label">Target Weight:</div><div class="value">${user?.targetWeight || 'N/A'} lbs</div></div>
          <div class="info-row"><div class="label">Goal:</div><div class="value">${user?.goal || 'N/A'}</div></div>
          <div class="info-row"><div class="label">Activity Level:</div><div class="value">${user?.activityLevel || 'N/A'}</div></div>
          <div class="info-row"><div class="label">Diet Preference:</div><div class="value">${user?.dietPreference || 'N/A'}</div></div>
          <div class="info-row"><div class="label">Ethnicity:</div><div class="value">${user?.ethnicity || 'N/A'}</div></div>
          <div class="info-row"><div class="label">Time Zone:</div><div class="value">${user?.timeZone || 'N/A'}</div></div>
          
          ${healthCondition ? `
          <h2>Health Conditions</h2>
          ${Object.entries(healthCondition).map(([key, value]) => 
            `<div class="info-row"><div class="label">${key}:</div><div class="value">${value}</div></div>`
          ).join('')}
          ` : ''}

          ${address ? `
          <h2>Address</h2>
          ${Object.entries(address).map(([key, value]) => 
            `<div class="info-row"><div class="label">${key}:</div><div class="value">${value}</div></div>`
          ).join('')}
          ` : ''}
          
          <div class="footer">
            <p>This document contains personal data protected under CCPA and GDPR regulations.</p>
          </div>
        </body>
        </html>
      `;

      const fileName = `user_data_export_${new Date().getTime()}.html`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.writeAsStringAsync(fileUri, htmlContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'text/html',
          dialogTitle: 'Export User Data as PDF/HTML',
          UTI: 'public.html'
        });
      } else {
        Alert.alert('Success', `Data exported to: ${fileUri}`);
      }
    } catch (err) {
      console.error('Export error:', err);
      Alert.alert('Export Failed', 'Could not export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  const handleExportOptions = () => {
    Alert.alert(
      'Export Format',
      'Choose the format for exporting your data',
      [
        {
          text: 'JSON',
          onPress: exportAsJSON
        },
        {
          text: 'CSV',
          onPress: exportAsCSV
        },
        {
          text: 'PDF/HTML',
          onPress: exportAsPDF
        },
        {
          text: 'Cancel',
          style: 'cancel'
        }
      ],
      { cancelable: true }
    );
  };

  const InfoRow = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value?.toString() || 'N/A'}</Text>
    </View>
  );

  const SectionHeader = ({ 
    title, 
    isExpanded, 
    onPress 
  }: { 
    title: string; 
    isExpanded: boolean; 
    onPress: () => void;
  }) => (
    <TouchableOpacity onPress={onPress} style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.expandIconContainer}>
        <Text style={styles.expandIcon}>{isExpanded ? '−' : '+'}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={COLORS.black} />
        <Text style={styles.loadingText}>Loading your data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity 
          onPress={() => userId && dispatch(fetchUserById(userId))} 
          style={styles.retryButton}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerAccent} />
        <Text style={styles.headerTitle}>Data Export</Text>
        <Text style={styles.headerSubtitle}>Complete personal information overview</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'U'}
                </Text>
              </View>
            </View>
            <Text style={styles.userName}>
              {user.firstName || ''} {user.lastName || ''}
            </Text>
            <Text style={styles.userEmail}>{user.email || 'N/A'}</Text>
          </View>

          <SectionHeader
            title="Personal Information"
            isExpanded={expandedSections.profile}
            onPress={() => toggleSection('profile')}
          />

          {expandedSections.profile && (
            <View style={styles.sectionContent}>
              <InfoRow label="Age" value={user.age ? `${user.age} years` : 'N/A'} />
              <InfoRow label="Gender" value={user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : 'N/A'} />
              <InfoRow label="Height" value={`${user.heightInFeet || 0}'${user.heightInInches || 0}"`} />
              <InfoRow label="Current Weight" value={user.weightInLbs ? `${user.weightInLbs} lbs` : 'N/A'} />
              <InfoRow label="Target Weight" value={user.targetWeight ? `${user.targetWeight} lbs` : 'N/A'} />
              <InfoRow label="Goal" value={user.goal} />
              <InfoRow label="Activity Level" value={user.activityLevel} />
              <InfoRow label="Diet Preference" value={user.dietPreference} />
              <InfoRow label="Ethnicity" value={user.ethnicity} />
              <InfoRow label="Time Zone" value={user.timeZone} />
            </View>
          )}
        </View>

        {healthCondition && (
          <View style={styles.card}>
            <SectionHeader
              title="Health Conditions"
              isExpanded={expandedSections.health}
              onPress={() => toggleSection('health')}
            />

            {expandedSections.health && (
              <View style={styles.sectionContent}>
                {Object.entries(healthCondition).map(([key, value]) => (
                  <InfoRow key={key} label={key} value={value as string} />
                ))}
              </View>
            )}
          </View>
        )}

        {address && (
          <View style={styles.card}>
            <SectionHeader
              title="Address Information"
              isExpanded={expandedSections.privacy}
              onPress={() => toggleSection('privacy')}
            />

            {expandedSections.privacy && (
              <View style={styles.sectionContent}>
                {Object.entries(address).map(([key, value]) => (
                  <InfoRow key={key} label={key} value={value as string} />
                ))}
              </View>
            )}
          </View>
        )}

        <View style={styles.exportInfo}>
          <Text style={styles.exportInfoText}>
            CCPA/GDPR Compliance Export{'\n'}
            Generated: {new Date().toLocaleDateString()}
          </Text>
        </View>

        <View style={styles.exportButtonsContainer}>
          <TouchableOpacity 
            onPress={exportAsJSON} 
            style={[styles.exportButton, styles.exportButtonSecondary]}
            disabled={exporting}
          >
            {exporting ? (
              <ActivityIndicator size="small" color={COLORS.black} />
            ) : (
              <Text style={styles.exportButtonSecondaryText}>JSON</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={exportAsCSV} 
            style={[styles.exportButton, styles.exportButtonSecondary]}
            disabled={exporting}
          >
            {exporting ? (
              <ActivityIndicator size="small" color={COLORS.black} />
            ) : (
              <Text style={styles.exportButtonSecondaryText}>CSV</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={exportAsPDF} 
            style={[styles.exportButton, styles.exportButtonSecondary]}
            disabled={exporting}
          >
            {exporting ? (
              <ActivityIndicator size="small" color={COLORS.black} />
            ) : (
              <Text style={styles.exportButtonSecondaryText}>PDF</Text>
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={handleExportOptions} 
          style={styles.exportButton}
          disabled={exporting}
        >
          {exporting ? (
            <ActivityIndicator size="small" color={COLORS.white} />
          ) : (
            <Text style={styles.exportButtonText}>Choose Export Format</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    backgroundColor: COLORS.white,
    paddingTop: verticalScale(60),
    paddingBottom: verticalScale(30),
    paddingHorizontal: scale(24),
    borderBottomWidth: 2,
    borderBottomColor: COLORS.lightGray
  },
  headerAccent: {
    width: scale(60),
    height: verticalScale(4),
    backgroundColor: COLORS.black,
    marginBottom: verticalScale(16)
  },
  headerTitle: {
    fontSize: moderateScale(38),
    fontWeight: '900',
    color: COLORS.black,
    marginBottom: verticalScale(8),
    letterSpacing: -1
  },
  headerSubtitle: {
    fontSize: moderateScale(15),
    color: COLORS.mediumGray,
    fontWeight: '500',
    letterSpacing: 0.3
  },
  scrollView: {
    flex: 1
  },
  scrollContent: {
    padding: scale(24),
    paddingTop: verticalScale(24)
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: scale(12),
    padding: scale(24),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: COLORS.borderGray,
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: verticalScale(28),
    paddingBottom: verticalScale(24),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray
  },
  avatarContainer: {
    marginBottom: verticalScale(16)
  },
  avatar: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: COLORS.lightGray
  },
  avatarText: {
    fontSize: moderateScale(36),
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 1
  },
  userName: {
    fontSize: moderateScale(24),
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: verticalScale(6),
    letterSpacing: -0.3
  },
  userEmail: {
    fontSize: moderateScale(14),
    color: COLORS.mediumGray,
    fontWeight: '500'
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: verticalScale(12),
    marginBottom: verticalScale(8)
  },
  sectionTitle: {
    fontSize: moderateScale(17),
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: 0.2
  },
  expandIconContainer: {
    width: scale(32),
    height: scale(32),
    backgroundColor: COLORS.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(16)
  },
  expandIcon: {
    fontSize: moderateScale(20),
    fontWeight: '600',
    color: COLORS.white
  },
  sectionContent: {
    paddingTop: verticalScale(8)
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: verticalScale(14),
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray
  },
  infoLabel: {
    flex: 1,
    fontSize: moderateScale(14),
    color: COLORS.mediumGray,
    fontWeight: '500'
  },
  infoValue: {
    flex: 1,
    fontSize: moderateScale(14),
    color: COLORS.black,
    fontWeight: '600',
    textAlign: 'right'
  },
  exportInfo: {
    backgroundColor: COLORS.lightGray,
    borderRadius: scale(12),
    padding: scale(20),
    marginBottom: verticalScale(20),
    borderWidth: 1,
    borderColor: COLORS.borderGray
  },
  exportInfoText: {
    fontSize: moderateScale(13),
    color: COLORS.darkGray,
    textAlign: 'center',
    lineHeight: 20,
    fontWeight: '600'
  },
  exportButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(16),
    gap: scale(10)
  },
  exportButton: {
    backgroundColor: COLORS.black,
    borderRadius: scale(12),
    padding: scale(18),
    alignItems: 'center',
    marginBottom: verticalScale(30),
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4
  },
  exportButtonSecondary: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.black,
    marginBottom: 0
  },
  exportButtonText: {
    fontSize: moderateScale(16),
    fontWeight: '700',
    color: COLORS.white,
    letterSpacing: 0.5
  },
  exportButtonSecondaryText: {
    fontSize: moderateScale(13),
    fontWeight: '700',
    color: COLORS.black,
    letterSpacing: 0.3
  },
  loadingText: {
    marginTop: verticalScale(16),
    fontSize: moderateScale(16),
    color: COLORS.mediumGray,
    fontWeight: '500'
  },
  errorText: {
    fontSize: moderateScale(16),
    color: COLORS.darkGray,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: verticalScale(20)
  },
  retryButton: {
    backgroundColor: COLORS.black,
    paddingHorizontal: scale(32),
    paddingVertical: verticalScale(12),
    borderRadius: scale(8)
  },
  retryButtonText: {
    fontSize: moderateScale(14),
    fontWeight: '600',
    color: COLORS.white
  }
});

export default DataExportScreen