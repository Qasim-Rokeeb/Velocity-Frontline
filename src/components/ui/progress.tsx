"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { children?: React.ReactNode }
>(({ className, value, children, ...props }, ref) => {
    // If custom children are provided, we render them instead of the default indicator.
    if (children) {
        return (
            <ProgressPrimitive.Root
                ref={ref}
                className={cn(
                "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
                className
                )}
                {...props}
            >
                {children}
            </ProgressPrimitive.Root>
        )
    }

    return (
        <ProgressPrimitive.Root
            ref={ref}
            className={cn(
                "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
                className
            )}
            {...props}
        >
            <ProgressPrimitive.Indicator
            className="h-full w-full flex-1 bg-gradient-to-r from-primary to-primary/50 bg-[length:200%_100%] animate-progress-gradient transition-all"
            style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
            />
        </ProgressPrimitive.Root>
    )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
