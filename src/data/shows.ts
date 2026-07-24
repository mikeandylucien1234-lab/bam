// Données de démonstration Haitian Stars Media.
// Pas d'infra streaming réelle : les `videoUrl` sont des placeholders
// (MP4 de démo / embed YouTube) à remplacer manuellement plus tard.

export type Category =
  | 'Interview'
  | 'Podcast'
  | 'Rap Kreyòl'
  | 'Débat'
  | 'Collab'
  | 'Short'
  | 'Article';

export type Show = {
  id: string;
  title: string;
  description: string; // souvent en kreyòl
  category: Category;
  isLive: boolean;
  viewerCount?: number; // spectateurs en direct
  views?: number; // vues totales (replay)
  duration?: string; // ex. "42:18" ou "0:38"
  readingTime?: string; // pour les articles
  nextAirDate?: string; // si offline
  videoUrl: string; // placeholder démo
};

// Placeholder vidéo de démo (Big Buck Bunny) — à remplacer par le vrai stream.
const DEMO_MP4 =
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

export const categories: Category[] = [
  'Interview',
  'Podcast',
  'Rap Kreyòl',
  'Débat',
  'Collab',
  'Short',
  'Article',
];

// Émissions en direct (section 3 de l'accueil).
export const liveShows: Show[] = [
  {
    id: 'live-1',
    title: 'Tèt Kale ak Zoe',
    description: 'Entèvyou espesyal ak yon atis rap kreyòl k ap monte — san filtè.',
    category: 'Interview',
    isLive: true,
    viewerCount: 2148,
    videoUrl: DEMO_MP4,
  },
  {
    id: 'live-2',
    title: 'Podcast Lakay — Episòd 47',
    description: 'Deba sou mizik, kilti ak dyaspora a. An dirèk depi Miami.',
    category: 'Podcast',
    isLive: true,
    viewerCount: 873,
    videoUrl: DEMO_MP4,
  },
  {
    id: 'live-3',
    title: 'Freestyle Vandredi',
    description: 'Batay rap kreyòl an dirèk — vote pou atis ou pi renmen an.',
    category: 'Rap Kreyòl',
    isLive: false,
    nextAirDate: 'vendredi 20h',
    videoUrl: DEMO_MP4,
  },
  {
    id: 'live-4',
    title: 'Kredi Showbiz',
    description: 'Deba cho sou aktialite showbiz kreyòl la ak envite espesyal.',
    category: 'Débat',
    isLive: false,
    nextAirDate: 'dimanche 18h',
    videoUrl: DEMO_MP4,
  },
];

// Interviews à ne pas manquer (section 4).
export const interviews: Show[] = [
  {
    id: 'int-1',
    title: 'Wyclef — Retour aux racines',
    description: 'Yon konvèsasyon fon sou mizik ak Ayiti.',
    category: 'Interview',
    isLive: false,
    duration: '48:12',
    views: 128000,
    videoUrl: DEMO_MP4,
  },
  {
    id: 'int-2',
    title: 'Rutshelle san maske',
    description: 'Karyè, lanmou ak defi yon dyèz.',
    category: 'Interview',
    isLive: false,
    duration: '35:40',
    views: 94200,
    videoUrl: DEMO_MP4,
  },
  {
    id: 'int-3',
    title: 'Roody Roodboy an dirèk',
    description: 'Sou koulis mizik konpa nouvèl jenerasyon an.',
    category: 'Interview',
    isLive: false,
    duration: '52:05',
    views: 76500,
    videoUrl: DEMO_MP4,
  },
  {
    id: 'int-4',
    title: 'K-Dilak — Bòs la pale',
    description: 'Antreprenarya nan endistri mizik la.',
    category: 'Interview',
    isLive: false,
    duration: '41:33',
    views: 61200,
    videoUrl: DEMO_MP4,
  },
];

export function formatViewers(n?: number): string {
  if (!n) return '0';
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace('.0', '') + 'k';
  return String(n);
}

export function formatViews(n?: number): string {
  if (!n) return '0 vue';
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + ' M de vues';
  if (n >= 1000) return (n / 1000).toFixed(0) + ' k vues';
  return n + ' vues';
}
