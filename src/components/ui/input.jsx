import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-lg !border-neutral-300 !bg-white border px-3 py-2 text-sm !text-neutral-900 !placeholder:text-neutral-400 focus:!border-primary-500 focus:outline-none focus:ring-2 focus:!ring-primary-100 disabled:cursor-not-allowed disabled:opacity-50",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

export { Input }
