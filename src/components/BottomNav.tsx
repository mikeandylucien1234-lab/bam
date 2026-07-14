import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, fonts } from '../theme';

// npx expo install @expo/vector-icons
const TABS = [
  { key: 'Home', icon: 'home-outline', iconActive: 'home', label: 'Accueil' },
  { key: 'Catalog', icon: 'search-outline', iconActive: 'search', label: 'Recherche' },
  { key: 'Orders', icon: 'bag-outline', iconActive: 'bag', label: 'Commandes' },
  { key: 'Favorites', icon: 'heart-outline', iconActive: 'heart', label: 'Favoris' },
  { key: 'Account', icon: 'person-outline', iconActive: 'person', label: 'Profil' },
] as const;

export default function BottomNav() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  return (
    <View style={styles.wrap}>
      {TABS.map((tab) => {
        const active = route.name === tab.key;
        return (
          <Pressable key={tab.key} onPress={() => navigation.navigate(tab.key)} style={styles.item}>
            {active && <View style={styles.dot} />}
            <Ionicons
              name={(active ? tab.iconActive : tab.icon) as any}
              size={20}
              color={active ? colors.red : colors.ink + 'AA'}
            />
            <Text style={[styles.label, { color: active ? colors.red : colors.ink + '88' }]}>{tab.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: colors.border,
  },
  item: { alignItems: 'center', gap: 3, paddingHorizontal: 8 },
  dot: { position: 'absolute', top: -8, width: 4, height: 4, borderRadius: 2, backgroundColor: colors.red },
  label: { fontFamily: fonts.bodyBold, fontSize: 10 },
});
