import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSearchNameDays } from '../hooks/useNameDays';
import { Search } from 'lucide-react-native';
import { useSettings } from '../context/SettingsContext';

const GREEK_BLUE = '#0D5EAF';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const { data, isLoading, refetch, isFetched } = useSearchNameDays(query, false);
  const { isDarkMode, language } = useSettings();

  const bgColor = isDarkMode ? '#111827' : '#fff';
  const textColor = isDarkMode ? '#f9fafb' : '#111827';
  const subtextColor = isDarkMode ? '#9ca3af' : '#6b7280';
  const cardBg = isDarkMode ? '#1f2937' : '#fff';
  const inputBg = isDarkMode ? '#374151' : '#f9fafb';
  const borderColor = isDarkMode ? '#4b5563' : '#d1d5db';

  // Labels are now derived fresh each render based on current language
  const getLabels = () => ({
    title: language === 'el' ? 'Αναζήτηση' : 'Search',
    placeholder: language === 'el' ? 'Αναζήτηση ονόματος...' : 'Search for a name...',
    noResults: language === 'el' ? 'Δεν βρέθηκαν αποτελέσματα για' : 'No results found for',
    also: language === 'el' ? 'Επίσης:' : 'Also:',
  });

  const labels = getLabels();

  const handleSearch = () => {
    if (query.trim()) {
        refetch();
    }
  };

  // Use a renderItem function that reads labels at render time
  const renderResultItem = ({ item }: { item: any }) => {
    const currentLabels = getLabels();
    return (
      <View style={[styles.resultCard, { backgroundColor: cardBg, borderColor: isDarkMode ? '#374151' : '#f3f4f6' }]}>
        <Text style={styles.resultDate}>{item.date_str}</Text>
        <Text style={[styles.resultDescription, { color: isDarkMode ? '#d1d5db' : '#4b5563' }]}>{item.saint_description}</Text>
        {item.related_names && item.related_names.length > 0 && (
          <Text style={[styles.relatedNames, { color: subtextColor }]}>{currentLabels.also} {item.related_names.join(', ')}</Text>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: textColor }]}>{labels.title}</Text>
        
        <View style={[styles.searchBox, { backgroundColor: inputBg, borderColor }]}>
            <Search color={subtextColor} size={20} />
            <TextInput 
                style={[styles.searchInput, { color: textColor }]}
                placeholder={labels.placeholder}
                placeholderTextColor={subtextColor}
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
            />
        </View>

        {isLoading && <ActivityIndicator size="large" color={GREEK_BLUE} />}

        {isFetched && data?.length === 0 && (
             <Text style={[styles.noResults, { color: subtextColor }]}>{labels.noResults} "{query}"</Text>
        )}

        <FlatList 
            data={data}
            extraData={language}
            keyExtractor={(item, index) => `${item.date_str}-${index}`}
            renderItem={renderResultItem}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 16,
  },
  resultCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: GREEK_BLUE,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  resultDate: {
    color: GREEK_BLUE,
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 4,
  },
  resultDescription: {
    marginBottom: 8,
  },
  relatedNames: {
    fontSize: 13,
  },
});

export default SearchScreen;
