import { useMemo } from 'react';

/**
 * Burndown Mini-Chart Component
 * A small sparkline showing ideal vs actual velocity (light theme)
 */
export function BurndownChart({
    idealData = [],
    actualData = [],
    width = 120,
    height = 40,
    className = "",
}) {
    const { idealPath, actualPath, maxValue } = useMemo(() => {
        const allValues = [...idealData, ...actualData];
        const max = Math.max(...allValues, 1);

        const createPath = (data) => {
            if (data.length === 0) return '';

            const stepX = width / (data.length - 1 || 1);
            const points = data.map((value, index) => {
                const x = index * stepX;
                const y = height - (value / max) * height;
                return `${x},${y}`;
            });

            return `M ${points.join(' L ')}`;
        };

        return {
            idealPath: createPath(idealData),
            actualPath: createPath(actualData),
            maxValue: max,
        };
    }, [idealData, actualData, width, height]);

    return (
        <div className={className}>
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="overflow-visible"
                role="img"
                aria-label="Sprint burndown chart"
            >
                {/* Grid lines */}
                <line x1="0" y1={height / 2} x2={width} y2={height / 2} stroke="#e4e4e7" strokeWidth="0.5" strokeDasharray="2,2" />
                <line x1="0" y1={height} x2={width} y2={height} stroke="#e4e4e7" strokeWidth="0.5" />

                {/* Ideal line (dashed) */}
                {idealPath && (
                    <path
                        d={idealPath}
                        fill="none"
                        stroke="#a1a1aa"
                        strokeWidth="1.5"
                        strokeDasharray="4,2"
                        className="opacity-60"
                    />
                )}

                {/* Actual line */}
                {actualPath && (
                    <path
                        d={actualPath}
                        fill="none"
                        stroke="#2B3990"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                )}

                {/* Current point */}
                {actualData.length > 0 && (
                    <circle
                        cx={(actualData.length - 1) * (width / (actualData.length - 1 || 1))}
                        cy={height - (actualData[actualData.length - 1] / maxValue) * height}
                        r="3"
                        fill="#2B3990"
                        className="drop-shadow-sm"
                    />
                )}
            </svg>
        </div>
    );
}

export default BurndownChart;
