import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'el' | 'en';
type Theme = 'light' | 'dark';
type NotificationTiming = 0 | 1 | 2 | 3; // 0 = same day, 1 = 1 day before, 2 = 2 days before, 3 = 3 days before

interface SettingsContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
  isLoading: boolean;
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
  notificationTiming: NotificationTiming;
  setNotificationTiming: (timing: NotificationTiming) => void;
}

const STORAGE_KEYS = {
  LANGUAGE: '@eortologio_language',
  THEME: '@eortologio_theme',
  NOTIFICATIONS_ENABLED: '@eortologio_notifications',
  NOTIFICATION_TIMING: '@eortologio_notification_timing',
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>('el');
  const [theme, setThemeState] = useState<Theme>('light');
  const [notificationsEnabled, setNotificationsEnabledState] = useState(false);
  const [notificationTiming, setNotificationTimingState] = useState<NotificationTiming>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load settings from storage on mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [storedLanguage, storedTheme, storedNotifications, storedTiming] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
          AsyncStorage.getItem(STORAGE_KEYS.THEME),
          AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED),
          AsyncStorage.getItem(STORAGE_KEYS.NOTIFICATION_TIMING),
        ]);

        if (storedLanguage === 'el' || storedLanguage === 'en') {
          setLanguageState(storedLanguage);
        }
        if (storedTheme === 'light' || storedTheme === 'dark') {
          setThemeState(storedTheme);
        }
        if (storedNotifications !== null) {
          setNotificationsEnabledState(storedNotifications === 'true');
        }
        if (storedTiming !== null) {
          const timing = parseInt(storedTiming, 10);
          if ([0, 1, 2, 3].includes(timing)) {
            setNotificationTimingState(timing as NotificationTiming);
          }
        }
      } catch (error) {
        console.error('Failed to load settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
    } catch (error) {
      console.error('Failed to save language:', error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  const setNotificationsEnabled = async (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATIONS_ENABLED, enabled.toString());
    } catch (error) {
      console.error('Failed to save notifications setting:', error);
    }
  };

  const setNotificationTiming = async (timing: NotificationTiming) => {
    setNotificationTimingState(timing);
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.NOTIFICATION_TIMING, timing.toString());
    } catch (error) {
      console.error('Failed to save notification timing:', error);
    }
  };

  return (
    <SettingsContext.Provider value={{
      language,
      setLanguage,
      theme,
      setTheme,
      isDarkMode: theme === 'dark',
      isLoading,
      notificationsEnabled,
      setNotificationsEnabled,
      notificationTiming,
      setNotificationTiming,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
