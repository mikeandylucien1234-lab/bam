import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import { fmtGourdes } from '../data/products';
import { useCart } from '../context/CartContext';
import { useCatalogue } from '../context/CatalogueContext';

// Traduit de la section showProduct du prototype web (markup l.454-496,
// logique prod/formats/qty/addSelected l.1063-1073 & 1235-1245).
// Couleurs spécifiques reprises telles quelles du prototype, comme HomeScreen.
const BADGE_BORDER = 'rgba(22,32,26,0.18)';
const MUTED_BROWN = 'rgba(22,32,26,0.55)';
const DESC_BROWN = 'rgba(22,32,26,0.62)';
const FORMAT_BORDER = 'rgba(22,32,26,0.14)';
const STEP_BG = '#E6E9E1';

export default function ProductScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const insets = useSafeAreaInsets();
  const { addItem } = useCart();
  const { products, formatsFor } = useCatalogue();

  // products.find(x => x.id === S.pid) || products[0]
  const product = products.find((p) => p.id === route.params?.pid) ?? products[0];
  const fmts = formatsFor(product);

  const [fmtIdx, setFmtIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const f = fmts[fmtIdx] ?? fmts[0];
  const unitPrice = product.price * f.mult * f.disc;

  // « Ajoute nan panyen » : ajoute au panier puis va au panier (comme le prototype).
  const onAdd = () => {
    addItem({
      key: `${product.id}:${fmtIdx}`,
      name: product.name,
      sub: `${f.label} · ${f.sub}`,
      image: product.image,
      tint: product.tint,
      price: unitPrice,
      qty,
    });
    setAdded(true);
    setTimeout(() => navigation.navigate('Cart'), 350);
  };

  return (
    <View style={styles.screen}>
      <StatusBar style="dark" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero teinté */}
        <View style={[styles.hero, { backgroundColor: product.tint, paddingTop: insets.top + spacing.xs }]}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="chevron-back" size={18} color={colors.ink} />
          </Pressable>
          {/* Le PNG produit a un fond blanc. Plutôt que le mix-blend-mode:multiply
              du prototype (non rendu par react-native-web, donc non vérifiable en
              aperçu), on pose la canette sur une tuile blanche arrondie — même parti
              pris que les cartes du catalogue, rendu identique natif/web. */}
          <View style={styles.heroTile}>
            <Image source={product.image} style={styles.heroImage} resizeMode="contain" />
          </View>
        </View>

        {/* Feuille crème */}
        <View style={[styles.sheet, { paddingBottom: insets.bottom + spacing.xl }]}>
          {/* En-tête produit */}
          <View style={styles.titleBlock}>
            <View style={styles.catRow}>
              <Text style={[styles.catLabel, { color: product.accent }]}>{product.cat.toUpperCase()}</Text>
              <Text style={styles.badge}>Fèt an Ayiti</Text>
            </View>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={[styles.kre, { color: product.accent }]}>« {product.kre} »</Text>
          </View>

          <Text style={styles.desc}>{product.desc}</Text>

          {/* Sélecteur de format */}
          <View style={styles.formatBlock}>
            <Text style={styles.formatEyebrow}>FORMAT</Text>
            <View style={styles.formatRow}>
              {fmts.map((x, i) => {
                const active = i === fmtIdx;
                return (
                  <Pressable
                    key={x.label}
                    onPress={() => setFmtIdx(i)}
                    style={[
                      styles.formatBtn,
                      {
                        backgroundColor: active ? colors.ink : colors.white,
                        borderColor: active ? colors.ink : FORMAT_BORDER,
                      },
                    ]}
                  >
                    <Text style={[styles.formatLabel, { color: active ? colors.cream : colors.ink }]}>
                      {x.label}
                    </Text>
                    <Text style={[styles.formatSub, { color: active ? colors.cream : colors.ink }]}>
                      {fmtGourdes(product.price * x.mult * x.disc)}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Prix + quantité */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>{fmtGourdes(unitPrice)}</Text>
            <View style={styles.stepper}>
              <Pressable style={styles.stepBtn} onPress={() => setQty((q) => Math.max(1, q - 1))} hitSlop={4}>
                <Text style={styles.stepSign}>−</Text>
              </Pressable>
              <Text style={styles.qtyLabel}>{qty}</Text>
              <Pressable style={styles.stepBtn} onPress={() => setQty((q) => Math.min(99, q + 1))} hitSlop={4}>
                <Text style={styles.stepSign}>+</Text>
              </Pressable>
            </View>
          </View>

          {/* CTA */}
          <Pressable style={[styles.cta, added && styles.ctaDone]} onPress={onAdd}>
            <Text style={styles.ctaText}>
              {added ? 'Ajoute nan panyen ✓' : `Ajoute nan panyen · ${fmtGourdes(unitPrice * qty)}`}
            </Text>
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
    marginTop: spacing.xs,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#1B1310',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 3,
  },
  heroTile: {
    marginTop: spacing.md,
    marginBottom: 30,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.lg,
    paddingVertical: 18,
    shadowColor: '#1B1310',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 4,
  },
  heroImage: { height: 210, width: '70%' },

  sheet: {
    backgroundColor: colors.cream,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    marginTop: -24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    gap: 14,
  },

  titleBlock: { gap: 4 },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  catLabel: { fontFamily: fonts.bodyBold, fontSize: 10.5, letterSpacing: 1.6 },
  badge: {
    fontFamily: fonts.bodyBold,
    fontSize: 10.5,
    color: MUTED_BROWN,
    borderWidth: 1,
    borderColor: BADGE_BORDER,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: radius.pill,
    overflow: 'hidden',
  },
  name: { fontFamily: fonts.display, fontSize: 30, color: colors.ink, lineHeight: 33 },
  kre: { fontFamily: fonts.display, fontStyle: 'italic', fontSize: 15 },

  desc: { fontFamily: fonts.bodyRegular, fontSize: 13.5, color: DESC_BROWN, lineHeight: 22 },

  formatBlock: { gap: 8 },
  formatEyebrow: { fontFamily: fonts.bodyBold, fontSize: 12, letterSpacing: 1, color: MUTED_BROWN },
  formatRow: { flexDirection: 'row', gap: spacing.xs },
  formatBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    gap: 2,
  },
  formatLabel: { fontFamily: fonts.bodyBold, fontSize: 13 },
  formatSub: { fontFamily: fonts.body, fontSize: 11, opacity: 0.75 },

  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  price: { fontFamily: fonts.bodyBold, fontSize: 22, color: colors.ink },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.white,
    borderRadius: radius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    shadowColor: '#1B1310',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  stepBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: STEP_BG,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepSign: { fontFamily: fonts.bodyBold, fontSize: 18, color: colors.ink, lineHeight: 20 },
  qtyLabel: { fontFamily: fonts.bodyBold, fontSize: 16, color: colors.ink, minWidth: 18, textAlign: 'center' },

  cta: {
    backgroundColor: colors.red,
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: colors.red,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 22,
    elevation: 6,
  },
  ctaDone: { backgroundColor: colors.palm, shadowColor: colors.palm },
  ctaText: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.white },
});
