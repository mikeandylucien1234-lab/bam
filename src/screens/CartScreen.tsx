import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import { fmtGourdes } from '../data/products';
import { useCart } from '../context/CartContext';

const MUTED = 'rgba(22,32,26,0.55)';
const STEP_BG = '#E6E9E1';

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const { items, count, subtotal, shipping, total, bumpItem } = useCart();

  const shipNote =
    subtotal > 0 && shipping === 0
      ? 'Livrezon gratis! 🎉'
      : subtotal > 0
      ? `Plis ${fmtGourdes(5000 - subtotal)} pou livrezon gratis`
      : '';

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={18} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Panier</Text>
        <Text style={styles.count}>{count > 0 ? `${count} atik` : ''}</Text>
      </View>

      {items.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="bag-handle-outline" size={44} color={MUTED} />
          </View>
          <Text style={styles.emptyTitle}>Panyen ou vid</Text>
          <Text style={styles.emptySub}>Al gade sa ki populè kounye a nan katalòg la.</Text>
          <Pressable style={styles.emptyBtn} onPress={() => navigation.navigate('Catalog')}>
            <Text style={styles.emptyBtnText}>Wè katalòg</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 12, gap: 10 }} showsVerticalScrollIndicator={false}>
            {items.map((r) => (
              <View key={r.key} style={styles.row}>
                <View style={styles.rowImageWrap}>
                  <Image source={r.image} style={styles.rowImage} resizeMode="contain" />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.rowName} numberOfLines={1}>{r.name}</Text>
                  <Text style={styles.rowSub} numberOfLines={1}>{r.sub}</Text>
                  <Text style={styles.rowPrice}>{fmtGourdes(r.price * r.qty)}</Text>
                </View>
                <View style={styles.stepper}>
                  <Pressable style={styles.stepBtn} onPress={() => bumpItem(r.key, -1)} hitSlop={4}>
                    <Ionicons name="remove" size={15} color={colors.ink} />
                  </Pressable>
                  <Text style={styles.qty}>{r.qty}</Text>
                  <Pressable style={styles.stepBtn} onPress={() => bumpItem(r.key, 1)} hitSlop={4}>
                    <Ionicons name="add" size={15} color={colors.ink} />
                  </Pressable>
                </View>
              </View>
            ))}

            <View style={styles.summary}>
              <Row label="Sous-total" value={fmtGourdes(subtotal)} />
              <Row label="Livraison" value={shipping === 0 ? 'Gratis' : fmtGourdes(shipping)} />
              <View style={styles.dashed} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{fmtGourdes(total)}</Text>
              </View>
              {!!shipNote && <Text style={styles.shipNote}>{shipNote}</Text>}
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={styles.cta} onPress={() => navigation.navigate('Checkout')}>
              <Text style={styles.ctaText}>Passer au paiement · {fmtGourdes(total)}</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.sumRow}>
      <Text style={styles.sumLabel}>{label}</Text>
      <Text style={styles.sumValue}>{value}</Text>
    </View>
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
  count: { fontFamily: fonts.bodyRegular, fontSize: 13, color: MUTED, marginBottom: -6 },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 12 },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.ink },
  emptySub: { fontFamily: fonts.bodyRegular, fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 19 },
  emptyBtn: { backgroundColor: colors.red, borderRadius: radius.pill, paddingHorizontal: 22, paddingVertical: 12, marginTop: 6 },
  emptyBtnText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.white },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.white, borderRadius: radius.md, padding: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  rowImageWrap: { width: 60, height: 60, borderRadius: radius.sm, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  rowImage: { width: 50, height: 50 },
  rowName: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },
  rowSub: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: MUTED, marginTop: 1 },
  rowPrice: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink, marginTop: 3 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: STEP_BG, borderRadius: radius.pill, padding: 4 },
  stepBtn: { width: 26, height: 26, borderRadius: 13, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  qty: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink, minWidth: 14, textAlign: 'center' },

  summary: {
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, marginTop: 6, gap: 9,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  sumRow: { flexDirection: 'row', justifyContent: 'space-between' },
  sumLabel: { fontFamily: fonts.bodyRegular, fontSize: 13.5, color: 'rgba(22,32,26,0.62)' },
  sumValue: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },
  dashed: { borderTopWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(22,32,26,0.18)', marginVertical: 2 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink },
  totalValue: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink },
  shipNote: { fontFamily: fonts.bodyBold, fontSize: 11.5, color: colors.mangoDark },

  footer: { padding: spacing.lg, paddingTop: 10, backgroundColor: colors.cream },
  cta: {
    backgroundColor: colors.red, borderRadius: 18, paddingVertical: 16, alignItems: 'center',
    shadowColor: colors.red, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.28, shadowRadius: 20, elevation: 6,
  },
  ctaText: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.white },
});
