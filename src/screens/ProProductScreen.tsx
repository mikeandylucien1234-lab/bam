import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import { proProducts, fmtGourdes } from '../data/products';
import { useCart } from '../context/CartContext';

const PRO_BLUE = colors.blue;
const MUTED = 'rgba(22,32,26,0.6)';
const BORDER = 'rgba(22,32,26,0.14)';

export default function ProProductScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();

  const pp = proProducts.find((p) => p.id === route.params?.proId) ?? proProducts[0];
  const [tierIdx, setTierIdx] = useState(0);
  const tier = pp.tiers[Math.min(tierIdx, pp.tiers.length - 1)];
  const total = tier.pu * tier.n;

  const onAdd = () => {
    addItem({
      key: `${pp.id}:${tierIdx}`,
      name: pp.name,
      sub: `${tier.label} · ${fmtGourdes(tier.pu)}/${pp.unit}`,
      image: tier.image,
      tint: pp.tint,
      price: total,
      qty: 1,
      pro: true,
    });
    navigation.navigate('Cart');
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <View style={[styles.hero, { backgroundColor: pp.tint, paddingTop: insets.top + spacing.xs }]}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="chevron-back" size={18} color={colors.ink} />
          </Pressable>
          <View style={styles.heroImgWrap}>
            <Image source={tier.image} style={styles.heroImg} resizeMode="contain" />
          </View>
        </View>

        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
          <View style={styles.badgeRow}>
            <Text style={styles.eyebrow}>BAM PRO</Text>
            <View style={styles.badge}><Text style={styles.badgeText}>Gwosis</Text></View>
          </View>
          <Text style={styles.name}>{pp.name}</Text>
          <Text style={styles.sub}>{pp.sub}</Text>

          <Text style={styles.formatLabel}>CHWAZI VOLIM</Text>
          <View style={{ gap: 10 }}>
            {pp.tiers.map((t, i) => {
              const active = i === tierIdx;
              return (
                <Pressable
                  key={t.label}
                  onPress={() => setTierIdx(i)}
                  style={[styles.tier, { borderColor: active ? PRO_BLUE : BORDER, backgroundColor: active ? '#EDF1F9' : colors.white }]}
                >
                  <View style={[styles.radio, { borderColor: active ? PRO_BLUE : '#C9BC9F' }]}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.tierLabel}>{t.label}</Text>
                    <Text style={styles.tierPu}>{fmtGourdes(t.pu)} / {pp.unit}</Text>
                  </View>
                  {t.save && <View style={styles.saveTag}><Text style={styles.saveText}>{t.save}</Text></View>}
                  <Text style={styles.tierTotal}>{fmtGourdes(t.pu * t.n)}</Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.totalRow}>
            <View>
              <Text style={styles.totalLabel}>Total ({tier.n} {pp.unit})</Text>
              <Text style={styles.totalValue}>{fmtGourdes(total)}</Text>
            </View>
          </View>

          <Pressable style={styles.cta} onPress={onAdd}>
            <Ionicons name="cart" size={18} color={colors.white} />
            <Text style={styles.ctaText}>Ajoute nan panyen · {fmtGourdes(total)}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  hero: { paddingHorizontal: spacing.lg },
  backBtn: {
    marginTop: spacing.xs, width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.85)', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 3,
  },
  heroImgWrap: { alignItems: 'center', marginTop: spacing.md, marginBottom: 26 },
  heroImg: { height: 200, width: '72%' },

  sheet: { backgroundColor: colors.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -24, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, gap: 8 },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1.6, color: PRO_BLUE },
  badge: { borderWidth: 1, borderColor: BORDER, borderRadius: radius.pill, paddingHorizontal: 9, paddingVertical: 3 },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 10.5, color: MUTED },
  name: { fontFamily: fonts.display, fontSize: 28, color: colors.ink, marginTop: 2 },
  sub: { fontFamily: fonts.bodyRegular, fontSize: 13.5, color: MUTED, lineHeight: 20 },

  formatLabel: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, color: MUTED, marginTop: 12 },
  tier: { flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderRadius: radius.md, padding: 14 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: PRO_BLUE },
  tierLabel: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.ink },
  tierPu: { fontFamily: fonts.bodyRegular, fontSize: 12, color: MUTED, marginTop: 1 },
  saveTag: { backgroundColor: '#E6F2E4', borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 3 },
  saveText: { fontFamily: fonts.bodyBold, fontSize: 11, color: '#2F7A3D' },
  tierTotal: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },

  totalRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  totalLabel: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: MUTED },
  totalValue: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },

  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: PRO_BLUE, borderRadius: 18, paddingVertical: 16, marginTop: 8,
    shadowColor: PRO_BLUE, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.28, shadowRadius: 20, elevation: 6,
  },
  ctaText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.white },
});
