import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';

const MUTED = 'rgba(22,32,26,0.55)';
const TODO = 'rgba(22,32,26,0.22)';

const STEPS = [
  { label: 'Commande confirmée', time: 'Jodi a · 10:02', st: 'done' },
  { label: 'En préparation au dépôt', time: 'Jodi a · 10:40', st: 'done' },
  { label: 'En route — Delmas', time: 'Jodi a · 12:15', st: 'current' },
  { label: 'Livrée', time: 'Estimée 3–5 PM', st: 'todo' },
] as const;

export default function TrackingScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.navigate('Home')} hitSlop={8}>
          <Ionicons name="chevron-back" size={18} color={colors.ink} />
        </Pressable>
        <View>
          <Text style={styles.title}>Suivi de commande</Text>
          <Text style={styles.orderNum}>#BAM-2418</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md, gap: 16 }} showsVerticalScrollIndicator={false}>
        {/* ETA */}
        <View style={styles.eta}>
          <Text style={styles.etaEyebrow}>LIVRAISON ESTIMÉE</Text>
          <Text style={styles.etaTime}>Jodi a, 3–5 PM</Text>
          <Text style={styles.etaSub}>Machin nan sou wout Delmas → Rue Capois</Text>
        </View>

        {/* Timeline */}
        <View style={styles.timeline}>
          {STEPS.map((s, i) => {
            const done = s.st === 'done';
            const current = s.st === 'current';
            const active = done || current;
            return (
              <View key={s.label} style={styles.step}>
                <View style={styles.stepRail}>
                  <View style={[styles.dot, { backgroundColor: active ? colors.red : TODO, borderColor: current ? '#B8E0CE' : active ? colors.red : TODO }]} />
                  {i < STEPS.length - 1 && <View style={[styles.line, { backgroundColor: done ? colors.red : TODO }]} />}
                </View>
                <View style={{ paddingBottom: 18 }}>
                  <Text style={[styles.stepLabel, { color: s.st === 'todo' ? MUTED : colors.ink, fontFamily: current ? fonts.bodyBold : fonts.body }]}>{s.label}</Text>
                  <Text style={styles.stepTime}>{s.time}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Courier */}
        <View style={styles.courier}>
          <View style={styles.courierAvatar}>
            <Text style={styles.courierInitials}>JB</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.courierName}>Jean-Baptiste M.</Text>
            <Text style={styles.courierRole}>Livreur BAM · Moto 217</Text>
          </View>
          <Pressable style={styles.callBtn}>
            <Ionicons name="call" size={14} color={colors.white} />
            <Text style={styles.callText}>Rele li</Text>
          </Pressable>
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
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.ink },
  orderNum: { fontFamily: fonts.bodyRegular, fontSize: 12, color: MUTED },

  eta: { backgroundColor: colors.blue, borderRadius: radius.lg, padding: 18, gap: 4 },
  etaEyebrow: { fontFamily: fonts.bodyBold, fontSize: 11, letterSpacing: 1.5, color: colors.mango },
  etaTime: { fontFamily: fonts.display, fontSize: 24, color: colors.white },
  etaSub: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: '#BFD0F0' },

  timeline: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 18,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  step: { flexDirection: 'row', gap: 14 },
  stepRail: { alignItems: 'center' },
  dot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2.5 },
  line: { width: 2.5, flex: 1, minHeight: 26, borderRadius: 2, marginVertical: 2 },
  stepLabel: { fontSize: 13.5 },
  stepTime: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: MUTED, marginTop: 1 },

  courier: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.md, padding: 13,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  courierAvatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#FBEBD5', alignItems: 'center', justifyContent: 'center' },
  courierInitials: { fontFamily: fonts.display, fontSize: 17, color: colors.mangoDark },
  courierName: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },
  courierRole: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: MUTED, marginTop: 1 },
  callBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.red, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 9 },
  callText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.white },
});
