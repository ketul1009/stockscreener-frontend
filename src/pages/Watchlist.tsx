import { NavigationBar } from "@/components/NavigationBar";
import BaseDialog from "@/components/ui/BaseDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
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
    const {userData} = useApp();
    const context = useApp();

    useEffect(() => {
        getWatchlists();
    }, [userData]);

    const getWatchlists = async () => {
        if (!userData) return;
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
            }).then((res) => {
                setWatchlists(watchlists.filter((_, index) => index !== selectedWatchlistIndex));
                context.showToast("Watchlist deleted successfully", "success");
                setOpenDialog(false);
            }).catch((err) => {
                context.showToast(err.response.data.message, "error");
            })
        }
    }

    const handleWatchlistCreate = async () => {
        if (!userData) return;
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
        }).catch((err) => {
            context.showToast("Failed to create watchlist", "error");
        })
    }

    const handleWatchlistChange = (index: number) => {
        setSelectedWatchlistIndex(index);
        getWatchlistData(watchlists[index].id);
    }

    const handleWatchlistStockDelete = async (stockData: any) => {
        console.log(stockData, selectedWatchlistIndex, watchlists);
        if (selectedWatchlistIndex === null) return;
        if (!watchlists[selectedWatchlistIndex]) return;


        console.log("watchlists[selectedWatchlistIndex]",watchlists[selectedWatchlistIndex]);
        await axiosInstance.put(`/watchlists/update?id=${watchlists[selectedWatchlistIndex].id}`, {
            id: watchlists[selectedWatchlistIndex].id,
            name: watchlists[selectedWatchlistIndex].name,
            user_id: userData?.id,
            stock_list: stockData
        }).then((res) => {
            context.showToast("Stock removed from watchlist", "success");
            setWatchlistData(stockData);
        }).catch((err) => {
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
        <div>
            <NavigationBar />
            <div className="flex flex-row items-start justify-start h-screen pl-10 pt-10 gap-10">
                <WatchlistTable 
                    savedWatchlists={watchlists ?? []} 
                    onDelete={handleWatchlistDelete} 
                    handleWatchlistChange={handleWatchlistChange}
                    selectedWatchlistIndex={selectedWatchlistIndex}
                />
                {watchlists?.length > 0 && <WatchlistDataTable 
                    watchlistData={watchlistData}
                    onSave={(data: any[])=>{
                        handleWatchlistStockDelete(data);
                    }}
                    onSaveCallback={()=>{
                        getWatchlists();
                    }}
                />}
                <BaseDialog 
                    open={openDialog}
                    onOpenChange={setOpenDialog}
                    title="Delete Watchlist" 
                    description="Are you sure you want to delete this watchlist?"
                    content={<div>This action cannot be undone.</div>}
                    primaryAction={{
                        label: "Delete",
                        onClick: confirmDelete
                    }}
                />
                <AddWatchlistCard 
                    watchlistName={watchlistName}
                    setWatchlistName={setWatchlistName}
                    handleWatchlistCreate={handleWatchlistCreate}
                />
            </div>
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

    return (
        <div className="flex flex-col">
            <div className="table-outline">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className="table-header text-center">Symbol</TableHead>
                        <TableHead className="table-header text-center">Price</TableHead>
                        <TableHead className="table-header text-center">Change</TableHead>
                        <TableHead className="table-header text-center">Volume</TableHead>
                        <TableHead className="table-header text-center"></TableHead>
                    </TableRow>
                </TableHeader>
                {currentData.length === 0 && (
                    <TableBody>
                        <TableRow>
                            <TableCell  colSpan={5} className="text-center w-160">No stocks found</TableCell>
                        </TableRow>
                    </TableBody>
                )}
                <TableBody>
                    {currentData.map((item, index) => (
                        <TableRow key={item.symbol} className="hover:bg-gray-100 cursor-pointer">
                            <TableCell className="w-32 text-center">{item.symbol}</TableCell>
                            <TableCell className="w-32 text-center">{roundToPlaces(item.close)}</TableCell>
                            <TableCell className="w-32 text-center">{roundToPlaces(item.change)}</TableCell>
                            <TableCell className="w-32 text-center">{roundToPlaces(item.volume)}</TableCell>
                            <TableCell className="w-32 text-center">
                                <Button variant="outline" onClick={() => handleDelete(index)}>
                                    <Trash />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            </div>
            <div className="flex flex-row justify-end">
                {JSON.stringify(currentData) !== JSON.stringify(initialData) && (
                    <div className="flex flex-row gap-2">
                        <Button variant="default" onClick={() => {
                            onSave(currentData);
                            onSaveCallback();
                        }}>Save</Button>
                        <Button variant="outline" onClick={() => {
                            setCurrentData(initialData);
                        }}>Cancel</Button>
                    </div>
                )}
            </div>
        </div>
    )
}

const WatchlistTable = ({savedWatchlists, onDelete, handleWatchlistChange, selectedWatchlistIndex}: { savedWatchlists: any[], onDelete: (index: number) => void, handleWatchlistChange: (index: number) => void, selectedWatchlistIndex: number | null }) => {

    const getSelectedWatchlistClassName = (index: number) => {
        if (selectedWatchlistIndex === index) {
            return "w-32 text-center font-bold";
        }
        return "w-32 text-center";
    }

    return (
        <div className="table-outline">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="table-header text-center">Name</TableHead>
                        <TableHead className="table-header text-center">Stocks</TableHead>
                        <TableHead className="table-header text-center"></TableHead>
                    </TableRow>
                </TableHeader>
                {savedWatchlists.length === 0 && (
                    <TableBody>
                        <TableRow>
                            <TableCell colSpan={4} className="text-center w-96">No watchlists found</TableCell>
                        </TableRow>
                    </TableBody>
                )}
                <TableBody>
                    {savedWatchlists.map((watchlist, index) => (
                        <TableRow key={watchlist.name} onClick={() => handleWatchlistChange(index)} className="hover:bg-gray-100 cursor-pointer">
                            <TableCell className={getSelectedWatchlistClassName(index)}>{watchlist.name}</TableCell>
                            <TableCell className={getSelectedWatchlistClassName(index)}>{watchlist.stock_list ? watchlist.stock_list.length : 0}</TableCell>
                            <TableCell className={getSelectedWatchlistClassName(index)}>
                                <Button 
                                    variant={index === selectedWatchlistIndex ? "default" : "outline"}
                                    className={index === selectedWatchlistIndex ? "bg-black text-white" : ""}
                                    onClick={(e) => {
                                        onDelete(index)
                                        e.stopPropagation()
                                    }}
                                >
                                    <Trash />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

const AddWatchlistCard = ({watchlistName, setWatchlistName, handleWatchlistCreate}: {watchlistName: string, setWatchlistName: (name: string) => void, handleWatchlistCreate: () => void}) => {
    return (
        <div className="mt-10">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>Add Watchlist</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-row gap-2">
                        <Input placeholder="Watchlist Name" value={watchlistName} onChange={(e) => setWatchlistName(e.target.value)} />
                        <Button variant="outline" onClick={() => {
                            handleWatchlistCreate()
                            setWatchlistName("")
                        }}>Add</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

