import { NavigationBar } from "@/components/NavigationBar";
import BaseDialog from "@/components/ui/BaseDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
    Trash, 
    Plus, 
    Eye, 
    Heart, 
    TrendingUp, 
    BarChart3, 
    ArrowUpRight, 
    ArrowDownRight,
    Loader2,
    AlertCircle
} from "lucide-react";
import { useEffect, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import axiosInstance from "@/lib/axios";
import { roundToPlaces } from "@/utils/utils";

export default function Watchlist() {
    const [watchlists, setWatchlists] = useState<any[]>([]);
    const [watchlistData, setWatchlistData] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedWatchlistIndex, setSelectedWatchlistIndex] = useState<number | null>(null);
    const [watchlistName, setWatchlistName] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const {userData} = useApp();
    const context = useApp();

    useEffect(() => {
        getWatchlists();
    }, [userData]);

    const getWatchlists = async () => {
        if (!userData) return;
        setIsLoading(true);
        await axiosInstance.get("/watchlists/all",
            {
                params: {
                    user_id: userData.id
                }
            }
        )
        .then((res) => {
            setWatchlists(res.data);
        })
        .catch((err) => {
            context.showToast(err.response.data.message, "error");
        })
        .finally(() => {
            setIsLoading(false);
        })
    }

    const handleWatchlistDelete = (index: number) => {
        setSelectedWatchlistIndex(index);
        setOpenDialog(true);
    }

    const confirmDelete = async () => {
        if (selectedWatchlistIndex !== null) {
            await axiosInstance.delete(`/watchlists`, {
                params: {
                    id: watchlists[selectedWatchlistIndex].id
                }
            }).then(() => {
                setWatchlists(watchlists.filter((_, index) => index !== selectedWatchlistIndex));
                context.showToast("Watchlist deleted successfully", "success");
                setOpenDialog(false);
                setSelectedWatchlistIndex(null);
                setWatchlistData([]);
            }).catch((err) => {
                context.showToast(err.response.data.message, "error");
            })
        }
    }

    const handleWatchlistCreate = async () => {
        if (!userData || !watchlistName.trim()) return;
        setIsLoading(true);
        const newWatchlistBody = {
            name: watchlistName,
            user_id: userData?.id,
            stocks: []
        }
        await axiosInstance.post("/watchlists", newWatchlistBody).then((res) => {
            if (watchlists === null || watchlists === undefined || watchlists.length === 0) {
                setWatchlists([res.data]);
            } else {
                setWatchlists([...watchlists, res.data]);
            }
            context.showToast("Watchlist created successfully", "success");
            setWatchlistName("");
        }).catch(() => {
            context.showToast("Failed to create watchlist", "error");
        }).finally(() => {
            setIsLoading(false);
        })
    }

    const handleWatchlistChange = (index: number) => {
        setSelectedWatchlistIndex(index);
        getWatchlistData(watchlists[index].id);
    }

    const handleWatchlistStockDelete = async (stockData: any) => {
        if (selectedWatchlistIndex === null) return;
        if (!watchlists[selectedWatchlistIndex]) return;

        await axiosInstance.put(`/watchlists/update?id=${watchlists[selectedWatchlistIndex].id}`, {
            id: watchlists[selectedWatchlistIndex].id,
            name: watchlists[selectedWatchlistIndex].name,
            user_id: userData?.id,
            stock_list: stockData
        }).then(() => {
            context.showToast("Stock removed from watchlist", "success");
            setWatchlistData(stockData);
        }).catch(() => {
            context.showToast("Error removing from watchlist", "error");
        })
    }

    const getWatchlistData = async (watchlistId: number) => {
        await axiosInstance.get(`/watchlists`, {
            params: {
                id: watchlistId
            }
        }).then((res) => {
            setWatchlistData(res.data.stock_list ? res.data.stock_list : []);
        }).catch((err) => {
            context.showToast(err.response.data.message, "error");
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <NavigationBar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-red-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            My Watchlists
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Track your favorite stocks and monitor their performance. 
                            Create multiple watchlists to organize your investments by strategy or sector.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Watchlists Section */}
                        <div className="lg:col-span-1">
                            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <Eye className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-semibold text-gray-900">
                                                    Watchlists
                                                </CardTitle>
                                                <CardDescription>
                                                    Your stock collections
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {isLoading ? (
                                        <div className="flex items-center justify-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                        </div>
                                    ) : watchlists.length === 0 ? (
                                        <div className="text-center py-8">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <Heart className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                No Watchlists Found
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                Create your first watchlist to start tracking stocks.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {watchlists.map((watchlist, index) => (
                                                <div
                                                    key={watchlist.id}
                                                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                                                        selectedWatchlistIndex === index
                                                            ? 'border-blue-500 bg-blue-50'
                                                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                    }`}
                                                    onClick={() => handleWatchlistChange(index)}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex-1">
                                                            <h3 className={`font-semibold ${
                                                                selectedWatchlistIndex === index ? 'text-blue-900' : 'text-gray-900'
                                                            }`}>
                                                                {watchlist.name}
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {watchlist.stock_list ? watchlist.stock_list.length : 0} stocks
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button 
                                                                variant="outline" 
                                                                size="sm"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleWatchlistDelete(index);
                                                                }}
                                                                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                                            >
                                                                <Trash className="w-4 h-4" />
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Add Watchlist Card */}
                            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mt-6">
                                <CardHeader className="pb-4">
                                    <CardTitle className="text-lg font-semibold text-gray-900">
                                        Create New Watchlist
                                    </CardTitle>
                                    <CardDescription>
                                        Add a new watchlist to organize your stocks
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <Input 
                                                placeholder="Enter watchlist name" 
                                                value={watchlistName} 
                                                onChange={(e) => setWatchlistName(e.target.value)}
                                                className="w-full"
                                                onKeyPress={(e) => {
                                                    if (e.key === 'Enter' && watchlistName.trim()) {
                                                        handleWatchlistCreate();
                                                    }
                                                }}
                                            />
                                        </div>
                                        <Button 
                                            onClick={handleWatchlistCreate}
                                            disabled={!watchlistName.trim() || isLoading}
                                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                    Creating...
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Create Watchlist
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Stocks Section */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
                                <CardHeader className="pb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                                <TrendingUp className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-semibold text-gray-900">
                                                    {selectedWatchlistIndex !== null && watchlists[selectedWatchlistIndex] 
                                                        ? watchlists[selectedWatchlistIndex].name 
                                                        : "Stocks"
                                                    }
                                                </CardTitle>
                                                <CardDescription>
                                                    {selectedWatchlistIndex !== null && watchlists[selectedWatchlistIndex]
                                                        ? `${watchlistData.length} stocks in this watchlist`
                                                        : "Select a watchlist to view stocks"
                                                    }
                                                </CardDescription>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {selectedWatchlistIndex === null ? (
                                        <div className="text-center py-12">
                                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                                <BarChart3 className="w-8 h-8 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                                No Watchlist Selected
                                            </h3>
                                            <p className="text-gray-600">
                                                Choose a watchlist from the left to view its stocks.
                                            </p>
                                        </div>
                                    ) : (
                                        <WatchlistDataTable 
                                            watchlistData={watchlistData}
                                            onSave={(data: any[])=>{
                                                handleWatchlistStockDelete(data);
                                            }}
                                            onSaveCallback={()=>{
                                                getWatchlists();
                                            }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    {/* Summary Section */}
                    {selectedWatchlistIndex !== null && watchlistData.length > 0 && (
                        <div className="mt-8">
                            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
                                Watchlist Summary
                            </h2>
                            <div className="grid md:grid-cols-3 gap-6">
                                <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <TrendingUp className="w-6 h-6 text-blue-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Total Stocks</h3>
                                        <p className="text-2xl font-bold text-blue-600">{watchlistData.length}</p>
                                    </CardContent>
                                </Card>

                                <Card className="hover:shadow-lg transition-all duration-200 border-0 shadow-md bg-white/60 backdrop-blur-sm">
                                    <CardContent className="p-6 text-center">
                                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <ArrowUpRight className="w-6 h-6 text-green-600" />
                                        </div>
                                        <h3 className="font-semibold text-gray-900 mb-2">Gainers</h3>
                                        <p className="text-2xl font-bold text-green-600">
                                            {watchlistData.filter((stock: any) => stock.change >= 0).length}
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
                                            {watchlistData.filter((stock: any) => stock.change < 0).length}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <BaseDialog 
                open={openDialog}
                onOpenChange={setOpenDialog}
                title="Delete Watchlist" 
                description="Are you sure you want to delete this watchlist?"
                content={
                    <div className="space-y-4">
                        <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                            <div className="flex items-center gap-2">
                                <AlertCircle className="w-5 h-5 text-red-600" />
                                <p className="text-sm text-red-700 font-medium">This action cannot be undone.</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            All stocks in this watchlist will be permanently removed.
                        </p>
                    </div>
                }
                primaryAction={{
                    label: "Delete Watchlist",
                    onClick: confirmDelete
                }}
            />
        </div>
    )
}

const WatchlistDataTable = ({watchlistData, onSave, onSaveCallback}: {watchlistData: any[], onSave: (data: any[]) => void, onSaveCallback: () => void}) => {

    const [initialData, setInitialData] = useState<any[]>(watchlistData);
    const [currentData, setCurrentData] = useState<any[]>(watchlistData);

    useEffect(() => {
        setCurrentData(watchlistData);
        setInitialData(watchlistData);
    }, [watchlistData]);

    const handleDelete = (index: number) => {
        setCurrentData(currentData.filter((_, i) => i !== index));
    }

    const hasChanges = JSON.stringify(currentData) !== JSON.stringify(initialData);

    return (
        <div className="space-y-4">
            {currentData.length === 0 && !hasChanges ? (
                <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No Stocks Found
                    </h3>
                    <p className="text-gray-600">
                        This watchlist is empty. Add stocks from screeners or search results.
                    </p>
                </div>
            ) : (
                <>
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
                                {currentData.map((item, index) => (
                                    <TableRow key={item.symbol} className="hover:bg-gray-50 transition-colors">
                                        <TableCell className="font-medium text-gray-900">
                                            {item.symbol}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ₹{roundToPlaces(item.close)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className={`flex items-center justify-end gap-1 ${
                                                item.change >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {item.change >= 0 ? (
                                                    <ArrowUpRight className="w-4 h-4" />
                                                ) : (
                                                    <ArrowDownRight className="w-4 h-4" />
                                                )}
                                                {roundToPlaces(item.change)}%
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right text-gray-600">
                                            {roundToPlaces(item.volume).toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Button 
                                                variant="outline" 
                                                size="sm"
                                                onClick={() => handleDelete(index)}
                                                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    
                    {hasChanges && (
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setCurrentData(initialData);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button 
                                onClick={() => {
                                    onSave(currentData);
                                    onSaveCallback();
                                }}
                                className="bg-green-600 hover:bg-green-700 text-white"
                            >
                                Save Changes
                            </Button>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

