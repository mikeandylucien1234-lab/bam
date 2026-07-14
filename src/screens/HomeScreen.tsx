import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, shadow, fonts } from '../theme';
import BottomNav from '../components/BottomNav';
import Seal from '../components/Seal';

// npx expo install expo-linear-gradient
const imgJuicePassion = require('../../assets/images/imgJuicePassion.png');
const imgNoodleCutout = require('../../assets/images/imgNoodleCutout.png');
const imgRiceBag = require('../../assets/images/imgRiceBag.png');
const imgBannerJuice = require('../../assets/images/imgBannerJuice.png');

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 8 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable style={styles.roundBtn}>
            <Ionicons name="menu" size={18} color={colors.ink} />
          </Pressable>
          <Pressable style={styles.locationPill}>
            <Ionicons name="location" size={14} color={colors.red} />
            <Text style={styles.locationText}>Delmas 33, Port-au-Prince</Text>
            <Ionicons name="chevron-down" size={13} color={colors.textFaint} />
          </Pressable>
          <Pressable style={styles.roundBtn}>
            <Ionicons name="notifications-outline" size={17} color={colors.ink} />
            <View style={styles.badge} />
          </Pressable>
        </View>

        <View style={styles.body}>
          {/* Address confirm banner */}
          <Pressable style={styles.addressBanner}>
            <View style={styles.addressIcon}>
              <Ionicons name="location" size={16} color={colors.red} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addressTitle}>Confirmer l'adresse ?</Text>
              <Text style={styles.addressSub}>Ça semble un peu loin de vous.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textFaint} />
          </Pressable>

          {/* Detail / Gros split */}
          <View style={styles.splitRow}>
            <Pressable
              style={[styles.splitCard, shadow.card]}
              onPress={() => navigation.navigate('Catalog')}
            >
              <LinearGradient colors={['#D9143A', colors.redDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={styles.splitTop}>
                <Text style={styles.splitTitle}>Detail</Text>
                <View style={styles.splitChevron}>
                  <Ionicons name="chevron-forward" size={13} color={colors.white} />
                </View>
              </View>
              <Text style={styles.splitSub}>Jus, riz & nouilles à l'unité</Text>
              <Image source={imgJuicePassion} style={styles.splitImageRight} resizeMode="contain" />
            </Pressable>

            <Pressable
              style={[styles.splitCard, shadow.card]}
              onPress={() => navigation.navigate('ProIntro')}
            >
              <LinearGradient colors={[colors.mango, colors.mangoDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
              <View style={styles.splitTop}>
                <Text style={styles.splitTitle}>Gros</Text>
                <View style={styles.splitChevron}>
                  <Ionicons name="chevron-forward" size={13} color={colors.white} />
                </View>
              </View>
              <Text style={styles.splitSub}>Palettes pour commerces & revendeurs</Text>
              <Ionicons name="cube" size={72} color="rgba(255,255,255,0.25)" style={styles.splitIconRight} />
            </Pressable>
          </View>

          {/* Search */}
          <Pressable style={styles.search}>
            <Ionicons name="search" size={16} color={colors.textFaint} />
            <Text style={styles.searchText}>Rechercher un produit BAM...</Text>
            <Ionicons name="options-outline" size={15} color={colors.textFaint} />
          </Pressable>

          {/* Categories */}
          <View style={styles.catRow}>
            <CategoryItem label="Nouilles" image={imgNoodleCutout} bg="#FAE7DA" onPress={() => navigation.navigate('Catalog', { cat: 'Nouilles' })} />
            <CategoryItem label="Jus" image={imgJuicePassion} bg="#ECE0F4" onPress={() => navigation.navigate('Catalog', { cat: 'Jus' })} />
            <CategoryItem label="Riz & Grains" image={imgRiceBag} bg="#FBEBD5" onPress={() => navigation.navigate('Catalog', { cat: 'Riz' })} />
          </View>

          {/* Promo banner */}
          <Pressable style={[styles.promo, shadow.card]}>
            <Image source={imgBannerJuice} style={styles.promoBg} resizeMode="cover" />
            <LinearGradient colors={['rgba(27,19,16,0.75)', 'rgba(27,19,16,0.1)']} start={{ x: 0, y: 0.5 }} end={{ x: 0.75, y: 0.5 }} style={StyleSheet.absoluteFill} />
            <View style={styles.promoContent}>
              <Text style={styles.promoEyebrow}>OFFRE DE LANCEMENT</Text>
              <Text style={styles.promoTitle}>-15% sur votre{'\n'}1ère palette</Text>
              <View style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>Commander</Text>
              </View>
            </View>
          </Pressable>

          {/* Story strip */}
          <View style={[styles.storyCard, shadow.card]}>
            <Seal size={40} />
            <View style={{ flex: 1 }}>
              <Text style={styles.storyTitle}>Une marque, une fierté</Text>
              <Text style={styles.storySub}>
                Fondée par un entrepreneur haïtien — le goût, la qualité, la communauté.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

function CategoryItem({ label, image, bg, onPress }: { label: string; image: any; bg: string; onPress: () => void }) {
  return (
    <Pressable style={styles.catItem} onPress={onPress}>
      <View style={[styles.catCircle, { backgroundColor: bg }]}>
        <Image source={image} style={styles.catImage} resizeMode="contain" />
      </View>
      <Text style={styles.catLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    paddingBottom: spacing.sm,
  },
  roundBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.white,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.red,
  },
  locationPill: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },

  body: { paddingHorizontal: spacing.md },

  addressBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: '#F1E9DA',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginTop: spacing.xs,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: '#F7DCC0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  addressSub: { fontFamily: fonts.bodyRegular, fontSize: 12, color: colors.textMuted, marginTop: 1 },

  splitRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.md },
  splitCard: {
    flex: 1,
    height: 144,
    borderRadius: radius.lg,
    padding: spacing.md,
    justifyContent: 'space-between',
    overflow: 'hidden',
  },
  splitTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  splitTitle: { fontFamily: fonts.display, fontSize: 19, color: colors.white },
  splitChevron: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splitSub: { fontFamily: fonts.bodyRegular, fontSize: 12, color: 'rgba(255,255,255,0.9)', lineHeight: 16 },
  splitImageRight: { position: 'absolute', bottom: -10, right: -10, width: 90, height: 90, opacity: 0.9 },
  splitIconRight: { position: 'absolute', bottom: -16, right: -12 },

  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: 13,
    marginTop: spacing.md,
  },
  searchText: { flex: 1, fontFamily: fonts.bodyRegular, fontSize: 13.5, color: colors.textFaint },

  catRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: spacing.lg },
  catItem: { alignItems: 'center', gap: 6 },
  catCircle: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  catImage: { width: 38, height: 38 },
  catLabel: { fontFamily: fonts.bodyBold, fontSize: 10.5, color: colors.ink + 'B3' },

  promo: {
    marginTop: spacing.lg,
    height: 132,
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  promoBg: { ...StyleSheet.absoluteFillObject },
  promoContent: { flex: 1, justifyContent: 'center', paddingHorizontal: spacing.md, gap: 4 },
  promoEyebrow: { fontFamily: fonts.bodyBold, fontSize: 11, color: colors.mango, letterSpacing: 0.5 },
  promoTitle: { fontFamily: fonts.display, fontSize: 20, color: colors.white, lineHeight: 24 },
  promoBtn: {
    marginTop: 8,
    alignSelf: 'flex-start',
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: radius.pill,
  },
  promoBtnText: { fontFamily: fonts.bodyBold, fontSize: 11.5, color: colors.ink },

  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    padding: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  storyTitle: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.ink },
  storySub: { fontFamily: fonts.bodyRegular, fontSize: 11, color: colors.textMuted, lineHeight: 15, marginTop: 2 },
});
