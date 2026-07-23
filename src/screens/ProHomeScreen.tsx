import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import { fmtGourdes } from '../data/products';
import { useCatalogue } from '../context/CatalogueContext';
import ProBottomNav, { PRO_NAV_SPACE } from '../components/ProBottomNav';
import Marquee from '../components/Marquee';

const TICKER = [
  'Jus Passion  ▲  4 400 G / kès',
  'Livrezon menm jou · kòmande anvan 14è',
  'Diri Jasmin  ▼  3 050 G / sak',
  '3 palèt anvan tarif Gold',
  'Nouvo palèt Jus 100 kès disponib',
  'Nouilles carton  ▲  5 480 G',
  '−7% sou komann 100 kès+',
];

function LiveDot() {
  const a = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(a, { toValue: 0.25, duration: 700, useNativeDriver: true }),
        Animated.timing(a, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <View style={styles.liveWrap}>
      <Animated.View style={[styles.liveDot, { opacity: a }]} />
      <Text style={styles.liveText}>LIVE</Text>
    </View>
  );
}

const PRO_BLUE = colors.blue;
const AMBER = colors.mango;

const QUICK = [
  { icon: 'cart-outline', label: 'Nouvo kòmann', bg: '#E3EAF7', to: 'ProProduct', params: { proId: 'pro-jus' } },
  { icon: 'car-outline', label: 'Swiv livrezon', bg: '#E1EFE2', to: 'Tracking', params: undefined },
  { icon: 'call-outline', label: 'Komèsyal mwen', bg: '#FCEFDD', to: 'ProContact', params: undefined },
  { icon: 'document-text-outline', label: 'Fakti pro forma', bg: '#FDF6E7', to: 'ProInvoices', params: undefined },
];

