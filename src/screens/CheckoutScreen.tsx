import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import { fmtGourdes } from '../data/products';
import { useCart } from '../context/CartContext';

const MUTED = 'rgba(22,32,26,0.55)';
const BORDER = 'rgba(22,32,26,0.14)';
const USER_NAME = 'Sammy';

const SHIP_OPTS = [
  { label: 'Livraison', sub: '24–48 h · Pòtoprens' },
  { label: 'Retrait dépôt', sub: 'Gratis · Tabarre' },
];
const PAY_OPTS = [
  { name: 'MonCash', sub: 'Peye ak telefòn ou', icon: 'M', iconBg: colors.red },
  { name: 'Carte bancaire', sub: 'Visa · Mastercard', icon: '💳', iconBg: colors.blue },
  { name: 'Cash à la livraison', sub: 'Lajan kach lè w resevwa l', icon: 'G', iconBg: colors.mango },
];

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { subtotal, shipping, total, shipIdx, setShipIdx, payIdx, setPayIdx, clear } = useCart();

  const placeOrder = () => {
    clear();
    navigation.navigate('Tracking');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={18} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Paiement</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 30, gap: 18 }} showsVerticalScrollIndicator={false}>
        {/* Livraison */}
        <View style={{ gap: 8 }}>
          <Text style={styles.eyebrow}>LIVRAISON</Text>
          <View style={styles.addressCard}>
            <View style={styles.addrIcon}>
              <Ionicons name="location-outline" size={18} color={colors.mangoDark} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.addrName}>{USER_NAME} · 12, Rue Capois</Text>
              <Text style={styles.addrSub}>Pòtoprens, Ayiti · +509 34 12 34 56</Text>
            </View>
            <Text style={styles.modify}>Modifier</Text>
          </View>
          <View style={styles.optRow}>
            {SHIP_OPTS.map((o, i) => {
              const active = shipIdx === i;
              return (
                <Pressable
                  key={o.label}
                  onPress={() => setShipIdx(i)}
                  style={[styles.optBtn, { backgroundColor: active ? colors.ink : colors.white, borderColor: active ? colors.ink : BORDER }]}
                >
                  <Text style={[styles.optLabel, { color: active ? colors.cream : colors.ink }]}>{o.label}</Text>
                  <Text style={[styles.optSub, { color: active ? colors.cream : colors.ink }]}>{o.sub}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Paiement */}
        <View style={{ gap: 8 }}>
          <Text style={styles.eyebrow}>MOYEN DE PAIEMENT</Text>
          {PAY_OPTS.map((p, i) => {
            const active = payIdx === i;
            return (
              <Pressable
                key={p.name}
                onPress={() => setPayIdx(i)}
                style={[styles.payRow, { borderColor: active ? colors.red : BORDER, backgroundColor: colors.white }]}
              >
                <View style={[styles.payIcon, { backgroundColor: p.iconBg }]}>
                  <Text style={styles.payIconText}>{p.icon}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.payName}>{p.name}</Text>
                  <Text style={styles.paySub}>{p.sub}</Text>
                </View>
                <View style={[styles.radio, { borderColor: active ? colors.red : '#C9BC9F' }]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* Résumé */}
        <View style={styles.summary}>
          <View style={styles.sumRow}><Text style={styles.sumLabel}>Sous-total</Text><Text style={styles.sumValue}>{fmtGourdes(subtotal)}</Text></View>
          <View style={styles.sumRow}><Text style={styles.sumLabel}>Livraison</Text><Text style={styles.sumValue}>{shipping === 0 ? 'Gratis' : fmtGourdes(shipping)}</Text></View>
          <View style={styles.dashed} />
          <View style={styles.sumRow}><Text style={styles.totalLabel}>Total</Text><Text style={styles.totalLabel}>{fmtGourdes(total)}</Text></View>
        </View>

        <Pressable style={styles.cta} onPress={placeOrder}>
          <Text style={styles.ctaText}>Konfime kòmann · {fmtGourdes(total)}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.sm, paddingBottom: spacing.xs },
  backBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.white,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },

  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, color: MUTED },

  addressCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white,
    borderRadius: radius.sm, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  addrIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FBEBD5', alignItems: 'center', justifyContent: 'center' },
  addrName: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },
  addrSub: { fontFamily: fonts.bodyRegular, fontSize: 12, color: MUTED, marginTop: 1 },
  modify: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.red },

  optRow: { flexDirection: 'row', gap: 8 },
  optBtn: { flex: 1, borderWidth: 1.5, borderRadius: 14, paddingVertical: 11, paddingHorizontal: 8, alignItems: 'center', gap: 2 },
  optLabel: { fontFamily: fonts.bodyBold, fontSize: 13 },
  optSub: { fontFamily: fonts.bodyRegular, fontSize: 11, opacity: 0.75 },

  payRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: radius.sm, padding: 12 },
  payIcon: { width: 38, height: 38, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  payIconText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.white },
  payName: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  paySub: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: MUTED, marginTop: 1 },
  radio: { width: 18, height: 18, borderRadius: 9, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 9, height: 9, borderRadius: 4.5, backgroundColor: colors.red },

  summary: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, gap: 9,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { fontFamily: fonts.bodyRegular, fontSize: 13.5, color: 'rgba(22,32,26,0.62)' },
  sumValue: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },
  dashed: { borderTopWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(22,32,26,0.18)', marginVertical: 2 },
  totalLabel: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink },

  cta: {
    backgroundColor: colors.red, borderRadius: 18, paddingVertical: 16, alignItems: 'center',
    shadowColor: colors.red, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.28, shadowRadius: 20, elevation: 6,
  },
  ctaText: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.white },
});
