import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radius, fonts } from '../../theme/hsm';
import { formatViewers } from '../../data/shows';

// Badge LIVE (rouge, point pulsant statique) ou OFFLINE (gris).
export function LiveBadge({ live }: { live: boolean }) {
  if (live) {
    return (
      <View style={[styles.badge, { backgroundColor: colors.red }]}>
        <View style={styles.dot} />
        <Text style={styles.badgeText}>LIVE</Text>
      </View>
    );
  }
  return (
    <View style={[styles.badge, { backgroundColor: 'rgba(0,0,0,0.55)', borderWidth: StyleSheet.hairlineWidth, borderColor: colors.borderHi }]}>
      <Text style={[styles.badgeText, { color: colors.textMuted }]}>OFFLINE</Text>
    </View>
  );
}

// Compteur de spectateurs en direct (icône silhouettes + nombre).
export function ViewerCount({ count }: { count?: number }) {
  return (
    <View style={styles.viewers}>
      <Ionicons name="people" size={12} color={colors.white} />
      <Text style={styles.viewersText}>{formatViewers(count)}</Text>
    </View>
  );
}

// Tag de catégorie (INTERVIEW, PODCAST, RAP KREYÒL...).
export function CategoryTag({ label }: { label: string }) {
  return (
    <View style={styles.tag}>
      <Text style={styles.tagText}>{label.toUpperCase()}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.white },
  badgeText: { fontFamily: fonts.black, fontSize: 10, color: colors.white, letterSpacing: 1 },

  viewers: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(0,0,0,0.55)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },
  viewersText: { fontFamily: fonts.bold, fontSize: 11.5, color: colors.white },

  tag: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.borderHi,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.pill,
  },
  tagText: { fontFamily: fonts.bold, fontSize: 9.5, color: colors.text, letterSpacing: 1 },
});
