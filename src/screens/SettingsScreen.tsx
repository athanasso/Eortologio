import React from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { useFavorites } from '../context/FavoritesContext';
import { Moon, Sun, Globe, Info, ExternalLink, Github, Heart, Bell, Trash2 } from 'lucide-react-native';

const GREEK_BLUE = '#0D5EAF';

const SettingsScreen = () => {
  const { language, setLanguage, theme, setTheme, isDarkMode, notificationsEnabled, setNotificationsEnabled, notificationTiming, setNotificationTiming } = useSettings();
  const { favorites, clearAllFavorites } = useFavorites();

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
    notifications: language === 'el' ? 'ΕΙΔΟΠΟΙΗΣΕΙΣ' : 'NOTIFICATIONS',
    enableNotifications: language === 'el' ? 'Ειδοποιήσεις' : 'Notifications',
    notifyBefore: language === 'el' ? 'Πότε να ειδοποιηθώ' : 'When to notify',
    sameDay: language === 'el' ? 'Την ημέρα' : 'Same day',
    oneDayBefore: language === 'el' ? '1 μέρα πριν' : '1 day before',
    twoDaysBefore: language === 'el' ? '2 μέρες πριν' : '2 days before',
    threeDaysBefore: language === 'el' ? '3 μέρες πριν' : '3 days before',
    favorites: language === 'el' ? 'ΑΓΑΠΗΜΕΝΑ' : 'FAVORITES',
    clearFavorites: language === 'el' ? 'Διαγραφή όλων' : 'Clear all favorites',
    clearConfirm: language === 'el' ? 'Σίγουρα θέλετε να διαγράψετε όλα τα αγαπημένα;' : 'Are you sure you want to delete all favorites?',
    cancel: language === 'el' ? 'Άκυρο' : 'Cancel',
    delete: language === 'el' ? 'Διαγραφή' : 'Delete',
    about: language === 'el' ? 'ΣΧΕΤΙΚΑ' : 'ABOUT',
    developer: language === 'el' ? 'Προγραμματιστής' : 'Developer',
    version: language === 'el' ? 'Έκδοση' : 'Version',
    gitRepo: language === 'el' ? 'Αποθετήριο GitHub' : 'GitHub Repository',
    credits: language === 'el' ? 'ΕΥΧΑΡΙΣΤΙΕΣ' : 'CREDITS',
    apiCredits: language === 'el' ? 'API: iliasdev' : 'API: iliasdev',
  };

  const timingOptions = [
    { value: 0, label: labels.sameDay },
    { value: 1, label: labels.oneDayBefore },
    { value: 2, label: labels.twoDaysBefore },
    { value: 3, label: labels.threeDaysBefore },
  ];

  const handleClearFavorites = () => {
    Alert.alert(
      labels.clearFavorites,
      labels.clearConfirm,
      [
        { text: labels.cancel, style: 'cancel' },
        { text: labels.delete, style: 'destructive', onPress: () => clearAllFavorites() },
      ]
    );
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

        {/* Notifications Section */}
        <Text style={[styles.sectionTitle, { color: subtextColor }]}>{labels.notifications}</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Bell color={textColor} size={22} />
              <Text style={[styles.rowLabel, { color: textColor }]}>{labels.enableNotifications}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d5db', true: GREEK_BLUE }}
              thumbColor="#fff"
            />
          </View>
          {notificationsEnabled && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={[styles.notifyHint, { color: subtextColor }]}>
                  {language === 'el' ? 'Ρυθμίστε πότε θα ειδοποιηθείτε για κάθε αγαπημένο στην καρτέλα Αγαπημένα' : 'Set when to be notified for each favorite in the Favorites tab'}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Favorites Section */}
        <Text style={[styles.sectionTitle, { color: subtextColor }]}>{labels.favorites}</Text>
        <View style={[styles.card, { backgroundColor: cardBg }]}>
          <TouchableOpacity style={styles.row} onPress={handleClearFavorites} disabled={favorites.length === 0}>
            <View style={styles.rowLeft}>
              <Trash2 color={favorites.length > 0 ? '#ef4444' : subtextColor} size={22} />
              <Text style={[styles.rowLabel, { color: favorites.length > 0 ? '#ef4444' : subtextColor }]}>
                {labels.clearFavorites} ({favorites.length})
              </Text>
            </View>
          </TouchableOpacity>
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
            <Text style={[styles.rowValue, { color: subtextColor }]}>1.1.0</Text>
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
  timingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 8,
  },
  timingButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  timingButtonActive: {
    backgroundColor: GREEK_BLUE,
    borderColor: GREEK_BLUE,
  },
  timingButtonText: {
    fontSize: 13,
    color: '#6b7280',
  },
  timingButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  notifyHint: {
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 32,
    fontSize: 13,
  },
});

export default SettingsScreen;
