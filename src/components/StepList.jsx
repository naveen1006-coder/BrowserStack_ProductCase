import { motion } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Step List Component
 * Animated step indicator with scanning animation during plan generation
 */
export function StepList({
    steps,
    currentStep = 0,
    isScanning = false,
    className = "",
}) {
    return (
        <div
            className={cn("space-y-3", className)}
            role="list"
            aria-label="Generation progress"
        >
            {steps.map((step, index) => {
                const isComplete = index < currentStep;
                const isCurrent = index === currentStep;
                const isPending = index > currentStep;

                return (
                    <motion.div
                        key={step.id || index}
                        className={cn(
                            "flex items-center gap-3 p-3 rounded-lg transition-colors",
                            isComplete && "bg-success-50",
                            isCurrent && isScanning && "bg-primary-50",
                            isPending && "bg-neutral-50"
                        )}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        role="listitem"
                        aria-current={isCurrent ? "step" : undefined}
                    >
                        {/* Step indicator */}
                        <div
                            className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                                isComplete && "bg-success-500 text-white",
                                isCurrent && isScanning && "bg-primary-500 text-white",
                                isCurrent && !isScanning && "bg-primary-100 text-primary-600",
                                isPending && "bg-neutral-200 text-neutral-400"
                            )}
                        >
                            {isComplete ? (
                                <Check className="w-4 h-4" />
                            ) : isCurrent && isScanning ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <span className="text-sm font-medium">{index + 1}</span>
                            )}
                        </div>

                        {/* Step content */}
                        <div className="flex-1 min-w-0">
                            <p
                                className={cn(
                                    "font-medium",
                                    isComplete && "text-success-700",
                                    isCurrent && "text-primary-700",
                                    isPending && "text-neutral-400"
                                )}
                            >
                                {step.title}
                            </p>
                            {step.description && (
                                <p className="text-sm text-neutral-500 truncate">
                                    {step.description}
                                </p>
                            )}
                        </div>

                        {/* Scanning animation */}
                        {isCurrent && isScanning && (
                            <motion.div
                                className="w-2 h-2 rounded-full bg-primary-500"
                                animate={{
                                    opacity: [0.4, 1, 0.4],
                                    scale: [0.8, 1.2, 0.8],
                                }}
                                transition={{
                                    duration: 1.5,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                }}
                            />
                        )}
                    </motion.div>
                );
            })}
        </div>
    );
}

export default StepList;
