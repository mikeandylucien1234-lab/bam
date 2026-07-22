import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';

const PRO_BLUE = colors.blue;
const SUB = 'rgba(255,255,255,0.78)';

const BENEFITS = [
  { icon: '📦', title: 'Vant an gwo', desc: 'Kòmande katon ak palèt dirèkteman.' },
  { icon: '💰', title: 'Pri privilejye', desc: 'Jwenn pri rezève pou pwofesyonèl.' },
  { icon: '🚚', title: 'Livrezon dedye', desc: 'Sèvis livrezon adapte pou revandè.' },
  { icon: '🤝', title: 'Akonpayman', desc: 'Yon konseye BAM ap la avè w.' },
];

export default function ProIntroScreen() {
  const navigation = useNavigation<any>();
  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: spacing.xl }} bounces={false}>
        <SafeAreaView edges={['top']}>
          <LinearGradient colors={[PRO_BLUE, '#132F6E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.hero}>
            <View style={styles.heroBlob} />
            <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
              <Ionicons name="chevron-back" size={18} color={colors.white} />
            </Pressable>
            <Text style={styles.heroTitle}>Byenveni nan{'\n'}BAM Pro</Text>
            <Text style={styles.heroSub}>Devlope komès ou ak pri gwosis BAM — pou revandè ak antrepriz.</Text>
          </LinearGradient>
        </SafeAreaView>

        <View style={styles.grid}>
          {BENEFITS.map((b) => (
            <View key={b.title} style={styles.benefit}>
              <Text style={{ fontSize: 24 }}>{b.icon}</Text>
              <Text style={styles.benefitTitle}>{b.title}</Text>
              <Text style={styles.benefitDesc}>{b.desc}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.primary} onPress={() => navigation.navigate('ProOnboarding')}>
            <Text style={styles.primaryText}>Devni revandè</Text>
          </Pressable>
          <Pressable style={styles.secondary} onPress={() => navigation.navigate('ProLogin')}>
            <Text style={styles.secondaryText}>Mwen gen tan gen yon kont</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  hero: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: 34, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden' },
  heroBlob: { position: 'absolute', width: 220, height: 220, borderRadius: 110, backgroundColor: 'rgba(242,161,37,0.16)', right: -70, top: -50 },
  backBtn: { width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(255,255,255,0.16)', alignItems: 'center', justifyContent: 'center' },
  heroTitle: { fontFamily: fonts.display, fontSize: 34, color: colors.white, marginTop: 20, lineHeight: 37 },
  heroSub: { fontFamily: fonts.bodyRegular, fontSize: 14, color: '#E7CFE0', marginTop: 10, lineHeight: 20, maxWidth: 280 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm, paddingHorizontal: spacing.lg, paddingTop: 22 },
  benefit: {
    width: '47.5%', flexGrow: 1, backgroundColor: colors.white, borderRadius: radius.lg, padding: 16, gap: 8,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 2,
  },
  benefitTitle: { fontFamily: fonts.bodyBold, fontSize: 13.5, color: colors.ink },
  benefitDesc: { fontFamily: fonts.bodyRegular, fontSize: 11.5, color: 'rgba(22,32,26,0.6)', lineHeight: 16 },

  actions: { paddingHorizontal: spacing.lg, paddingTop: 28, gap: 10 },
  primary: {
    height: 52, borderRadius: radius.pill, backgroundColor: colors.mango, alignItems: 'center', justifyContent: 'center',
    shadowColor: colors.mango, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.32, shadowRadius: 18, elevation: 5,
  },
  primaryText: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.ink },
  secondary: { height: 48, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
  secondaryText: { fontFamily: fonts.bodyBold, fontSize: 14.5, color: PRO_BLUE },
});
