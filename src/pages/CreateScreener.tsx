import { NavigationBar } from "@/components/NavigationBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Trash2Icon } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import axiosInstance from "@/lib/axios";
import { STOCK_UNIVERSE, RULE_CONDITIONS, RULE_VALUES, TECHNICAL_INDICATORS } from "@/constants/constants";
import { useParams } from "react-router-dom";

export default function CreateScreener() {
    const { id } = useParams();
    const context = useApp();
    const [screenerName, setScreenerName] = useState("");
    const [selectedStockUniverse, setSelectedStockUniverse] = useState("");
    const [screenerRules, setScreenerRules] = useState<any[]>([]);

    useEffect(() => {
        if (id) {
            axiosInstance.get(`/screeners`, {
                params: {
                    id: id
                }
            }).then((res) => {
                const screenerData = res.data;
                setScreenerName(screenerData.name);
                setSelectedStockUniverse(screenerData.stock_universe);
                setScreenerRules(screenerData.rules);
            }).catch((err) => {
                context.showToast(`Failed to fetch screener: ${err.response?.data?.error || 'Unknown error'}`, "error");
            });
        }
    }, [id]);

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
            let currentScreenerRules = [...screenerRules];
            currentScreenerRules.push({type: "condition", condition: "AND"});
            setScreenerRules(currentScreenerRules);
        } else {
            let currentScreenerRules = [...screenerRules];
            currentScreenerRules.push({type: "condition", condition: "OR"});
            setScreenerRules(currentScreenerRules);
        }
    }

    const handleAddRuleClick = () => {
        let currentScreenerRules = [...screenerRules];
        currentScreenerRules.push({type: "filter", technicalIndicator: "", comparisonType: "", comparisonValue: ""});
        setScreenerRules(currentScreenerRules);
    }

    const handleRuleRowRender = (rule: any, index: number, onRemove: () => void) => {
        if (rule.type === "condition") {
            return <div className="flex flex-row justify-center items-center gap-4">
                {rule.condition}
                <Button variant="outline" className="bg-transparent hover:bg-transparent border-none shadow-none" onClick={onRemove}><Trash2Icon /></Button>
            </div>
        } else {
            return <FilterRow rule={rule} onChange={(value) => {
                let currentScreenerRules = [...screenerRules];
                currentScreenerRules[index] = value;
                setScreenerRules(currentScreenerRules);
            }} onRemove={onRemove} />
        }
    }

    const saveScreener = async () => {
        const screener = {
            username: context.userData.username,
            name: screenerName,
            stockUniverse: selectedStockUniverse,
            rules: screenerRules
        }
        await axiosInstance.post('/screeners', screener).then((res) => {
            if (res.status === 201) {
                context.showToast("Screener saved successfully", "success");
            } else {
                context.showToast("Failed to save screener", "error");
            }
        }).catch((err) => {
            context.showToast(`Failed to save screener: ${err.response.data.error}`, "error");
        });
    }

    const updateScreener = async () => {
        const screener = {
            id: parseInt(id || "0"),
            name: screenerName,
            username: context.userData.username,
            stock_universe: selectedStockUniverse,
            rules: screenerRules
        }
        await axiosInstance.put(`/screeners/${id}`, screener).then((res) => {
            if (res.status === 200) {
                context.showToast("Screener updated successfully", "success");
            } else {
                context.showToast("Failed to update screener", "error");
            }
        }).catch((err) => {
            context.showToast(`Failed to update screener: ${err.response.data.error}`, "error");
        });
    }

    const handleSaveScreenerClick = () => {
        if (validateScreenerRules()) {
            if (id) {
                updateScreener();
            } else {
                saveScreener();
            }
        } else {
            context.showToast("Please add at least one rule and make sure the last rule is a filter", "error");
        }
    }

    const validateScreenerRules = () => {
        if (screenerRules.length === 0) {
            return false;
        }
        return screenerRules.every((rule) => {
            if (rule.type === "condition") {
                return rule.condition === "AND" || rule.condition === "OR";
            } else {
                return rule.technicalIndicator && rule.comparisonType && rule.comparisonValue;
            }
        }) && screenerRules[screenerRules.length - 1].type === "filter";
    }

    const handleRemoveRuleClick = (index: number) => {
        let currentScreenerRules = JSON.parse(JSON.stringify(screenerRules));
        currentScreenerRules.splice(index, 1);
        setScreenerRules(currentScreenerRules);
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
                            <Input
                                placeholder="Screener Name"
                                maxLength={20}
                                value={screenerName}
                                onChange={(e) => setScreenerName(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-row justify-center items-center w-72">
                            <Label className="w-full">Stock Universe</Label>
                            <div className="w-full">
                                <Select value={selectedStockUniverse} onValueChange={(value) => setSelectedStockUniverse(value)}>
                                    <SelectTrigger className="w-[100px]">
                                        <SelectValue placeholder="" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {STOCK_UNIVERSE.map((stock) => (
                                        <SelectItem value={stock.value}>{stock.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                    
                                </Select>
                            </div>
                        </div>
                        {screenerRules.map((rule, index) => (
                            handleRuleRowRender(rule, index, () => handleRemoveRuleClick(index))
                        ))}
                        <div className="flex flex-row justify-center items-center w-72 gap-4">
                            <Button variant="outline" onClick={handleAddRuleClick}>Add Rule</Button>
                            <Button variant="outline" className={`${conditionButtonClassName()} text-xs`} onClick={() => handleConditionClick("AND")}>AND</Button>
                            <Button variant="outline" className={`${conditionButtonClassName()} text-xs`} onClick={() => handleConditionClick("OR")}>OR</Button>
                        </div>
                        <div className="flex flex-row justify-center items-center w-72 gap-4 mt-5">
                            <Button variant="outline" onClick={handleSaveScreenerClick}>Save Screener</Button>
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

const FilterRow = ({ rule, onChange, onRemove }: { rule: any, onChange: (value: object) => void, onRemove: () => void }) => {
    const [currentRule, setCurrentRule] = useState<any>(rule);

    useEffect(() => {
        setCurrentRule(JSON.parse(JSON.stringify(rule)));
    }, [JSON.stringify(rule)]);

    return (
        <div className="flex flex-row justify-center items-center">
            <div className="flex flex-row gap-4 justify-center items-center">
                <Select onValueChange={(value) => {
                    setCurrentRule({...currentRule, technicalIndicator: value});
                    onChange({...currentRule, technicalIndicator: value});
                }}
                defaultValue={currentRule.technicalIndicator}
                >
                    <SelectTrigger className="">
                        <SelectValue placeholder="" />
                    </SelectTrigger>
                    <SelectContent>
                        {TECHNICAL_INDICATORS.map((technicalIndicator) => (
                            <SelectItem value={technicalIndicator.value}>{technicalIndicator.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {currentRule.technicalIndicator &&
                <div className="flex flex-row gap-4 justify-center items-center">
                    <Select onValueChange={(value) => {
                        setCurrentRule({...currentRule, condition: value});
                        onChange({...currentRule, condition: value});
                    }}
                    defaultValue={currentRule.condition}
                    >
                        <SelectTrigger className="">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                            {RULE_CONDITIONS.map((ruleCondition) => (
                                <SelectItem value={ruleCondition.value}>{ruleCondition.label}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <div className="flex flex-row">
                        <Select onValueChange={(value) => {
                            setCurrentRule({...currentRule, comparisonType: value, comparisonValue: ""});
                            onChange({...currentRule, comparisonType: value, comparisonValue: ""});
                        }}
                        defaultValue={currentRule.comparisonType}
                        >
                            <SelectTrigger className="">
                                <SelectValue placeholder="" />
                            </SelectTrigger>
                            <SelectContent>
                                {RULE_VALUES.map((ruleValue) => (
                                    <SelectItem value={ruleValue.value}>{ruleValue.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {<ComparisonInput comparisonType={currentRule.comparisonType} comparisonValue={currentRule.comparisonValue} onChange={(value) => {
                            setCurrentRule({...currentRule, comparisonValue: value});
                            onChange({...currentRule, comparisonValue: value});
                        }} />}
                    </div>
                </div>
                }
                <Button variant="outline" className="bg-transparent hover:bg-transparent border-none shadow-none" onClick={onRemove}><Trash2Icon /></Button>
            </div>
        </div>
    )
}

const ComparisonInput = ({ comparisonType, comparisonValue, onChange }: { comparisonType: string, comparisonValue: string, onChange: (value: string) => void }) => {

    switch (comparisonType) {
        case "number":
            return <Input placeholder="Rule Value" className="w-24" value={comparisonValue} onChange={(e) => onChange(e.target.value)} />
        case "percentage":
            return <Input placeholder="Rule Value" className="w-24" value={comparisonValue} onChange={(e) => onChange(e.target.value)} />
        case "indicator":
            return (
                <div>
                    <Select onValueChange={(value) => onChange(value)} defaultValue={comparisonValue}>
                        <SelectTrigger className="">
                            <SelectValue placeholder="" />
                        </SelectTrigger>
                        <SelectContent>
                            {TECHNICAL_INDICATORS.map((technicalIndicator) => (
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
