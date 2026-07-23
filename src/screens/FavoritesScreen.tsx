import React from 'react';
import { View, Text, ScrollView, Pressable, Image, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import { fmtGourdes } from '../data/products';
import BottomNav, { BOTTOM_NAV_SPACE } from '../components/BottomNav';
import { useFavorites } from '../context/FavoritesContext';
import { useCatalogue } from '../context/CatalogueContext';

const MUTED = 'rgba(22,32,26,0.55)';

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const { favIds, toggleFav } = useFavorites();
  const { products } = useCatalogue();
  const favs = products.filter((p) => favIds.includes(p.id));

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Text style={styles.title}>Favori mwen</Text>
      {favs.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIcon}>
            <Ionicons name="heart-outline" size={44} color={MUTED} />
          </View>
          <Text style={styles.emptyTitle}>Pa gen favori</Text>
          <Text style={styles.emptySub}>Touche ❤ sou yon pwodwi pou jwenn li isit la pi vit.</Text>
          <Pressable style={styles.emptyBtn} onPress={() => navigation.navigate('Catalog')}>
            <Text style={styles.emptyBtnText}>Wè katalòg</Text>
          </Pressable>
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md, paddingBottom: BOTTOM_NAV_SPACE, gap: 12 }} showsVerticalScrollIndicator={false}>
          {favs.map((p) => (
            <Pressable key={p.id} style={styles.row} onPress={() => navigation.navigate('Product', { pid: p.id })}>
              <View style={[styles.imgWrap, { backgroundColor: p.tint }]}>
                <Image source={p.image} style={styles.img} resizeMode="contain" />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
                <Text style={styles.sub} numberOfLines={1}>{p.sub}</Text>
                <Text style={styles.price}>{fmtGourdes(p.price)}</Text>
              </View>
              <Pressable style={styles.heart} onPress={() => toggleFav(p.id)} hitSlop={8}>
                <Ionicons name="heart" size={20} color={colors.red} />
              </Pressable>
            </Pressable>
          ))}
        </ScrollView>
      )}
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.ink, paddingHorizontal: spacing.lg, paddingTop: spacing.md },

  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 12 },
  emptyIcon: { width: 96, height: 96, borderRadius: 48, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  emptyTitle: { fontFamily: fonts.display, fontSize: 22, color: colors.ink },
  emptySub: { fontFamily: fonts.bodyRegular, fontSize: 13, color: MUTED, textAlign: 'center', lineHeight: 19 },
  emptyBtn: { backgroundColor: colors.red, borderRadius: radius.pill, paddingHorizontal: 22, paddingVertical: 12, marginTop: 6 },
  emptyBtnText: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.white },

  row: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.md, padding: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  imgWrap: { width: 64, height: 64, borderRadius: radius.sm, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  img: { width: 52, height: 52 },
  name: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  sub: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: MUTED, marginTop: 1 },
  price: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink, marginTop: 3 },
  heart: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
});
