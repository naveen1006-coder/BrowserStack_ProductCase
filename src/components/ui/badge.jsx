import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors",
    {
        variants: {
            variant: {
                default: "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300",
                secondary: "bg-neutral-100 text-neutral-700 dark:bg-slate-700 dark:text-slate-300",
                success: "bg-success-50 text-success-600 dark:bg-success-500/20 dark:text-success-500",
                warning: "bg-warning-50 text-warning-600 dark:bg-warning-500/20 dark:text-warning-500",
                danger: "bg-danger-50 text-danger-600 dark:bg-danger-500/20 dark:text-danger-500",
                outline: "border border-current bg-transparent",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

function Badge({ className, variant, ...props }) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
