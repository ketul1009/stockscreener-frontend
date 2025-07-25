import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"
import { 
    BarChart3, 
    Heart, 
    User, 
    LogOut, 
    LogIn, 
    UserPlus, 
    Home,
    TrendingUp,
    Filter,
    Menu,
    X
} from "lucide-react"
import { useState } from "react"

interface NavigationBarProps {
    className?: string
}

export function NavigationBar({ className }: NavigationBarProps) {
    const { isAuthenticated, logout } = useAuth()
    const location = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const navigationItems = [
        { path: "/", label: "Dashboard", icon: Home },
        { path: "/screener", label: "Screeners", icon: Filter },
        { path: "/watchlist", label: "Watchlist", icon: Heart },
        { path: "/market-overview", label: "Market", icon: TrendingUp },
    ]

    const isActiveRoute = (path: string) => {
        if (path === "/") {
            return location.pathname === "/"
        }
        return location.pathname.startsWith(path)
    }

    const handleLogout = () => {
        logout()
        setIsMobileMenuOpen(false)
    }

    return (
        <nav className={cn(
            "w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm supports-[backdrop-filter]:bg-white/80 shadow-sm sticky top-0 z-50",
            className
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* Logo and Brand */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-105 transition-transform">
                                <BarChart3 className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-bold text-xl text-gray-900 group-hover:text-blue-600 transition-colors">
                                StockScreener
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navigationItems.map((item) => {
                            const Icon = item.icon
                            const isActive = isActiveRoute(item.path)
                            
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                    )}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span>{item.label}</span>
                                </Link>
                            )
                        })}
                    </div>

                    {/* Desktop Auth Buttons */}
                    <div className="hidden md:flex items-center space-x-3">
                        {isAuthenticated ? (
                            <>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    asChild
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    <Link to="/profile">
                                        <User className="w-4 h-4" />
                                        <span>Profile</span>
                                    </Link>
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm" 
                                    onClick={handleLogout}
                                    className="flex items-center space-x-2 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    asChild
                                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                >
                                    <Link to="/login">
                                        <LogIn className="w-4 h-4" />
                                        <span>Login</span>
                                    </Link>
                                </Button>
                                <Button 
                                    size="sm" 
                                    asChild
                                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
                                >
                                    <Link to="/signup">
                                        <UserPlus className="w-4 h-4" />
                                        <span>Sign Up</span>
                                    </Link>
                                </Button>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </Button>
                    </div>
                </div>

                {/* Mobile Navigation Menu */}
                {isMobileMenuOpen && (
                    <div className="md:hidden border-t border-gray-200 bg-white/95 backdrop-blur-sm">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {/* Mobile Navigation Items */}
                            {navigationItems.map((item) => {
                                const Icon = item.icon
                                const isActive = isActiveRoute(item.path)
                                
                                return (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={cn(
                                            "flex items-center space-x-3 px-3 py-2 rounded-lg text-base font-medium transition-all duration-200",
                                            isActive
                                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        )}
                                    >
                                        <Icon className="w-5 h-5" />
                                        <span>{item.label}</span>
                                    </Link>
                                )
                            })}

                            {/* Mobile Auth Buttons */}
                            <div className="pt-4 border-t border-gray-200">
                                {isAuthenticated ? (
                                    <div className="space-y-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            asChild
                                            className="w-full justify-start flex items-center space-x-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        >
                                            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>
                                                <User className="w-5 h-5" />
                                                <span>Profile</span>
                                            </Link>
                                        </Button>
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={handleLogout}
                                            className="w-full justify-start flex items-center space-x-3 text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                        >
                                            <LogOut className="w-5 h-5" />
                                            <span>Logout</span>
                                        </Button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            asChild
                                            className="w-full justify-start flex items-center space-x-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                        >
                                            <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                                                <LogIn className="w-5 h-5" />
                                                <span>Login</span>
                                            </Link>
                                        </Button>
                                        <Button 
                                            size="sm" 
                                            asChild
                                            className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-3"
                                        >
                                            <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                                                <UserPlus className="w-5 h-5" />
                                                <span>Sign Up</span>
                                            </Link>
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
} 