import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  // Actions
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  // Computed (Getters)
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      // Add item (increments quantity if it already exists)
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === newItem.id,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return { items: [...state.items, { ...newItem, quantity: 1 }] };
        });
      },

      // Remove one quantity of an item (decrement). If quantity <= 1, remove item completely
      removeItem: (id) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === id);
          if (!existingItem) return { items: state.items };
          if (existingItem.quantity > 1) {
            return {
              items: state.items.map((item) =>
                item.id === id
                  ? { ...item, quantity: item.quantity - 1 }
                  : item,
              ),
            };
          }
          // quantity is 1 or missing -> remove the item
          return { items: state.items.filter((item) => item.id !== id) };
        });
      },

      // Update specific quantity (e.g., using a + / - counter)
      updateQuantity: (id, quantity) => {
        set((state) => {
          if (quantity <= 0) {
            return { items: state.items.filter((item) => item.id !== id) };
          }
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item,
            ),
          };
        });
      },

      // Clear the entire cart (useful after a successful checkout)
      clearCart: () => set({ items: [] }),

      // Calculate total price of all items
      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0,
        );
      },

      // Calculate total number of items (useful for a cart badge)
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "henna-cart-storage", // The key used in localStorage
    },
  ),
);
