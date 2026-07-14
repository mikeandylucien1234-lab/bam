import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fonts, spacing } from '../theme';
import BottomNav from '../components/BottomNav';

// Écran temporaire — à remplacer écran par écran dans Claude Code
// en suivant le même style que HomeScreen.tsx (thème, données, composants).
export default function PlaceholderScreen({ route }: any) {
  const title = route?.name ?? 'Écran';
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.center}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.sub}>Cet écran reste à construire — voir le prototype pour la référence de contenu.</Text>
      </View>
      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.lg },
  title: { fontFamily: fonts.display, fontSize: 22, color: colors.ink },
  sub: { fontFamily: fonts.bodyRegular, fontSize: 13, color: colors.textMuted, textAlign: 'center', marginTop: 8 },
});
