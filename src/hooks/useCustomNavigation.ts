import { useNavigate } from "react-router-dom"
import { useAuth } from "./useAuth"

interface CustomNavigationProps {
    path: string
}

export const useCustomNavigation = ({ path }: CustomNavigationProps) => {
    const navigate = useNavigate()
    const { isAuthenticated } = useAuth()


    const navigateToPath = () => {
        if (isAuthenticated) {
            navigate(path)
        } else {
            navigate('/login')
        }
    }
    return {navigateToPath }
}