import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet } from 'react-native';
import { useTodayNameDays } from '../hooks/useNameDays';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../context/SettingsContext';
import { Calendar as CalendarIcon } from 'lucide-react-native';

const GREEK_BLUE = '#0D5EAF';
const HOLIDAY_RED = '#dc2626';

const HomeScreen = () => {
  const { data, isLoading, error } = useTodayNameDays();
  const { isDarkMode, language } = useSettings();

  const bgColor = isDarkMode ? '#111827' : '#fff';
  const textColor = isDarkMode ? '#f9fafb' : '#111827';
  const subtextColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const cardBg = isDarkMode ? '#1f2937' : '#f9fafb';

  const labels = {
    today: language === 'el' ? 'Σήμερα' : 'Today',
    celebrating: language === 'el' ? 'Γιορτάζουν' : 'Celebrating Names',
    noNames: language === 'el' ? 'Δεν γιορτάζει κανείς σήμερα.' : 'No names celebrating today.',
    saints: language === 'el' ? 'Άγιοι & Εορτές' : 'Saints & Feasts',
    holidays: language === 'el' ? 'Αργίες & Εθνικές Εορτές' : 'Holidays & National Events',
    noHolidays: language === 'el' ? 'Δεν υπάρχουν αργίες σήμερα.' : 'No holidays today.',
    loading: language === 'el' ? 'Φόρτωση...' : 'Loading...',
    error: language === 'el' ? 'Αποτυχία φόρτωσης' : 'Failed to load data',
  };

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: bgColor }]}>
        <ActivityIndicator size="large" color={GREEK_BLUE} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, { backgroundColor: bgColor }]}>
        <Text style={styles.errorText}>{labels.error}</Text>
      </View>
    );
  }

  const hasHolidays = data?.other_info && data.other_info.length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.headerSection}>
            <Text style={[styles.headerTitle, { color: textColor }]}>{labels.today}</Text>
            <Text style={[styles.headerDate, { color: subtextColor }]}>
              {new Date().toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Text>
        </View>

        {/* Holidays Section - Show prominently if there are holidays */}
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
                        <View key={index} style={styles.nameBadge}>
                            <Text style={styles.nameText}>{name}</Text>
                        </View>
                    ))}
                </View>
            )}
        </View>

        <View style={[styles.saintsCard, { backgroundColor: cardBg }]}>
             <Text style={[styles.saintsTitle, { color: textColor }]}>{labels.saints}</Text>
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
  holidayCard: {
    backgroundColor: HOLIDAY_RED,
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
    backgroundColor: GREEK_BLUE,
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
