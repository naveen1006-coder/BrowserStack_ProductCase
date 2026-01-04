import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronUp,
    ChevronDown,
    Filter,
    Terminal,
    AlertCircle,
    Bot,
    User,
    Trash2,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const FILTER_OPTIONS = [
    { id: 'all', label: 'All', icon: Terminal },
    { id: 'errors', label: 'Errors', icon: AlertCircle },
    { id: 'ai', label: 'AI Actions', icon: Bot },
    { id: 'user', label: 'User Actions', icon: User },
];

/**
 * Activity Console Component
 * A terminal-style log panel fixed at the bottom of the screen (light theme)
 */
export function ActivityConsole({ logs = [], onClearLogs, className = "" }) {
    const [isOpen, setIsOpen] = useState(true);
    const [filter, setFilter] = useState('all');
    const logEndRef = useRef(null);

    // Auto-scroll to bottom when new logs arrive
    useEffect(() => {
        if (isOpen && logEndRef.current) {
            logEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [logs, isOpen]);

    // Filter logs based on selected filter
    const filteredLogs = logs.filter(log => {
        if (filter === 'all') return true;
        if (filter === 'errors') return log.type === 'error' || log.type === 'warning';
        if (filter === 'ai') return log.actor.startsWith('AI_') || log.actor === 'SYSTEM';
        if (filter === 'user') return log.actor.startsWith('USER_');
        return true;
    });

    const getActorColor = (actor) => {
        if (actor.startsWith('AI_')) return 'text-primary-600';
        if (actor.startsWith('USER_')) return 'text-success-600';
        if (actor === 'SYSTEM') return 'text-warning-600';
        return 'text-neutral-500';
    };

    const getActionColor = (type) => {
        if (type === 'error') return 'text-danger-600';
        if (type === 'warning') return 'text-warning-600';
        if (type === 'success') return 'text-success-600';
        return 'text-neutral-700';
    };

    const handleClearLogs = (e) => {
        e.stopPropagation();
        if (onClearLogs) {
            onClearLogs();
        }
    };

    return (
        <div className={cn("fixed bottom-0 left-0 right-0 z-40", className)}>
            {/* Toggle handle */}
            <div
                className="bg-white border-t border-neutral-200 px-4 py-1.5 flex items-center justify-between cursor-pointer hover:bg-neutral-50 shadow-lg"
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                aria-expanded={isOpen}
                aria-label="Toggle activity console"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setIsOpen(!isOpen);
                    }
                }}
            >
                <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-primary-500" />
                    <span className="text-xs font-medium text-neutral-700">Activity Console</span>
                    <Badge className="bg-primary-100 text-primary-700 text-[10px] px-1.5">
                        {filteredLogs.length}
                    </Badge>
                </div>
                <div className="flex items-center gap-2">
                    {isOpen ? (
                        <ChevronDown className="w-4 h-4 text-neutral-400" />
                    ) : (
                        <ChevronUp className="w-4 h-4 text-neutral-400" />
                    )}
                </div>
            </div>

            {/* Console panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 200 }}
                        exit={{ height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-neutral-50 border-t border-neutral-200 overflow-hidden"
                    >
                        {/* Filter bar */}
                        <div className="px-3 py-1.5 bg-white border-b border-neutral-200 flex items-center justify-between">
                            <div className="flex items-center gap-1">
                                <Filter className="w-3 h-3 text-neutral-400 mr-1" />
                                {FILTER_OPTIONS.map((option) => {
                                    const Icon = option.icon;
                                    return (
                                        <button
                                            key={option.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setFilter(option.id);
                                            }}
                                            className={cn(
                                                "px-2 py-0.5 text-[10px] rounded flex items-center gap-1 transition-colors",
                                                filter === option.id
                                                    ? "bg-primary-500 text-white"
                                                    : "text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                                            )}
                                            aria-pressed={filter === option.id}
                                        >
                                            <Icon className="w-3 h-3" />
                                            {option.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Clear logs button */}
                            {onClearLogs && logs.length > 0 && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 px-2 text-[10px] text-neutral-500 hover:text-danger-600 hover:bg-danger-50"
                                    onClick={handleClearLogs}
                                    aria-label="Clear all logs"
                                >
                                    <Trash2 className="w-3 h-3 mr-1" />
                                    Clear Logs
                                </Button>
                            )}
                        </div>

                        {/* Log stream */}
                        <div className="h-[160px] overflow-y-auto font-mono text-xs p-2 space-y-0.5 bg-neutral-50">
                            {filteredLogs.length === 0 ? (
                                <div className="text-neutral-400 text-center py-4">
                                    {logs.length === 0 ? 'No activity logs yet' : 'No matching logs for this filter'}
                                </div>
                            ) : (
                                filteredLogs.map((log, index) => (
                                    <div
                                        key={log.id || index}
                                        className="flex items-start gap-2 py-0.5 hover:bg-white px-1 rounded border-l-2 border-transparent hover:border-primary-300"
                                    >
                                        <span className="text-neutral-400 shrink-0">{log.timestamp}</span>
                                        <span className="text-neutral-300 shrink-0">|</span>
                                        <span className={cn("shrink-0 min-w-[80px] font-medium", getActorColor(log.actor))}>
                                            {log.actor}
                                        </span>
                                        <span className="text-neutral-300 shrink-0">|</span>
                                        <span className={cn("shrink-0 min-w-[120px] font-medium", getActionColor(log.type))}>
                                            {log.action}
                                        </span>
                                        <span className="text-neutral-300 shrink-0">|</span>
                                        <span className="text-neutral-600 truncate">{log.details}</span>
                                    </div>
                                ))
                            )}
                            <div ref={logEndRef} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default ActivityConsole;
