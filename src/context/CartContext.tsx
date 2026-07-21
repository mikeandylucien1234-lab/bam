import React, { createContext, useContext, useMemo, useState } from 'react';

// État panier global léger — alimente Cart / Checkout et les boutons « Ajoute ».
// Logique de livraison reprise du prototype (deliveryFee 250, gratis dès 5000 G
// ou retrait dépôt, ou article Pro).
export type CartItem = {
  key: string;
  name: string;
  sub: string;
  image: any;
  tint?: string;
  price: number; // prix unitaire (gourdes)
  qty: number;
  pro?: boolean;
};

const DELIVERY_FEE = 250;

type CartState = {
  items: CartItem[];
  shipIdx: number; // 0 = livraison, 1 = retrait dépôt
  payIdx: number;
  count: number;
  subtotal: number;
  shipping: number;
  total: number;
  addItem: (item: Omit<CartItem, 'qty'> & { qty?: number }) => void;
  bumpItem: (key: string, delta: number) => void;
  clear: () => void;
  setShipIdx: (i: number) => void;
  setPayIdx: (i: number) => void;
};

const CartContext = createContext<CartState | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [shipIdx, setShipIdx] = useState(0);
  const [payIdx, setPayIdx] = useState(0);

  const addItem: CartState['addItem'] = (item) => {
    const qty = item.qty ?? 1;
    setItems((prev) => {
      const idx = prev.findIndex((p) => p.key === item.key);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + qty };
        return next;
      }
      return [...prev, { ...item, qty }];
    });
  };

  const bumpItem = (key: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((p) => (p.key === key ? { ...p, qty: p.qty + delta } : p))
        .filter((p) => p.qty > 0)
    );
  };

  const clear = () => setItems([]);

  const value = useMemo<CartState>(() => {
    const count = items.reduce((a, c) => a + c.qty, 0);
    const subtotal = items.reduce((a, c) => a + c.price * c.qty, 0);
    const hasPro = items.some((c) => c.pro);
    const shipping =
      shipIdx === 1 ? 0 : hasPro || subtotal >= 5000 ? 0 : subtotal > 0 ? DELIVERY_FEE : 0;
    const total = subtotal + shipping;
    return { items, shipIdx, payIdx, count, subtotal, shipping, total, addItem, bumpItem, clear, setShipIdx, setPayIdx };
  }, [items, shipIdx, payIdx]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
