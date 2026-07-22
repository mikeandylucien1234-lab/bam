import React, { useState } from 'react';
import { View, Text, Pressable, TextInput, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';

const PRO_BLUE = colors.blue;
const MUTED = 'rgba(22,32,26,0.6)';
const BORDER = 'rgba(22,32,26,0.16)';

export default function ProLoginScreen() {
  const navigation = useNavigation<any>();
  const [tel, setTel] = useState('');
  const [pass, setPass] = useState('');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={() => navigation.goBack()} hitSlop={8}>
            <Ionicons name="chevron-back" size={18} color={colors.ink} />
          </Pressable>
          <Text style={styles.title}>Koneksyon Pro</Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.intro}>Konekte ak kont revandè BAM ou pou jwenn pri gwosis ak swiv kòmann ou yo.</Text>

          <View style={{ gap: 6 }}>
            <Text style={styles.label}>Telefòn</Text>
            <TextInput value={tel} onChangeText={setTel} placeholder="+509 __ __ __ __" placeholderTextColor="rgba(22,32,26,0.35)" keyboardType="phone-pad" style={styles.input} />
          </View>
          <View style={{ gap: 6 }}>
            <Text style={styles.label}>Modpas</Text>
            <TextInput value={pass} onChangeText={setPass} placeholder="••••••••" placeholderTextColor="rgba(22,32,26,0.35)" secureTextEntry style={styles.input} />
          </View>

          <Pressable style={styles.cta} onPress={() => navigation.navigate('ProHome')}>
            <Text style={styles.ctaText}>Konekte</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
  body: { padding: spacing.lg, gap: 16 },
  intro: { fontFamily: fonts.bodyRegular, fontSize: 13.5, color: MUTED, lineHeight: 20 },
  label: { fontFamily: fonts.bodyBold, fontSize: 12, color: colors.ink },
  input: {
    height: 52, borderRadius: radius.sm, borderWidth: 1.5, borderColor: BORDER, backgroundColor: colors.white,
    paddingHorizontal: 16, fontSize: 14.5, fontFamily: fonts.body, color: colors.ink,
  },
  cta: {
    height: 52, borderRadius: radius.pill, backgroundColor: PRO_BLUE, alignItems: 'center', justifyContent: 'center', marginTop: 6,
    shadowColor: PRO_BLUE, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.28, shadowRadius: 18, elevation: 5,
  },
  ctaText: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.white },
});
