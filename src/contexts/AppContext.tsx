import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ActionButton } from '@/constants/constants'
import ModalButton from '@/components/ModalButton'
import axiosInstance from '@/lib/axios'
import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { toast } from 'sonner'

interface AppContextType {
    isLoading: boolean
    setLoading: (loading: boolean) => void
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void
    theme: 'light' | 'dark'
    toggleTheme: () => void
    getUserData: () => Promise<any>
    showModal: (title: string, description?: string, actionButton?: ActionButton, secondaryButton?: ActionButton) => void
    hideModal: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
    const [isLoading, setIsLoading] = useState(false)
    const [theme, setTheme] = useState<'light' | 'dark'>('light')
    const [modal, setModal] = useState<ReactNode | null>(null)

    useEffect(() => {
        console.log("modal: ", modal)
    }, [modal])

    const getUserData = async () => {
        const response = await axiosInstance.get('/me');
        return response.data;
    }

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

    const showModal = (title: string, description?: string, actionButton?: ActionButton, secondaryButton?: ActionButton) => {
        setModal(
            <Dialog open={true} onOpenChange={() => {setModal(null)}}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{title}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        {actionButton && <ModalButton 
                            onClick={actionButton.onClick} 
                            variant={actionButton.variant}
                            text={actionButton.text}
                            disabled={actionButton.disabled}
                            loading={actionButton.loading}
                            type={actionButton.type}
                            size={actionButton.size} />}
                        {secondaryButton && <ModalButton
                            onClick={secondaryButton.onClick} 
                            variant={secondaryButton.variant}
                            text={secondaryButton.text}
                            disabled={secondaryButton.disabled}
                            loading={secondaryButton.loading}
                            type={secondaryButton.type}
                            size={secondaryButton.size} />}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        )
    }

    const hideModal = () => {
        setModal(null)
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
        toggleTheme,
        getUserData,
        showModal,
        hideModal
    }

    return (
        <AppContext.Provider value={value}>
            <>
                {children}
                {modal}
            </>
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