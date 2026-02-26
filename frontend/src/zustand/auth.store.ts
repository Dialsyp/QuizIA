import { create } from "zustand"
import { persist } from "zustand/middleware"

import { getCurrentUser } from "../axios/auth"
import type { User } from "../types/user.type"

interface AuthState {
  user: User | null
  loading: boolean
  checkAuth: () => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      loading: true,

      checkAuth: async () => {
        try {
          const user = await getCurrentUser()
          set({ user, loading: false })
        } catch {
          set({ user: null, loading: false })
        }
      },

      logout: () => {
        set({ user: null })
      }
    }),
    {
      name: "auth-storage" // ⭐ clé localStorage
    }
  )
)