import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { Moon, Sun, Globe, Info, ExternalLink, Github, Heart } from 'lucide-react-native';

const GREEK_BLUE = '#0D5EAF';

const SettingsScreen = () => {
  const { language, setLanguage, theme, setTheme, isDarkMode } = useSettings();

  const toggleTheme = () => {
    setTheme(isDarkMode ? 'light' : 'dark');
  };

  const bgColor = isDarkMode ? '#111827' : '#fff';
  const textColor = isDarkMode ? '#f9fafb' : '#111827';
  const cardBg = isDarkMode ? '#1f2937' : '#f3f4f6';
  const subtextColor = isDarkMode ? '#9ca3af' : '#6b7280';

  const currentYear = new Date().getFullYear();
  const copyrightYears = currentYear > 2026 ? `2026-${currentYear}` : '2026';

  const labels = {
    title: language === 'el' ? 'Ρυθμίσεις' : 'Settings',
    appearance: language === 'el' ? 'ΕΜΦΑΝΙΣΗ' : 'APPEARANCE',
    darkMode: language === 'el' ? 'Σκούρο Θέμα' : 'Dark Mode',
    languageSection: language === 'el' ? 'ΓΛΩΣΣΑ' : 'LANGUAGE',
    language: language === 'el' ? 'Γλώσσα' : 'Language',
    about: language === 'el' ? 'ΣΧΕΤΙΚΑ' : 'ABOUT',
    developer: language === 'el' ? 'Προγραμματιστής' : 'Developer',
    version: language === 'el' ? 'Έκδοση' : 'Version',
    apiDocs: language === 'el' ? 'API Documentation' : 'API Documentation',
    gitRepo: language === 'el' ? 'Αποθετήριο GitHub' : 'GitHub Repository',
    credits: language === 'el' ? 'ΕΥΧΑΡΙΣΤΙΕΣ' : 'CREDITS',
    apiCredits: language === 'el' ? 'API: iliasdev' : 'API: iliasdev',
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{labels.title}</Text>

        {/* Appearance Section */}
        <Text style={[styles.sectionTitle, { color: subtextColor }]}>{labels.appearance}</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              {isDarkMode ? <Moon color={textColor} size={22} /> : <Sun color={textColor} size={22} />}
              <Text style={[styles.rowLabel, { color: textColor }]}>{labels.darkMode}</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#d1d5db', true: GREEK_BLUE }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Language Section */}
        <Text style={[styles.sectionTitle, { color: subtextColor }]}>{labels.languageSection}</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Globe color={textColor} size={22} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{labels.language}</Text>
            </View>
          </View>
          <View style={styles.languageButtons}>
            <TouchableOpacity
              style={[styles.langButton, language === 'el' && styles.langButtonActive]}
              onPress={() => setLanguage('el')}
            >
              <Text style={[styles.langButtonText, language === 'el' && styles.langButtonTextActive]}>
                Ελληνικά
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.langButton, language === 'en' && styles.langButtonActive]}
              onPress={() => setLanguage('en')}
            >
              <Text style={[styles.langButtonText, language === 'en' && styles.langButtonTextActive]}>
                English
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* About Section */}
        <Text style={[styles.sectionTitle, { color: subtextColor }]}>{labels.about}</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Info color={textColor} size={22} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{labels.developer}</Text>
            </View>
            <Text style={[styles.rowValue, { color: subtextColor }]}>athanasso</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowLabel, { color: textColor, marginLeft: 0 }]}>{labels.version}</Text>
            </View>
            <Text style={[styles.rowValue, { color: subtextColor }]}>1.0.0</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.row}
            onPress={() => Linking.openURL('https://github.com/athanasso/eortologio')}
          >
            <View style={styles.rowLeft}>
              <Github color={textColor} size={22} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{labels.gitRepo}</Text>
            </View>
            <ExternalLink color={subtextColor} size={18} />
          </TouchableOpacity>
        </View>

        {/* Credits Section */}
        <Text style={[styles.sectionTitle, { color: subtextColor }]}>{labels.credits}</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <TouchableOpacity 
            style={styles.row}
            onPress={() => Linking.openURL('https://eortologio.iliasdev.com/docs')}
          >
            <View style={styles.rowLeft}>
              <Heart color={GREEK_BLUE} size={22} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{labels.apiCredits}</Text>
            </View>
            <ExternalLink color={subtextColor} size={18} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.footer, { color: subtextColor }]}>
          Eortologio App © {copyrightYears}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  card: {
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowLabel: {
    fontSize: 16,
    marginLeft: 12,
  },
  rowValue: {
    fontSize: 15,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128,128,128,0.2)',
    marginHorizontal: 12,
  },
  languageButtons: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  langButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  langButtonActive: {
    backgroundColor: GREEK_BLUE,
    borderColor: GREEK_BLUE,
  },
  langButtonText: {
    fontSize: 15,
    color: '#6b7280',
  },
  langButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  footer: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
    fontSize: 13,
  },
});

export default SettingsScreen;
