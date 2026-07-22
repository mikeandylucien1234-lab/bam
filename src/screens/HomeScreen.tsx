import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import BottomNav, { BOTTOM_NAV_SPACE } from '../components/BottomNav';
import { products, fmtGourdes, type Product } from '../data/products';
import { useCart } from '../context/CartContext';

// Redesign « Scoops » (layout épuré, aéré) — contenu krèyol & palette BAM
// conservés. Repris de showHomeRetail du prototype, réagencé.
const SWITCH_BG = colors.ink;
const SWITCH_TEXT = 'rgba(238,240,234,0.72)';
const GOLD = colors.mango;
const MUTED = 'rgba(22,32,26,0.5)';
const SEARCH_BG = colors.white;

// Sur les tuiles pastel des catégories, le fond blanc des PNG se fond dans la
// teinte via multiply (rendu natif iOS/Android ; non appliqué par react-native-web).
const multiply = { mixBlendMode: 'multiply' } as any;

const imgNoodleCutout = require('../../assets/images/imgNoodleCutout.png');
const imgJuicePassion = require('../../assets/images/imgJuicePassion.png');
const imgRiceBag = require('../../assets/images/imgRiceBag.png');
const imgNoodleChicken = require('../../assets/images/imgNoodleChicken.png');

const CATS = [
  { label: 'Nouilles', cat: 'Nouilles', image: imgNoodleCutout, tint: '#FAE7DA' },
  { label: 'Jus', cat: 'Jus', image: imgJuicePassion, tint: '#ECE0F4' },
  { label: 'Riz & Grenn', cat: 'Riz', image: imgRiceBag, tint: '#FBEBD5' },
] as const;

