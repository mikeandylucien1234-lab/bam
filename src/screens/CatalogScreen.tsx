import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import BottomNav from '../components/BottomNav';
import { products, fmtGourdes, type Product } from '../data/products';

// Traduit de la section showCatalog du prototype web (catalogProducts + catChips).
// Couleurs spécifiques reprises telles quelles du prototype, comme HomeScreen.
const CARD_BG = '#F7F6F3';
const CHIP_BORDER = '#E8DBBE';
const CHIP_TEXT = '#6E5F4B';
const SUB_TEXT = '#8A7A62';

// « Tout » = aucun filtre — voir products.filter du prototype.
const CATEGORIES = ['Tout', 'Jus', 'Riz', 'Nouilles'] as const;
type Category = (typeof CATEGORIES)[number];

export default function CatalogScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  const initialCat: Category = CATEGORIES.includes(route.params?.cat)
    ? route.params.cat
    : 'Tout';
  const [cat, setCat] = useState<Category>(initialCat);

  const catalogProducts = products.filter((p) => cat === 'Tout' || p.cat === cat);

  // Grille 2 colonnes — RN n'a pas de CSS grid : on découpe en lignes de 2.
  const rows: (Product | null)[][] = [];
  for (let i = 0; i < catalogProducts.length; i += 2) {
    rows.push([catalogProducts[i], catalogProducts[i + 1] ?? null]);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.lg }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Catalogue</Text>

        {/* Chips catégories — scroll horizontal */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {CATEGORIES.map((label) => {
            const active = cat === label;
            return (
              <Pressable
                key={label}
                onPress={() => setCat(label)}
                style={[
                  styles.chip,
                  {
                    backgroundColor: active ? colors.red : colors.white,
                    borderColor: active ? colors.red : CHIP_BORDER,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: active ? colors.white : CHIP_TEXT }]}>
                  {label}
                </Text>
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
                  <ProductCard
                    key={p.id}
                    product={p}
                    onOpen={() => navigation.navigate('Product', { pid: p.id })}
                  />
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
  // « + » visuel uniquement pour l'instant : le panier arrive dans son écran dédié.
  const [added, setAdded] = useState(false);
  const onAdd = () => {
    setAdded(true);
    setTimeout(() => setAdded(false), 1100);
  };

  return (
    <Pressable style={styles.card} onPress={onOpen}>
      <View style={styles.imageWrap}>
        <Image source={product.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
        <Text style={styles.sub} numberOfLines={1}>{product.sub}</Text>
      </View>
      <View style={styles.cardBottom}>
        <Text style={styles.price}>{fmtGourdes(product.price)}</Text>
        <Pressable
          style={[styles.addBtn, added && styles.addBtnDone]}
          onPress={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          hitSlop={6}
        >
          <Ionicons name={added ? 'checkmark' : 'add'} size={added ? 15 : 19} color={colors.white} />
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },

  title: {
    fontFamily: fonts.display,
    fontSize: 30,
    color: colors.ink,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
  },

  chipsRow: {
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 6,
  },
  chip: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingHorizontal: 16,
    paddingVertical: 9,
  },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 13 },

  grid: { paddingHorizontal: spacing.lg, paddingTop: spacing.sm, gap: spacing.sm },
  gridRow: { flexDirection: 'row', gap: spacing.sm },

  card: {
    flex: 1,
    backgroundColor: CARD_BG,
    borderRadius: radius.md,
    padding: 10,
    paddingBottom: 12,
    gap: 8,
    shadowColor: '#1B1310',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 2,
  },
  cardSpacer: { flex: 1 },
  imageWrap: {
    height: 124,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  image: { height: 108, width: '100%' },
  cardInfo: { gap: 1, paddingHorizontal: 3 },
  name: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },
  sub: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: SUB_TEXT },
  cardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 3,
  },
  price: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.ink },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addBtnDone: { backgroundColor: colors.palm },
});
