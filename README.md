# Eortologio 🇬🇷

A React Native app for Greek Name Days (Εορτολόγιο). Find out who is celebrating today, search for any name, and browse the calendar for upcoming celebrations.

## Features

- 📅 **Today's Celebrations** - See who is celebrating today with saints and feast information
- 🗓️ **Calendar View** - Browse any date to see name days and holidays
- 🔍 **Name Search** - Find when any Greek name celebrates
- 🎉 **Holidays** - View Greek national holidays and events (αργίες)
- 🌙 **Dark Mode** - Full dark theme support
- 🌍 **Bilingual** - Greek and English language support
- 💾 **Persistent Settings** - Your preferences are saved

## Screenshots

<!-- Add your screenshots here -->

## Tech Stack

- **React Native** with Expo
- **TypeScript**
- **React Navigation** - Bottom tab navigation
- **TanStack Query** - Data fetching and caching
- **AsyncStorage** - Settings persistence
- **react-native-calendars** - Calendar component

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Expo Go app on your phone (for testing)

### Installation

```bash
# Clone the repository
git clone https://github.com/athanasso/eortologio.git
cd eortologio

# Install dependencies
npm install

# Start the development server
npx expo start
```

### Running the App

1. Run `npx expo start`
2. Scan the QR code with Expo Go (Android) or Camera app (iOS)

## Project Structure

```
src/
├── context/
│   └── SettingsContext.tsx    # App settings (theme, language)
├── hooks/
│   └── useNameDays.ts         # React Query hooks for API
├── navigation/
│   └── RootNavigator.tsx      # Bottom tab navigation
├── screens/
│   ├── HomeScreen.tsx         # Today's celebrations
│   ├── CalendarScreen.tsx     # Calendar view
│   ├── SearchScreen.tsx       # Name search
│   └── SettingsScreen.tsx     # App settings
└── services/
    └── api.ts                 # API client
```

## API

This app uses the [Greek Nameday API](https://eortologio.iliasdev.com/docs) by iliasdev.

## License

MIT

## Credits

- **API**: [iliasdev](https://eortologio.iliasdev.com/docs)
- **Developer**: athanasso
