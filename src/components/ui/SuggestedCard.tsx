import { Plus } from "lucide-react";
import { ArrowRight } from "lucide-react";
import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { cn } from "@/lib/utils";

interface SuggestedCardProps {
    className?: string;
    title: string;
    description: string;
    content: string;
    onAddButton: {
        onClick: () => void;
        title: string;
    };
    onViewButton: {
        onClick: () => void;
        title: string;
    };
}

export default function SuggestedCard({ title, description, content, onAddButton, onViewButton, className }: SuggestedCardProps) {
    return (
        <Card className={cn("w-72 m-4 h-72", className)}>
            <CardHeader>
                <CardTitle>
                    {title}
                </CardTitle>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <span>
                    {content}
                </span>
            </CardContent>
            <CardFooter className="flex flex-col justify-start items-start gap-2">
                <Button variant="outline" onClick={onAddButton.onClick}>
                    <Plus />
                    {onAddButton.title}
                </Button>
                <Button variant="outline" onClick={onViewButton.onClick}>
                    <ArrowRight />
                    {onViewButton.title}
                </Button>
            </CardFooter>
        </Card>
    )
}
