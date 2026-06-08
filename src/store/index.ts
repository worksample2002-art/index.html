import { create } from 'zustand';
import { CartItem, Product, User } from '../types';

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addToCart: (product) => set((state) => {
    const existing = state.items.find(i => i.id === product.id);
    if (existing) {
      return { items: state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) };
    }
    return { items: [...state.items, { ...product, quantity: 1 }] };
  }),
  removeFromCart: (productId) => set((state) => ({ items: state.items.filter(i => i.id !== productId) })),
  updateQuantity: (productId, quantity) => set((state) => ({
    items: state.items.map(i => i.id === productId ? { ...i, quantity } : i)
  })),
  clearCart: () => set({ items: [] }),
  getCartTotal: () => {
    const items = get().items;
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}));

interface AuthState {
  user: User | null;
  token: string | null;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  login: (user, token) => set({ user, token }),
  logout: () => set({ user: null, token: null }),
}));
