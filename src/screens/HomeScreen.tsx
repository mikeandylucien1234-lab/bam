import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import BottomNav from '../components/BottomNav';
import { products, fmtGourdes, type Product } from '../data/products';

// Traduit fidèlement de la section showHomeRetail du prototype web
// (markup l.154-283). Textes en kreyòl, structure et contenu identiques.
// Couleurs spécifiques du prototype reprises telles quelles.
const PURPLE = '#6E3D63';
const PURPLE_TEXT = '#E7CFE0';
const GOLD = '#F5A623';
const ADDR_BG = '#F3E6CC';
const MUTED = '#8A7A62';
const SEARCH_TEXT = '#A79781';
const CARD_BG = '#F7F6F3';

const imgNoodleCutout = require('../../assets/images/imgNoodleCutout.png');
const imgJuicePassion = require('../../assets/images/imgJuicePassion.png');
const imgRiceBag = require('../../assets/images/imgRiceBag.png');
const imgBannerRice = require('../../assets/images/imgBannerRice.png');
const imgBannerJuice = require('../../assets/images/imgBannerJuice.png');
const imgNoodleChicken = require('../../assets/images/imgNoodleChicken.png');

// Le fond blanc de certains PNG se fond dans le crème via multiply (comme
// mix-blend-mode:multiply du prototype). Non rendu par react-native-web,
// mais correct sur iOS/Android (RN 0.76).
const multiply = { mixBlendMode: 'multiply' } as any;

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const homeProducts = products.filter((p) => p.cat === 'Jus').slice(0, 3);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.md }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>BAM</Text>
          </View>
          <Pressable style={styles.location} onPress={() => navigation.navigate('Catalog')}>
            <Ionicons name="location" size={16} color={colors.red} />
            <Text style={styles.locationText}>Pòtoprens</Text>
            <Ionicons name="chevron-down" size={13} color={MUTED} />
          </Pressable>
          <Pressable style={styles.bell}>
            <Ionicons name="notifications-outline" size={22} color={colors.ink} />
            <View style={styles.bellDot} />
          </Pressable>
        </View>

        {/* Bandeau adresse */}
        <Pressable style={styles.addressBanner}>
          <View style={styles.addressIcon}>
            <Ionicons name="location" size={17} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.addressTitle}>Se bon adrès la?</Text>
            <Text style={styles.addressSub}>Sanble li yon ti jan lwen ou.</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color={MUTED} />
        </Pressable>

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
          <Ionicons name="options-outline" size={17} color={MUTED} />
        </Pressable>

        {/* Cercles catégories */}
        <View style={styles.catRow}>
          <CategoryItem label="Nouilles" image={imgNoodleCutout} onPress={() => navigation.navigate('Catalog', { cat: 'Nouilles' })} />
          <CategoryItem label="Jus" image={imgJuicePassion} onPress={() => navigation.navigate('Catalog', { cat: 'Jus' })} />
          <CategoryItem label="Riz & Grenn" image={imgRiceBag} onPress={() => navigation.navigate('Catalog', { cat: 'Riz' })} />
        </View>

        {/* Bannière promo immersive */}
        <Pressable style={styles.promo}>
          <Image source={imgBannerRice} style={styles.promoImage} resizeMode="cover" />
          <View style={styles.promoDots}>
            <View style={[styles.dot, { width: 18, backgroundColor: colors.white }]} />
            <View style={[styles.dot, { width: 6, backgroundColor: 'rgba(255,255,255,0.55)' }]} />
          </View>
        </Pressable>

        {/* Bannière BAM Points */}
        <Pressable style={styles.bamPoints} onPress={() => navigation.navigate('BamPoints')}>
          <LinearGradient
            colors={['#F6B542', '#F2A125', '#D4820E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.bamStar}>
            <Ionicons name="star" size={18} color={colors.white} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.bamTitle}>BAM Points</Text>
            <Text style={styles.bamSub} numberOfLines={1}>Ranmase pwen a chak acha</Text>
          </View>
          <View style={styles.bamChevron}>
            <Ionicons name="chevron-forward" size={15} color={colors.white} />
          </View>
        </Pressable>

        {/* Bannière saveurs */}
        <View style={styles.showcase}>
          <Image source={imgBannerJuice} style={styles.showcaseImage} resizeMode="cover" />
        </View>

        {/* Carrousel produits (jus) */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}
        >
          {homeProducts.map((p) => (
            <ProductMiniCard
              key={p.id}
              product={p}
              onOpen={() => navigation.navigate('Product', { pid: p.id })}
            />
          ))}
        </ScrollView>

        {/* Deux cartes produit (nouilles + riz) */}
        <View style={styles.duoRow}>
          <FeatureCard
            image={imgNoodleChicken}
            onOpen={() => navigation.navigate('Product', { pid: 'nouille' })}
          />
          <FeatureCard
            image={imgRiceBag}
            onOpen={() => navigation.navigate('Product', { pid: 'riz-25' })}
          />
        </View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

function CategoryItem({ label, image, onPress }: { label: string; image: any; onPress: () => void }) {
  return (
    <Pressable style={styles.catItem} onPress={onPress}>
      <View style={styles.catImageWrap}>
        <Image source={image} style={[styles.catImage, multiply]} resizeMode="contain" />
      </View>
      <Text style={styles.catLabel}>{label}</Text>
    </Pressable>
  );
}

function ProductMiniCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const [added, setAdded] = useState(false);
  const onAdd = (e: any) => {
    e?.stopPropagation?.();
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
  };
  return (
    <Pressable style={styles.mini} onPress={onOpen}>
      <View style={styles.miniImageWrap}>
        <Image source={product.image} style={styles.miniImage} resizeMode="contain" />
      </View>
      <View style={styles.miniInfo}>
        <Text style={styles.miniName}>{product.name}</Text>
        <Text style={[styles.miniKre, { color: product.accent }]}>{product.kre}</Text>
      </View>
      <Pressable style={styles.addBtn} onPress={onAdd}>
        {added ? (
          <Text style={styles.addText}>Ajouté ✓</Text>
        ) : (
          <Text style={styles.addText}>
            Ajoute <Text style={styles.addPrice}>– {fmtGourdes(product.price)}</Text>
          </Text>
        )}
      </Pressable>
      <Text style={styles.detailLink} onPress={onOpen}>Wè detay</Text>
    </Pressable>
  );
}

