import { NavigationBar } from "@/components/NavigationBar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import SuggestedCard from "@/components/ui/SuggestedCard";
import { Pencil, Plus, Trash, Filter, BookOpen, TrendingUp, Eye } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { useNavigate } from "react-router-dom";

const suggestedScreener = [{
        title: "Trending Stocks",
        description: "Capture stocks with strong momentum",
        content: "High volume, price momentum",
        onAddButton: { onClick: () => {}, title: "Add to Screener" },
        onViewButton: { onClick: () => {}, title: "View Screener" }
    },
    {
        title: "Value Picks",
        description: "Find undervalued opportunities",
        content: "Low P/E, high dividend yield",
        onAddButton: { onClick: () => {}, title: "Add to Screener" },
        onViewButton: { onClick: () => {}, title: "View Screener" }
    },
    {
        title: "Growth Leaders",
        description: "Identify high-growth companies",
        content: "Revenue growth, expanding markets",
        onAddButton: { onClick: () => {}, title: "Add to Screener" },
        onViewButton: { onClick: () => {}, title: "View Screener" }
    },
    {
        title: "Dividend Aristocrats",
        description: "Stable dividend-paying stocks",
        content: "Consistent dividend history",
        onAddButton: { onClick: () => {}, title: "Add to Screener" },
        onViewButton: { onClick: () => {}, title: "View Screener" }
    },
    {
        title: "Momentum Movers",
        description: "Stocks with strong price action",
        content: "Technical breakout patterns",
        onAddButton: { onClick: () => {}, title: "Add to Screener" },
        onViewButton: { onClick: () => {}, title: "View Screener" }
    },
    {
        title: "Sector Leaders",
        description: "Top performers by sector",
        content: "Sector-specific metrics",
        onAddButton: { onClick: () => {}, title: "Add to Screener" },
        onViewButton: { onClick: () => {}, title: "View Screener" }
    }
]

