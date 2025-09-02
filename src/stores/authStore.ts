import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/types/user'
import { INITIAL_USER } from '@/utils/constants'

interface AuthState {
  currentUser: User
  setCurrentUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: INITIAL_USER,
      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: 'auth-storage',
    }
  )
)