function FeatureCard({ image, onOpen }: { image: any; onOpen: () => void }) {
  return (
    <Pressable style={styles.feature} onPress={onOpen}>
      <View style={styles.featureImageWrap}>
        <Image source={image} style={styles.featureImage} resizeMode="contain" />
      </View>
      <View style={styles.featureBtnWrap}>
        <View style={styles.featureBtn}>
          <Text style={styles.featureBtnText}>Wè pwodwi a</Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingTop: 6,
  },
  logo: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
  location: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  bell: { width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  bellDot: {
    position: 'absolute',
    top: -1,
    right: -1,
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: colors.red,
    borderWidth: 2,
    borderColor: colors.white,
  },

  addressBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: ADDR_BG,
    borderRadius: radius.md,
    padding: 14,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  addressIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.mango,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTitle: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.ink },
  addressSub: { fontFamily: fonts.bodyRegular, fontSize: 12, color: MUTED, marginTop: 1 },

  switchWrap: { alignItems: 'center', paddingTop: 18 },
  switch: {
    flexDirection: 'row',
    backgroundColor: PURPLE,
    borderRadius: radius.pill,
    padding: 4,
    gap: 2,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 5,
  },
  switchBtn: { paddingHorizontal: 22, paddingVertical: 9, borderRadius: radius.pill },
  switchActive: { backgroundColor: 'transparent' },
  switchActiveText: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: PURPLE_TEXT },
  switchPro: { backgroundColor: GOLD },
  switchProText: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: CARD_BG,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
  },
  searchText: { flex: 1, fontFamily: fonts.bodyRegular, fontSize: 14, color: SEARCH_TEXT },

  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 26,
    paddingTop: 22,
  },
  catItem: { alignItems: 'center', gap: 8 },
  catImageWrap: { width: 76, height: 76, alignItems: 'center', justifyContent: 'center' },
  catImage: { width: 64, height: 64 },
  catLabel: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.ink },

  promo: {
    marginHorizontal: spacing.lg,
    marginTop: 22,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#1B1310',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.2,
    shadowRadius: 30,
    elevation: 6,
  },
  promoImage: { width: '100%', aspectRatio: 1980 / 840 },
  promoDots: { position: 'absolute', bottom: 12, left: 16, flexDirection: 'row', gap: 6 },
  dot: { height: 5, borderRadius: 3 },

  bamPoints: {
    height: 60,
    borderRadius: radius.md,
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingHorizontal: 14,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bamTitle: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.white },
  bamSub: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: 'rgba(27,19,16,0.72)', marginTop: 1 },
  bamChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  showcase: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    borderRadius: 22,
    overflow: 'hidden',
    shadowColor: '#1B1310',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 5,
  },
  showcaseImage: { width: '100%', aspectRatio: 1980 / 840 },

  carousel: { gap: 14, paddingHorizontal: spacing.lg, paddingTop: 20, paddingBottom: 8 },
  mini: {
    width: 176,
    borderRadius: radius.lg,
    backgroundColor: colors.white,
    padding: 16,
    paddingTop: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#1B1310',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 3,
  },
  miniImageWrap: { height: 128, width: '100%', alignItems: 'center', justifyContent: 'center' },
  miniImage: { height: 120, width: '100%' },
  miniInfo: { alignItems: 'center', gap: 2 },
  miniName: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  miniKre: { fontFamily: fonts.display, fontStyle: 'italic', fontSize: 12 },
  addBtn: {
    width: '100%',
    borderRadius: radius.pill,
    backgroundColor: PURPLE,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.white },
  addPrice: { color: GOLD },
  detailLink: {
    fontFamily: fonts.bodyBold,
    fontSize: 11.5,
    color: PURPLE,
    textDecorationLine: 'underline',
  },

  duoRow: { flexDirection: 'row', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: 22 },
  feature: {
    flex: 1,
    borderRadius: 22,
    backgroundColor: CARD_BG,
    overflow: 'hidden',
    shadowColor: '#1B1310',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  featureImageWrap: { width: '100%', height: 160, alignItems: 'center', justifyContent: 'center', paddingTop: 12 },
  featureImage: { width: '86%', height: '100%' },
  featureBtnWrap: { padding: 12, alignItems: 'center' },
  featureBtn: {
    backgroundColor: PURPLE,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  featureBtnText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.white },
});
