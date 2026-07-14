// Design tokens BAM — migrés du prototype web pour rester cohérents
// entre la démo de vente et l'app réelle.

export const colors = {
  ink: '#1B1310',
  cream: '#FBF4E8',
  red: '#C8102E',
  redDark: '#8C0E27',
  blue: '#0B2E7A',
  blueDark: '#132F6E',
  mango: '#F2A125',
  mangoDark: '#C9750A',
  palm: '#3D5A28',
  white: '#FFFFFF',
  border: 'rgba(27,19,16,0.10)',
  textMuted: 'rgba(27,19,16,0.55)',
  textFaint: 'rgba(27,19,16,0.40)',
};

export const radius = {
  sm: 16,
  md: 20,
  lg: 24,
  pill: 999,
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },
};

// Polices : Fraunces (display) + Plus Jakarta Sans (UI).
// À charger via expo-font dans App.tsx — voir src/theme/fonts.ts
export const fonts = {
  display: 'Fraunces_600SemiBold',
  displayBold: 'Fraunces_700Bold',
  body: 'PlusJakartaSans_500Medium',
  bodyBold: 'PlusJakartaSans_700Bold',
  bodyRegular: 'PlusJakartaSans_400Regular',
};
