import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, Product } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (product: Product, quantity?: number, weight?: string) => void
  removeItem: (productId: string, weight?: string) => void
  updateQuantity: (productId: string, quantity: number, weight?: string) => void
  clearCart: () => void
  toggleCart: () => void
  openCart: () => void
  closeCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (product, quantity = 1, weight) => {
        set((state) => {
          const existing = state.items.find(
            (i) => i.productId === product.id && i.weight === weight
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.productId === product.id && i.weight === weight
                  ? { ...i, quantity: i.quantity + quantity }
                  : i
              ),
              isOpen: true,
            }
          }
          return {
            items: [
              ...state.items,
              { productId: product.id, product, quantity, weight },
            ],
            isOpen: true,
          }
        })
      },

      removeItem: (productId, weight) => {
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.productId === productId && i.weight === weight)
          ),
        }))
      },

      updateQuantity: (productId, quantity, weight) => {
        if (quantity <= 0) {
          get().removeItem(productId, weight)
          return
        }
        set((state) => ({
          items: state.items.map((i) =>
            i.productId === productId && i.weight === weight
              ? { ...i, quantity }
              : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      total: () => {
        return get().items.reduce((sum, item) => {
          const price = item.product.price
          return sum + price * item.quantity
        }, 0)
      },

      itemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'savika-cart',
    }
  )
)
