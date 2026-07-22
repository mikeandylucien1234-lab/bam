import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ScrollView, Pressable, TextInput, StyleSheet, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { colors, radius, spacing, fonts } from '../theme';

const PRO_BLUE = colors.blue;
const MUTED = 'rgba(22,32,26,0.55)';
const BORDER = 'rgba(22,32,26,0.16)';

type Field =
  | { key: string; label: string; type: 'text' | 'phone'; placeholder: string }
  | { key: string; label: string; type: 'choice'; options: readonly string[] };

const STEPS: { title: string; subtitle: string; fields: Field[] }[] = [
  {
    title: 'Enfòmasyon pèsonèl',
    subtitle: 'Di nou kimoun ou ye.',
    fields: [
      { key: 'non', label: 'Non', type: 'text', placeholder: 'Non fanmi ou' },
      { key: 'prenon', label: 'Prenon', type: 'text', placeholder: 'Prenon ou' },
      { key: 'tel', label: 'Telefòn', type: 'phone', placeholder: '+509 __ __ __ __' },
    ],
  },
  {
    title: 'Komès ou',
    subtitle: 'Ki kalite biznis ou genyen?',
    fields: [
      { key: 'nonKomes', label: 'Non komès', type: 'text', placeholder: 'Non biznis ou' },
      { key: 'kalite', label: 'Kalite komès', type: 'choice', options: ['Boutik', 'Restoran', 'Depo', 'Distribitè', 'Lòt'] },
    ],
  },
  {
    title: 'Adrès',
    subtitle: 'Kote nou ap livre w?',
    fields: [
      { key: 'vil', label: 'Vil', type: 'choice', options: ['Pòtoprens', 'Okap', 'Gonayiv', 'Kayes', 'Lòt'] },
      { key: 'komin', label: 'Komin / katye', type: 'text', placeholder: 'Ex. Delmas, Petyonvil…' },
    ],
  },
  {
    title: 'Aktivite',
    subtitle: 'Konbyen ou panse achte pa mwa?',
    fields: [
      {
        key: 'volim',
        label: 'Volim acha estime',
        type: 'choice',
        options: ['Mwens ke 10 000 G', '10 000 – 50 000 G', '50 000 – 200 000 G', 'Plis ke 200 000 G'],
      },
    ],
  },
];

export default function ProOnboardingScreen() {
  const navigation = useNavigation<any>();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const anim = useRef(new Animated.Value(1)).current;

  const total = STEPS.length;
  const current = STEPS[step];

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, { toValue: 1, duration: 260, useNativeDriver: true }).start();
  }, [step]);

  const set = (key: string, value: string) => setData((d) => ({ ...d, [key]: value }));

  const canProceed = current.fields.every((f) => (data[f.key] ?? '').trim().length > 0);

  const next = () => {
    if (step < total - 1) setStep((s) => s + 1);
    else navigation.navigate('ProConfirm');
  };
  const back = () => {
    if (step > 0) setStep((s) => s - 1);
    else navigation.goBack();
  };

  const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [24, 0] });

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* Header + progress */}
        <View style={styles.header}>
          <Pressable style={styles.backBtn} onPress={back} hitSlop={8}>
            <Ionicons name="chevron-back" size={18} color={colors.ink} />
          </Pressable>
          <Text style={styles.stepCount}>Etap {step + 1} / {total}</Text>
        </View>
        <View style={styles.progressTrack}>
          {STEPS.map((_, i) => (
            <View key={i} style={[styles.progressSeg, { backgroundColor: i <= step ? PRO_BLUE : BORDER }]} />
          ))}
        </View>

        <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingBottom: 24 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <Animated.View style={{ opacity: anim, transform: [{ translateX }] }}>
            <Text style={styles.title}>{current.title}</Text>
            <Text style={styles.subtitle}>{current.subtitle}</Text>

            <View style={{ gap: 18, marginTop: spacing.lg }}>
              {current.fields.map((f) => (
                <View key={f.key} style={{ gap: 8 }}>
                  <Text style={styles.fieldLabel}>{f.label}</Text>
                  {f.type === 'choice' ? (
                    <View style={styles.choiceWrap}>
                      {f.options.map((opt) => {
                        const active = data[f.key] === opt;
                        return (
                          <Pressable
                            key={opt}
                            onPress={() => set(f.key, opt)}
                            style={[styles.choice, { backgroundColor: active ? colors.ink : colors.white, borderColor: active ? colors.ink : BORDER }]}
                          >
                            <Text style={[styles.choiceText, { color: active ? colors.cream : colors.ink }]}>{opt}</Text>
                            {active && <Ionicons name="checkmark" size={14} color={colors.cream} style={{ marginLeft: 6 }} />}
                          </Pressable>
                        );
                      })}
                    </View>
                  ) : (
                    <TextInput
                      value={data[f.key] ?? ''}
                      onChangeText={(t) => set(f.key, t)}
                      placeholder={f.placeholder}
                      placeholderTextColor="rgba(22,32,26,0.35)"
                      keyboardType={f.type === 'phone' ? 'phone-pad' : 'default'}
                      style={styles.input}
                    />
                  )}
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>

        <View style={styles.footer}>
          <Pressable
            style={[styles.cta, !canProceed && styles.ctaDisabled]}
            onPress={next}
            disabled={!canProceed}
          >
            <Text style={styles.ctaText}>{step < total - 1 ? 'Kontinye' : 'Voye demann mwen'}</Text>
            <Ionicons name="arrow-forward" size={17} color={colors.white} />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.cream },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  backBtn: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.white, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2,
  },
  stepCount: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: MUTED },
  progressTrack: { flexDirection: 'row', gap: 5, paddingHorizontal: spacing.lg, paddingTop: spacing.md },
  progressSeg: { flex: 1, height: 5, borderRadius: 3 },

  title: { fontFamily: fonts.display, fontSize: 28, color: colors.ink },
  subtitle: { fontFamily: fonts.bodyRegular, fontSize: 13.5, color: MUTED, marginTop: 4 },

  fieldLabel: { fontFamily: fonts.bodyBold, fontSize: 12.5, color: colors.ink },
  input: {
    height: 52, borderRadius: radius.sm, borderWidth: 1.5, borderColor: BORDER, backgroundColor: colors.white,
    paddingHorizontal: 16, fontSize: 14.5, fontFamily: fonts.body, color: colors.ink,
  },
  choiceWrap: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  choice: { flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderRadius: radius.pill, paddingHorizontal: 16, paddingVertical: 11 },
  choiceText: { fontFamily: fonts.bodyBold, fontSize: 13 },

  footer: { padding: spacing.lg, paddingTop: 10 },
  cta: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: PRO_BLUE, borderRadius: 18, paddingVertical: 16,
    shadowColor: PRO_BLUE, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.28, shadowRadius: 20, elevation: 6,
  },
  ctaDisabled: { opacity: 0.4 },
  ctaText: { fontFamily: fonts.bodyBold, fontSize: 15.5, color: colors.white },
});
