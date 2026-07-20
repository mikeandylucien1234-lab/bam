import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, radius } from '../theme';

// Barre de navigation flottante sombre — inspiration « Scoops » (pilule noire
// flottante), couleurs BAM (encre + accent rouge sur l'onglet actif).
const TABS = [
  { key: 'Home', icon: 'home-outline', iconActive: 'home' },
  { key: 'Catalog', icon: 'search-outline', iconActive: 'search' },
  { key: 'Orders', icon: 'bag-outline', iconActive: 'bag' },
  { key: 'Favorites', icon: 'heart-outline', iconActive: 'heart' },
  { key: 'Account', icon: 'person-outline', iconActive: 'person' },
] as const;

// Hauteur réservée sous le contenu scrollable pour ne pas passer sous la barre.
export const BOTTOM_NAV_SPACE = 96;

export default function BottomNav() {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 10) }]} pointerEvents="box-none">
      <View style={styles.pill}>
        {TABS.map((tab) => {
          const active = route.name === tab.key;
          return (
            <Pressable key={tab.key} onPress={() => navigation.navigate(tab.key)} style={styles.item} hitSlop={6}>
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <Ionicons
                  name={(active ? tab.iconActive : tab.icon) as any}
                  size={21}
                  color={active ? colors.white : 'rgba(251,244,232,0.6)'}
                />
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.ink,
    borderRadius: radius.pill,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#1B1310',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 10,
  },
  item: { alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapActive: { backgroundColor: colors.red },
});
