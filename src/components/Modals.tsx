import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { DialogFooter, DialogHeader } from "./ui/dialog";
import { ReactNode, useState } from "react";
import { Button } from "./ui/button";

interface ActionButtonProps {
    onClick: () => void;
    text: string;
    variant: "default" | "outline" | "secondary" | "ghost" | "link";
}

interface BaseActionModalProps {
    title: string;
    content: ReactNode;
    actionButton: ActionButtonProps;
    secondaryButton: ActionButtonProps;
}

export default function BaseActionModal({ title, content, actionButton, secondaryButton }: BaseActionModalProps) {

    const [isOpen, setIsOpen] = useState(false)
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>{content}</DialogDescription>
            </DialogContent>
            <DialogFooter>
                <Button onClick={secondaryButton.onClick} variant={secondaryButton.variant}>{secondaryButton.text}</Button>
                <Button onClick={actionButton.onClick} variant={actionButton.variant}>{actionButton.text}</Button>
            </DialogFooter>
        </Dialog>
    )
}   
