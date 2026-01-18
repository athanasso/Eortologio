import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { scheduleAllNotifications, cancelNotificationsForFavorite } from '../services/notifications';

export interface FavoriteItem {
  name: string;
  notifyEnabled: boolean;
  notifyTimings: number[]; // Array of days before: [0] = same day, [1] = 1 day before, etc.
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  addFavorite: (name: string) => void;
  removeFavorite: (name: string) => void;
  isFavorite: (name: string) => boolean;
  toggleFavoriteNotify: (name: string) => void;
  setFavoriteTimings: (name: string, timings: number[]) => void;
  clearAllFavorites: () => void;
  rescheduleNotifications: () => Promise<void>;
  isLoading: boolean;
}

const STORAGE_KEY = '@eortologio_favorites_v2';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

interface FavoritesProviderProps {
  children: ReactNode;
  notificationsEnabled: boolean;
  language: 'el' | 'en';
}

export const FavoritesProvider = ({ children, notificationsEnabled, language }: FavoritesProviderProps) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load favorites on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Failed to load favorites:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadFavorites();
  }, []);

  const saveFavorites = async (newFavorites: FavoriteItem[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Failed to save favorites:', error);
    }
  };

  // Reschedule all notifications
  const rescheduleNotifications = useCallback(async () => {
    await scheduleAllNotifications(favorites, notificationsEnabled, language);
  }, [favorites, notificationsEnabled, language]);

  // Auto-reschedule when favorites or settings change
  useEffect(() => {
    if (!isLoading) {
      rescheduleNotifications();
    }
  }, [favorites, notificationsEnabled, isLoading, rescheduleNotifications]);

  const addFavorite = (name: string) => {
    const trimmedName = name.trim();
    if (!favorites.some(f => f.name === trimmedName)) {
      const newFavorite: FavoriteItem = {
        name: trimmedName,
        notifyEnabled: true,
        notifyTimings: [0], // Default: notify on same day
      };
      const newFavorites = [...favorites, newFavorite];
      setFavorites(newFavorites);
      saveFavorites(newFavorites);
    }
  };

  const removeFavorite = async (name: string) => {
    await cancelNotificationsForFavorite(name);
    const newFavorites = favorites.filter(f => f.name !== name);
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const isFavorite = (name: string) => {
    return favorites.some(f => f.name === name.trim());
  };

  const toggleFavoriteNotify = (name: string) => {
    const newFavorites = favorites.map(f => 
      f.name === name ? { ...f, notifyEnabled: !f.notifyEnabled } : f
    );
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const setFavoriteTimings = (name: string, timings: number[]) => {
    const newFavorites = favorites.map(f => 
      f.name === name ? { ...f, notifyTimings: timings } : f
    );
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const clearAllFavorites = () => {
    setFavorites([]);
    saveFavorites([]);
  };

  return (
    <FavoritesContext.Provider value={{
      favorites,
      addFavorite,
      removeFavorite,
      isFavorite,
      toggleFavoriteNotify,
      setFavoriteTimings,
      clearAllFavorites,
      rescheduleNotifications,
      isLoading,
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