export default function Screener() {

    const { userData } = useApp(); 
    const [screeners, setScreeners] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const context = useApp();

    const fetchScreeners = async () => {
        setIsLoading(true);
        await axiosInstance.get('/screeners', {
            params: {
                username: userData.username
            }
        }).then((res) => {
            if (res.status === 200) {
                setScreeners(res.data);
            }
        }).catch(() => {
            context.showToast("Error fetching screeners", "error");
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const getRuleCondition = (condition: string) => {
        if (condition === "greater_than") {
            return ">";
        } else if (condition === "less_than") {
            return "<";
        } else if (condition === "equal_to") {
            return "=";
        } else if (condition === "not_equal_to") {
            return "!=";
        }
    }

    const formatScreenerRules = (rules: any) => {
        let formattedRules = [];
        for (let i = 0; i < rules.length; i++) {
            let ruleString = "";
            const rule = rules[i];
            if (rule.type === "filter") {
                ruleString += `${rule.technicalIndicator} ${getRuleCondition(rule.condition)} ${rule.comparisonValue}`;
            } else if (rule.type === "condition") {
                ruleString += `${rule.condition} `;
            }
            formattedRules.push(ruleString);
        }
        return formattedRules;
    }

    const handleDeleteScreener = async (id: number) => {
        await axiosInstance.delete(`/screeners`, {
            params: {
                id: id
            }
        }).then((res) => {
            if (res.status === 200) {
                context.showToast("Screener deleted successfully", "success");
                context.hideModal();
                fetchScreeners();
            } else {
                context.showToast("Error deleting screener", "error");
            }
        }).catch(() => {
            context.showToast("Error deleting screener", "error");
        });
    }

    const showDeleteScreenerModal = (id: number) => {
        context.showModal(
            "Delete Screener", 
            "Are you sure you want to delete this screener?", 
            {
                onClick: () => {
                    handleDeleteScreener(id);
                },
                text: "Delete",
                variant: "default"
            },
            {
                onClick: () => {
                    context.hideModal();
                },
                text: "Cancel",
                variant: "outline"
            }
        )
    }

    useEffect(() => {
        if (userData && screeners.length === 0) {
            fetchScreeners();
        }
    }, [userData]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <NavigationBar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Filter className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Stock Screeners
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Manage your custom stock screeners and discover new screening strategies. 
                            Create, edit, and run powerful filters to find your next investment opportunity.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Saved Screeners Section */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <BookOpen className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-semibold text-gray-900">
                                                    Saved Screeners
                                                </CardTitle>
                                                <CardDescription>
                                                    Your custom stock screening configurations
                                                </CardDescription>
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={() => navigate("/create-screener")}
                                            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            New Screener
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-12">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    ) : screeners.length === 0 ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Filter className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                No Screeners Found
                                            </h3>
                                            <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                Create your first screener to start filtering stocks based on your criteria.
                                            </p>
                                            <Button 
                                                onClick={() => navigate("/create-screener")}
                                                className="bg-blue-600 hover:bg-blue-700 text-white"
                                            >
                                                <Plus className="w-4 h-4 mr-2" />
                                                Create Your First Screener
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {screeners.map((screener: any) => (
                                                <Card 
                                                    key={screener.id} 
                                                    className="hover:shadow-lg transition-all duration-200 border border-gray-200 bg-white/60 backdrop-blur-sm cursor-pointer group"
                                                    onClick={() => navigate(`/view-screener/${screener.id}`)}
                                                >
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-3 mb-3">
                                                                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                                        {screener.name}
                                                                    </h3>
                                                                    <div className="flex items-center gap-1 text-sm text-gray-500">
                                                                        <Eye className="w-4 h-4" />
                                                                        <span>View</span>
                                                                    </div>
                                                                </div>
                                                                {screener.description && (
                                                                    <p className="text-gray-600 mb-3">
                                                                        {screener.description}
                                                                    </p>
                                                                )}
                                                                <div className="flex flex-wrap gap-2">
                                                                    {formatScreenerRules(screener.rules).slice(0, 3).map((rule: any, index: number) => (
                                                                        <span 
                                                                            key={index}
                                                                            className="px-3 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium"
                                                                        >
                                                                            {rule}
                                                                        </span>
                                                                    ))}
                                                                    {formatScreenerRules(screener.rules).length > 3 && (
                                                                        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                                                            +{formatScreenerRules(screener.rules).length - 3} more
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2 ml-4">
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        navigate(`/edit-screener/${screener.id}`);
                                                                    }}
                                                                    className="hover:bg-blue-50 hover:border-blue-200"
                                                                >
                                                                    <Pencil className="w-4 h-4" />
                                                                </Button>
                                                                <Button 
                                                                    variant="outline" 
                                                                    size="sm"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        showDeleteScreenerModal(screener.id);
                                                                    }}
                                                                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                                                >
                                                                    <Trash className="w-4 h-4" />
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Suggested Screeners Section */}
                        <div className="lg:col-span-1">
                            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm sticky top-8">
                                <CardHeader className="pb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-xl font-semibold text-gray-900">
                                                Suggested Screeners
                                            </CardTitle>
                                            <CardDescription>
                                                Popular screening strategies to get you started
                                            </CardDescription>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {suggestedScreener.slice(0, 4).map((screener, index) => (
                                            <SuggestedCard
                                                key={index}
                                                className="w-full"
                                                title={screener.title}
                                                description={screener.description}
                                                content={screener.content}
                                                onAddButton={{ onClick: () => {}, title: "Add to Screener" }}
                                                onViewButton={{ onClick: () => {}, title: "View Screener" }}
                                            />
                                        ))}
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-gray-200">
                                        <Button 
                                            variant="outline" 
                                            className="w-full text-gray-600 hover:text-gray-900"
                                            onClick={() => navigate("/suggested-screeners")}
                                        >
                                            View All Suggestions
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Quick Stats Section */}
                    {screeners.length > 0 && (
                        <div className="mt-12">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                                Screener Overview
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <Filter className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Total Screeners</h3>
                                        <p className="text-2xl font-bold text-blue-600">{screeners.length}</p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <TrendingUp className="w-6 h-6 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Active Filters</h3>
                                        <p className="text-2xl font-bold text-green-600">
                                            {screeners.reduce((total, screener) => total + (screener.rules?.length || 0), 0)}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <Eye className="w-6 h-6 text-purple-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Ready to View</h3>
                                        <p className="text-2xl font-bold text-purple-600">{screeners.length}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}


