import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Mémorise si l'utilisateur est passé revendeur (persisté entre les sessions).
const KEY = 'bam.isPro';

type ProState = { isPro: boolean; becomePro: () => void; leavePro: () => void };
const ProContext = createContext<ProState | null>(null);

export function ProProvider({ children }: { children: React.ReactNode }) {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((v) => {
      if (v === '1') setIsPro(true);
    });
  }, []);

  const becomePro = () => {
    setIsPro(true);
    AsyncStorage.setItem(KEY, '1');
  };
  const leavePro = () => {
    setIsPro(false);
    AsyncStorage.setItem(KEY, '0');
  };

  return <ProContext.Provider value={{ isPro, becomePro, leavePro }}>{children}</ProContext.Provider>;
}

export function usePro() {
  const ctx = useContext(ProContext);
  if (!ctx) throw new Error('usePro must be used within ProProvider');
  return ctx;
}
