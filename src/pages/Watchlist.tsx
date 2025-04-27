import { NavigationBar } from "@/components/NavigationBar";
import BaseDialog from "@/components/ui/BaseDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function Watchlist() {
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [watchlistData, setWatchlistData] = useState<any[]>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [watchlistName, setWatchlistName] = useState<string>("");

    useEffect(() => {
        setWatchlist(watchlists);
        setWatchlistData(data);
    }, []);

    const handleWatchlistDelete = (index: number) => {
        setSelectedIndex(index);
        setOpenDialog(true);
    }

    const confirmDelete = () => {
        if (selectedIndex !== null) {
            const newWatchlist = [...watchlist];
            newWatchlist.splice(selectedIndex, 1);
            setWatchlist(newWatchlist);
            setOpenDialog(false);
        }
    }

    const handleStockDelete = (index: number) => {
        const newWatchlistData = [...watchlistData];
        newWatchlistData.splice(index, 1);
        setWatchlistData(newWatchlistData);
    }

    const handleWatchlistCreate = () => {
        const newWatchlist = {
            name: watchlistName,
            stocks: []
        }
        setWatchlist([...watchlist, newWatchlist]);
    }

    const handleWatchlistChange = (index: number) => {
        const newWatchlistData = watchlist[index].data;
        setWatchlistData(newWatchlistData);
    }

    return (
        <div>
            <NavigationBar />
            <div className="flex flex-row items-start justify-start h-screen pl-10 pt-10 gap-10">
                <WatchlistTable 
                    savedWatchlists={watchlist} 
                    onDelete={handleWatchlistDelete} 
                    handleWatchlistChange={handleWatchlistChange}
                />
                {watchlist.length > 0 && <WatchlistDataTable 
                    watchlistData={watchlistData}
                    onDelete={(index: number) => handleStockDelete(index)}
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

const data = [
    {
        name: "Microsoft",
        symbol: "MSFT",
        price: 100,
        change: 10
    },
    {
        name: "Tesla",
        symbol: "TSLA",
        price: 100,
        change: 10
    },
    {
        name: "Amazon",
        symbol: "AMZN",
        price: 100,
        change: 10
    },
    {
        name: "Apple",
        symbol: "AAPL",
        price: 100,
        change: 10
    },
]

const WatchlistDataTable = ({watchlistData, onDelete}: {watchlistData: any[], onDelete: (index: number) => void}) => {
    return (
        <div className="table-outline">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="table-header text-center">Name</TableHead>
                        <TableHead className="table-header text-center">Symbol</TableHead>
                        <TableHead className="table-header text-center">Price</TableHead>
                        <TableHead className="table-header text-center">Change</TableHead>
                        <TableHead className="table-header text-center"></TableHead>
                    </TableRow>
                </TableHeader>
                {watchlistData.length === 0 && (
                    <TableBody>
                        <TableRow>
                            <TableCell  colSpan={5} className="text-center w-160">No stocks found</TableCell>
                        </TableRow>
                    </TableBody>
                )}
                <TableBody>
                    {watchlistData.map((item, index) => (
                        <TableRow key={item.symbol} className="hover:bg-gray-100 cursor-pointer">
                            <TableCell className="w-32 text-center">{item.name}</TableCell>
                            <TableCell className="w-32 text-center">{item.symbol}</TableCell>
                            <TableCell className="w-32 text-center">{item.price}</TableCell>
                            <TableCell className="w-32 text-center">{item.change}</TableCell>
                            <TableCell className="w-32 text-center">
                                <Button variant="outline" onClick={() => onDelete(index)}>
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

const watchlists = [
    {
        name: "Watchlist 1",
        stocks: ["AAPL", "GOOG", "MSFT"],
        id: 1,
        data: data
    },
    {
        name: "Watchlist 2",
        stocks: ["AAPL", "GOOG", "MSFT"],
        id: 2,
        data: []
    }
]

const WatchlistTable = ({savedWatchlists, onDelete, handleWatchlistChange }: { savedWatchlists: any[], onDelete: (index: number) => void, handleWatchlistChange: (index: number) => void }) => {

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
                        <TableRow key={watchlist.name} onClick={() => handleWatchlistChange(index)}>
                            <TableCell className="w-32 text-center">{watchlist.name}</TableCell>
                            <TableCell className="w-32 text-center">{watchlist.stocks.length}</TableCell>
                            <TableCell className="w-32 text-center">
                                <Button 
                                    variant="outline" 
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

