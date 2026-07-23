import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet, Easing } from 'react-native';
import { fonts } from '../theme';

// Bandeau de texte défilant (ticker) — boucle continue et fluide.
export default function Marquee({
  items,
  color = '#fff',
  speed = 40, // px / seconde
}: {
  items: string[];
  color?: string;
  speed?: number;
}) {
  const [w, setW] = useState(0);
  const x = useRef(new Animated.Value(0)).current;
  const text = items.join('        •        ') + '        •        ';

  useEffect(() => {
    if (w <= 0) return;
    x.setValue(0);
    const anim = Animated.loop(
      Animated.timing(x, {
        toValue: -w,
        duration: (w / speed) * 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );
    anim.start();
    return () => anim.stop();
  }, [w, speed]);

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.track, { transform: [{ translateX: x }] }]}>
        <Text onLayout={(e) => setW(e.nativeEvent.layout.width)} style={[styles.text, { color }]} numberOfLines={1}>
          {text}
        </Text>
        <Text style={[styles.text, { color }]} numberOfLines={1}>{text}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', flex: 1 },
  track: { flexDirection: 'row' },
  text: { fontFamily: fonts.bodyBold, fontSize: 12.5, letterSpacing: 0.3 },
});
