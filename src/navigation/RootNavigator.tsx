import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import CalendarScreen from '../screens/CalendarScreen';
import SearchScreen from '../screens/SearchScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { Home, Calendar, Search, Heart, Settings } from 'lucide-react-native';
import { useSettings } from '../context/SettingsContext';

const Tab = createBottomTabNavigator();

const RootNavigator = () => {
  const { isDarkMode, language } = useSettings();

  const tabBarBg = isDarkMode ? '#1f2937' : '#fff';
  const activeTint = '#0D5EAF';
  const inactiveTint = isDarkMode ? '#9ca3af' : 'gray';

  const labels = {
    today: language === 'el' ? 'Σήμερα' : 'Today',
    calendar: language === 'el' ? 'Ημερολόγιο' : 'Calendar',
    search: language === 'el' ? 'Αναζήτηση' : 'Search',
    favorites: language === 'el' ? 'Αγαπημένα' : 'Favorites',
    settings: language === 'el' ? 'Ρυθμίσεις' : 'Settings',
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: activeTint,
          tabBarInactiveTintColor: inactiveTint,
          tabBarStyle: {
            backgroundColor: tabBarBg,
            borderTopWidth: 0,
            elevation: 10,
            height: 60,
            paddingBottom: 10,
            paddingTop: 10,
          },
        }}
      >
        <Tab.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{
                tabBarLabel: labels.today,
                tabBarIcon: ({ color }) => <Home color={color} size={24} />
            }}
        />
        <Tab.Screen 
            name="Calendar" 
            component={CalendarScreen} 
            options={{
                tabBarLabel: labels.calendar,
                tabBarIcon: ({ color }) => <Calendar color={color} size={24} />
            }}
        />
        <Tab.Screen 
            name="Search" 
            component={SearchScreen} 
            options={{
                tabBarLabel: labels.search,
                tabBarIcon: ({ color }) => <Search color={color} size={24} />
            }}
        />
        <Tab.Screen 
            name="Favorites" 
            component={FavoritesScreen} 
            options={{
                tabBarLabel: labels.favorites,
                tabBarIcon: ({ color }) => <Heart color={color} size={24} />
            }}
        />
        <Tab.Screen 
            name="Settings" 
            component={SettingsScreen} 
            options={{
                tabBarLabel: labels.settings,
                tabBarIcon: ({ color }) => <Settings color={color} size={24} />
            }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
