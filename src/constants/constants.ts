export const BASE_URL = "http://localhost:8080";

export const API_KEY = "your_api_key_here";

export const API_URL = `${BASE_URL}/v1`;

export const STOCK_UNIVERSE = [
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

export const RULE_CONDITIONS = ruleConditions;
export const RULE_VALUES = ruleValues;
export const TECHNICAL_INDICATORS = technicalIndicators;

export interface ActionButton {
    text?: string;
    variant?: "default" | "outline" | "secondary" | "ghost" | "link";
    onClick?: () => void;
    disabled?: boolean;
    loading?: boolean;
    type?: "button" | "submit" | "reset";
    size?: "sm" | "md" | "lg";
    className?: string;
    icon?: React.ReactNode;
    children?: React.ReactNode;
}
