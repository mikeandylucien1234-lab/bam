import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';

const PRO_BLUE = colors.blue;

export default function ProConfirmScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.screen} edges={['top', 'bottom']}>
      <View style={styles.center}>
        <View style={styles.check}>
          <Ionicons name="checkmark" size={40} color={PRO_BLUE} />
        </View>
        <Text style={styles.title}>Mèsi!</Text>
        <Text style={styles.sub}>
          Demann ou anrejistre avèk siksè. Ekip BAM ap egzamine li. Pou pwototip sa a, etap sa a se pou ilistrasyon.
        </Text>
        <Pressable style={styles.cta} onPress={() => navigation.navigate('ProHome')}>
          <Text style={styles.ctaText}>Dekouvri BAM Pro</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl, gap: 16 },
  check: { width: 84, height: 84, borderRadius: 42, backgroundColor: '#E3EAF7', alignItems: 'center', justifyContent: 'center' },
  title: { fontFamily: fonts.display, fontSize: 30, color: colors.ink },
  sub: { fontFamily: fonts.bodyRegular, fontSize: 14, color: 'rgba(22,32,26,0.6)', textAlign: 'center', lineHeight: 21, maxWidth: 300 },
  cta: {
    height: 52, paddingHorizontal: 32, borderRadius: radius.pill, backgroundColor: PRO_BLUE, alignItems: 'center', justifyContent: 'center', marginTop: 10,
    shadowColor: PRO_BLUE, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 18, elevation: 5,
  },
  ctaText: { fontFamily: fonts.bodyBold, fontSize: 15, color: colors.white },
});
