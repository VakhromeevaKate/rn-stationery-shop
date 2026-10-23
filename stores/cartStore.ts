import { create } from 'zustand';
import { CartLine, Drug } from '../types/drug';
import { useShallow } from 'zustand/react/shallow';

interface CartState {
  lines: Record<string, CartLine>;

  add: (drug: Drug, quantity?: number) => void;
  remove: (drugId: string) => void;
  increment: (drugId: string) => void;
  decrement: (drugId: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>((set) => ({
  lines: {},

  add: (drug, quantity = 1) =>
    set((state) => {
      const existing = state.lines[drug.id];
      return {
        lines: {
          ...state.lines,
          [drug.id]: existing
            ? { ...existing, quantity: existing.quantity + quantity }
            : { drug, quantity },
        },
      };
    }),

  remove: (drugId) =>
    set((state) => {
      const { [drugId]: _removed, ...rest } = state.lines;
      return { lines: rest };
    }),

  increment: (drugId) =>
    set((state) => {
      const line = state.lines[drugId];
      if (!line) return state;
      return {
        lines: {
          ...state.lines,
          [drugId]: { ...line, quantity: line.quantity + 1 },
        },
      };
    }),

  decrement: (drugId) =>
    set((state) => {
      const line = state.lines[drugId];
      if (!line) return state;
      // Если количество станет 0 — просто удаляем позицию
      if (line.quantity <= 1) {
        const { [drugId]: _removed, ...rest } = state.lines;
        return { lines: rest };
      }
      return {
        lines: {
          ...state.lines,
          [drugId]: { ...line, quantity: line.quantity - 1 },
        },
      };
    }),

  clear: () => set({ lines: {} }),
}));

// ---------- Селекторы ----------
export const selectCartCount = (s: CartState): number =>
  Object.values(s.lines).reduce((sum, line) => sum + line.quantity, 0);

export const selectCartTotal = (s: CartState): number =>
  Object.values(s.lines).reduce(
    (sum, line) => sum + (line.drug.price || 150) * line.quantity, // добавили fallback, если цена не указана
    0,
  );

export const selectCartLines = (s: CartState): CartLine[] =>
  Object.values(s.lines);

// ---------- Хуки с shallow-сравнением ----------
export const useCartLines = () =>
  useCartStore(useShallow(selectCartLines));