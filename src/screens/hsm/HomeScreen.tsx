import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

import { colors, radius, spacing, shadow, fonts } from '../../theme/hsm';
import Logo from '../../components/hsm/Logo';
import Thumbnail from '../../components/hsm/Thumbnail';
import { LiveBadge, ViewerCount, CategoryTag } from '../../components/hsm/ui';
import { liveShows, type Show } from '../../data/shows';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const liveCount = liveShows.filter((s) => s.isLive).length;
  const hero = liveShows[0];

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      {/* 1. Header sticky */}
      <View style={styles.header}>
        <Logo size="sm" />
        <View style={styles.headerActions}>
          <Pressable style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="search" size={19} color={colors.text} />
          </Pressable>
          <Pressable style={styles.iconBtn} hitSlop={8}>
            <Ionicons name="menu" size={22} color={colors.text} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        {/* 2. Hero */}
        <HeroSection show={hero} onWatch={() => navigation.navigate('Player', { id: hero.id })} navigation={navigation} />

        {/* 3. Émissions en direct */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Émissions en direct</Text>
            <Text style={styles.sectionSub}>
              {liveCount > 0
                ? `${liveCount} show${liveCount > 1 ? 's' : ''} diffuse${liveCount > 1 ? 'nt' : ''} en ce moment`
                : 'Aucun show en direct — voici la programmation'}
            </Text>
          </View>

          <View style={{ gap: spacing.md }}>
            {liveShows.map((show) => (
              <LiveShowCard
                key={show.id}
                show={show}
                onPress={() => navigation.navigate('Player', { id: show.id })}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function HeroSection({
  show,
  onWatch,
  navigation,
}: {
  show: Show;
  onWatch: () => void;
  navigation: any;
}) {
  return (
    <Thumbnail category={show.category} style={styles.hero} watermark={200}>
      <View style={styles.heroContent}>
        <View style={styles.heroBadge}>
          <View style={styles.heroBadgeDot} />
          <Text style={styles.heroBadgeText}>
            {show.isLive ? `${show.category.toUpperCase()} EN DIRECT` : show.category.toUpperCase()}
          </Text>
        </View>

        <Text style={styles.heroTitle}>
          Tèt Kale{'\n'}
          <Text style={{ color: colors.red }}>ak Zoe</Text>
        </Text>
        <Text style={styles.heroDesc}>{show.description}</Text>

        <View style={styles.heroActions}>
          <Pressable style={[styles.btn, styles.btnRed, shadow.glowRed]} onPress={onWatch}>
            <Ionicons name="play" size={16} color={colors.white} />
            <Text style={styles.btnRedText}>Regarder maintenant</Text>
          </Pressable>

          <View style={styles.heroActionsRow}>
            <Pressable
              style={[styles.btn, styles.btnGold]}
              onPress={() => navigation.navigate('StarMember')}
            >
              <Ionicons name="star" size={15} color={colors.gold} />
              <Text style={styles.btnGoldText}>Devenir Star Member</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, styles.btnGhost]}
              onPress={() => navigation.navigate('Schedule')}
            >
              <Ionicons name="information-circle-outline" size={16} color={colors.text} />
              <Text style={styles.btnGhostText}>Programme</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Thumbnail>
  );
}

function LiveShowCard({ show, onPress }: { show: Show; onPress: () => void }) {
  return (
    <Pressable style={[styles.card, shadow.card]} onPress={onPress}>
      <Thumbnail category={show.category} style={styles.cardThumb} watermark={120}>
        {/* Ligne du haut : badge + viewers */}
        <View style={styles.cardTop}>
          <LiveBadge live={show.isLive} />
          {show.isLive && <ViewerCount count={show.viewerCount} />}
        </View>

        {/* Bas : titre, description, tag catégorie */}
        <View style={styles.cardBottom}>
          <View style={styles.cardTextCol}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {show.title}
            </Text>
            {show.isLive ? (
              <Text style={styles.cardDesc} numberOfLines={2}>
                {show.description}
              </Text>
            ) : (
              <View style={styles.nextRow}>
                <Ionicons name="time-outline" size={13} color={colors.gold} />
                <Text style={styles.nextText}>Prochaine émission — {show.nextAirDate}</Text>
              </View>
            )}
          </View>
          <View style={styles.cardTagWrap}>
            <CategoryTag label={show.category} />
          </View>
        </View>
      </Thumbnail>
    </Pressable>
  );
}

const H = spacing.md;

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: H,
    paddingVertical: spacing.sm,
    backgroundColor: colors.bg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  iconBtn: { width: 30, height: 30, alignItems: 'center', justifyContent: 'center' },

  // Hero
  hero: {
    height: 460,
    marginBottom: spacing.xs,
  },
  heroContent: { padding: spacing.lg, gap: spacing.sm },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: colors.red,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.pill,
  },
  heroBadgeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  heroBadgeText: { fontFamily: fonts.black, fontSize: 11, color: colors.white, letterSpacing: 1 },
  heroTitle: {
    fontFamily: fonts.black,
    fontSize: 42,
    lineHeight: 44,
    color: colors.white,
    letterSpacing: -0.5,
    marginTop: 4,
  },
  heroDesc: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
    maxWidth: '92%',
  },
  heroActions: { marginTop: spacing.sm, gap: spacing.sm },
  heroActionsRow: { flexDirection: 'row', gap: spacing.sm },

  // Boutons
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderRadius: radius.pill,
  },
  btnRed: { backgroundColor: colors.red },
  btnRedText: { fontFamily: fonts.bold, fontSize: 14.5, color: colors.white },
  btnGold: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.gold,
    backgroundColor: colors.goldSoft,
  },
  btnGoldText: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.gold },
  btnGhost: {
    borderWidth: 1.5,
    borderColor: colors.borderHi,
    backgroundColor: 'rgba(255,255,255,0.04)',
  },
  btnGhostText: { fontFamily: fonts.bold, fontSize: 12.5, color: colors.text },

  // Section
  section: { paddingHorizontal: H, marginTop: spacing.lg },
  sectionHead: { marginBottom: spacing.md },
  sectionTitle: { fontFamily: fonts.black, fontSize: 22, color: colors.text, letterSpacing: -0.3 },
  sectionSub: { fontFamily: fonts.medium, fontSize: 13, color: colors.red, marginTop: 3 },

  // Card live
  card: {
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    overflow: 'hidden',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  cardThumb: { height: 200 },
  cardTop: {
    position: 'absolute',
    top: spacing.sm,
    left: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTextCol: { flex: 1 },
  cardTitle: { fontFamily: fonts.black, fontSize: 18, color: colors.white },
  cardDesc: {
    fontFamily: fonts.regular,
    fontSize: 12.5,
    lineHeight: 17,
    color: colors.textMuted,
    marginTop: 3,
  },
  nextRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 },
  nextText: { fontFamily: fonts.medium, fontSize: 12, color: colors.gold },
  cardTagWrap: { paddingBottom: 2 },
});
