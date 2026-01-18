import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { SettingsProvider, useSettings } from './src/context/SettingsContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import RootNavigator from './src/navigation/RootNavigator';

const queryClient = new QueryClient();

// Inner component that uses settings for FavoritesProvider
function AppContent() {
  const { notificationsEnabled, language } = useSettings();
  
  return (
    <FavoritesProvider notificationsEnabled={notificationsEnabled} language={language}>
      <RootNavigator />
    </FavoritesProvider>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <SettingsProvider>
          <AppContent />
        </SettingsProvider>
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
