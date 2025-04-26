import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/useAuth"

interface NavigationBarProps {
    className?: string
}

export function NavigationBar({ className }: NavigationBarProps) {
    const { isAuthenticated, logout } = useAuth()

    return (
        <nav className={cn("w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)}>
            <div className="flex h-14 items-center justify-between">
                <div className="mr-4 ml-4 flex">
                    <Link to="/" className="mr-6 flex items-center space-x-2">
                        <span className="font-bold">StockScreener</span>
                    </Link>
                    <nav className="flex items-center space-x-6 text-sm font-medium">
                        <Link
                            to="/screener"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Screener
                        </Link>
                        <Link
                            to="/watchlist"
                            className="transition-colors hover:text-foreground/80 text-foreground/60"
                        >
                            Watchlist
                        </Link>
                    </nav>
                </div>
                <div className="flex items-center space-x-2 mr-4">
                    {isAuthenticated ? (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/profile">Profile</Link>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/login">Login</Link>
                            </Button>
                            <Button size="sm" asChild>
                                <Link to="/signup">Sign Up</Link>
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
} 