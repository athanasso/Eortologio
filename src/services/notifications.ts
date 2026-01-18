import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FavoriteItem } from '../context/FavoritesContext';
import { searchNameDays, CelebrationDate } from './api';

// Configure how notifications appear when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SCHEDULED_NOTIFICATIONS_KEY = '@eortologio_scheduled_notifications';

export interface ScheduledNotification {
  id: string;
  favoriteName: string;
  celebrationDate: string;
  daysBefore: number;
}

// Request notification permissions
export async function requestNotificationPermissions(): Promise<boolean> {
  if (!Device.isDevice) {
    console.log('Push notifications only work on physical devices');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push notification permissions');
    return false;
  }

  // Android specific channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('namedays', {
      name: 'Name Day Reminders',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0D5EAF',
    });
  }

  return true;
}

// Get the next occurrence of a date this year or next year
function getNextOccurrence(month: number, day: number): Date {
  const now = new Date();
  const thisYear = now.getFullYear();
  
  // Create date for this year
  let targetDate = new Date(thisYear, month - 1, day, 9, 0, 0); // Notify at 9 AM
  
  // If the date has passed this year, use next year
  if (targetDate < now) {
    targetDate = new Date(thisYear + 1, month - 1, day, 9, 0, 0);
  }
  
  return targetDate;
}

// Schedule notifications for a single favorite
async function scheduleNotificationsForFavorite(
  favorite: FavoriteItem,
  language: 'el' | 'en'
): Promise<ScheduledNotification[]> {
  const scheduledIds: ScheduledNotification[] = [];
  
  if (!favorite.notifyEnabled || favorite.notifyTimings.length === 0) {
    return scheduledIds;
  }

  try {
    // Search for when this name celebrates
    const celebrations = await searchNameDays(favorite.name);
    
    if (!celebrations || celebrations.length === 0) {
      return scheduledIds;
    }

    // Get the first/main celebration date
    const mainCelebration = celebrations[0];
    const celebrationDate = getNextOccurrence(mainCelebration.month, mainCelebration.day);
    
    // Schedule notification for each selected timing
    for (const daysBefore of favorite.notifyTimings) {
      const notificationDate = new Date(celebrationDate);
      notificationDate.setDate(notificationDate.getDate() - daysBefore);
      
      // Skip if notification date is in the past
      if (notificationDate <= new Date()) {
        continue;
      }

      // Create notification content
      const title = language === 'el' 
        ? `🎉 Γιορτάζει: ${favorite.name}` 
        : `🎉 Celebrating: ${favorite.name}`;
      
      let body: string;
      if (daysBefore === 0) {
        body = language === 'el' 
          ? `Σήμερα γιορτάζει ${favorite.name}! Μην ξεχάσετε να ευχηθείτε!`
          : `${favorite.name} is celebrating today! Don't forget to wish them!`;
      } else if (daysBefore === 1) {
        body = language === 'el'
          ? `Αύριο γιορτάζει ${favorite.name}!`
          : `${favorite.name} is celebrating tomorrow!`;
      } else {
        body = language === 'el'
          ? `${favorite.name} γιορτάζει σε ${daysBefore} μέρες!`
          : `${favorite.name} is celebrating in ${daysBefore} days!`;
      }

      // Schedule the notification
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data: { favoriteName: favorite.name, celebrationDate: celebrationDate.toISOString() },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DATE,
          date: notificationDate,
          channelId: Platform.OS === 'android' ? 'namedays' : undefined,
        },
      });

      scheduledIds.push({
        id: notificationId,
        favoriteName: favorite.name,
        celebrationDate: celebrationDate.toISOString(),
        daysBefore,
      });
    }
  } catch (error) {
    console.error(`Error scheduling notifications for ${favorite.name}:`, error);
  }

  return scheduledIds;
}

// Schedule all notifications based on favorites
export async function scheduleAllNotifications(
  favorites: FavoriteItem[],
  notificationsEnabled: boolean,
  language: 'el' | 'en'
): Promise<void> {
  // Cancel all existing notifications first
  await Notifications.cancelAllScheduledNotificationsAsync();
  
  if (!notificationsEnabled || favorites.length === 0) {
    await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify([]));
    return;
  }

  const permissionGranted = await requestNotificationPermissions();
  if (!permissionGranted) {
    return;
  }

  const allScheduled: ScheduledNotification[] = [];

  // Schedule notifications for each favorite
  for (const favorite of favorites) {
    const scheduled = await scheduleNotificationsForFavorite(favorite, language);
    allScheduled.push(...scheduled);
  }

  // Save record of scheduled notifications
  await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(allScheduled));
  
  console.log(`Scheduled ${allScheduled.length} notifications`);
}

// Cancel all notifications for a specific favorite
export async function cancelNotificationsForFavorite(favoriteName: string): Promise<void> {
  try {
    const storedJson = await AsyncStorage.getItem(SCHEDULED_NOTIFICATIONS_KEY);
    if (!storedJson) return;

    const scheduled: ScheduledNotification[] = JSON.parse(storedJson);
    const toCancel = scheduled.filter(s => s.favoriteName === favoriteName);
    const remaining = scheduled.filter(s => s.favoriteName !== favoriteName);

    // Cancel the notifications
    for (const notification of toCancel) {
      await Notifications.cancelScheduledNotificationAsync(notification.id);
    }

    // Update stored record
    await AsyncStorage.setItem(SCHEDULED_NOTIFICATIONS_KEY, JSON.stringify(remaining));
  } catch (error) {
    console.error('Error canceling notifications:', error);
  }
}

// Get count of scheduled notifications
export async function getScheduledNotificationCount(): Promise<number> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  return scheduled.length;
}
