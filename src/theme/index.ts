// Design tokens BAM — palette « Fresh » : émeraude + neutre clair + ambre.
// Nommage sémantique (primary/bg/accent…) avec alias rétro-compat pour les
// écrans qui référencent encore red/cream/mango — un seul point de recolor.

const palette = {
  ink: '#16201A',        // vert-noir profond (texte, nav, boutons)
  bg: '#EEF0EA',         // fond neutre clair
  surface: '#FFFFFF',    // cartes / tuiles
  primary: '#129E66',    // émeraude — accent, actifs, CTA
  primaryDark: '#0C7A4E',
  accent: '#F2A32A',     // ambre — secondaire (BAM Points, Pro)
  accentDark: '#CE7C0C',
  success: '#3D7A4E',    // confirmation « ✓ »
  ink2: '#0B2E7A',       // bleu profond (réserve)
};

export const colors = {
  ...palette,
  white: palette.surface,
  border: 'rgba(22,32,26,0.10)',
  textMuted: 'rgba(22,32,26,0.55)',
  textFaint: 'rgba(22,32,26,0.42)',

  // Alias rétro-compat (mêmes noms qu'avant → nouvelle palette) :
  cream: palette.bg,
  red: palette.primary,
  redDark: palette.primaryDark,
  mango: palette.accent,
  mangoDark: palette.accentDark,
  palm: palette.success,
  blue: palette.ink2,
  blueDark: palette.ink2,
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
