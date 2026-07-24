// Design tokens Haitian Stars Media (HSM)
// Thème sombre & cinématographique — rouge = live/CTA, or = Star Member.

export const colors = {
  // Fonds
  bg: '#0A0A0C', // noir / anthracite de base
  bgElevated: '#101014',
  surface: '#16161C', // cards : légèrement plus clair que le fond
  surfaceAlt: '#1E1E26',
  surfaceHi: '#26262F',

  // Accents
  red: '#E31C25', // live + CTA principal
  redDark: '#B3141B',
  redSoft: 'rgba(227,28,37,0.16)',
  gold: '#F5C542', // Star Member (premium)
  goldDark: '#CC9E24',
  goldSoft: 'rgba(245,197,66,0.14)',

  // Neutres / texte
  white: '#FFFFFF',
  text: '#F4F4F6',
  textMuted: 'rgba(244,244,246,0.62)',
  textFaint: 'rgba(244,244,246,0.40)',
  offline: '#6C6C77', // badge OFFLINE
  border: 'rgba(255,255,255,0.08)',
  borderHi: 'rgba(255,255,255,0.16)',

  // Overlays de vignettes (dégradé sombre en bas pour la lisibilité)
  scrimTop: 'rgba(10,10,12,0.0)',
  scrimMid: 'rgba(10,10,12,0.35)',
  scrimBottom: 'rgba(10,10,12,0.92)',
};

export const radius = {
  sm: 12,
  md: 16,
  lg: 20,
  xl: 28,
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
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 8,
  },
  glowRed: {
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 18,
    elevation: 10,
  },
};

// Typographie bold / impactante — Plus Jakarta Sans (déjà installé).
// Le poids ExtraBold 800 sert de « display » pour les titres et le logo.
export const fonts = {
  black: 'PlusJakartaSans_800ExtraBold',
  bold: 'PlusJakartaSans_700Bold',
  medium: 'PlusJakartaSans_500Medium',
  regular: 'PlusJakartaSans_400Regular',
};

// Couleurs de dégradé par catégorie, pour les vignettes sans asset.
export const categoryGradient: Record<string, [string, string]> = {
  Interview: ['#3A0D12', '#12060A'],
  Podcast: ['#1A1030', '#0A0714'],
  'Rap Kreyòl': ['#2B0A0A', '#120404'],
  Débat: ['#0D2033', '#050D16'],
  Collab: ['#301A05', '#160B02'],
  Short: ['#0C2A24', '#04120F'],
  Article: ['#2A210A', '#120E03'],
};
