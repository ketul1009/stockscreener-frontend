import { useApp } from "@/contexts/AppContext";
import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";


const stockData = [
    {
        stock: "AAPL",
        price: 150.75,
        change: 1.25,
        volume: 1000000
    },
    {
        stock: "AAPL",
        price: 150.75,
        change: 1.25,
        volume: 1000000
    },
    {
        stock: "AAPL",
        price: 150.75,
        change: 1.25,
        volume: 1000000
    },
    {
        stock: "AAPL",
        price: 150.75,
        change: 1.25,
        volume: 1000000
    }
]


export default function ViewScreener() {
    const { id } = useParams();
    const [screener, setScreener] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { userData } = useApp();
    const [jobId, setJobId] = useState<string | null>(null);
    const context = useApp();

    useEffect(() => {
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
    }, []);

    const handleRunScreener = () => {
        if (userData) {
            axiosInstance.post('/jobs', {
                rules: screener.rules,
                username: userData.username
            }).then((res) => {
                setJobId(res.data.job_id);
                context.showToast("Screener running", "success");
            }).catch((err) => {
                context.showToast("Error running screener", "error");
            });
        }
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
                            <Button variant="outline" onClick={handleRunScreener}>
                                <h1>Run Screener</h1>
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
                                    {stockData.map((stock) => (
                                        <TableRow>
                                            <TableCell className="text-center">{stock.stock}</TableCell>
                                            <TableCell className="text-center">{stock.price}</TableCell>
                                            <TableCell className="text-center">{stock.change}</TableCell>
                                            <TableCell className="text-center">{stock.volume}</TableCell>
                                            <TableCell className="text-center">
                                                <Button variant="link" className="text-blue-500">
                                                    Add to Watchlist
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
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