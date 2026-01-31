import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSearchNameDays } from '../hooks/useNameDays';
import { Search, Heart } from 'lucide-react-native';
import { useSettings } from '../context/SettingsContext';
import { useFavorites } from '../context/FavoritesContext';
import { COLORS, getThemeColors } from '../constants/theme';

const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const { data, isLoading, refetch, isFetched } = useSearchNameDays(query, false);
  const { isDarkMode, language } = useSettings();
  const { addFavorite, removeFavorite, isFavorite } = useFavorites();

  const theme = getThemeColors(isDarkMode);

  const labels = useMemo(() => ({
    title: language === 'el' ? 'Αναζήτηση' : 'Search',
    placeholder: language === 'el' ? 'Αναζήτηση ονόματος...' : 'Search for a name...',
    noResults: language === 'el' ? 'Δεν βρέθηκαν αποτελέσματα για' : 'No results found for',
    also: language === 'el' ? 'Επίσης:' : 'Also:',
    addFav: language === 'el' ? 'Προσθήκη στα αγαπημένα' : 'Add to favorites',
  }), [language]);

  const handleSearch = useCallback(() => {
    if (query.trim()) {
      refetch();
    }
  }, [query, refetch]);

  const toggleFavorite = useCallback((name: string) => {
    if (isFavorite(name)) {
      removeFavorite(name);
    } else {
      addFavorite(name);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  const renderResultItem = useCallback(({ item }: { item: any }) => {
    const searchedName = query.trim();
    const isNameFavorite = isFavorite(searchedName);
    
    return (
      <View style={[styles.resultCard, { backgroundColor: isDarkMode ? theme.card : '#fff', borderColor: isDarkMode ? '#374151' : '#f3f4f6' }]}>
        <View style={styles.cardHeader}>
          <Text style={styles.resultDate}>{item.date_str}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(searchedName)} style={styles.favoriteButton}>
            <Heart 
              color={isNameFavorite ? '#ef4444' : theme.subtext} 
              fill={isNameFavorite ? '#ef4444' : 'transparent'} 
              size={22} 
            />
          </TouchableOpacity>
        </View>
        <Text style={[styles.resultDescription, { color: isDarkMode ? '#d1d5db' : '#4b5563' }]}>{item.saint_description}</Text>
        {item.related_names && item.related_names.length > 0 && (
          <View style={styles.relatedContainer}>
            <Text style={[styles.relatedNames, { color: theme.subtext }]}>{labels.also} </Text>
            {item.related_names.map((name: string, idx: number) => (
              <TouchableOpacity key={idx} onPress={() => toggleFavorite(name)} style={styles.relatedNameButton}>
                <Text style={[styles.relatedNameText, { color: isFavorite(name) ? '#ef4444' : theme.subtext }]}>
                  {name}{idx < item.related_names.length - 1 ? ', ' : ''}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  }, [query, isFavorite, toggleFavorite, isDarkMode, theme, labels]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>{labels.title}</Text>
        
        <View style={[styles.searchBox, { backgroundColor: theme.input, borderColor: theme.border }]}>
          <Search color={theme.subtext} size={20} />
          <TextInput 
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={labels.placeholder}
            placeholderTextColor={theme.subtext}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>

        {isLoading && <ActivityIndicator size="large" color={COLORS.greekBlue} />}

        {isFetched && data?.length === 0 && (
          <Text style={[styles.noResults, { color: theme.subtext }]}>{labels.noResults} "{query}"</Text>
        )}

        <FlatList 
          data={data}
          extraData={[language, query]}
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
    borderLeftColor: COLORS.greekBlue,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultDate: {
    color: COLORS.greekBlue,
    fontWeight: 'bold',
    fontSize: 18,
  },
  favoriteButton: {
    padding: 4,
  },
  resultDescription: {
    marginBottom: 8,
  },
  relatedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  relatedNames: {
    fontSize: 13,
  },
  relatedNameButton: {
    padding: 2,
  },
  relatedNameText: {
    fontSize: 13,
  },
});

export default SearchScreen;
