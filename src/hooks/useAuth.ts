import { create } from 'zustand'

interface User {
    id: string
    email: string
}

interface AuthState {
    isAuthenticated: boolean
    user: User | null
    token: string | null
    login: (user: User, token: string) => void
    logout: () => void
}

type SetState = (fn: (state: AuthState) => Partial<AuthState>) => void

export const useAuth = create<AuthState>((set: SetState) => ({
    isAuthenticated: false,
    user: null,
    token: null,
    login: (user: User, token: string) => {
        localStorage.setItem('token', token)
        set((state) => ({ ...state, isAuthenticated: true, user, token }))
    },
    logout: () => {
        localStorage.removeItem('token')
        set((state) => ({ ...state, isAuthenticated: false, user: null, token: null }))
    },
})) 