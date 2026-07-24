import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, fonts, spacing, radius } from '../../theme/hsm';
import { StarMark } from '../../components/hsm/Logo';

// Écran temporaire HSM — à construire section par section
// (Player, Star Member, Catalogue, Profil, Auth, Admin...).
export default function PlaceholderScreen({ route }: any) {
  const navigation = useNavigation<any>();
  const title = route?.name ?? 'Écran';
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.top}>
        <Pressable style={styles.back} hitSlop={8} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.text} />
        </Pressable>
      </View>
      <View style={styles.center}>
        <StarMark size={48} />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>Cet écran reste à construire — on avance section par section.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  top: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  back: {
    width: 38,
    height: 38,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg, gap: spacing.sm },
  title: { fontFamily: fonts.black, fontSize: 24, color: colors.text, marginTop: spacing.sm },
  sub: { fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, textAlign: 'center', maxWidth: 260 },
});
