import axiosInstance from "@/lib/axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { NavigationBar } from "@/components/NavigationBar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ViewScreener() {
    const { id } = useParams();
    const [screener, setScreener] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    
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
                    <div className="flex flex-col items-center mx-10 my-10">
                        <h1>Rules</h1>
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