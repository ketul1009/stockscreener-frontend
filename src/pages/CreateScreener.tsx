import { NavigationBar } from "@/components/NavigationBar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Trash2Icon, PlusIcon, SaveIcon, FilterIcon, SettingsIcon } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import axiosInstance from "@/lib/axios";
import { STOCK_UNIVERSE, RULE_CONDITIONS, RULE_VALUES, TECHNICAL_INDICATORS } from "@/constants/constants";
import { useParams, useNavigate } from "react-router-dom";

export default function CreateScreener() {
    const { id } = useParams();
    const navigate = useNavigate();
    const context = useApp();
    const [screenerName, setScreenerName] = useState("");
    const [selectedStockUniverse, setSelectedStockUniverse] = useState("");
    const [screenerRules, setScreenerRules] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (id) {
            setIsLoading(true);
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
            }).finally(() => {
                setIsLoading(false);
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
            return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-300";
        }
        return "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed";
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
            return (
                <div className="flex items-center justify-center py-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full">
                        <span className="font-semibold text-gray-700">{rule.condition}</span>
                        <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-gray-200" 
                            onClick={onRemove}
                        >
                            <Trash2Icon className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            );
        } else {
            return (
                <FilterRow 
                    rule={rule} 
                    onChange={(value) => {
                        let currentScreenerRules = [...screenerRules];
                        currentScreenerRules[index] = value;
                        setScreenerRules(currentScreenerRules);
                    }} 
                    onRemove={onRemove} 
                />
            );
        }
    }

    const saveScreener = async () => {
        setIsLoading(true);
        const screener = {
            user_id: context.userData.id,
            name: screenerName,
            stockUniverse: selectedStockUniverse,
            rules: screenerRules
        }
        await axiosInstance.post('/screeners', screener).then((res) => {
            if (res.status === 201) {
                context.showToast("Screener saved successfully", "success");
                navigate("/screener");
            } else {
                context.showToast("Failed to save screener", "error");
            }
        }).catch((err) => {
            context.showToast(`Failed to save screener: ${err.response.data.error}`, "error");
        }).finally(() => {
            setIsLoading(false);
        });
    }

    const updateScreener = async () => {
        setIsLoading(true);
        const screener = {
            id: parseInt(id || "0"),
            name: screenerName,
            user_id: context.userData.id,
            stock_universe: selectedStockUniverse,
            rules: screenerRules
        }
        await axiosInstance.put(`/screeners/${id}`, screener).then((res) => {
            if (res.status === 200) {
                context.showToast("Screener updated successfully", "success");
                navigate("/screener");
            } else {
                context.showToast("Failed to update screener", "error");
            }
        }).catch((err) => {
            context.showToast(`Failed to update screener: ${err.response.data.error}`, "error");
        }).finally(() => {
            setIsLoading(false);
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <NavigationBar />
            
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <FilterIcon className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            {id ? "Edit Screener" : "Create New Screener"}
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Build powerful stock screeners with custom filters and conditions. 
                            Define your criteria and discover stocks that match your investment strategy.
                        </p>
                    </div>

                    {/* Main Form Card */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <SettingsIcon className="w-5 h-5" />
                                Screener Configuration
                            </CardTitle>
                            <CardDescription>
                                Configure the basic settings for your stock screener
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Screener Name */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Screener Name</Label>
                                    <Input
                                        placeholder="Enter screener name"
                                        maxLength={20}
                                        value={screenerName}
                                        onChange={(e) => setScreenerName(e.target.value)}
                                        className="w-full"
                                    />
                                </div>
                                
                                {/* Stock Universe */}
                                <div className="space-y-2">
                                    <Label className="text-sm font-medium text-gray-700">Stock Universe</Label>
                                    <Select value={selectedStockUniverse} onValueChange={(value) => setSelectedStockUniverse(value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select stock universe" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {STOCK_UNIVERSE.map((stock) => (
                                                <SelectItem key={stock.value} value={stock.value}>
                                                    {stock.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Rules Section */}
                    <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mb-8">
                        <CardHeader className="pb-6">
                            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                <FilterIcon className="w-5 h-5" />
                                Screening Rules
                            </CardTitle>
                            <CardDescription>
                                Define the filtering criteria for your screener
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Rules List */}
                            <div className="space-y-4">
                                {screenerRules.map((rule, index) => (
                                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                                        {handleRuleRowRender(rule, index, () => handleRemoveRuleClick(index))}
                                    </div>
                                ))}
                            </div>

                            {/* Add Rule Buttons */}
                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                <Button 
                                    onClick={handleAddRuleClick}
                                    className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                    <PlusIcon className="w-4 h-4 mr-2" />
                                    Add Filter Rule
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className={conditionButtonClassName()}
                                    onClick={() => handleConditionClick("AND")}
                                    disabled={!conditionButtonValidation()}
                                >
                                    AND
                                </Button>
                                <Button 
                                    variant="outline" 
                                    className={conditionButtonClassName()}
                                    onClick={() => handleConditionClick("OR")}
                                    disabled={!conditionButtonValidation()}
                                >
                                    OR
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <div className="flex justify-center gap-4">
                        <Button 
                            variant="outline" 
                            onClick={() => navigate("/screener")}
                            className="px-8 py-3"
                        >
                            Cancel
                        </Button>
                        <Button 
                            onClick={handleSaveScreenerClick}
                            disabled={isLoading || !screenerName || !selectedStockUniverse}
                            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white"
                        >
                            <SaveIcon className="w-4 h-4 mr-2" />
                            {isLoading ? "Saving..." : (id ? "Update Screener" : "Save Screener")}
                        </Button>
                    </div>

                    {/* Results Preview */}
                    {screenerRules.length > 0 && (
                        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm mt-8">
                            <CardHeader className="pb-6">
                                <CardTitle className="text-xl font-semibold text-gray-900">
                                    Results Preview
                                </CardTitle>
                                <CardDescription>
                                    Preview of your screener configuration
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm text-gray-600">
                                        Screener: <span className="font-medium">{screenerName || "Untitled"}</span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Universe: <span className="font-medium">{selectedStockUniverse || "Not selected"}</span>
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Rules: <span className="font-medium">{screenerRules.length}</span>
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}

const FilterRow = ({ rule, onChange, onRemove }: { rule: any, onChange: (value: object) => void, onRemove: () => void }) => {
    const [currentRule, setCurrentRule] = useState<any>(rule);

    useEffect(() => {
        setCurrentRule(JSON.parse(JSON.stringify(rule)));
    }, [JSON.stringify(rule)]);

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 flex-wrap">
                {/* Technical Indicator */}
                <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Indicator</Label>
                    <Select 
                        onValueChange={(value) => {
                            setCurrentRule({...currentRule, technicalIndicator: value});
                            onChange({...currentRule, technicalIndicator: value});
                        }}
                        defaultValue={currentRule.technicalIndicator}
                    >
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select indicator" />
                        </SelectTrigger>
                        <SelectContent>
                            {TECHNICAL_INDICATORS.map((technicalIndicator) => (
                                <SelectItem key={technicalIndicator.value} value={technicalIndicator.value}>
                                    {technicalIndicator.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Condition */}
                {currentRule.technicalIndicator && (
                    <div className="space-y-1">
                        <Label className="text-xs text-gray-500">Condition</Label>
                        <Select 
                            onValueChange={(value) => {
                                setCurrentRule({...currentRule, condition: value});
                                onChange({...currentRule, condition: value});
                            }}
                            defaultValue={currentRule.condition}
                        >
                            <SelectTrigger className="w-32">
                                <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                                {RULE_CONDITIONS.map((ruleCondition) => (
                                    <SelectItem key={ruleCondition.value} value={ruleCondition.value}>
                                        {ruleCondition.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}

                {/* Comparison Type and Value */}
                {currentRule.technicalIndicator && currentRule.condition && (
                    <div className="flex items-end gap-2">
                        <div className="space-y-1">
                            <Label className="text-xs text-gray-500">Type</Label>
                            <Select 
                                onValueChange={(value) => {
                                    setCurrentRule({...currentRule, comparisonType: value, comparisonValue: ""});
                                    onChange({...currentRule, comparisonType: value, comparisonValue: ""});
                                }}
                                defaultValue={currentRule.comparisonType}
                            >
                                <SelectTrigger className="w-24">
                                    <SelectValue placeholder="" />
                                </SelectTrigger>
                                <SelectContent>
                                    {RULE_VALUES.map((ruleValue) => (
                                        <SelectItem key={ruleValue.value} value={ruleValue.value}>
                                            {ruleValue.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        
                        <ComparisonInput 
                            comparisonType={currentRule.comparisonType} 
                            comparisonValue={currentRule.comparisonValue} 
                            onChange={(value) => {
                                setCurrentRule({...currentRule, comparisonValue: value});
                                onChange({...currentRule, comparisonValue: value});
                            }} 
                        />
                    </div>
                )}
            </div>

            {/* Remove Button */}
            <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0 hover:bg-red-100 text-red-600" 
                onClick={onRemove}
            >
                <Trash2Icon className="h-4 w-4" />
            </Button>
        </div>
    );
}

const ComparisonInput = ({ comparisonType, comparisonValue, onChange }: { comparisonType: string, comparisonValue: string, onChange: (value: string) => void }) => {
    switch (comparisonType) {
        case "number":
            return (
                <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Value</Label>
                    <Input 
                        placeholder="Enter value" 
                        className="w-24" 
                        value={comparisonValue} 
                        onChange={(e) => onChange(e.target.value)} 
                    />
                </div>
            );
        case "percentage":
            return (
                <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Value</Label>
                    <Input 
                        placeholder="Enter %" 
                        className="w-24" 
                        value={comparisonValue} 
                        onChange={(e) => onChange(e.target.value)} 
                    />
                </div>
            );
        case "indicator":
            return (
                <div className="space-y-1">
                    <Label className="text-xs text-gray-500">Indicator</Label>
                    <Select onValueChange={(value) => onChange(value)} defaultValue={comparisonValue}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Select indicator" />
                        </SelectTrigger>
                        <SelectContent>
                            {TECHNICAL_INDICATORS.map((technicalIndicator) => (
                                <SelectItem key={technicalIndicator.value} value={technicalIndicator.value}>
                                    {technicalIndicator.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            );
        default:
            return null;
    }
}