export default function ProHomeScreen() {
  const navigation = useNavigation<any>();
  const { proProducts } = useCatalogue();

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: PRO_NAV_SPACE }} bounces={false}>
        <SafeAreaView edges={['top']}>
          <LinearGradient colors={['#0A1230', '#111C46', '#0A1024']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={styles.heroBlob} />
            <View style={styles.heroTop}>
              <View style={styles.brandRow}>
                <View style={styles.logo}><Text style={styles.logoText}>BAM</Text></View>
                <View>
                  <Text style={styles.brandName}>BAM Wholesale</Text>
                  <View style={styles.tier}>
                    <Ionicons name="ribbon" size={10} color={AMBER} />
                    <Text style={styles.tierText}>REVANDÈ · SILVER</Text>
                  </View>
                </View>
              </View>
              <View style={styles.toggle}>
                <Pressable style={styles.toggleBtn} onPress={() => navigation.navigate('Home')}>
                  <Text style={styles.toggleInactive}>Détail</Text>
                </Pressable>
                <View style={[styles.toggleBtn, styles.toggleActive]}>
                  <Text style={styles.toggleActiveText}>Pro</Text>
                </View>
              </View>
            </View>

            {/* Stat chips */}
            <View style={styles.statChips}>
              <View style={styles.statChip}>
                <Text style={styles.statChipLabel}>Kredi disponib</Text>
                <Text style={styles.statChipValue}>120 000 G</Text>
              </View>
              <View style={styles.statChipDivider} />
              <View style={styles.statChip}>
                <Text style={styles.statChipLabel}>Pwochèn livrezon</Text>
                <Text style={styles.statChipValue}>Jodi a · 3–5 PM</Text>
              </View>
            </View>

            {/* Ticker live */}
            <View style={styles.ticker}>
              <LiveDot />
              <View style={styles.tickerSep} />
              <Marquee items={TICKER} color="rgba(255,255,255,0.9)" speed={48} />
            </View>
          </LinearGradient>
        </SafeAreaView>

        {/* Carte compte revendeur */}
        <LinearGradient colors={['#081F57', '#0F2C6E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.account}>
          <View style={styles.accountHead}>
            <View style={styles.accountAvatar}><Text style={styles.accountInitials}>SD</Text></View>
            <View>
              <Text style={styles.accountName}>Sammy Désir</Text>
              <Text style={styles.accountRole}>Revandè Pro</Text>
            </View>
          </View>
          <View style={styles.statsRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statLabel}>Kòmann mwa sa a</Text>
              <Text style={styles.statValue}>12 palèt</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statLabel}>Total depanse</Text>
              <Text style={styles.statValue}>54 280 G</Text>
            </View>
          </View>
          <View style={styles.barTrack}><View style={styles.barFill} /></View>
          <Text style={styles.barNote}>3 palèt anvan pou w rive nan tarif Gold</Text>
        </LinearGradient>

        {/* Bandeau livraison */}
        <View style={styles.ship}>
          <Text style={{ fontSize: 22 }}>🚚</Text>
          <View style={{ flex: 1, gap: 6 }}>
            <View style={styles.shipTag}><Text style={styles.shipTagText}>Livrezon ekspres</Text></View>
            <Text style={styles.shipTitle}>Kòmande anvan 14è, depa depo a menm jou a.</Text>
            <Text style={styles.shipSub}>Retrè gratis oswa livrezon kalkile selon pwa.</Text>
          </View>
        </View>

        {/* Actions rapides */}
        <View style={styles.quickGrid}>
          {QUICK.map((q) => (
            <Pressable key={q.label} style={[styles.quick, { backgroundColor: q.bg }]} onPress={() => navigation.navigate(q.to, q.params)}>
              <View style={styles.quickTop}>
                <Ionicons name={q.icon as any} size={22} color={colors.ink} />
                <Ionicons name="chevron-forward" size={16} color="#B7A98F" />
              </View>
              <Text style={styles.quickLabel}>{q.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Palettes */}
        <Text style={styles.sectionTitle}>Palettes & gros volumes</Text>
        <View style={{ paddingHorizontal: spacing.lg, gap: 12 }}>
          {proProducts.map((p) => {
            const from = Math.min(...p.tiers.map((t) => t.pu));
            return (
              <Pressable key={p.id} style={styles.palette} onPress={() => navigation.navigate('ProProduct', { proId: p.id })}>
                <View style={[styles.paletteImg, { backgroundColor: p.tint }]}>
                  <Image source={p.tiers[0].image} style={styles.paletteImgInner} resizeMode="contain" />
                </View>
                <View style={{ flex: 1, gap: 3 }}>
                  <Text style={styles.paletteName}>{p.name}</Text>
                  <Text style={styles.paletteSub} numberOfLines={2}>{p.sub}</Text>
                  <Text style={styles.paletteFrom}>à partir de <Text style={styles.paletteFromPrice}>{fmtGourdes(from)}</Text> / {p.unit}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color="#B7A98F" />
              </Pressable>
            );
          })}
        </View>

        {/* Commercial dédié */}
        <View style={styles.rep}>
          <View style={styles.repHead}>
            <View style={styles.repAvatar}><Text style={styles.repInitials}>JB</Text></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.repName}>Jerry Baptiste</Text>
              <Text style={styles.repRole}>Reprezantan BAM Wholesale</Text>
            </View>
            <View style={styles.repBadge}><Text style={styles.repBadgeText}>Disponib</Text></View>
          </View>
          <Text style={styles.repLine}>✉️  jerry.baptiste@bamhaiti.com</Text>
          <Text style={styles.repLine}>📱  +509 38 12 44 09</Text>
          <Pressable style={styles.repBtn} onPress={() => navigation.navigate('ProContact')}><Text style={styles.repBtnText}>Kontakte</Text></Pressable>
        </View>

        {/* Prix spécial */}
        <View style={styles.special}>
          <Text style={styles.specialTitle}>Bezwen yon pri espesyal?</Text>
          <Text style={styles.specialSub}>Ekip komèsyal nou an la pou volim mikse ak livrezon Pòtoprens / Okap.</Text>
          <View style={styles.specialBtn}><Text style={styles.specialBtnText}>WhatsApp +509 38 00 00 00</Text></View>
        </View>
      </ScrollView>

      <ProBottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  hero: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: 16, borderBottomLeftRadius: 26, borderBottomRightRadius: 26, overflow: 'hidden' },
  heroBlob: { position: 'absolute', width: 260, height: 260, borderRadius: 130, backgroundColor: 'rgba(242,161,37,0.10)', right: -90, top: -110 },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  logo: { width: 42, height: 42, borderRadius: 13, backgroundColor: AMBER, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: fonts.displayBold, fontSize: 14, color: colors.ink },
  brandName: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.white },
  tier: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  tierText: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1, color: AMBER },
  toggle: { flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: radius.pill, padding: 3, gap: 2 },
  toggleBtn: { paddingHorizontal: 15, paddingVertical: 7, borderRadius: radius.pill },
  toggleInactive: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: 'rgba(255,255,255,0.75)' },
  toggleActive: { backgroundColor: AMBER },
  toggleActiveText: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.ink },

  statChips: {
    flexDirection: 'row', alignItems: 'center', marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.06)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: radius.md, paddingVertical: 12, paddingHorizontal: 16,
  },
  statChip: { flex: 1, gap: 3 },
  statChipDivider: { width: 1, alignSelf: 'stretch', backgroundColor: 'rgba(255,255,255,0.12)', marginHorizontal: 14 },
  statChipLabel: { fontFamily: fonts.bodyRegular, fontSize: 10.5, color: 'rgba(255,255,255,0.55)', letterSpacing: 0.3 },
  statChipValue: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.white },

  ticker: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 12,
    backgroundColor: 'rgba(0,0,0,0.28)', borderRadius: 12, paddingVertical: 9, paddingLeft: 12, paddingRight: 14,
  },
  liveWrap: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#FF4D4D' },
  liveText: { fontFamily: fonts.bodyBold, fontSize: 10, letterSpacing: 1, color: '#FF6B6B' },
  tickerSep: { width: 1, height: 14, backgroundColor: 'rgba(255,255,255,0.2)' },

  account: { marginHorizontal: spacing.lg, marginTop: 24, borderRadius: radius.lg, padding: 22, gap: 16 },
  accountHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  accountAvatar: { width: 46, height: 46, borderRadius: 14, backgroundColor: AMBER, alignItems: 'center', justifyContent: 'center' },
  accountInitials: { fontFamily: fonts.display, fontSize: 19, color: colors.ink },
  accountName: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.white },
  accountRole: { fontFamily: fonts.bodyBold, fontSize: 11.5, color: AMBER, marginTop: 2 },
  statsRow: { flexDirection: 'row', gap: 16 },
  statLabel: { fontFamily: fonts.bodyRegular, fontSize: 11, color: 'rgba(255,255,255,0.75)' },
  statValue: { fontFamily: fonts.display, fontSize: 24, color: colors.white, marginTop: 4 },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.16)' },
  barFill: { width: '70%', height: '100%', borderRadius: 3, backgroundColor: AMBER },
  barNote: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: 'rgba(255,255,255,0.75)' },

  ship: {
    flexDirection: 'row', gap: 12, marginHorizontal: spacing.lg, marginTop: 24, backgroundColor: '#EAF1E1', borderRadius: radius.md, padding: 16,
  },
  shipTag: { alignSelf: 'flex-start', backgroundColor: AMBER, borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  shipTagText: { fontFamily: fonts.bodyBold, fontSize: 10.5, color: colors.ink },
  shipTitle: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.ink, lineHeight: 18 },
  shipSub: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: 'rgba(22,32,26,0.6)', lineHeight: 17 },

  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md, paddingHorizontal: spacing.lg, paddingTop: 24 },
  quick: { width: '47%', flexGrow: 1, borderRadius: radius.md, padding: 16, gap: 22, justifyContent: 'space-between' },
  quickTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  quickLabel: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.ink },

  sectionTitle: { fontFamily: fonts.display, fontSize: 21, color: colors.ink, paddingHorizontal: spacing.lg, paddingTop: 26, paddingBottom: 12 },
  palette: {
    flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: colors.white, borderRadius: radius.md, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 14, elevation: 3,
  },
  paletteImg: { width: 84, height: 84, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  paletteImgInner: { width: 70, height: 70 },
  paletteName: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.ink },
  paletteSub: { fontFamily: fonts.bodyRegular, fontSize: 12, color: 'rgba(22,32,26,0.6)', lineHeight: 16 },
  paletteFrom: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: 'rgba(22,32,26,0.6)', marginTop: 2 },
  paletteFromPrice: { fontFamily: fonts.bodyBold, fontSize: 16, color: PRO_BLUE },

  rep: {
    marginHorizontal: spacing.lg, marginTop: 20, backgroundColor: colors.white, borderRadius: radius.md, padding: 16, gap: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 14, elevation: 3,
  },
  repHead: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  repAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: PRO_BLUE, alignItems: 'center', justifyContent: 'center' },
  repInitials: { fontFamily: fonts.display, fontSize: 18, color: colors.white },
  repName: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  repRole: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: 'rgba(22,32,26,0.6)', marginTop: 2 },
  repBadge: { backgroundColor: '#E6F2E4', borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  repBadgeText: { fontFamily: fonts.bodyBold, fontSize: 10.5, color: '#2F7A3D' },
  repLine: { fontFamily: fonts.body, fontSize: 13, color: '#4A4038' },
  repBtn: { alignSelf: 'flex-end', backgroundColor: PRO_BLUE, borderRadius: radius.pill, paddingHorizontal: 18, paddingVertical: 9 },
  repBtnText: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.white },

  special: {
    marginHorizontal: spacing.lg, marginTop: 20, backgroundColor: '#FDF6E7', borderWidth: 1, borderColor: '#F0DFB8', borderRadius: radius.lg, padding: 22, gap: 8,
  },
  specialTitle: { fontFamily: fonts.display, fontSize: 19, color: colors.ink },
  specialSub: { fontFamily: fonts.bodyRegular, fontSize: 13, color: 'rgba(22,32,26,0.6)', lineHeight: 19 },
  specialBtn: { alignSelf: 'flex-start', backgroundColor: AMBER, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 9, marginTop: 8 },
  specialBtnText: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.ink },
});
