import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Launch Loading Overlay
 * Full-screen loading animation shown during sprint launch
 */
export function LaunchLoadingOverlay({ isVisible, progress = 0, stage = 'preparing' }) {
    const stages = [
        { key: 'preparing', label: 'Preparing sprint...', icon: Zap },
        { key: 'syncing', label: 'Syncing with backlog...', icon: Zap },
        { key: 'launching', label: 'Launching sprint...', icon: Rocket },
        { key: 'complete', label: 'Sprint launched!', icon: Check },
    ];

    const currentStageIndex = stages.findIndex(s => s.key === stage);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-primary-600"
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
                    <div className="relative text-center text-white z-10">
                        {/* Animated rocket */}
                        <motion.div
                            className="mb-8 inline-flex items-center justify-center w-24 h-24 bg-white/20 rounded-full"
                            animate={{
                                scale: [1, 1.1, 1],
                                y: stage === 'launching' || stage === 'complete' ? [0, -10, 0] : 0,
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        >
                            <Rocket className={cn(
                                "w-12 h-12",
                                stage === 'complete' ? 'text-green-300' : 'text-white'
                            )} />
                        </motion.div>

                        {/* Stage indicator */}
                        <motion.h2
                            key={stage}
                            className="text-2xl font-bold mb-4"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {stages.find(s => s.key === stage)?.label || 'Loading...'}
                        </motion.h2>

                        {/* Progress steps */}
                        <div className="flex items-center justify-center gap-3 mb-8">
                            {stages.map((s, index) => (
                                <motion.div
                                    key={s.key}
                                    className={cn(
                                        "w-3 h-3 rounded-full",
                                        index <= currentStageIndex ? 'bg-white' : 'bg-white/30'
                                    )}
                                    initial={{ scale: 0.8 }}
                                    animate={{
                                        scale: index === currentStageIndex ? [1, 1.3, 1] : 1
                                    }}
                                    transition={{
                                        duration: 0.8,
                                        repeat: index === currentStageIndex ? Infinity : 0
                                    }}
                                />
                            ))}
                        </div>

                        {/* Progress bar */}
                        <div className="w-64 mx-auto">
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-white rounded-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.5, ease: "easeOut" }}
                                />
                            </div>
                            <p className="text-sm text-white/70 mt-2">{progress}% complete</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default LaunchLoadingOverlay;
