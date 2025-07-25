import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationBar } from "@/components/NavigationBar";
import { useNavigate } from "react-router-dom";

export default function MarketOverview() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <NavigationBar />
            
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Hero Section */}
                    <div className="mb-12">
                        <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Market Overview
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            Comprehensive market insights and analytics are coming soon. 
                            Get ready to explore real-time market trends, sector performance, and advanced analytics.
                        </p>
                    </div>

                    {/* Coming Soon Card */}
                    <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center pb-6">
                            <div className="w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                                Coming Soon
                            </CardTitle>
                            <CardDescription className="text-lg text-gray-600">
                                We're working hard to bring you powerful market analytics and insights.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="text-center pb-8">
                            <div className="grid md:grid-cols-3 gap-6 mb-8">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Real-time Data</h3>
                                    <p className="text-sm text-gray-600">Live market updates</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Sector Analysis</h3>
                                    <p className="text-sm text-gray-600">Industry insights</p>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Trend Analysis</h3>
                                    <p className="text-sm text-gray-600">Market patterns</p>
                                </div>
                            </div>
                            
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button 
                                    onClick={() => navigate("/dashboard")}
                                    variant="outline"
                                    className="px-8 py-3 text-gray-700 border-gray-300 hover:bg-gray-50"
                                >
                                    Back to Dashboard
                                </Button>
                                <Button 
                                    onClick={() => navigate("/screener")}
                                    className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white"
                                >
                                    Explore Screeners
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Progress Section */}
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                            What's Coming
                        </h2>
                        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                            <Card className="text-left border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Market Indices</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        Track major market indices including S&P 500, NASDAQ, and Dow Jones with real-time updates and historical data.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="text-left border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Sector Performance</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        Analyze sector-wise performance with detailed breakdowns and comparative analysis across different industries.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="text-left border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Volume Analysis</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        Monitor trading volumes, unusual activity, and market liquidity with advanced volume indicators.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="text-left border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                <CardContent className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                                            <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-900">Market Sentiment</h3>
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        Understand market sentiment through fear & greed indicators, volatility measures, and trend analysis.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 