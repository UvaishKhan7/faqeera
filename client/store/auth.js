import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null, // No user is logged in initially
      token: null,

      // Action to perform when a user logs in or registers
      login: (userData) => {
        const user = {
          _id: userData._id,
          name: userData.name,
          email: userData.email,
          isAdmin: userData.isAdmin,
        };
        set({ user: user, token: userData.token });
      },

      // Action to perform when a user logs out
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'faqeera-auth-storage', // Name for the localStorage key
    }
  )
);