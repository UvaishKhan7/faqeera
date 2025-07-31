import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],

      addToCart: ({ product, variant }) => {
        const cartItemId = `${product._id}-${variant.size}-${variant.color}`;
        const { items } = get();
        const itemInCart = items.find((item) => item.cartItemId === cartItemId);

        if (itemInCart) {
          // Instead of just +1, we call our new increaseQuantity function
          get().increaseQuantity(cartItemId);
        } else {
          const newItem = {
            cartItemId, productId: product._id, name: product.name,
            slug: product.slug, image: product.images[0], price: product.price,
            size: variant.size, color: variant.color, stock: variant.stock, quantity: 1,
          };
          set({ items: [...items, newItem] });
        }
      },

      removeFromCart: (cartItemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));
      },

      clearCart: () => {
        // To clear the cart, we simply set the items array back to empty.
        set({ items: [] });
      },
      
      // --- NEW FUNCTION: Increase quantity ---
      increaseQuantity: (cartItemId) => {
        const { items } = get();
        const updatedItems = items.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) } // Prevent going over stock
            : item
        );
        set({ items: updatedItems });
      },

      // --- NEW FUNCTION: Decrease quantity ---
      decreaseQuantity: (cartItemId) => {
        const { items } = get();
        const itemToRemove = items.find(item => item.cartItemId === cartItemId);

        // If decreasing to 0, remove the item completely
        if (itemToRemove?.quantity === 1) {
          get().removeFromCart(cartItemId);
        } else {
          const updatedItems = items.map((item) =>
            item.cartItemId === cartItemId
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
          set({ items: updatedItems });
        }
      },
    }),
    {
      name: 'faqeera-cart-storage',
    }
  )
);