import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import { fmtGourdes } from '../data/products';
import BottomNav, { BOTTOM_NAV_SPACE } from '../components/BottomNav';

const MUTED = 'rgba(22,32,26,0.55)';
const USER_NAME = 'Sammy Désir';

const ORDERS = [
  { num: '#BAM-2418', date: '9 juil. 2026', total: 1895, status: 'En route', chipBg: '#FBEBD5', chipFg: '#CE7C0C' },
  { num: '#BAM-2397', date: '28 juin 2026', total: 4325, status: 'Livrée', chipBg: '#E3EFDD', chipFg: '#3D7A4E' },
];
const MENU = ['Adresses de livraison', 'Moyens de paiement', 'Èd & Kontak'];

export default function AccountScreen() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: BOTTOM_NAV_SPACE, gap: 16 }} showsVerticalScrollIndicator={false}>
        {/* Profil */}
        <View style={styles.profile}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{USER_NAME.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.name}>{USER_NAME}</Text>
            <Text style={styles.since}>Kliyan BAM depi 2024</Text>
          </View>
        </View>

        {/* Points */}
        <View style={styles.pointsCard}>
          <View>
            <Text style={styles.pointsValue}>1 250 pwen</Text>
            <Text style={styles.pointsLabel}>Pwogram Fidelite BAM</Text>
          </View>
          <Pressable style={styles.pointsBtn} onPress={() => navigation.navigate('BamPoints')}>
            <Text style={styles.pointsBtnText}>Itilize pwen</Text>
          </Pressable>
        </View>

        {/* Mode Revendeur */}
        <Pressable style={styles.proRow} onPress={() => navigation.navigate('ProIntro')}>
          <View style={{ flex: 1 }}>
            <Text style={styles.proTitle}>Mode Revendeur</Text>
            <Text style={styles.proSub}>Prix palette pour votre commerce</Text>
          </View>
          <View style={styles.toggle}>
            <View style={styles.toggleKnob} />
          </View>
        </Pressable>

        {/* Commandes */}
        <View style={{ paddingHorizontal: spacing.lg, gap: 10 }}>
          <Text style={styles.eyebrow}>MES COMMANDES</Text>
          {ORDERS.map((o) => (
            <Pressable key={o.num} style={styles.orderRow} onPress={() => navigation.navigate('Tracking')}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderNum}>{o.num}</Text>
                <Text style={styles.orderSub}>{o.date} · {fmtGourdes(o.total)}</Text>
              </View>
              <View style={[styles.chip, { backgroundColor: o.chipBg }]}>
                <Text style={[styles.chipText, { color: o.chipFg }]}>{o.status}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#B7A98F" />
            </Pressable>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {MENU.map((m, i) => (
            <Pressable key={m} style={[styles.menuItem, i < MENU.length - 1 && styles.menuDivider]}>
              <Text style={styles.menuText}>{m}</Text>
              <Ionicons name="chevron-forward" size={16} color="#B7A98F" />
            </Pressable>
          ))}
        </View>

        <Text style={styles.logout}>Se déconnecter</Text>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },

  profile: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingHorizontal: spacing.lg, paddingTop: spacing.lg },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.blue, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontFamily: fonts.display, fontSize: 24, color: colors.white },
  name: { fontFamily: fonts.bodyBold, fontSize: 18, color: colors.ink },
  since: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: MUTED, marginTop: 2 },

  pointsCard: {
    marginHorizontal: spacing.lg, backgroundColor: '#FBEBD5', borderRadius: radius.lg, padding: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
  },
  pointsValue: { fontFamily: fonts.display, fontSize: 24, color: colors.ink },
  pointsLabel: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.mangoDark, marginTop: 2 },
  pointsBtn: { backgroundColor: colors.ink, borderRadius: radius.pill, paddingHorizontal: 14, paddingVertical: 9 },
  pointsBtnText: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.mango },

  proRow: {
    marginHorizontal: spacing.lg, backgroundColor: colors.white, borderRadius: radius.md, padding: 14,
    flexDirection: 'row', alignItems: 'center', gap: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  proTitle: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  proSub: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: MUTED, marginTop: 1 },
  toggle: { width: 46, height: 27, borderRadius: 14, backgroundColor: 'rgba(22,32,26,0.18)', justifyContent: 'center', paddingHorizontal: 3 },
  toggleKnob: { width: 21, height: 21, borderRadius: 11, backgroundColor: colors.white, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.25, shadowRadius: 3, elevation: 2 },

  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, color: MUTED },
  orderRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.sm, padding: 13,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  orderNum: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },
  orderSub: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: MUTED, marginTop: 1 },
  chip: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 11 },

  menu: {
    marginHorizontal: spacing.lg, backgroundColor: colors.white, borderRadius: radius.md,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 15 },
  menuDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: 'rgba(22,32,26,0.1)' },
  menuText: { fontFamily: fonts.body, fontSize: 13.5, color: colors.ink },

  logout: { fontFamily: fonts.bodyBold, fontSize: 13, color: colors.red, textAlign: 'center' },
});
