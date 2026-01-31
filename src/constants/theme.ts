// Centralized theme constants for the Eortologio app

export const COLORS = {
  // Brand colors
  greekBlue: '#0D5EAF',
  holidayRed: '#dc2626',
  favoriteGold: '#f59e0b',
  
  // Light theme
  light: {
    background: '#fff',
    text: '#111827',
    subtext: '#6b7280',
    card: '#f3f4f6',
    cardAlt: '#f9fafb',
    input: '#f9fafb',
    border: '#d1d5db',
    disabled: '#d1d5db',
  },
  
  // Dark theme
  dark: {
    background: '#111827',
    text: '#f9fafb',
    subtext: '#9ca3af',
    card: '#1f2937',
    cardAlt: '#1f2937',
    input: '#374151',
    border: '#4b5563',
    disabled: '#4b5563',
  },
} as const;

// Get theme colors based on dark mode
export const getThemeColors = (isDarkMode: boolean) => {
  return isDarkMode ? COLORS.dark : COLORS.light;
};

// Common shadow styles
export const SHADOWS = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  cardSmall: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
} as const;

// Typography sizes
export const TYPOGRAPHY = {
  title: 32,
  sectionTitle: 20,
  body: 16,
  caption: 13,
} as const;

// Spacing
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const;

// Border radius
export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 20,
} as const;
