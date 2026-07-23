import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  products as staticProducts,
  proProducts as staticProProducts,
  formatsFor as staticFormatsFor,
  type Product,
  type ProProduct,
} from '../data/products';
import { supabase } from '../lib/supabase';
import { imageFor } from '../lib/images';

export type Reward = { icon: string; name: string; cost: number; available: boolean };
type Format = { label: string; sub: string; mult: number; disc: number };

type Ctx = {
  products: Product[];
  proProducts: ProProduct[];
  formatsFor: (p: Product) => Format[];
  rewards: Reward[];
  source: 'local' | 'remote';
};

const CatalogueContext = createContext<Ctx | null>(null);

// Charge le catalogue depuis Supabase, avec repli sur les données locales
// (rendu instantané + hors-ligne). Les images restent embarquées.
export function CatalogueProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [proProducts, setProProducts] = useState<ProProduct[]>(staticProProducts);
  const [formatsMap, setFormatsMap] = useState<Record<string, Format[]>>({});
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [source, setSource] = useState<'local' | 'remote'>('local');

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const [prod, fmts, pros, tiers, rw] = await Promise.all([
          supabase.from('products').select('*').eq('is_active', true).order('sort'),
          supabase.from('product_formats').select('*').order('sort'),
          supabase.from('pro_products').select('*').order('sort'),
          supabase.from('pro_tiers').select('*').order('sort'),
          supabase.from('rewards').select('*').order('sort'),
        ]);
        if (!alive) return;

        if (prod.data?.length) {
          setProducts(
            prod.data.map((r: any) => ({
              id: r.id, cat: r.category_id, name: r.name, kre: r.kre, sub: r.sub,
              image: imageFor(r.image_key), tint: r.tint, accent: r.accent, price: r.price, desc: r.description,
            }))
          );
          setSource('remote');
        }
        if (fmts.data?.length) {
          const m: Record<string, Format[]> = {};
          fmts.data.forEach((f: any) => {
            (m[f.product_id] ||= []).push({ label: f.label, sub: f.sub, mult: Number(f.mult), disc: Number(f.disc) });
          });
          setFormatsMap(m);
        }
        if (pros.data?.length && tiers.data) {
          setProProducts(
            pros.data.map((pp: any) => ({
              id: pp.id, name: pp.name, sub: pp.sub, tint: pp.tint, unit: pp.unit,
              tiers: tiers.data
                .filter((t: any) => t.pro_product_id === pp.id)
                .map((t: any) => ({ label: t.label, n: t.qty, pu: t.unit_price, image: imageFor(t.image_key), save: t.save_label })),
            }))
          );
        }
        if (rw.data?.length) {
          setRewards(rw.data.map((r: any) => ({ icon: r.icon, name: r.name, cost: r.cost, available: r.available })));
        }
      } catch {
        // garde le repli local
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const formatsFor = (p: Product): Format[] => formatsMap[p.id] ?? staticFormatsFor(p);

  return (
    <CatalogueContext.Provider value={{ products, proProducts, formatsFor, rewards, source }}>
      {children}
    </CatalogueContext.Provider>
  );
}

export function useCatalogue() {
  const ctx = useContext(CatalogueContext);
  if (!ctx) throw new Error('useCatalogue must be used within CatalogueProvider');
  return ctx;
}
