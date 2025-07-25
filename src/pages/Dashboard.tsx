import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationBar } from "@/components/NavigationBar";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <NavigationBar />
            
            {/* Hero Section */}
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Welcome to StockScreener
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover and analyze stocks with powerful screening tools. Create custom screeners or explore your saved configurations.
                    </p>
                </div>

                {/* Main Action Cards */}
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Saved Screeners Card */}
                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col justify-between">
                            <CardHeader className="text-center pb-4">
                                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    Saved Screeners
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Access your previously created stock screeners and configurations
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <Button 
                                    onClick={() => navigate("/screener")}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    View Saved Screeners
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Create New Screener Card */}
                        <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm flex flex-col justify-between">
                            <CardHeader className="text-center pb-4">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                </div>
                                <CardTitle className="text-2xl font-bold text-gray-900">
                                    Create New Screener
                                </CardTitle>
                                <CardDescription className="text-gray-600">
                                    Build a custom stock screener with advanced filtering options
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="text-center">
                                <Button 
                                    onClick={() => navigate("/create-screener")}
                                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
                                >
                                    Start Creating
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Quick Stats Section */}
                    <div className="mt-16">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                            Quick Access
                        </h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Market Overview</h3>
                                    <p className="text-sm text-gray-600">Get insights into market trends and performance</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Profile</h3>
                                    <p className="text-sm text-gray-600">Manage your account and preferences</p>
                                </CardContent>
                            </Card>

                            <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                <CardContent className="p-6 text-center">
                                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">Watchlist</h3>
                                    <p className="text-sm text-gray-600">Track your favorite stocks and alerts</p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
