// Migré depuis le prototype web — même contenu, même prix, même copy kreyòl.

export type Product = {
  id: string;
  cat: 'Jus' | 'Riz' | 'Nouilles';
  name: string;
  kre: string; // nom en kreyòl
  sub: string;
  image: any;
  tint: string;
  accent: string;
  price: number; // en gourdes (G)
  desc: string;
};

export const products: Product[] = [
  {
    id: 'j-ananas',
    cat: 'Jus',
    name: 'Jus Ananas',
    kre: 'Zannanna',
    sub: 'Canette 500 ml',
    image: require('../../assets/images/imgJuicePineapple.png'),
    tint: '#E8EFDA',
    accent: '#3D5A28',
    price: 250,
    desc: "Ananas pressé, sans concentré ni colorant. Mis en canette 48 h après récolte pour garder le vrai goût du fruit.",
  },
  {
    id: 'j-passion',
    cat: 'Jus',
    name: 'Jus Passion',
    kre: 'Grenadya',
    sub: 'Canette 500 ml',
    image: require('../../assets/images/imgJuicePassion.png'),
    tint: '#ECE0F4',
    accent: '#5B2D82',
    price: 250,
    desc: "Grenadya fre, acidulé et parfumé. Notre nouveau parfum, sans concentré — juste le fruit, l'eau et un peu de canne.",
  },
  {
    id: 'j-mango',
    cat: 'Jus',
    name: 'Jus Mangue',
    kre: 'Mango Fransik',
    sub: 'Canette 500 ml',
    image: require('../../assets/images/imgJuiceMango.png'),
    tint: '#FCE8D2',
    accent: '#C25E00',
    price: 250,
    desc: "Mangue Francisque bien mûre, la reine des mangues d'Haïti. Doux, épais, généreux — sans concentré.",
  },
  {
    id: 'j-cherry',
    cat: 'Jus',
    name: 'Jus Cerise',
    kre: 'Seriz peyi',
    sub: 'Canette 500 ml',
    image: require('../../assets/images/imgJuiceCherry.png'),
    tint: '#F9DFDB',
    accent: '#C8102E',
    price: 250,
    desc: "Cerise des Antilles, riche en vitamine C. Le goût des limonades de grand-mère, en canette.",
  },
  {
    id: 'riz-25',
    cat: 'Riz',
    name: 'Riz Jasmin 25 kg',
    kre: 'Diri pafime',
    sub: 'Sac 25 kg',
    image: require('../../assets/images/imgRiceBag.png'),
    tint: '#FBEBD5',
    accent: '#C75B12',
    price: 3450,
    desc: "Riz jasmin premium, grain long et parfumé. Trié et ensaché pour BAM — cuisson régulière, zéro brisure.",
  },
  {
    id: 'nouille',
    cat: 'Nouilles',
    name: 'Nouilles Cup Poulet',
    kre: 'Gou poul la',
    sub: 'Cup 65 g',
    image: require('../../assets/images/imgNoodleCutout.png'),
    tint: '#FAE7DA',
    accent: '#D96A3B',
    price: 145,
    desc: "Nouilles instantanées saveur poulet, prêtes en 3 minutes. Le cup dépanneur préféré des ti moun — et des grands.",
  },
];

export function formatsFor(p: Product) {
  if (p.cat === 'Jus')
    return [
      { label: 'Unité', sub: '500 ml', mult: 1, disc: 1 },
      { label: 'Pack ×6', sub: '6 canettes', mult: 6, disc: 0.95 },
      { label: 'Caisse ×24', sub: '24 canettes', mult: 24, disc: 0.92 },
    ];
  if (p.cat === 'Riz')
    return [
      { label: '1 sac', sub: '25 kg', mult: 1, disc: 1 },
      { label: '×2 sacs', sub: '50 kg', mult: 2, disc: 0.97 },
      { label: '×4 sacs', sub: '100 kg', mult: 4, disc: 0.94 },
    ];
  return [
    { label: 'Cup', sub: '65 g', mult: 1, disc: 1 },
    { label: '×12 cups', sub: 'la douzaine', mult: 12, disc: 0.95 },
    { label: 'Carton ×48', sub: '48 cups', mult: 48, disc: 0.9 },
  ];
}

export type ProTier = { label: string; n: number; pu: number; image: any; save: string | null };
export type ProProduct = {
  id: string;
  name: string;
  sub: string;
  tint: string;
  unit: string;
  tiers: ProTier[];
};

export const proProducts: ProProduct[] = [
  {
    id: 'pro-jus',
    name: 'Palette Jus BAM',
    sub: 'Caisses de 24 canettes 500 ml, parfum au choix',
    tint: '#E9EDF6',
    unit: 'caisse',
    tiers: [
      { label: '25 caisses', n: 25, pu: 4750, image: require('../../assets/images/imgPalletJuice25.png'), save: null },
      { label: '50 caisses', n: 50, pu: 4600, image: require('../../assets/images/imgPalletJuice50.png'), save: '−3 %' },
      { label: '100 caisses', n: 100, pu: 4400, image: require('../../assets/images/imgPalletJuice100.png'), save: '−7 %' },
    ],
  },
  {
    id: 'pro-riz',
    name: 'Palette Riz Jasmin',
    sub: 'Sacs premium de 25 kg',
    tint: '#FBEBD5',
    unit: 'sac',
    tiers: [
      { label: '50 sacs', n: 50, pu: 3150, image: require('../../assets/images/imgPalletRice.png'), save: null },
      { label: '100 sacs', n: 100, pu: 3050, image: require('../../assets/images/imgPalletRice100.png'), save: '−3 %' },
    ],
  },
  {
    id: 'pro-nouilles',
    name: 'Nouilles Cup — Cartons',
    sub: 'Cartons de 48 cups saveur poulet',
    tint: '#FAE7DA',
    unit: 'carton',
    tiers: [
      { label: '10 cartons', n: 10, pu: 5660, image: require('../../assets/images/imgNoodleChicken.png'), save: null },
      { label: '20 cartons', n: 20, pu: 5480, image: require('../../assets/images/imgNoodleChicken.png'), save: '−3 %' },
    ],
  },
];

export function fmtGourdes(n: number) {
  return Math.round(n).toLocaleString('fr-FR').replace(/[\u202f\u00a0]/g, ' ') + ' G';
}
