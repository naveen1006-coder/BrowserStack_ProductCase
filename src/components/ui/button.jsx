import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700",
                secondary: "bg-neutral-100 text-neutral-900 hover:bg-neutral-200 active:bg-neutral-300 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700",
                outline: "border-2 border-primary-500 text-primary-500 hover:bg-primary-50 bg-transparent dark:hover:bg-primary-900/30",
                ghost: "hover:bg-neutral-100 text-neutral-700 dark:text-slate-300 dark:hover:bg-slate-800",
                danger: "bg-danger-500 text-white hover:bg-danger-600",
                success: "bg-success-500 text-white hover:bg-success-600",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 px-3 text-xs",
                lg: "h-12 px-6 text-base",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
