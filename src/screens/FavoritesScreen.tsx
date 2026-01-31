import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQueries } from '@tanstack/react-query';
import { useFavorites, FavoriteItem } from '../context/FavoritesContext';
import { useSettings } from '../context/SettingsContext';
import { searchNameDays } from '../services/api';
import { Trash2, Bell, BellOff, ChevronDown, ChevronUp, Calendar } from 'lucide-react-native';
import { COLORS, getThemeColors } from '../constants/theme';

interface FavoriteWithDate extends FavoriteItem {
  dateStr?: string;
}

const FavoritesScreen = () => {
  const { favorites, removeFavorite, toggleFavoriteNotify, setFavoriteTimings } = useFavorites();
  const { isDarkMode, language, notificationsEnabled } = useSettings();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const theme = getThemeColors(isDarkMode);

  const labels = useMemo(() => ({
    title: language === 'el' ? 'Αγαπημένα' : 'Favorites',
    empty: language === 'el' ? 'Δεν έχετε αγαπημένα ακόμα.\nΑναζητήστε ένα όνομα και πατήστε το ❤️ για να το προσθέσετε.' : 'No favorites yet.\nSearch for a name and tap ❤️ to add it.',
    deleteConfirm: language === 'el' ? 'Αφαίρεση από αγαπημένα;' : 'Remove from favorites?',
    cancel: language === 'el' ? 'Άκυρο' : 'Cancel',
    remove: language === 'el' ? 'Αφαίρεση' : 'Remove',
    notify: language === 'el' ? 'Ειδοποίηση' : 'Notify',
    notifyWhen: language === 'el' ? 'Πότε να ειδοποιηθώ:' : 'When to notify:',
    sameDay: language === 'el' ? 'Την ημέρα' : 'Same day',
    oneDayBefore: language === 'el' ? '1 μέρα πριν' : '1 day before',
    twoDaysBefore: language === 'el' ? '2 μέρες πριν' : '2 days before',
    threeDaysBefore: language === 'el' ? '3 μέρες πριν' : '3 days before',
    notificationsOff: language === 'el' ? 'Οι ειδοποιήσεις είναι απενεργοποιημένες. Ενεργοποιήστε τες στις Ρυθμίσεις.' : 'Notifications are disabled. Enable them in Settings.',
  }), [language]);

  const timingOptions = useMemo(() => [
    { value: 0, label: labels.sameDay },
    { value: 1, label: labels.oneDayBefore },
    { value: 2, label: labels.twoDaysBefore },
    { value: 3, label: labels.threeDaysBefore },
    { value: 5, label: language === 'el' ? '5 μέρες πριν' : '5 days before' },
    { value: 7, label: language === 'el' ? '1 εβδομάδα πριν' : '1 week before' },
    { value: 14, label: language === 'el' ? '2 εβδομάδες πριν' : '2 weeks before' },
  ], [labels, language]);

  // Use React Query's useQueries for batch fetching with automatic caching
  const dateQueries = useQueries({
    queries: favorites.map((fav) => ({
      queryKey: ['nameDays', 'search', fav.name],
      queryFn: () => searchNameDays(fav.name),
      staleTime: 1000 * 60 * 60 * 24 * 7, // 7 days
      gcTime: 1000 * 60 * 60 * 24 * 30, // 30 days cache
    })),
  });

  // Merge favorites with their celebration dates
  const favoritesWithDates = useMemo((): FavoriteWithDate[] => {
    return favorites.map((fav, index) => {
      const query = dateQueries[index];
      const dateStr = query.data?.[0]?.date_str;
      return { ...fav, dateStr };
    });
  }, [favorites, dateQueries]);

  const handleRemove = useCallback((name: string) => {
    Alert.alert(
      labels.deleteConfirm,
      name,
      [
        { text: labels.cancel, style: 'cancel' },
        { text: labels.remove, style: 'destructive', onPress: () => removeFavorite(name) },
      ]
    );
  }, [labels, removeFavorite]);

  const toggleTiming = useCallback((name: string, currentTimings: number[], timing: number) => {
    let newTimings: number[];
    if (currentTimings.includes(timing)) {
      newTimings = currentTimings.filter(t => t !== timing);
      if (newTimings.length === 0) newTimings = [0]; // At least one timing required
    } else {
      newTimings = [...currentTimings, timing].sort();
    }
    setFavoriteTimings(name, newTimings);
  }, [setFavoriteTimings]);

  const renderItem = ({ item }: { item: FavoriteWithDate }) => {
    const isExpanded = expandedItem === item.name;
    
    return (
      <View style={[styles.card, { backgroundColor: theme.card }]}>
        <View style={styles.cardHeader}>
          <View style={styles.cardLeft}>
            <Text style={[styles.nameText, { color: theme.text }]}>{item.name}</Text>
            {item.dateStr && (
              <View style={styles.dateRow}>
                <Calendar color={COLORS.greekBlue} size={14} />
                <Text style={[styles.dateText, { color: COLORS.greekBlue }]}>{item.dateStr}</Text>
              </View>
            )}
          </View>
          <View style={styles.cardActions}>
            {notificationsEnabled && (
              <TouchableOpacity 
                onPress={() => setExpandedItem(isExpanded ? null : item.name)} 
                style={styles.actionButton}
              >
                {item.notifyEnabled ? (
                  <Bell color={COLORS.greekBlue} size={20} />
                ) : (
                  <BellOff color={theme.subtext} size={20} />
                )}
                {isExpanded ? (
                  <ChevronUp color={theme.subtext} size={16} />
                ) : (
                  <ChevronDown color={theme.subtext} size={16} />
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handleRemove(item.name)} style={styles.deleteButton}>
              <Trash2 color="#ef4444" size={20} />
            </TouchableOpacity>
          </View>
        </View>
        
        {isExpanded && notificationsEnabled && (
          <View style={styles.expandedSection}>
            <View style={styles.notifyRow}>
              <Text style={[styles.notifyLabel, { color: theme.text }]}>{labels.notify}</Text>
              <Switch
                value={item.notifyEnabled}
                onValueChange={() => toggleFavoriteNotify(item.name)}
                trackColor={{ false: '#d1d5db', true: COLORS.greekBlue }}
                thumbColor="#fff"
              />
            </View>
            
            {item.notifyEnabled && (
              <>
                <Text style={[styles.timingLabel, { color: theme.subtext }]}>{labels.notifyWhen}</Text>
                <View style={styles.timingButtons}>
                  {timingOptions.map((option) => {
                    const isSelected = item.notifyTimings.includes(option.value);
                    return (
                      <TouchableOpacity
                        key={option.value}
                        style={[styles.timingButton, isSelected && styles.timingButtonActive]}
                        onPress={() => toggleTiming(item.name, item.notifyTimings, option.value)}
                      >
                        <Text style={[styles.timingButtonText, isSelected && styles.timingButtonTextActive]}>
                          {option.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </>
            )}
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{labels.title}</Text>
        
        {!notificationsEnabled && favorites.length > 0 && (
          <View style={styles.warningBanner}>
            <BellOff color={COLORS.favoriteGold} size={16} />
            <Text style={styles.warningText}>{labels.notificationsOff}</Text>
          </View>
        )}
        
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: theme.subtext }]}>{labels.empty}</Text>
          </View>
        ) : (
          <FlatList
            data={favoritesWithDates}
            keyExtractor={(item) => item.name}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20 }}
            extraData={expandedItem}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  warningText: {
    color: '#f59e0b',
    fontSize: 13,
    marginLeft: 8,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  card: {
    borderRadius: 12,
    marginBottom: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.greekBlue,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardLeft: {
    flex: 1,
  },
  nameText: {
    fontSize: 18,
    fontWeight: '600',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  dateText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginRight: 4,
  },
  deleteButton: {
    padding: 8,
  },
  expandedSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128,128,128,0.2)',
  },
  notifyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  notifyLabel: {
    fontSize: 16,
  },
  timingLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  timingButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    backgroundColor: COLORS.greekBlue,
    borderColor: COLORS.greekBlue,
  },
  timingButtonText: {
    fontSize: 13,
    color: '#6b7280',
  },
  timingButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default FavoritesScreen;
