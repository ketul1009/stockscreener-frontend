import { NavigationBar } from "@/components/NavigationBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { PlusIcon } from "lucide-react";

const stockUniverse = [
    {
        value: "all",
        label: "All"
    },
    {
        value: "nifty50",
        label: "Nifty 50"
    },
    {
        value: "nifty100",
        label: "Nifty 100"
    },
    {
        value: "sensex30",
        label: "SENSEX 30"
    }
]

const technicalIndicators = [
    {
        value: "rsi",
        label: "RSI"
    },
    {
        value: "macd",
        label: "MACD"
    },
    {
        value: "bollinger_bands",
        label: "Bollinger Bands"
    }
]

const ruleConditions = [
    {
        value: "greater_than",
        label: "Greater Than"
    },
    {
        value: "less_than",
        label: "Less Than"
    },
    {
        value: "equal_to",
        label: "Equal To"
    }
]

const ruleValues = [
    {
        value: "number",
        label: "Number"
    },
    {
        value: "percentage",
        label: "Percentage"
    },
    {
        value: "indicator",
        label: "Indicator"
    }
    
]

const defaultRule = {
    type: "filter",
    technicalIndicator: "",
    comparisonType: "",
    comparisonValue: ""
}

export default function CreateScreener() {

    const [screenerName, setScreenerName] = useState("");
    const [selectedStockUniverse, setSelectedStockUniverse] = useState("");
    const [andOr, setAndOr] = useState("");
    const [screenerRules, setScreenerRules] = useState<any[]>([defaultRule]);

    const conditionButtonValidation = () => {
        if (screenerRules.length > 0) {
            return screenerRules[screenerRules.length - 1].type === "filter";
        }
        return false;
    }

    const conditionButtonClassName = () => {
        if (conditionButtonValidation()) {
            return "";
        }
        return "bg-gray-300 text-gray-800 hover:bg-gray-300";
    }

    const handleConditionClick = (condition: string) => {
        if (!conditionButtonValidation()) {
            return;
        }
        if (condition === "AND") {
            setScreenerRules([
                ...screenerRules, {type: "condition", condition: "AND"},
                {type: "filter", technicalIndicator: "", comparisonType: "", comparisonValue: ""}
            ]);
            console.log("Added rule");
        } else {
            setScreenerRules([
                ...screenerRules, {type: "condition", condition: "OR"},
                {type: "filter", technicalIndicator: "", comparisonType: "", comparisonValue: ""}
            ]);
            console.log("Added rule");
        }
    }

    return (
        <div>
            <NavigationBar />
            <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col justify-center items-center mt-10 mb-10 w-full">
                    <h1 className="text-2xl font-bold">Create Screener</h1>
                    <div className="flex flex-col justify-center items-center bg-gray-100 p-10 rounded-lg gap-4 w-full">
                        <div className="flex flex-row justify-center items-center w-72">
                            <Label className="w-full">Screener Name</Label>
                            <Input placeholder="Screener Name" maxLength={20} />
                        </div>
                        <div className="flex flex-row justify-center items-center w-72">
                            <Label className="w-full">Stock Universe</Label>
                            <div className="w-full">
                                <Select>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {stockUniverse.map((stock) => (
                                        <SelectItem value={stock.value}>{stock.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    
                                </Select>
                            </div>
                        </div>
                        <div className="flex flex-row justify-center items-center w-72">
                            <Label className="w-full">Stock Universe</Label>
                            <Input placeholder="Stock Universe" />
                        </div>
                        {FilterRow({ rule: screenerRules[0], onChange: (value: object) => {
                            let newRule = {...value, type: "filter"};
                            const screenerRule = [newRule];
                            setScreenerRules(screenerRule);
                        }})}
                        {screenerRules.slice(1).map((rule, index) => (
                            rule.type === "condition" ? <div>{rule.condition}</div> : <FilterRow rule={rule} onChange={(value: object) => {
                                let newRule = {...value, type: "filter"};
                                const screenerRule = [...screenerRules];
                                screenerRule[index] = newRule;
                                setScreenerRules(screenerRule);
                            }} />
                        ))}
                        <div className="flex flex-row justify-center items-center w-72 gap-4">
                            <Button variant="outline">Add Rule</Button>
                            <Button variant="outline" className={`${conditionButtonClassName()} text-xs`} onClick={() => handleConditionClick("AND")}>AND</Button>
                            <Button variant="outline" className={`${conditionButtonClassName()} text-xs`} onClick={() => handleConditionClick("OR")}>OR</Button>
                        </div>
                        <div className="flex flex-row justify-center items-center w-72 gap-4 mt-5">
                            <Button variant="outline">Save Screener</Button>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col justify-center items-center mt-10 mb-10">
                    <div className="flex flex-col justify-center items-center">
                        <h1 className="text-2xl font-bold">Results</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

const FilterRow = ({ rule, onChange }: { rule: any, onChange: (value: object) => void }) => {
    const [currentRule, setCurrentRule] = useState<any>(rule);

    return (
        <div className="flex flex-row justify-center items-center">
            <div className="flex flex-row gap-4 justify-center items-center">
                <Select onValueChange={(value) => {
                    setCurrentRule({...currentRule, technicalIndicator: value});
                    onChange({...currentRule, technicalIndicator: value});
                }}>
                    <SelectTrigger className="">
                        <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                        {technicalIndicators.map((technicalIndicator) => (
                            <SelectItem value={technicalIndicator.value}>{technicalIndicator.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {currentRule.technicalIndicator &&
                <div className="flex flex-row gap-4 justify-center items-center">
                    <Select onValueChange={(value) => {
                        setCurrentRule({...currentRule, comparisonType: value});
                        onChange({...currentRule, comparisonType: value});
                    }}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                            {ruleConditions.map((ruleCondition) => (
                                <SelectItem value={ruleCondition.value}>{ruleCondition.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-row">
                        <Select onValueChange={(value) => {
                            setCurrentRule({...currentRule, comparisonType: value});
                            onChange({...currentRule, comparisonType: value});
                        }}>
                            <SelectTrigger className="">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {ruleValues.map((ruleValue) => (
                                    <SelectItem value={ruleValue.value}>{ruleValue.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {<ComparisonInput comparisonType={currentRule.comparisonType} onChange={(value) => {
                            setCurrentRule({...currentRule, comparisonValue: value});
                            onChange({...currentRule, comparisonValue: value});
                        }} />}
                    </div>
                </div>
                }
            </div>
        </div>
    )
}

const ComparisonInput = ({ comparisonType, onChange }: { comparisonType: string, onChange: (value: string) => void }) => {

    switch (comparisonType) {
        case "number":
            return <Input placeholder="Rule Value" className="w-24" onChange={(e) => onChange(e.target.value)} />
        case "percentage":
            return <Input placeholder="Rule Value" className="w-24" onChange={(e) => onChange(e.target.value)} />
        case "indicator":
            return (
                <div>
                    <Select onValueChange={(value) => onChange(value)}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                            {technicalIndicators.map((technicalIndicator) => (
                                <SelectItem value={technicalIndicator.value}>{technicalIndicator.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )
        default:
            return null;
    }
}
