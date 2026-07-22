import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';
import { fmtGourdes } from '../data/products';

const PRO_BLUE = colors.blue;
const MUTED = 'rgba(22,32,26,0.55)';

const INVOICES = [
  { num: 'PF-2026-0142', date: '9 juil. 2026', amount: 21400, status: 'Peye', paid: true },
  { num: 'PF-2026-0128', date: '28 juin 2026', amount: 18600, status: 'Peye', paid: true },
  { num: 'PF-2026-0117', date: '14 juin 2026', amount: 9200, status: 'An atant', paid: false },
];

export default function ProInvoicesScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={18} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Fakti pro forma</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md, gap: 12 }} showsVerticalScrollIndicator={false}>
        {INVOICES.map((f) => (
          <Pressable key={f.num} style={styles.card}>
            <View style={styles.iconBox}>
              <Ionicons name="document-text-outline" size={22} color={PRO_BLUE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.num}>{f.num}</Text>
              <Text style={styles.date}>{f.date} · {fmtGourdes(f.amount)}</Text>
            </View>
            <View style={[styles.chip, { backgroundColor: f.paid ? '#E3EFDD' : '#FBEBD5' }]}>
              <Text style={[styles.chipText, { color: f.paid ? '#3D7A4E' : colors.mangoDark }]}>{f.status}</Text>
            </View>
            <Ionicons name="download-outline" size={20} color={PRO_BLUE} style={{ marginLeft: 6 }} />
          </Pressable>
        ))}
        <Text style={styles.note}>Telechaje fakti ou yo an PDF pou kontabilite w.</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  backBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  title: { fontFamily: fonts.display, fontSize: 26, color: colors.ink },
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.white, borderRadius: radius.md, padding: 13,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  iconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#E3EAF7', alignItems: 'center', justifyContent: 'center' },
  num: { fontFamily: fonts.bodyBold, fontSize: 14, color: colors.ink },
  date: { fontFamily: fonts.bodyRegular, fontSize: 12, color: MUTED, marginTop: 1 },
  chip: { borderRadius: radius.pill, paddingHorizontal: 10, paddingVertical: 4 },
  chipText: { fontFamily: fonts.bodyBold, fontSize: 11 },
  note: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: MUTED, textAlign: 'center', lineHeight: 18, marginTop: 6 },
});
