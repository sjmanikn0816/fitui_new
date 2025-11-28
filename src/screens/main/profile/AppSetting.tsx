import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // or react-native-linear-gradient
import Switch from '@/components/ui/Swicth';
import DashboardHeader from '@/components/DashboardHeader';
import { Colors } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const SettingsScreen = () => {
  const [selectedTheme, setSelectedTheme] = useState('Dark');
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [autoSync, setAutoSync] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [autoSync2, setAutoSync2] = useState(true);

  const themes = ['Light', 'Dark', 'Auto'];
  const languages = [
    { name: 'English', flag: '🇺🇸' },
    { name: 'Spanish', flag: '🇪🇸' },
    { name: 'French', flag: '🇫🇷' },
    { name: 'German', flag: '🇩🇪' },
  ];



  const SectionHeader = ({ icon, title }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionIcon}>{icon}</Text>
      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );

  const Card = ({ children, style }) => (
    <View style={[styles.card, style]}>{children}</View>
  );

  return (
    <SafeAreaView style={styles.container}>

      
      {/* Header */}
 


                {/* <DashboardHeader
  showTabs={false}
  title="App Setttings"
  subtitle="Customized Your Experiance"
  description="Personalized how app works for you"
  backgroundColor={Colors.info}
/> */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Appearance Section */}
    /

        {/* Language Section */}
        <View style={styles.section}>
          <SectionHeader icon="🌐" title="Language" />
          <Card>
            {languages.map((language, index) => (
              <TouchableOpacity
                key={language.name}
                style={[
                  styles.languageOption,
                  selectedLanguage === language.name && styles.languageOptionActive,
                  index < languages.length - 1 && styles.languageOptionBorder,
                ]}
                onPress={() => setSelectedLanguage(language.name)}
                activeOpacity={0.7}
              >
                <View style={styles.languageInfo}>
                  <Text style={styles.languageFlag}>{language.flag}</Text>
                  <Text
                    style={[
                      styles.languageName,
                      selectedLanguage === language.name && styles.languageNameActive,
                    ]}
                  >
                    {language.name}
                  </Text>
                </View>
                {selectedLanguage === language.name && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </Card>
        </View>

        {/* Data Sync Section */}
        <View style={styles.section}>
          <SectionHeader icon="🔄" title="Data Sync" />
          <Card>
            <View style={[styles.syncItem, styles.syncItemBorder]}>
              <View style={styles.syncInfo}>
                <Text style={styles.syncTitle}>Auto Sync</Text>
                <Text style={styles.syncSubtitle}>
                  Automatically sync your data across devices
                </Text>
              </View>
              <Switch value={autoSync} onValueChange={setAutoSync} />
            </View>

            <View style={[styles.syncItem, styles.syncItemBorder]}>
              <View style={styles.syncInfo}>
                <Text style={styles.syncTitle}>Auto Backup</Text>
                <Text style={styles.syncSubtitle}>
                  Backup data to cloud storage
                </Text>
              </View>
              <Switch value={autoBackup} onValueChange={setAutoBackup} />
            </View>

            <View style={styles.syncItem}>
              <View style={styles.syncInfo}>
                <Text style={styles.syncTitle}>Auto Sync</Text>
                <Text style={styles.syncSubtitle}>
                  Keep your content updated automatically
                </Text>
              </View>
              <Switch  value={autoSync2} onValueChange={setAutoSync2} />
            </View>
          </Card>
        </View>

        {/* Data Usage Section */}
        <View style={[styles.section, { marginBottom: 20 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Data Usage</Text>
          </View>
          <Card>
            <View style={styles.usageContainer}>
              <TouchableOpacity
                style={[styles.usageButton, styles.usageButtonPrimary]}
                activeOpacity={0.8}
              >
                <Text style={styles.usageButtonPrimaryText}>View Data</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.usageButton, styles.usageButtonSecondary]}
                activeOpacity={0.8}
              >
                <Text style={styles.usageButtonSecondaryText}>Reset Statistics</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
    paddingBottom: 120,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: Colors.textPrimary,
    fontSize: 16,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    opacity: 0.9,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  card: {
    backgroundColor: Colors.bgCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.borderDark,
    shadowColor: Colors.emerald,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },

  // Theme Section
  themeContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
  },
  themeOption: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: Colors.bgCardHover,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  themeOptionActive: {
    backgroundColor: Colors.emerald,
    borderColor: Colors.emerald,
  },
  themeText: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  themeTextActive: {
    color: Colors.bgPrimary,
  },

  // Language Section
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  languageOptionActive: {
    backgroundColor: Colors.emerald,
  },
  languageOptionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  languageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  languageName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  languageNameActive: {
    color: Colors.bgPrimary,
  },
  checkIcon: {
    color: Colors.bgPrimary,
    fontSize: 16,
    fontWeight: 'bold',
  },

  // Data Sync Section
  syncItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  syncItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderDark,
  },
  syncInfo: {
    flex: 1,
  },
  syncTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  syncSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },

  // Toggle Switch
  toggleContainer: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
  },
  toggleCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.textPrimary,
    shadowColor: Colors.emerald,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
  },

  // Data Usage Section
  usageContainer: {
    padding: 16,
    gap: 8,
  },
  usageButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  usageButtonPrimary: {
    backgroundColor: Colors.emerald,
  },
  usageButtonSecondary: {
    backgroundColor: Colors.bgCardHover,
    borderWidth: 1,
    borderColor: Colors.borderDark,
  },
  usageButtonPrimaryText: {
    color: Colors.bgPrimary,
    fontSize: 14,
    fontWeight: '500',
  },
  usageButtonSecondaryText: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SettingsScreen;