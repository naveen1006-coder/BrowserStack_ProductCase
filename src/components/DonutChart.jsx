import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * SVG Donut Chart for Strategic Fit Visualization
 */
export function DonutChart({
    value = 0,
    size = 180,
    strokeWidth = 16,
    label = "Strategic Fit",
    className = "",
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (value / 100) * circumference;

    // Color based on value
    const getColor = useMemo(() => {
        if (value >= 80) return { stroke: '#10b981', bg: '#ecfdf5' }; // success
        if (value >= 60) return { stroke: '#2B3990', bg: '#eef0f9' }; // primary
        if (value >= 40) return { stroke: '#f59e0b', bg: '#fffbeb' }; // warning
        return { stroke: '#ef4444', bg: '#fef2f2' }; // danger
    }, [value]);

    return (
        <div
            className={`relative inline-flex items-center justify-center ${className}`}
            role="img"
            aria-label={`${label}: ${value}%`}
        >
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="transform -rotate-90"
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e4e4e7"
                    strokeWidth={strokeWidth}
                />

                {/* Progress arc */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={getColor.stroke}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: "easeOut" }}
                />
            </svg>

            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span
                    className="text-3xl font-bold text-neutral-900"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                >
                    {value}%
                </motion.span>
                <span className="text-sm text-neutral-500 mt-1">{label}</span>
            </div>
        </div>
    );
}

export default DonutChart;
