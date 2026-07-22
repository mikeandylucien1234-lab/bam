import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';

const PRO_BLUE = colors.blue;
const MUTED = 'rgba(22,32,26,0.6)';

const ACTIONS = [
  { icon: 'call', label: 'Rele li', bg: PRO_BLUE, fg: '#fff' },
  { icon: 'logo-whatsapp', label: 'WhatsApp', bg: '#25D366', fg: '#fff' },
  { icon: 'mail', label: 'Imèl', bg: colors.mango, fg: colors.ink },
];

export default function ProContactScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
          <Ionicons name="chevron-back" size={18} color={colors.ink} />
        </Pressable>
        <Text style={styles.title}>Komèsyal mwen</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: spacing.md, gap: 16 }} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.avatar}><Text style={styles.initials}>JB</Text></View>
          <Text style={styles.name}>Jerry Baptiste</Text>
          <Text style={styles.role}>Reprezantan BAM Wholesale</Text>
          <View style={styles.badge}><Text style={styles.badgeText}>Disponib kounye a</Text></View>

          <View style={styles.info}>
            <Text style={styles.infoLine}>✉️  jerry.baptiste@bamhaiti.com</Text>
            <Text style={styles.infoLine}>📱  +509 38 12 44 09</Text>
            <Text style={styles.infoLine}>🕒  Lendi–Samdi · 8è–17è</Text>
          </View>

          <View style={styles.actions}>
            {ACTIONS.map((a) => (
              <Pressable key={a.label} style={[styles.action, { backgroundColor: a.bg }]}>
                <Ionicons name={a.icon as any} size={18} color={a.fg} />
                <Text style={[styles.actionText, { color: a.fg }]}>{a.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Text style={styles.note}>Konseye w la pou tout kesyon sou pri gwosis, volim mikse ak livrezon.</Text>
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
    backgroundColor: colors.white, borderRadius: radius.lg, padding: 22, alignItems: 'center', gap: 6,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 14, elevation: 3,
  },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: PRO_BLUE, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  initials: { fontFamily: fonts.display, fontSize: 26, color: colors.white },
  name: { fontFamily: fonts.bodyBold, fontSize: 18, color: colors.ink },
  role: { fontFamily: fonts.bodyRegular, fontSize: 13, color: MUTED },
  badge: { backgroundColor: '#E6F2E4', borderRadius: radius.pill, paddingHorizontal: 12, paddingVertical: 5, marginTop: 6 },
  badgeText: { fontFamily: fonts.bodyBold, fontSize: 11.5, color: '#2F7A3D' },
  info: { alignSelf: 'stretch', gap: 10, marginTop: 16, paddingTop: 16, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(22,32,26,0.12)' },
  infoLine: { fontFamily: fonts.body, fontSize: 13.5, color: '#4A4038' },
  actions: { flexDirection: 'row', gap: 8, alignSelf: 'stretch', marginTop: 18 },
  action: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: radius.pill, paddingVertical: 12 },
  actionText: { fontFamily: fonts.bodyBold, fontSize: 12.5 },
  note: { fontFamily: fonts.bodyRegular, fontSize: 12.5, color: MUTED, textAlign: 'center', lineHeight: 18, paddingHorizontal: spacing.md },
});
