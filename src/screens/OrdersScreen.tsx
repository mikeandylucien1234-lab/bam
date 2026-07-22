import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import { fmtGourdes } from '../data/products';
import BottomNav, { BOTTOM_NAV_SPACE } from '../components/BottomNav';

const MUTED = 'rgba(22,32,26,0.55)';

const ORDERS = [
  { num: '#BAM-2418', date: '9 juil. 2026', total: 1895, status: 'En route', chipBg: '#FBEBD5', chipFg: '#CE7C0C', items: 'Jus Passion ×6 · Riz Jasmin ×1' },
  { num: '#BAM-2397', date: '28 juin 2026', total: 4325, status: 'Livrée', chipBg: '#E3EFDD', chipFg: '#3D7A4E', items: 'Palette Jus ×1' },
  { num: '#BAM-2350', date: '12 juin 2026', total: 890, status: 'Livrée', chipBg: '#E3EFDD', chipFg: '#3D7A4E', items: 'Nouilles Cup ×6' },
];

export default function OrdersScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <Text style={styles.title}>Kòmann mwen</Text>
      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md, paddingBottom: BOTTOM_NAV_SPACE, gap: 12 }} showsVerticalScrollIndicator={false}>
        {ORDERS.map((o) => (
          <Pressable key={o.num} style={styles.card} onPress={() => navigation.navigate('Tracking')}>
            <View style={styles.cardTop}>
              <Text style={styles.num}>{o.num}</Text>
              <View style={[styles.chip, { backgroundColor: o.chipBg }]}>
                <Text style={[styles.chipText, { color: o.chipFg }]}>{o.status}</Text>
              </View>
            </View>
            <Text style={styles.items} numberOfLines={1}>{o.items}</Text>
            <View style={styles.cardBottom}>
              <Text style={styles.date}>{o.date}</Text>
              <Text style={styles.total}>{fmtGourdes(o.total)}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  title: { fontFamily: fonts.display, fontSize: 28, color: colors.ink, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  card: {
    backgroundColor: colors.white, borderRadius: radius.md, padding: 15, gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  cardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  num: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: colors.ink },
  chip: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 11 },
  items: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: MUTED },
  cardBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  date: { fontFamily: fonts.bodyRegular, fontSize: 12, color: MUTED },
  total: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.ink },
});
