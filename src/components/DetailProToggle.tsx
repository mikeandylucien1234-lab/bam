import React, { useRef, useState } from 'react';
import { View, Pressable, Animated, StyleSheet } from 'react-native';
import { colors, radius, fonts } from '../theme';

// Bascule Détail / Pro avec transition animée : un curseur ambre glisse
// vers « Pro » avant d'ouvrir le parcours vente en gros.
export default function DetailProToggle({ onPro, onDetail }: { onPro: () => void; onDetail?: () => void }) {
  const [w, setW] = useState(0);
  const anim = useRef(new Animated.Value(0)).current; // 0 = Détail, 1 = Pro
  const pad = 4;
  const seg = w > 0 ? (w - pad * 2) / 2 : 0;

  const goPro = () => {
    Animated.timing(anim, { toValue: 1, duration: 240, useNativeDriver: false }).start();
    setTimeout(onPro, 300);
  };
  const goDetail = () => {
    Animated.timing(anim, { toValue: 0, duration: 200, useNativeDriver: false }).start();
    onDetail?.();
  };

  const left = anim.interpolate({ inputRange: [0, 1], outputRange: [pad, pad + seg] });
  const detailColor = anim.interpolate({ inputRange: [0, 1], outputRange: [colors.ink, 'rgba(238,240,234,0.7)'] });
  const proColor = anim.interpolate({ inputRange: [0, 1], outputRange: ['rgba(238,240,234,0.7)', colors.ink] });

  return (
    <View style={styles.wrap} onLayout={(e) => setW(e.nativeEvent.layout.width)}>
      {seg > 0 && <Animated.View style={[styles.highlight, { width: seg, left }]} />}
      <Pressable style={styles.seg} onPress={goDetail}>
        <Animated.Text style={[styles.label, { color: detailColor }]}>Détail</Animated.Text>
      </Pressable>
      <Pressable style={styles.seg} onPress={goPro}>
        <Animated.Text style={[styles.label, { color: proColor }]}>Pro</Animated.Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: colors.ink,
    borderRadius: radius.pill,
    padding: 4,
    shadowColor: colors.ink,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 16,
    elevation: 5,
  },
  highlight: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    borderRadius: radius.pill,
    backgroundColor: colors.mango,
  },
  seg: { paddingHorizontal: 22, paddingVertical: 9, borderRadius: radius.pill },
  label: { fontFamily: fonts.bodyBold, fontSize: 13.5 },
});
