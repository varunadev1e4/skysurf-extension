import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { USERS, CURRENT_USER_ID } from '../data/dummy'

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      signIn: (emailOrUsername, _password) => {
        // Find user by username or simulate login
        const found = Object.values(USERS).find(
          u => u.username === emailOrUsername || emailOrUsername.includes('@')
        )
        const user = found || USERS[CURRENT_USER_ID]
        set({ user, isAuthenticated: true })
        return { success: true }
      },

      signUp: (email, username, _password) => {
        // Simulate sign up — always succeeds in demo
        const user = {
          ...USERS[CURRENT_USER_ID],
          username: username || USERS[CURRENT_USER_ID].username,
        }
        set({ user, isAuthenticated: true })
        return { success: true }
      },

      signOut: () => set({ user: null, isAuthenticated: false }),

      updateProfile: (updates) => {
        set(s => ({ user: { ...s.user, ...updates } }))
      },
    }),
    { name: 'skysurf-auth' }
  )
)

export default useAuthStore
