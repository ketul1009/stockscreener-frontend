import { useAuth } from '@/hooks/useAuth'
import { createContext, useContext, ReactNode, useState } from 'react'
import { toast } from 'sonner'

interface AppContextType {
    isLoading: boolean
    setLoading: (loading: boolean) => void
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void
    theme: 'light' | 'dark'
    toggleTheme: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        switch (type) {
            case 'success':
                toast.success(message)
                break
            case 'error':
                toast.error(message)
                break
            case 'info':
                toast.info(message)
                break
        }
    }

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light'
        setTheme(newTheme)
        document.documentElement.classList.toggle('dark')
    }

    const value = {
        isLoading,
        setLoading: setIsLoading,
        showToast,
        theme,
        toggleTheme
    }

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

export function useApp() {
    const context = useContext(AppContext)
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider')
    }
    return context
} 