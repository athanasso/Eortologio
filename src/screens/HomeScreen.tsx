import React, { useMemo } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useTodayNameDays } from '../hooks/useNameDays';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { useFavorites } from '../context/FavoritesContext';
import { Calendar as CalendarIcon, Heart, Star } from 'lucide-react-native';
import { COLORS, getThemeColors } from '../constants/theme';

const HomeScreen = () => {
  const { data, isLoading, error } = useTodayNameDays();
  const { isDarkMode, language } = useSettings();
  const { isFavorite } = useFavorites();

  const theme = getThemeColors(isDarkMode);

  const labels = useMemo(() => ({
    today: language === 'el' ? 'Σήμερα' : 'Today',
    celebrating: language === 'el' ? 'Γιορτάζουν' : 'Celebrating Names',
    noNames: language === 'el' ? 'Δεν γιορτάζει κανείς σήμερα.' : 'No names celebrating today.',
    saints: language === 'el' ? 'Άγιοι & Εορτές' : 'Saints & Feasts',
    holidays: language === 'el' ? 'Αργίες & Εθνικές Εορτές' : 'Holidays & National Events',
    noHolidays: language === 'el' ? 'Δεν υπάρχουν αργίες σήμερα.' : 'No holidays today.',
    loading: language === 'el' ? 'Φόρτωση...' : 'Loading...',
    error: language === 'el' ? 'Αποτυχία φόρτωσης' : 'Failed to load data',
    yourFavorites: language === 'el' ? 'Τα αγαπημένα σου γιορτάζουν!' : 'Your favorites are celebrating!',
  }), [language]);

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={COLORS.greekBlue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: theme.background }]}>
        <Text style={styles.errorText}>{labels.error}</Text>
      </View>
    );
  }

  const hasHolidays = data?.other_info && data.other_info.length > 0;
  
  // Find which favorites are celebrating today
  const celebratingFavorites = data?.celebrating_names.filter(name => isFavorite(name)) || [];
  const hasCelebratingFavorites = celebratingFavorites.length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.headerSection}>
            <Text style={[styles.headerTitle, { color: theme.text }]}>{labels.today}</Text>
            <Text style={[styles.headerDate, { color: theme.subtext }]}>
              {new Date().toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
        </View>

        {/* Favorites Celebrating Today */}
        {hasCelebratingFavorites && (
          <View style={styles.favoritesCard}>
            <View style={styles.favoritesHeader}>
              <Star color="#fff" fill="#fff" size={20} />
              <Text style={styles.favoritesTitle}>{labels.yourFavorites}</Text>
            </View>
            <View style={styles.namesContainer}>
              {celebratingFavorites.map((name, index) => (
                <View key={index} style={styles.favoriteBadge}>
                  <Text style={styles.favoriteNameText}>{name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Holidays Section */}
        {hasHolidays && (
          <View style={styles.holidayCard}>
            <View style={styles.holidayHeader}>
              <CalendarIcon color="#fff" size={20} />
              <Text style={styles.holidayTitle}>{labels.holidays}</Text>
            </View>
            {data?.other_info.map((info, index) => (
              <Text key={index} style={styles.holidayItem}>• {info}</Text>
            ))}
          </View>
        )}

        <View style={styles.namesCard}>
            <Text style={styles.cardTitle}>{labels.celebrating}</Text>
            {data?.celebrating_names.length === 0 ? (
                <Text style={styles.emptyText}>{labels.noNames}</Text>
            ) : (
                <View style={styles.namesContainer}>
                    {data?.celebrating_names.map((name, index) => (
                        <View key={index} style={[styles.nameBadge, isFavorite(name) && styles.favoriteName]}>
                            {isFavorite(name) && <Heart color="#fff" fill="#fff" size={12} style={{ marginRight: 4 }} />}
                            <Text style={styles.nameText}>{name}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>

        <View style={[styles.saintsCard, { backgroundColor: theme.card }]}>
             <Text style={[styles.saintsTitle, { color: theme.text }]}>{labels.saints}</Text>
             {data?.saints.map((saint, index) => (
                 <Text key={index} style={[styles.saintItem, { color: isDarkMode ? '#d1d5db' : '#374151' }]}>• {saint}</Text>
             ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  scrollView: {
    padding: 16,
  },
  headerSection: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  headerDate: {
    fontSize: 18,
    marginTop: 4,
  },
  favoritesCard: {
    backgroundColor: COLORS.favoriteGold,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  favoritesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  favoritesTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  favoriteBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  favoriteNameText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  holidayCard: {
    backgroundColor: COLORS.holidayRed,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  holidayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  holidayTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  holidayItem: {
    color: '#fff',
    fontSize: 15,
    marginBottom: 4,
    opacity: 0.95,
  },
  namesCard: {
    backgroundColor: COLORS.greekBlue,
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  emptyText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  namesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  nameBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteName: {
    backgroundColor: 'rgba(245, 158, 11, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  nameText: {
    color: '#fff',
    fontWeight: '500',
  },
  saintsCard: {
    borderRadius: 16,
    padding: 24,
  },
  saintsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  saintItem: {
    fontSize: 15,
    marginBottom: 8,
  },
});

export default HomeScreen;
