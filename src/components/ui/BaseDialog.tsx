import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "./button";

interface BaseDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    children?: React.ReactNode;
    content?: React.ReactNode;
    description?: string;
    primaryAction?: {
        label: string;
        onClick: () => void;
    }
}

export default function BaseDialog({open, onOpenChange, title, content, description, primaryAction}: BaseDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {content}
                {primaryAction && 
                <Button onClick={primaryAction.onClick}>{primaryAction.label}</Button>}
            </DialogContent>
        </Dialog>
    )
}
