import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Brain, CheckCircle2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Generating Loading Overlay
 * Full-screen loading animation shown when generating sprint plan
 */
export function GeneratingLoadingOverlay({ isVisible, currentStep = 0, steps = [] }) {
    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-600 to-primary-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute inset-0" style={{
                            backgroundImage: `radial-gradient(circle at 25px 25px, white 2px, transparent 0)`,
                            backgroundSize: '50px 50px',
                        }} />
                    </div>

                    {/* Content */}
                    <div className="relative text-center text-white z-10 px-8 max-w-md">
                        {/* Animated brain icon */}
                        <motion.div
                            className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full"
                            animate={{
                                scale: [1, 1.05, 1],
                                rotate: [0, 5, -5, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Brain className="w-12 h-12 text-white" />
                        </motion.div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold mb-8">
                            Generating Sprint Plan
                        </h2>

                        {/* Steps list */}
                        <div className="space-y-3 text-left">
                            {steps.map((step, index) => {
                                const isCompleted = index < currentStep;
                                const isCurrent = index === currentStep;

                                return (
                                    <motion.div
                                        key={step.id}
                                        className={cn(
                                            "flex items-center gap-3 p-3 rounded-lg transition-all",
                                            isCompleted ? "bg-white/20" : isCurrent ? "bg-white/10" : "opacity-50"
                                        )}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <div className={cn(
                                            "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                                            isCompleted ? "bg-white" : isCurrent ? "bg-white/30" : "bg-white/10"
                                        )}>
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-4 h-4 text-primary-600" />
                                            ) : isCurrent ? (
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                >
                                                    <Sparkles className="w-4 h-4 text-white" />
                                                </motion.div>
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-white/30" />
                                            )}
                                        </div>
                                        <div>
                                            <p className={cn(
                                                "font-medium text-sm",
                                                isCompleted || isCurrent ? "text-white" : "text-white/60"
                                            )}>
                                                {step.title}
                                            </p>
                                            <p className={cn(
                                                "text-xs",
                                                isCompleted || isCurrent ? "text-white/80" : "text-white/40"
                                            )}>
                                                {step.description}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Progress indicator */}
                        <div className="mt-8">
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default GeneratingLoadingOverlay;
