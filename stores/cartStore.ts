import { create } from 'zustand';
import type { CartLine, Product } from '../types/product';
import { useShallow } from 'zustand/react/shallow';

interface CartState {
  lines: Record<string, CartLine>;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  increment: (productId: string) => void;
  decrement: (productId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()((set) => ({
  lines: {},

  add: (product: Product, quantity = 1) =>
    set((state) => {
      const id = String(product.id);
      const existing = state.lines[id];

      if (product.stock <= 0) return state;

      const currentQuantity = existing?.quantity ?? 0;
      const nextQuantity = Math.min(
        currentQuantity + quantity,
        product.stock,
      );

      if (nextQuantity <= currentQuantity) return state;

      return {
        lines: {
          ...state.lines,
          [id]: existing
            ? { ...existing, quantity: nextQuantity }
            : { product, quantity: nextQuantity },
        },
      };
    }),

  remove: (productId: string) =>
    set((state) => {
      const { [productId]: _removed, ...rest } = state.lines;
      return { lines: rest };
    }),

  increment: (productId: string) =>
    set((state) => {
      const line = state.lines[productId];

      if (!line || line.quantity >= line.product.stock) {
        return state;
      }

      return {
        lines: {
          ...state.lines,
          [productId]: {
            ...line,
            quantity: line.quantity + 1,
          },
        },
      };
    }),

  decrement: (productId: string) =>
    set((state) => {
      const line = state.lines[productId];

      if (!line) return state;

      if (line.quantity <= 1) {
        const { [productId]: _removed, ...rest } = state.lines;
        return { lines: rest };
      }

      return {
        lines: {
          ...state.lines,
          [productId]: {
            ...line,
            quantity: line.quantity - 1,
          },
        },
      };
    }),

  clear: () => set({ lines: {} }),
}));

export const selectCartCount = (state: CartState): number =>
  Object.values(state.lines).reduce(
    (sum, line) => sum + line.quantity,
    0,
  );

export const selectCartTotal = (_state: CartState): number => 0;

export const selectCartLines = (state: CartState): CartLine[] =>
  Object.values(state.lines);

export const useCartLines = () =>
  useCartStore(useShallow(selectCartLines));