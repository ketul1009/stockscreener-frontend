import { useApp } from "@/contexts/AppContext";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { capitalize, roundToPlaces } from "@/utils/utils";
import BaseDialog from "@/components/ui/BaseDialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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
                }).catch((err) => {
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
                console.log("res: ", res.data);
                setScreener(res.data);
                setLoading(false);
            }
        }).catch((err) => {
            console.log("err: ", err);
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
                console.log("res: ", res.data);
                setJobId(res.data.job_id);
                setJobStatus(res.data.job_status);
            }
        }).catch((err) => {
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
        }).catch((err) => {
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
            }).catch((err) => {
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
        }).catch((err) => {
            context.showToast("Error getting watchlists", "error");
        })
    }
    
    return (
        <div>
            <NavigationBar />
            {loading ? 
                (<div className="flex flex-row">
                    <div className="flex flex-col items-start mx-10 my-10">
                        Loading...
                    </div>
                </div>
            ) : (
                <div className="flex flex-row">
                    <div className="flex flex-col items-start mx-10 my-10">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex flex-row gap-x-4 items-center justify-between">
                                        <h1 className="text-xl font-bold">{screener.name}</h1>
                                        <Button variant="outline"
                                            onClick={() => {
                                                navigate(`/edit-screener/${id}`);
                                            }}
                                        >Edit</Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="w-64 items-center justify-center flex flex-col gap-4">
                                    <h2>Universe: {screener.stock_universe}</h2>
                                    <RulesCard rules={screener.rules} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="flex flex-row outline outline-gray-300 rounded-lg mx-10 my-10">
                        <div className="flex flex-col items-center mx-10 my-10 w-1/5">
                            <Button variant="outline" onClick={handleRunScreener} disabled={jobStatus === "running" || jobStatus === "pending"}>
                                <h1>{jobStatus === "running" ? "Running" : "Run Screener"}</h1>
                            </Button>
                        </div>
                        <div className="flex flex-col items-center mx-10 my-10 w-4/5">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-24 text-center">Stock</TableHead>
                                        <TableHead className="w-24 text-center">Price</TableHead>
                                        <TableHead className="w-24 text-center">Change</TableHead>
                                        <TableHead className="w-24 text-center">Volume</TableHead>
                                        <TableHead className="w-24 text-center"></TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {results?.length > 0 ? (
                                        results.map((stock: any) => (
                                            <TableRow key={stock.symbol}>
                                                <TableCell className="text-center">{stock.symbol}</TableCell>
                                                <TableCell className="text-center">{roundToPlaces(stock.close)}</TableCell>
                                                <TableCell className="text-center">{roundToPlaces(stock.change)}</TableCell>
                                                <TableCell className="text-center">{roundToPlaces(stock.volume)}</TableCell>
                                                <TableCell className="text-center">
                                                    <Button variant="link" className="text-blue-500" onClick={() => {
                                                        setSelectedStock(stock);
                                                        setOpenAddToWatchlistDialog(true);
                                                    }}>
                                                        Add to Watchlist
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center">No results found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                            <AddToWatchlistModal 
                                openDialog={openAddToWatchlistDialog} 
                                setOpenDialog={setOpenAddToWatchlistDialog} 
                                stock={selectedStock} 
                                watchlists={watchlists}
                                successCallback={getWatchlists}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

function RulesCard(rules: any) {

    useEffect(() => {
        console.log("rules: ", rules);
    }, [rules]);

    const getRuleOperator = (operator: string) => {
        switch (operator) {
            case "greater_than":
                return ">";
            case "less_than":
                return "<";
            case "equal_to":
                return "=";
        }
    }
    return (
        <Card>
            <CardHeader>
                <CardTitle>Rules</CardTitle>
            </CardHeader>
            <CardContent>
                {rules.rules.map((rule: any) => (
                    <div key={JSON.stringify(rule)}>
                        {rule.type === "filter" ? (
                            <h2>{rule.technicalIndicator} {getRuleOperator(rule.condition)} {rule.comparisonValue}</h2>
                        ) : (
                            <h2>{rule.condition}</h2>
                        )}
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}

function AddToWatchlistModal({openDialog, setOpenDialog, stock, watchlists, successCallback}: {openDialog: boolean, setOpenDialog: (open: boolean) => void, stock: any, watchlists: any[], successCallback: () => void}) {
    const [selectedWatchlist, setSelectedWatchlist] = useState<any>(null);
    const { userData } = useApp();
    const context = useApp();


    const handleAddToWatchlist = () => {
        console.log("selectedWatchlist: ", selectedWatchlist);
        if (!selectedWatchlist) return;
        axiosInstance.put(`/watchlists/update?id=${selectedWatchlist.id}`, {
            id: selectedWatchlist.id,
            name: selectedWatchlist.name,
            user_id: userData?.id,
            stock_list: [...selectedWatchlist.stock_list, stock]
        }).then((res) => {
            context.showToast("Stock added to watchlist", "success");
            successCallback();
        }).catch((err) => {
            context.showToast("Error adding to watchlist", "error");
        })
    }
    
    return (
        <BaseDialog
            open={openDialog}
            onOpenChange={setOpenDialog}
            title="Add to Watchlist"
            content={
                <div>
                    <Select onValueChange={(value) => {
                        setSelectedWatchlist(watchlists.find((watchlist) => watchlist.name === value));
                    }}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a watchlist" />
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
            }
            primaryAction={{
                label: "Add",
                onClick: handleAddToWatchlist
            }}
        />
    )
}