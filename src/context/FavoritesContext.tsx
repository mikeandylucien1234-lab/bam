import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Favoris (ids produits), persistés entre les sessions.
const KEY = 'bam.favs';

type FavState = { favIds: string[]; isFav: (id: string) => boolean; toggleFav: (id: string) => void };
const FavContext = createContext<FavState | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favIds, setFavIds] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v) {
        try {
          setFavIds(JSON.parse(v));
        } catch {}
      }
    });
  }, []);

  const persist = (next: string[]) => {
    setFavIds(next);
    AsyncStorage.setItem(KEY, JSON.stringify(next));
  };

  const value = useMemo<FavState>(
    () => ({
      favIds,
      isFav: (id) => favIds.includes(id),
      toggleFav: (id) => persist(favIds.includes(id) ? favIds.filter((x) => x !== id) : [...favIds, id]),
    }),
    [favIds]
  );

  return <FavContext.Provider value={value}>{children}</FavContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavContext);
  if (!ctx) throw new Error('useFavorites must be used within FavoritesProvider');
  return ctx;
}
