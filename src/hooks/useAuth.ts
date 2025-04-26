import { create } from 'zustand'

interface User {
    id: string
    email: string
}

interface AuthState {
    isAuthenticated: boolean
    user: User | null
    login: (user: User) => void
    logout: () => void
}

type SetState = (fn: (state: AuthState) => Partial<AuthState>) => void

export const useAuth = create<AuthState>((set: SetState) => ({
    isAuthenticated: false,
    user: null,
    login: (user: User) => set((state) => ({ ...state, isAuthenticated: true, user })),
    logout: () => set((state) => ({ ...state, isAuthenticated: false, user: null })),
})) 