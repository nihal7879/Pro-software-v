import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role, User } from '@/types'
import { users } from '@/data/mockData'

interface AuthState {
  currentUser: User
  loginAs: (role: Role) => void
}

const defaultUser = users[0]

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      currentUser: defaultUser,
      loginAs: (role) => {
        const user = users.find((u) => u.role === role)
        if (user) set({ currentUser: user })
      },
    }),
    { name: 'pms.auth' },
  ),
)
