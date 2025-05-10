import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"

interface ProtectedRouteProps {
    children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuth()
    const location = useLocation()

    if (!isAuthenticated) {
        console.log("isAuthenticated: ", isAuthenticated)
        console.log("location: ", location)
        return <Navigate to="/login" replace />
    }

    return <>{children}</>
} 