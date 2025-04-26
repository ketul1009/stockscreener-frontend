import { cn } from "@/lib/utils"
import { ReactNode } from "react"

interface PageLayoutProps {
    children: ReactNode
    title?: string
    description?: string
    align?: "left" | "center" | "right"
    className?: string
    navigationBar?: ReactNode
    header?: ReactNode
    footer?: ReactNode
    maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full"
    padding?: "none" | "sm" | "md" | "lg"
    background?: "default" | "muted" | "gradient"
}

const maxWidthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full"
}

const paddingClasses = {
    none: "p-0",
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
}

const backgroundClasses = {
    default: "bg-background",
    muted: "bg-muted",
    gradient: "bg-gradient-to-b from-background to-muted"
}

export function PageLayout({
    children,
    title,
    description,
    align = "left",
    className,
    navigationBar,
    header,
    footer,
    maxWidth = "lg",
    padding = "md",
    background = "default"
}: PageLayoutProps) {
    const alignClass = align === "center" ? "items-center" : align === "right" ? "items-end" : "items-start"
    const containerClass = cn(
        "flex flex-col min-h-screen w-full",
        alignClass,
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        backgroundClasses[background],
        className
    )

    return (
        <div className="flex flex-col min-h-screen w-full">
            {navigationBar && <div className="w-full">{navigationBar}</div>}
            <div className={containerClass}>
                {header && <div className="w-full">{header}</div>}
                <main className="flex-1 w-full">
                    {title && <h1 className="text-2xl font-bold mb-2">{title}</h1>}
                    {description && <p className="text-sm text-muted-foreground mb-6">{description}</p>}
                    {children}
                </main>
                {footer && <div className="w-full">{footer}</div>}
            </div>
        </div>
    )
}