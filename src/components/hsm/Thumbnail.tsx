import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, categoryGradient } from '../../theme/hsm';
import type { Category } from '../../data/shows';

export const categoryIcon: Record<Category, keyof typeof Ionicons.glyphMap> = {
  Interview: 'mic',
  Podcast: 'headset',
  'Rap Kreyòl': 'musical-notes',
  Débat: 'chatbubbles',
  Collab: 'people',
  Short: 'flash',
  Article: 'newspaper',
};

// Vignette cinématographique sans asset : dégradé par catégorie,
// filigrane d'icône, et overlay sombre en bas pour la lisibilité du texte.
export default function Thumbnail({
  category,
  children,
  style,
  scrim = true,
  watermark = 88,
}: {
  category: Category;
  children?: React.ReactNode;
  style?: ViewStyle;
  scrim?: boolean;
  watermark?: number;
}) {
  const grad = categoryGradient[category] ?? ['#26262F', '#0A0A0C'];
  return (
    <View style={[styles.wrap, style]}>
      <LinearGradient
        colors={grad}
        start={{ x: 0.1, y: 0 }}
        end={{ x: 0.9, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <Ionicons
        name={categoryIcon[category]}
        size={watermark}
        color="rgba(255,255,255,0.07)"
        style={styles.watermark}
      />
      {scrim && (
        <LinearGradient
          colors={[colors.scrimTop, colors.scrimMid, colors.scrimBottom]}
          locations={[0, 0.55, 1]}
          style={StyleSheet.absoluteFill}
        />
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', justifyContent: 'flex-end' },
  watermark: { position: 'absolute', right: 8, top: 8 },
});
