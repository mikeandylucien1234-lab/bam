import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import BottomNav, { BOTTOM_NAV_SPACE } from '../components/BottomNav';
import { products, fmtGourdes, type Product } from '../data/products';

// Redesign « Scoops » (layout épuré) — contenu & palette BAM conservés.
// Traduit de la section showCatalog du prototype (catalogProducts + catChips).
const CARD_BG = '#FFFFFF';
const CHIP_BORDER = '#E8DBBE';
const SUB_TEXT = '#8A7A62';

// « Tout » = aucun filtre — voir products.filter du prototype.
const CATEGORIES = ['Tout', 'Jus', 'Riz', 'Nouilles'] as const;
type Category = (typeof CATEGORIES)[number];

export default function CatalogScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const initialCat: Category = CATEGORIES.includes(route.params?.cat) ? route.params.cat : 'Tout';
  const [cat, setCat] = useState<Category>(initialCat);

  const catalogProducts = products.filter((p) => cat === 'Tout' || p.cat === cat);

  const rows: (Product | null)[][] = [];
  for (let i = 0; i < catalogProducts.length; i += 2) {
    rows.push([catalogProducts[i], catalogProducts[i + 1] ?? null]);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: BOTTOM_NAV_SPACE }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <View style={styles.hero}>
          <Text style={styles.eyebrow}>ACHTE BAM</Text>
          <Text style={styles.title}>Sa w vle{'\n'}manje jodi a?</Text>
        </View>

        {/* Chips catégories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsRow}>
          {CATEGORIES.map((label) => {
            const active = cat === label;
            return (
              <Pressable
                key={label}
                onPress={() => setCat(label)}
                style={[
                  styles.chip,
                  { backgroundColor: active ? colors.ink : CARD_BG, borderColor: active ? colors.ink : CHIP_BORDER },
                ]}
              >
                <Text style={[styles.chipText, { color: active ? colors.cream : colors.ink }]}>{label}</Text>
                {active && <Ionicons name="close" size={13} color={colors.cream} style={{ marginLeft: 5 }} />}
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Grille produits */}
        <View style={styles.grid}>
          {rows.map((row, ri) => (
            <View key={ri} style={styles.gridRow}>
              {row.map((p, ci) =>
                p ? (
                  <ProductCard key={p.id} product={p} onOpen={() => navigation.navigate('Product', { pid: p.id })} />
                ) : (
                  <View key={`spacer-${ci}`} style={styles.cardSpacer} />
                )
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      <BottomNav />
    </SafeAreaView>
  );
}

function ProductCard({ product, onOpen }: { product: Product; onOpen: () => void }) {
  const [added, setAdded] = useState(false);
  const onAdd = (e: any) => {
    e?.stopPropagation?.();
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
  };

  return (
    <Pressable style={styles.card} onPress={onOpen}>
      <View style={styles.imageWrap}>
        <Image source={product.image} style={styles.image} resizeMode="contain" />
      </View>
      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
      <Text style={styles.sub} numberOfLines={1}>{product.sub}</Text>
      <View style={styles.cardBottom}>
        <Text style={styles.price}>{fmtGourdes(product.price)}</Text>
        <Pressable style={[styles.addBtn, added && styles.addBtnDone]} onPress={onAdd} hitSlop={6}>
          <Ionicons name={added ? 'checkmark' : 'add'} size={added ? 16 : 20} color={colors.cream} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },

  hero: { paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  eyebrow: { fontFamily: fonts.bodyBold, fontSize: 11.5, letterSpacing: 1.5, color: colors.red, marginBottom: 6 },
  title: { fontFamily: fonts.display, fontSize: 30, color: colors.ink, lineHeight: 34 },

  chipsRow: { flexDirection: 'row', gap: spacing.xs, paddingHorizontal: spacing.lg, paddingTop: spacing.lg, paddingBottom: 4 },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 13 },

  grid: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, gap: spacing.md },
  gridRow: { flexDirection: 'row', gap: spacing.md },

  card: { flex: 1 },
  cardSpacer: { flex: 1 },
  imageWrap: {
    height: 150,
    borderRadius: radius.lg,
    backgroundColor: CARD_BG,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginBottom: 10,
  },
  image: { height: 120, width: '82%' },
  name: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.ink },
  sub: { fontFamily: fonts.bodyRegular, fontSize: 12, color: SUB_TEXT, marginTop: 1 },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  price: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
  addBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDone: { backgroundColor: colors.palm },
});
