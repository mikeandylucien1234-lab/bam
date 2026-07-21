import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';

const MUTED = 'rgba(22,32,26,0.55)';

const REWARDS = [
  { icon: '🥤', name: '1 jus BAM gratis', cost: 300, tag: 'Disponib', color: '#3D7A4E' },
  { icon: '🚚', name: 'Livrezon gratis', cost: 150, tag: 'Disponib', color: '#3D7A4E' },
  { icon: '🍚', name: '10% sou 1 sak diri', cost: 800, tag: 'Bloke', color: colors.mangoDark },
];
const HISTORY = [
  { label: 'Kòmann #BAM-2418', date: '9 juil. 2026', delta: '+186' },
  { label: 'Kòmann #BAM-2397', date: '28 jen 2026', delta: '+432' },
];

export default function BamPointsScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={18} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>BAM Points</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md, gap: 16 }} showsVerticalScrollIndicator={false}>
        {/* Solde */}
        <View style={styles.balance}>
          <LinearGradient colors={['#F6B542', '#F2A125', '#D4820E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
          <View style={styles.balanceBlob} />
          <Text style={styles.balanceEyebrow}>SOLDE POU KOUNYE A</Text>
          <Text style={styles.balanceValue}>1 250 pwen</Text>
          <Text style={styles.balanceSub}>≈ 250 G de rabè disponib</Text>
        </View>

        {/* Règle */}
        <View style={{ gap: 10 }}>
          <Text style={styles.eyebrow}>RÈGLE FIDELITE</Text>
          <View style={styles.ruleCard}>
            <Text style={{ fontSize: 20 }}>🛒</Text>
            <Text style={styles.ruleText}>1 G depanse = 1 pwen. 200 pwen = 40 G rabè sou pwochen kòmann ou.</Text>
          </View>
        </View>

        {/* Rekonpans */}
        <View style={{ gap: 10 }}>
          <Text style={styles.eyebrow}>REKONPANS DISPONIB</Text>
          {REWARDS.map((r) => (
            <View key={r.name} style={styles.rewardCard}>
              <View style={styles.rewardIcon}><Text style={{ fontSize: 17 }}>{r.icon}</Text></View>
              <View style={{ flex: 1 }}>
                <Text style={styles.rewardName}>{r.name}</Text>
                <Text style={styles.rewardCost}>{r.cost} pwen</Text>
              </View>
              <Text style={[styles.rewardTag, { color: r.color }]}>{r.tag}</Text>
            </View>
          ))}
        </View>

        {/* Istwa */}
        <View style={{ gap: 10 }}>
          <Text style={styles.eyebrow}>ISTWA PWEN</Text>
          {HISTORY.map((h) => (
            <View key={h.label} style={styles.histCard}>
              <View>
                <Text style={styles.histLabel}>{h.label}</Text>
                <Text style={styles.histDate}>{h.date}</Text>
              </View>
              <Text style={styles.histDelta}>{h.delta}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  backBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },

  balance: { borderRadius: radius.lg, padding: 22, overflow: 'hidden', gap: 4, shadowColor: '#D4820E', shadowOffset: { width: 0, height: 14 }, shadowOpacity: 0.28, shadowRadius: 26, elevation: 6 },
  balanceBlob: { position: 'absolute', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(255,255,255,0.14)', right: -50, top: -60 },
  balanceEyebrow: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.5, color: 'rgba(22,32,26,0.65)' },
  balanceValue: { fontFamily: fonts.display, fontSize: 42, color: colors.white, marginTop: 4 },
  balanceSub: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: 'rgba(22,32,26,0.7)' },

  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, color: MUTED },

  ruleCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.md, padding: 15,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  ruleText: { flex: 1, fontFamily: fonts.bodyRegular, fontSize: 13, color: 'rgba(22,32,26,0.72)', lineHeight: 19 },

  rewardCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.md, padding: 13,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  rewardIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FBEBD5', alignItems: 'center', justifyContent: 'center' },
  rewardName: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },
  rewardCost: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: MUTED, marginTop: 1 },
  rewardTag: { fontFamily: fonts.bodyBold, fontSize: 12 },

  histCard: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: colors.white, borderRadius: radius.sm, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  histLabel: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.ink },
  histDate: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: MUTED, marginTop: 1 },
  histDelta: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: '#3D7A4E' },
});