const TRUST = [
  { icon: 'flash-outline', label: 'Livrezon\n24–48 h' },
  { icon: 'leaf-outline', label: 'Fèt an\nAyiti' },
  { icon: 'phone-portrait-outline', label: 'MonCash\n& Kach' },
] as const;

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { count } = useCart();
  const popular = products.filter((p) => p.cat === 'Jus').slice(0, 3);
  // Meilleures ventes : un mix (riz, nouilles, cerise) pour varier du carrousel jus.
  const bestSellers = ['riz-25', 'nouille', 'j-cherry']
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean) as Product[];
  const flashProduct = products.find((p) => p.id === 'j-cherry')!;
  // « Mak popilè » : un badge-logo par produit (nom court).
  const brands = products.map((p) => ({
    id: p.id,
    label: p.id === 'riz-25' ? 'Riz Jasmin' : p.id === 'nouille' ? 'Nouilles' : p.name,
    image: p.image,
  }));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: BOTTOM_NAV_SPACE }} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topbar}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>BAM</Text>
          </View>
          <Pressable style={styles.location} onPress={() => navigation.navigate('Catalog')}>
            <Ionicons name="location" size={15} color={colors.red} />
            <Text style={styles.locationText}>Pòtoprens</Text>
            <Ionicons name="chevron-down" size={13} color={MUTED} />
          </Pressable>
          <Pressable style={styles.cartBtn} onPress={() => navigation.navigate('Cart')} hitSlop={6}>
            <Ionicons name="bag-handle-outline" size={20} color={colors.ink} />
            {count > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{count}</Text>
              </View>
            )}
          </Pressable>
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>BONJOU 👋</Text>
          <Text style={styles.heroTitle}>Sa w vle{'\n'}kòmande jodi a?</Text>
        </View>

        {/* Bascule Détail / Pro */}
        <View style={styles.switchWrap}>
          <View style={styles.switch}>
            <View style={[styles.switchBtn, styles.switchActive]}>
              <Text style={styles.switchActiveText}>Détail</Text>
            </View>
            <Pressable style={[styles.switchBtn, styles.switchPro]} onPress={() => navigation.navigate('ProIntro')}>
              <Text style={styles.switchProText}>Pro</Text>
            </Pressable>
          </View>
        </View>

        {/* Recherche */}
        <Pressable style={styles.search} onPress={() => navigation.navigate('Catalog')}>
          <Ionicons name="search" size={18} color={MUTED} />
          <Text style={styles.searchText}>Chèche jus, riz, nouilles…</Text>
          <View style={styles.searchBtn}>
            <Ionicons name="options-outline" size={17} color={colors.cream} />
          </View>
        </Pressable>

        {/* Bande confiance */}
        <View style={styles.trustRow}>
          {TRUST.map((t) => (
            <View key={t.label} style={styles.trustItem}>
              <View style={styles.trustIcon}>
                <Ionicons name={t.icon as any} size={18} color={colors.red} />
              </View>
              <Text style={styles.trustLabel}>{t.label}</Text>
            </View>
          ))}
        </View>

        {/* Catégories */}
        <Text style={styles.sectionTitle}>Kategori</Text>
        <View style={styles.catRow}>
          {CATS.map((c) => (
            <Pressable key={c.label} style={styles.catItem} onPress={() => navigation.navigate('Catalog', { cat: c.cat })}>
              <View style={[styles.catTile, { backgroundColor: c.tint }]}>
                <Image source={c.image} style={[styles.catImage, multiply]} resizeMode="contain" />
              </View>
              <Text style={styles.catLabel} numberOfLines={1}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Òf Flash — minuteur en direct */}
        <FlashDeal product={flashProduct} onOpen={() => navigation.navigate('Product', { pid: flashProduct.id })} />

        {/* Bannière BAM Points */}
        <Pressable style={styles.bamPoints} onPress={() => navigation.navigate('BamPoints')}>
          <LinearGradient
            colors={['#F6B542', '#F2A125', '#D4820E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.bamStar}>
            <Ionicons name="star" size={20} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bamTitle}>BAM Points</Text>
            <Text style={styles.bamSub} numberOfLines={1}>Ranmase pwen a chak acha</Text>
          </View>
          <View style={styles.bamChevron}>
            <Ionicons name="arrow-forward" size={16} color={colors.white} />
          </View>
        </Pressable>

        {/* Offre de lancement */}
        <Pressable style={styles.promo} onPress={() => navigation.navigate('Catalog')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.promoEyebrow}>ÒF LANSMAN</Text>
            <Text style={styles.promoTitle}>−15% sou premye{'\n'}kòmann ou</Text>
          </View>
          <View style={styles.promoBtn}>
            <Text style={styles.promoBtnText}>Kòmande</Text>
            <Ionicons name="arrow-forward" size={14} color={colors.ink} />
          </View>
        </Pressable>

        {/* Popilè */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle2}>Popilè</Text>
          <Pressable onPress={() => navigation.navigate('Catalog', { cat: 'Jus' })}>
            <Text style={styles.seeAll}>Wè tout</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {popular.map((p) => (
            <PopularCard key={p.id} product={p} onOpen={() => navigation.navigate('Product', { pid: p.id })} />
          ))}
        </ScrollView>

        {/* Nouvo */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle2}>Nouvo lakay BAM</Text>
        </View>
        <View style={styles.duoRow}>
          <FeatureCard label="Nouilles Cup" image={imgNoodleChicken} onOpen={() => navigation.navigate('Product', { pid: 'nouille' })} />
          <FeatureCard label="Riz Jasmin" image={imgRiceBag} onOpen={() => navigation.navigate('Product', { pid: 'riz-25' })} />
        </View>

        {/* Meyè vant */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle2}>Meyè vant</Text>
          <Pressable onPress={() => navigation.navigate('Catalog')}>
            <Text style={styles.seeAll}>Wè tout</Text>
          </Pressable>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel}>
          {bestSellers.map((p) => (
            <PopularCard key={p.id} product={p} onOpen={() => navigation.navigate('Product', { pid: p.id })} />
          ))}
        </ScrollView>

        {/* Mak popilè — logos produits */}
        <Text style={styles.sectionTitle}>Mak popilè n ap ofri</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.brandRow}>
          {brands.map((b) => (
            <Pressable key={b.id} style={styles.brand} onPress={() => navigation.navigate('Product', { pid: b.id })}>
              <View style={styles.brandTile}>
                <Image source={b.image} style={styles.brandImg} resizeMode="contain" />
              </View>
              <Text style={styles.brandLabel} numberOfLines={1}>{b.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Histoire de la marque */}
        <View style={styles.story}>
          <View style={styles.storySeal}>
            <Text style={styles.storySealText}>BAM</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.storyTitle}>Yon mak, yon fyète</Text>
            <Text style={styles.storySub}>Fonde pa yon antreprenè ayisyen — gou, kalite, ak kominote.</Text>
          </View>
        </View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

function PopularCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const onAdd = (e: any) => {
    e?.stopPropagation?.();
    addItem({ key: `${product.id}:0`, name: product.name, sub: product.sub, image: product.image, tint: product.tint, price: product.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
  };
  return (
    <Pressable style={styles.pop} onPress={onOpen}>
      <View style={styles.popImageWrap}>
        <Image source={product.image} style={styles.popImage} resizeMode="contain" />
      </View>
      <Text style={styles.popName} numberOfLines={1}>{product.name}</Text>
      <Text style={[styles.popKre, { color: product.accent }]} numberOfLines={1}>{product.kre}</Text>
      <View style={styles.popBottom}>
        <Text style={styles.popPrice}>{fmtGourdes(product.price)}</Text>
        <Pressable style={[styles.addBtn, added && styles.addBtnDone]} onPress={onAdd} hitSlop={6}>
          <Ionicons name={added ? 'checkmark' : 'add'} size={added ? 15 : 19} color={colors.cream} />
        </Pressable>
      </View>
    </Pressable>
  );
}

function FeatureCard({ label, image, onOpen }: { label: string; image: any; onOpen: () => void }) {
  return (
    <Pressable style={styles.feature} onPress={onOpen}>
      <View style={styles.featureImageWrap}>
        <Image source={image} style={styles.featureImage} resizeMode="contain" />
      </View>
      <View style={styles.featureFoot}>
        <Text style={styles.featureLabel} numberOfLines={1}>{label}</Text>
        <View style={styles.featureBtn}>
          <Ionicons name="arrow-forward" size={15} color={colors.cream} />
        </View>
      </View>
    </Pressable>
  );
}

function TimeBox({ v }: { v: string }) {
  return (
    <View style={styles.timeBox}>
      <Text style={styles.timeText}>{v}</Text>
    </View>
  );
}

function FlashDeal({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const [left, setLeft] = useState(2 * 3600 + 45 * 60 + 30);
  useEffect(() => {
    const t = setInterval(() => setLeft((l) => (l > 0 ? l - 1 : 3 * 3600)), 1000);
    return () => clearInterval(t);
  }, []);
  const hh = String(Math.floor(left / 3600)).padStart(2, '0');
  const mm = String(Math.floor((left % 3600) / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  const flashPrice = Math.round(product.price * 0.8);

  return (
    <Pressable style={styles.flash} onPress={onOpen}>
      <View style={{ flex: 1 }}>
        <Text style={styles.flashEyebrow}>ÒF FLASH ⚡</Text>
        <Text style={styles.flashName}>{product.name}</Text>
        <View style={styles.flashPriceRow}>
          <Text style={styles.flashNew}>{fmtGourdes(flashPrice)}</Text>
          <Text style={styles.flashOld}>{fmtGourdes(product.price)}</Text>
        </View>
        <View style={styles.timerRow}>
          <TimeBox v={hh} />
          <Text style={styles.colon}>:</Text>
          <TimeBox v={mm} />
          <Text style={styles.colon}>:</Text>
          <TimeBox v={ss} />
        </View>
      </View>
      <View style={styles.flashImgWrap}>
        <Image source={product.image} style={styles.flashImg} resizeMode="contain" />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },

  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 6,
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 10,
    elevation: 4,
  },
  logoText: { fontFamily: fonts.displayBold, fontSize: 14, color: colors.white },
  location: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  locationText: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.ink },
  cartBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  cartBadge: {
    position: 'absolute', top: -3, right: -3, minWidth: 18, height: 18, borderRadius: 9,
    backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
    borderWidth: 2, borderColor: colors.cream,
  },
  cartBadgeText: { fontFamily: fonts.bodyBold, fontSize: 10, color: colors.white },

  hero: { paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, color: MUTED, marginBottom: 6 },
  heroTitle: { fontFamily: fonts.display, fontSize: 32, color: colors.ink, lineHeight: 36 },

  switchWrap: { alignItems: 'flex-start', paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  switch: {
    flexDirection: 'row',
    backgroundColor: SWITCH_BG,
    borderRadius: radius.pill,
    padding: 4,
    gap: 2,
    shadowColor: SWITCH_BG,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 5,
  },
  switchBtn: { paddingHorizontal: 22, paddingVertical: 9, borderRadius: radius.pill },
  switchActive: { backgroundColor: 'transparent' },
  switchActiveText: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: SWITCH_TEXT },
  switchPro: { backgroundColor: GOLD },
  switchProText: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: SEARCH_BG,
    borderRadius: radius.lg,
    paddingLeft: spacing.md,
    paddingRight: 6,
    paddingVertical: 6,
    marginHorizontal: spacing.lg,
    marginTop: spacing.lg,
    shadowColor: '#1B1310',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 2,
  },
  searchText: { flex: 1, fontFamily: fonts.bodyRegular, fontSize: 14, color: colors.textFaint, paddingVertical: 8 },
  searchBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },

  trustRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  trustItem: {
    flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: colors.white, borderRadius: radius.md, paddingVertical: 11, paddingHorizontal: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 8, elevation: 1,
  },
  trustIcon: { width: 30, height: 30, borderRadius: 15, backgroundColor: '#E3F0E8', alignItems: 'center', justifyContent: 'center' },
  trustLabel: { flex: 1, fontFamily: fonts.bodyBold, fontSize: 10.5, color: colors.ink, lineHeight: 13 },

  flash: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.ink, borderRadius: radius.lg,
    marginHorizontal: spacing.lg, marginTop: spacing.xl, padding: 18,
    overflow: 'hidden',
  },
  flashEyebrow: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1, color: colors.mango },
  flashName: { fontFamily: fonts.display, fontSize: 22, color: colors.cream, marginTop: 6 },
  flashPriceRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginTop: 4 },
  flashNew: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.red },
  flashOld: { fontFamily: fonts.bodyRegular, fontSize: 13, color: 'rgba(238,240,234,0.5)', textDecorationLine: 'line-through', marginBottom: 1 },
  timerRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 12 },
  timeBox: { backgroundColor: 'rgba(255,255,255,0.14)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 6, minWidth: 34, alignItems: 'center' },
  timeText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.cream },
  colon: { fontFamily: fonts.bodyBold, fontSize: 15, color: 'rgba(238,240,234,0.6)' },
  flashImgWrap: { width: 96, height: 118, borderRadius: radius.md, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  flashImg: { width: '78%', height: '86%' },

  brandRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  brand: { alignItems: 'center', gap: 7, width: 96 },
  brandTile: {
    width: 96, height: 84, borderRadius: radius.md, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  brandImg: { width: '64%', height: '84%' },
  brandLabel: { fontFamily: fonts.bodyBold, fontSize: 11.5, color: colors.ink },

  story: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, borderRadius: radius.lg,
    marginHorizontal: spacing.lg, marginTop: spacing.xl, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  storySeal: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.red, alignItems: 'center', justifyContent: 'center' },
  storySealText: { fontFamily: fonts.displayBold, fontSize: 13, color: colors.white },
  storyTitle: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },
  storySub: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: MUTED, lineHeight: 16, marginTop: 2 },

  sectionTitle: {
    fontFamily: fonts.bodyBold,
    fontSize: 17,
    color: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  catRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  catItem: { flex: 1, alignItems: 'center', gap: 8 },
  catTile: {
    width: '100%',
    height: 92,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  catImage: { width: 62, height: 62 },
  catLabel: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.ink },

  bamPoints: {
    height: 66,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    overflow: 'hidden',
    shadowColor: '#D4820E',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.28,
    shadowRadius: 18,
    elevation: 5,
  },
  bamStar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bamTitle: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.white },
  bamSub: { fontFamily: fonts.bodyRegular, fontSize: 12, color: 'rgba(27,19,16,0.72)', marginTop: 1 },
  bamChevron: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  promo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.ink,
    borderRadius: radius.lg,
    marginHorizontal: spacing.lg,
    marginTop: spacing.xl,
    padding: 18,
  },
  promoEyebrow: { fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1.2, color: colors.mango, marginBottom: 5 },
  promoTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.cream, lineHeight: 24 },
  promoBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.red, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 10,
  },
  promoBtnText: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.ink },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionTitle2: { fontFamily: fonts.bodyBold, fontSize: 17, color: colors.ink },
  seeAll: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.red },

  carousel: { gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  pop: { width: 158 },
  popImageWrap: {
    width: '100%',
    height: 140,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  popImage: { height: 118, width: '78%' },
  popName: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  popKre: { fontFamily: fonts.display, fontStyle: 'italic', fontSize: 12, marginTop: 1 },
  popBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  popPrice: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.ink },
  addBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDone: { backgroundColor: colors.palm },

  duoRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  feature: { flex: 1, borderRadius: radius.lg, backgroundColor: colors.white, overflow: 'hidden' },
  featureImageWrap: { width: '100%', height: 130, alignItems: 'center', justifyContent: 'center' },
  featureImage: { width: '72%', height: '86%' },
  featureFoot: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  featureLabel: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.ink, flex: 1 },
  featureBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
