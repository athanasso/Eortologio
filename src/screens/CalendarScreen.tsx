import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMonthNameDays } from '../hooks/useNameDays';
import { useSettings } from '../context/SettingsContext';
import { COLORS, getThemeColors } from '../constants/theme';

// Configure Greek locale for calendar
LocaleConfig.locales['el'] = {
  monthNames: [
    'Ιανουάριος', 'Φεβρουάριος', 'Μάρτιος', 'Απρίλιος', 'Μάιος', 'Ιούνιος',
    'Ιούλιος', 'Αύγουστος', 'Σεπτέμβριος', 'Οκτώβριος', 'Νοέμβριος', 'Δεκέμβριος'
  ],
  monthNamesShort: [
    'Ιαν', 'Φεβ', 'Μάρ', 'Απρ', 'Μάι', 'Ιούν',
    'Ιούλ', 'Αύγ', 'Σεπ', 'Οκτ', 'Νοέ', 'Δεκ'
  ],
  dayNames: ['Κυριακή', 'Δευτέρα', 'Τρίτη', 'Τετάρτη', 'Πέμπτη', 'Παρασκευή', 'Σάββατο'],
  dayNamesShort: ['Κυρ', 'Δευ', 'Τρί', 'Τετ', 'Πέμ', 'Παρ', 'Σάβ'],
  today: 'Σήμερα'
};

LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ],
  monthNamesShort: [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  today: 'Today'
};

interface ListItem {
  type: 'holiday' | 'name';
  value: string;
}

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [calendarKey, setCalendarKey] = useState(0);
  const currentMonth = new Date(selectedDate).getMonth() + 1;
  const { isDarkMode, language } = useSettings();
  
  // Force calendar re-render when language changes
  useEffect(() => {
    LocaleConfig.defaultLocale = language;
    setCalendarKey(prev => prev + 1);
  }, [language]);

  const { data: monthData, isLoading } = useMonthNameDays(currentMonth);

  const theme = getThemeColors(isDarkMode);

  const labels = useMemo(() => ({
    title: language === 'el' ? 'Ημερολόγιο' : 'Calendar',
    noData: language === 'el' ? 'Δεν υπάρχουν στοιχεία.' : 'No data available.',
    noMajor: language === 'el' ? 'Δεν υπάρχουν μεγάλες γιορτές.' : 'No major name days.',
    holidays: language === 'el' ? 'Αργίες' : 'Holidays',
    names: language === 'el' ? 'Ονόματα' : 'Names',
  }), [language]);

  const markedDates = useMemo(() => {
    if (!monthData) return {};
    const marks: any = {};
    const year = new Date().getFullYear();

    monthData.forEach(entry => {
        const monthStr = entry.month.toString().padStart(2, '0');
        const dayStr = entry.day.toString().padStart(2, '0');
        const dateKey = `${year}-${monthStr}-${dayStr}`;
        
        const hasHoliday = entry.other_info && entry.other_info.length > 0;
        const hasNames = entry.celebrating_names.length > 0;
        
        if (hasHoliday || hasNames) {
            marks[dateKey] = { 
              marked: true, 
              dotColor: hasHoliday ? COLORS.holidayRed : COLORS.greekBlue 
            };
        }
    });

    marks[selectedDate] = { 
        ...(marks[selectedDate] || {}), 
        selected: true, 
        selectedColor: COLORS.greekBlue 
    };

    return marks;
  }, [monthData, selectedDate]);

  const selectedDayData = useMemo(() => {
     if (!monthData) return null;
     const [_, m, d] = selectedDate.split('-');
     const monthInt = parseInt(m, 10);
     const dayInt = parseInt(d, 10);

     return monthData.find(e => e.day === dayInt && e.month === monthInt);
  }, [monthData, selectedDate]);

  // Combine holidays and names into a single list for FlatList
  const listData = useMemo((): ListItem[] => {
    if (!selectedDayData) return [];
    const items: ListItem[] = [];
    
    if (selectedDayData.other_info) {
      selectedDayData.other_info.forEach(info => {
        items.push({ type: 'holiday', value: info });
      });
    }
    
    selectedDayData.celebrating_names.forEach(name => {
      items.push({ type: 'name', value: name });
    });
    
    return items;
  }, [selectedDayData]);

  const renderItem = useCallback(({ item }: { item: ListItem }) => {
    if (item.type === 'holiday') {
      return (
        <View style={styles.holidayItem}>
          <Text style={styles.holidayItemText}>{item.value}</Text>
        </View>
      );
    }
    return (
      <View style={[styles.nameItem, { backgroundColor: theme.card }]}>
        <Text style={[styles.nameItemText, { color: theme.text }]}>{item.value}</Text>
      </View>
    );
  }, [theme]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{labels.title}</Text>
        
        <Calendar 
            key={`calendar-${calendarKey}-${isDarkMode}`}
            current={selectedDate}
            onDayPress={(day: any) => setSelectedDate(day.dateString)}
            markedDates={markedDates}
            theme={{
                backgroundColor: theme.background,
                calendarBackground: theme.background,
                textSectionTitleColor: theme.subtext,
                selectedDayBackgroundColor: COLORS.greekBlue,
                selectedDayTextColor: '#fff',
                todayTextColor: COLORS.greekBlue,
                dayTextColor: theme.text,
                textDisabledColor: isDarkMode ? '#4b5563' : '#d1d5db',
                arrowColor: COLORS.greekBlue,
                monthTextColor: theme.text,
                indicatorColor: COLORS.greekBlue,
                textDayFontWeight: '400',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '500',
            }}
            onMonthChange={(month: any) => {
               setSelectedDate(month.dateString);
            }}
            enableSwipeMonths={true}
        />

        <View style={styles.detailSection}>
            <Text style={[styles.selectedDateTitle, { color: theme.text }]}>
                {new Date(selectedDate).toLocaleDateString(language === 'el' ? 'el-GR' : 'en-US', { day: 'numeric', month: 'long'})}
            </Text>
            
            {isLoading ? (
                <ActivityIndicator color={COLORS.greekBlue} />
            ) : listData.length > 0 ? (
                <FlatList 
                    data={listData}
                    keyExtractor={(item, index) => `${item.type}-${item.value}-${index}`}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={true}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            ) : (
                <Text style={{ color: theme.subtext }}>{labels.noMajor}</Text>
            )}
        </View>
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
    marginBottom: 16,
  },
  detailSection: {
    flex: 1,
    marginTop: 16,
  },
  selectedDateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  holidayItem: {
    backgroundColor: COLORS.holidayRed,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  holidayItemText: {
    color: '#fff',
    fontWeight: '500',
  },
  nameItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.greekBlue,
  },
  nameItemText: {
    fontWeight: '500',
  },
});

export default CalendarScreen;
