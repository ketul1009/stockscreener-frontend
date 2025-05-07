import { ActionButton } from "@/constants/constants";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

export default function ModalButton({ text, onClick, variant, disabled, loading, type, size, className, icon, children }: ActionButton) {
    return (
        loading ? (
            <Button
                disabled={true}
                variant={variant}
                type={type}
                size={size as "default" | "sm" | "lg" | "icon" | null}
                className={className}
            >
                <Loader2 className="h-4 w-4 animate-spin" />
                {text}
            </Button>
        ) :
        <Button
            onClick={onClick}
            variant={variant}
            disabled={disabled}
            type={type}
            size={size as "default" | "sm" | "lg" | "icon" | null}
            className={className}
        >   
            {icon}
            {text || children}
        </Button>
    )
}
