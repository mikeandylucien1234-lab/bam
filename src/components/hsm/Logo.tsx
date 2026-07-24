import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';
import { colors, fonts } from '../../theme/hsm';

// Étoile dorée du logo HSM (SVG, dégradé or).
export function StarMark({ size = 26 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <SvgGradient id="hsmGold" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FCE08A" />
          <Stop offset="0.55" stopColor={colors.gold} />
          <Stop offset="1" stopColor={colors.goldDark} />
        </SvgGradient>
      </Defs>
      <Path
        d="M50 4 L61.8 37.6 L97.6 38.2 L68.9 59.9 L79.4 94.1 L50 72.4 L20.6 94.1 L31.1 59.9 L2.4 38.2 L38.2 37.6 Z"
        fill="url(#hsmGold)"
      />
    </Svg>
  );
}

// Logo complet : étoile + "HAITIAN STARS MEDIA".
export default function Logo({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const star = size === 'lg' ? 34 : size === 'sm' ? 20 : 26;
  const word = size === 'lg' ? 19 : size === 'sm' ? 13 : 16;
  const media = size === 'lg' ? 9 : size === 'sm' ? 6.5 : 7.5;

  return (
    <View style={styles.row}>
      <StarMark size={star} />
      <View style={{ marginLeft: size === 'sm' ? 6 : 9 }}>
        <View style={styles.wordRow}>
          <Text style={[styles.word, { fontSize: word, color: colors.white }]}>HAITIAN </Text>
          <Text style={[styles.word, { fontSize: word, color: colors.red }]}>STARS</Text>
        </View>
        <Text style={[styles.media, { fontSize: media }]}>M E D I A</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  wordRow: { flexDirection: 'row', alignItems: 'baseline' },
  word: { fontFamily: fonts.black, letterSpacing: 0.3 },
  media: {
    fontFamily: fonts.bold,
    color: colors.textFaint,
    letterSpacing: 2,
    marginTop: 1,
  },
});
