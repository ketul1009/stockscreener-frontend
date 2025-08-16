import { useApp } from "@/contexts/AppContext";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { capitalize, roundToPlaces } from "@/utils/utils";
import BaseDialog from "@/components/ui/BaseDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
    Play, 
    Edit, 
    Filter, 
    TrendingUp, 
    BarChart3, 
    Plus, 
    Loader2, 
    CheckCircle,
    AlertCircle,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";

export default function ViewScreener() {
    const { id } = useParams();
    const [screener, setScreener] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { userData } = useApp();
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<string | null>(null);
    const context = useApp();
    const [results, setResults] = useState<any>(null);
    const [openAddToWatchlistDialog, setOpenAddToWatchlistDialog] = useState(false);
    const [selectedStock, setSelectedStock] = useState<any>(null);
    const [watchlists, setWatchlists] = useState<any[]>([]);

    useEffect(() => {
        getScreenerData();
        getJobId();
        getWatchlists();
    }, []);

    useEffect(() => {
        if (!jobId) return;

        if (jobStatus === "running") {
            let pollInterval: NodeJS.Timeout;
            
            const pollJobStatus = () => {
                axiosInstance.get(`/jobs/result`, {
                    params: {
                        job_id: jobId
                    }
                }).then((res) => {
                    if (res.status === 200) {
                        setJobStatus(res.data.job_status);
                        if (res.data.job_status === "completed" || res.data.job_status === "failed") {
                            context.showToast(`Screener ${capitalize(res.data.job_status)}`, "success");
                            setResults(JSON.parse(res.data.result));
                            clearInterval(pollInterval);
                        }
                    }
                }).catch(() => {
                    context.showToast("Error getting job status", "error");
                    clearInterval(pollInterval);
                });
            };

            // Initial poll
            pollJobStatus();
            
            // Set up interval
            pollInterval = setInterval(pollJobStatus, 1500);

            // Cleanup function to clear interval when component unmounts or jobId changes
            return () => {
                if (pollInterval) {
                    clearInterval(pollInterval);
                }
            };
        }

        else {
            getResults();
        }
    }, [jobId, jobStatus]);

    const getScreenerData = () => {
        axiosInstance.get(`/screeners`, {
            params: {
                id: id
            }
        }).then((res) => {
            if (res.status === 200) {
                setScreener(res.data);
                setLoading(false);
            }
        }).catch(() => {
            context.showToast("Error getting screener", "error");
            setLoading(false);
        });
    }

    const getJobId = () => {
        axiosInstance.get(`/jobs`, {
            params: {
                user_id: userData?.id
            }
        }).then((res) => {
            if (res.status === 200) {
                setJobId(res.data.job_id);
                setJobStatus(res.data.job_status);
            }
        }).catch(() => {
            context.showToast("Error getting job status", "error");
        });
    }

    const getResults = () => {
        axiosInstance.get(`/jobs/result`, {
            params: {
                job_id: jobId
            }
        }).then((res) => {
            if (res.status === 200) {
                setResults(JSON.parse(res.data.result));
            }
        }).catch(() => {
            context.showToast("Error getting results", "error");
        });
    }

    const handleRunScreener = () => {
        if (userData) {
            axiosInstance.post('/jobs', {
                rules: screener.rules,
                user_id: userData.id
            }).then((res) => {
                setJobId(res.data.job_id);
                setJobStatus("running");
                context.showToast("Screener running", "success");
            }).catch(() => {
                context.showToast("Error running screener", "error");
            });
        }
    }

    const getWatchlists = () => {
        if (!userData) return;
        axiosInstance.get("/watchlists/all", {
            params: {
                user_id: userData?.id
            }
        }).then((res) => {
            setWatchlists(res.data);
        }).catch(() => {
            context.showToast("Error getting watchlists", "error");
        })
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "running":
                return <Loader2 className="w-4 h-4 animate-spin" />;
            case "completed":
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case "failed":
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return <Play className="w-4 h-4" />;
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "running":
                return "text-blue-600 bg-blue-100";
            case "completed":
                return "text-green-600 bg-green-100";
            case "failed":
                return "text-red-600 bg-red-100";
            default:
                return "text-gray-600 bg-gray-100";
        }
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <NavigationBar />
            
            {loading ? (
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="flex items-center justify-center py-20">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Screener</h2>
                                <p className="text-gray-600">Please wait while we fetch your screener details...</p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-6xl mx-auto">
                        {/* Header Section */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Filter className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">{screener.name}</h1>
                                        <p className="text-gray-600">Stock Universe: {screener.stock_universe}</p>
                                    </div>
                                </div>
                                <Button 
                                    onClick={() => navigate(`/edit-screener/${id}`)}
                                    variant="outline"
                                    className="hover:bg-blue-50 hover:border-blue-200"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Screener
                                </Button>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-4 gap-8">
                            {/* Screener Configuration */}
                            <div className="lg:col-span-1">
                                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm sticky top-8">
                                    <CardHeader className="pb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                                <BarChart3 className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-semibold text-gray-900">
                                                    Screener Rules
                                                </CardTitle>
                                                <CardDescription>
                                                    Your filtering criteria
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <RulesCard rules={screener.rules} />
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Results Section */}
                            <div className="lg:col-span-3">
                                <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                                    <CardHeader className="pb-6">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                    <TrendingUp className="w-5 h-5 text-green-600" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl font-semibold text-gray-900">
                                                        Screening Results
                                                    </CardTitle>
                                                    <CardDescription>
                                                        Stocks that match your criteria
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(jobStatus || "idle")}`}>
                                                    {getStatusIcon(jobStatus || "idle")}
                                                    {jobStatus === "running" ? "Running..." : jobStatus === "completed" ? "Completed" : jobStatus === "failed" ? "Failed" : "Ready"}
                                                </div>
                                                <Button 
                                                    onClick={handleRunScreener} 
                                                    disabled={jobStatus === "running" || jobStatus === "pending"}
                                                    className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                                                >
                                                    {jobStatus === "running" ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                            Running...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Play className="w-4 h-4 mr-2" />
                                                            Run Screener
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        {results?.length > 0 ? (
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader>
                                                        <TableRow className="border-b border-gray-200">
                                                            <TableHead className="text-left font-semibold text-gray-700">Symbol</TableHead>
                                                            <TableHead className="text-right font-semibold text-gray-700">Price</TableHead>
                                                            <TableHead className="text-right font-semibold text-gray-700">Change</TableHead>
                                                            <TableHead className="text-right font-semibold text-gray-700">Volume</TableHead>
                                                            <TableHead className="text-center font-semibold text-gray-700">Actions</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {results.map((stock: any) => (
                                                            <TableRow key={stock.symbol} className="hover:bg-gray-50 transition-colors">
                                                                <TableCell className="font-medium text-gray-900">
                                                                    {stock.symbol}
                                                                </TableCell>
                                                                <TableCell className="text-right font-medium">
                                                                    ₹{roundToPlaces(stock.close)}
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    <div className={`flex items-center justify-end gap-1 ${
                                                                        stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                                                                    }`}>
                                                                        {stock.change >= 0 ? (
                                                                            <ArrowUpRight className="w-4 h-4" />
                                                                        ) : (
                                                                            <ArrowDownRight className="w-4 h-4" />
                                                                        )}
                                                                        {roundToPlaces(stock.change)}%
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell className="text-right text-gray-600">
                                                                    {roundToPlaces(stock.volume).toLocaleString()}
                                                                </TableCell>
                                                                <TableCell className="text-center">
                                                                    <Button 
                                                                        variant="outline" 
                                                                        size="sm"
                                                                        onClick={() => {
                                                                            setSelectedStock(stock);
                                                                            setOpenAddToWatchlistDialog(true);
                                                                        }}
                                                                        className="hover:bg-blue-50 hover:border-blue-200"
                                                                    >
                                                                        <Plus className="w-4 h-4 mr-2" />
                                                                        Add to Watchlist
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        ) : jobStatus === "running" ? (
                                            <div className="text-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    Running Screener
                                                </h3>
                                                <p className="text-gray-600">
                                                    Please wait while we analyze stocks based on your criteria...
                                                </p>
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                    <TrendingUp className="w-8 h-8 text-gray-400" />
                                                </div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                    No Results Found
                                                </h3>
                                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                                    Run the screener to see stocks that match your criteria.
                                                </p>
                                                <Button 
                                                    onClick={handleRunScreener}
                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                >
                                                    <Play className="w-4 h-4 mr-2" />
                                                    Run Screener
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Results Summary */}
                        {results?.length > 0 && (
                            <div className="mt-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                                    Results Summary
                                </h2>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                                <TrendingUp className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Total Stocks</h3>
                                            <p className="text-2xl font-bold text-blue-600">{results.length}</p>
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                                <ArrowUpRight className="w-6 h-6 text-green-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Gainers</h3>
                                            <p className="text-2xl font-bold text-green-600">
                                                {results.filter((stock: any) => stock.change >= 0).length}
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                        <CardContent className="p-6 text-center">
                                            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                                <ArrowDownRight className="w-6 h-6 text-red-600" />
                                            </div>
                                            <h3 className="font-semibold text-gray-900 mb-2">Decliners</h3>
                                            <p className="text-2xl font-bold text-red-600">
                                                {results.filter((stock: any) => stock.change < 0).length}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <AddToWatchlistModal 
                openDialog={openAddToWatchlistDialog} 
                setOpenDialog={setOpenAddToWatchlistDialog} 
                stock={selectedStock} 
                watchlists={watchlists}
                successCallback={getWatchlists}
            />
        </div>
    )
}

function RulesCard(rules: any) {
    const getRuleOperator = (operator: string) => {
        switch (operator) {
            case "greater_than":
                return ">";
            case "less_than":
                return "<";
            case "equal_to":
                return "=";
            case "not_equal_to":
                return "!=";
            default:
                return operator;
        }
    }

    return (
        <div className="space-y-4">
            {rules.rules.map((rule: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {rule.type === "filter" ? (
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium">
                                {rule.technicalIndicator}
                            </span>
                            <span className="text-gray-600 font-medium">
                                {getRuleOperator(rule.condition)}
                            </span>
                            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full font-medium">
                                {rule.comparisonValue}
                            </span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center">
                            <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold">
                                {rule.condition}
                            </span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    )
}

function AddToWatchlistModal({openDialog, setOpenDialog, stock, watchlists, successCallback}: {openDialog: boolean, setOpenDialog: (open: boolean) => void, stock: any, watchlists: any[], successCallback: () => void}) {
    const [selectedWatchlist, setSelectedWatchlist] = useState<any>(null);
    const { userData } = useApp();
    const context = useApp();

    const handleAddToWatchlist = () => {
        if (!selectedWatchlist) return;
        axiosInstance.put(`/watchlists/update?id=${selectedWatchlist.id}`, {
            id: selectedWatchlist.id,
            name: selectedWatchlist.name,
            user_id: userData?.id,
            stock_list: [...selectedWatchlist.stock_list, stock]
        }).then((res) => {
            if (res.status === 200) {
                context.showToast("Stock added to watchlist", "success");
                successCallback();
                setOpenDialog(false);
            }
        }).catch(() => {
            context.showToast("Error adding to watchlist", "error");
        })
    }
    
    return (
        <BaseDialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            title="Add to Watchlist"
            content={
                <div className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 mb-2">Adding stock:</p>
                        <p className="font-semibold text-gray-900">{stock?.symbol}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Select Watchlist</label>
                        <Select onValueChange={(value) => {
                            setSelectedWatchlist(watchlists.find((watchlist) => watchlist.name === value));
                        }}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Choose a watchlist" />
                            </SelectTrigger>
                            <SelectContent>
                                {watchlists?.map((watchlist) => (
                                    <SelectItem
                                        key={watchlist.id}
                                        value={watchlist.name}
                                    >
                                        {watchlist.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            }
            primaryAction={{
                label: "Add to Watchlist",
                onClick: handleAddToWatchlist
            }}
        />
    )
}