import React, { useCallback, useMemo } from 'react';
import { View, Text, Switch, TouchableOpacity, StyleSheet, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { useFavorites } from '../context/FavoritesContext';
import { Moon, Sun, Globe, Info, ExternalLink, Github, Heart, Bell, Trash2 } from 'lucide-react-native';
import { COLORS, getThemeColors } from '../constants/theme';

const SettingsScreen = () => {
  const { language, setLanguage, setTheme, isDarkMode, notificationsEnabled, setNotificationsEnabled } = useSettings();
  const { favorites, clearAllFavorites } = useFavorites();

  const toggleTheme = useCallback(() => {
    setTheme(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setTheme]);

  const theme = getThemeColors(isDarkMode);

  const currentYear = new Date().getFullYear();
  const copyrightYears = currentYear > 2026 ? `2026-${currentYear}` : '2026';

  const labels = useMemo(() => ({
    title: language === 'el' ? 'Ρυθμίσεις' : 'Settings',
    appearance: language === 'el' ? 'ΕΜΦΑΝΙΣΗ' : 'APPEARANCE',
    darkMode: language === 'el' ? 'Σκούρο Θέμα' : 'Dark Mode',
    languageSection: language === 'el' ? 'ΓΛΩΣΣΑ' : 'LANGUAGE',
    language: language === 'el' ? 'Γλώσσα' : 'Language',
    notifications: language === 'el' ? 'ΕΙΔΟΠΟΙΗΣΕΙΣ' : 'NOTIFICATIONS',
    enableNotifications: language === 'el' ? 'Ειδοποιήσεις' : 'Notifications',
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
    notifyHint: language === 'el' 
      ? 'Ρυθμίστε πότε θα ειδοποιηθείτε για κάθε αγαπημένο στην καρτέλα Αγαπημένα' 
      : 'Set when to be notified for each favorite in the Favorites tab',
  }), [language]);

  const handleClearFavorites = useCallback(() => {
    Alert.alert(
      labels.clearFavorites,
      labels.clearConfirm,
      [
        { text: labels.cancel, style: 'cancel' },
        { text: labels.delete, style: 'destructive', onPress: () => clearAllFavorites() },
      ]
    );
  }, [labels, clearAllFavorites]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{labels.title}</Text>

        {/* Appearance Section */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>{labels.appearance}</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              {isDarkMode ? <Moon color={theme.text} size={22} /> : <Sun color={theme.text} size={22} />}
              <Text style={[styles.rowLabel, { color: theme.text }]}>{labels.darkMode}</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#d1d5db', true: COLORS.greekBlue }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* Language Section */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>{labels.languageSection}</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Globe color={theme.text} size={22} />
              <Text style={[styles.rowLabel, { color: theme.text }]}>{labels.language}</Text>
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
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>{labels.notifications}</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Bell color={theme.text} size={22} />
              <Text style={[styles.rowLabel, { color: theme.text }]}>{labels.enableNotifications}</Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#d1d5db', true: COLORS.greekBlue }}
              thumbColor="#fff"
            />
          </View>
          {notificationsEnabled && (
            <>
              <View style={styles.divider} />
              <View style={styles.row}>
                <Text style={[styles.notifyHint, { color: theme.subtext }]}>
                  {labels.notifyHint}
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Favorites Section */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>{labels.favorites}</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <TouchableOpacity style={styles.row} onPress={handleClearFavorites} disabled={favorites.length === 0}>
            <View style={styles.rowLeft}>
              <Trash2 color={favorites.length > 0 ? '#ef4444' : theme.subtext} size={22} />
              <Text style={[styles.rowLabel, { color: favorites.length > 0 ? '#ef4444' : theme.subtext }]}>
                {labels.clearFavorites} ({favorites.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>{labels.about}</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Info color={theme.text} size={22} />
              <Text style={[styles.rowLabel, { color: theme.text }]}>{labels.developer}</Text>
            </View>
            <Text style={[styles.rowValue, { color: theme.subtext }]}>athanasso</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.row}>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowLabel, { color: theme.text, marginLeft: 0 }]}>{labels.version}</Text>
            </View>
            <Text style={[styles.rowValue, { color: theme.subtext }]}>1.1.0</Text>
          </View>
          <View style={styles.divider} />
          <TouchableOpacity 
            style={styles.row}
            onPress={() => Linking.openURL('https://github.com/athanasso/eortologio')}
          >
            <View style={styles.rowLeft}>
              <Github color={theme.text} size={22} />
              <Text style={[styles.rowLabel, { color: theme.text }]}>{labels.gitRepo}</Text>
            </View>
            <ExternalLink color={theme.subtext} size={18} />
          </TouchableOpacity>
        </View>

        {/* Credits Section */}
        <Text style={[styles.sectionTitle, { color: theme.subtext }]}>{labels.credits}</Text>
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <TouchableOpacity 
            style={styles.row}
            onPress={() => Linking.openURL('https://eortologio.iliasdev.com/docs')}
          >
            <View style={styles.rowLeft}>
              <Heart color={COLORS.greekBlue} size={22} />
              <Text style={[styles.rowLabel, { color: theme.text }]}>{labels.apiCredits}</Text>
            </View>
            <ExternalLink color={theme.subtext} size={18} />
          </TouchableOpacity>
        </View>

        <Text style={[styles.footer, { color: theme.subtext }]}>
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
    backgroundColor: COLORS.greekBlue,
    borderColor: COLORS.greekBlue,
  },
  langButtonText: {
    fontSize: 15,
    color: '#6b7280',
  },
  langButtonTextActive: {
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
