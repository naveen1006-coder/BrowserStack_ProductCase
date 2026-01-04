import { useMemo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { createSeededRandom } from '@/utils/seededRandom';

/**
 * Performant Particle Animation Component
 * - 40 particles on desktop, 20 on mobile (<640px)
 * - Snap to grid every 3 seconds
 * - GPU-accelerated transforms only
 */
export function ParticleAnimation({ seed = 42 }) {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isMobile, setIsMobile] = useState(false);
    const [gridPositions, setGridPositions] = useState([]);

    // Determine particle count based on screen size
    const particleCount = isMobile ? 20 : 40;

    // Grid configuration
    const gridSize = 60;

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
                setIsMobile(window.innerWidth < 640);
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    // Generate grid positions deterministically
    const generateGridPositions = useMemo(() => {
        const random = createSeededRandom(seed);
        const positions = [];

        const cols = Math.floor(dimensions.width / gridSize) || 1;
        const rows = Math.floor(dimensions.height / gridSize) || 1;

        for (let i = 0; i < particleCount; i++) {
            const col = Math.floor(random() * cols);
            const row = Math.floor(random() * rows);
            positions.push({
                x: col * gridSize + gridSize / 2,
                y: row * gridSize + gridSize / 2,
            });
        }

        return positions;
    }, [seed, dimensions.width, dimensions.height, particleCount]);

    // Snap to new grid positions every 3 seconds
    useEffect(() => {
        if (dimensions.width === 0) return;

        const updatePositions = () => {
            const random = createSeededRandom(Date.now());
            const cols = Math.floor(dimensions.width / gridSize) || 1;
            const rows = Math.floor(dimensions.height / gridSize) || 1;

            const newPositions = [];
            for (let i = 0; i < particleCount; i++) {
                const col = Math.floor(random() * cols);
                const row = Math.floor(random() * rows);
                newPositions.push({
                    x: col * gridSize + gridSize / 2,
                    y: row * gridSize + gridSize / 2,
                });
            }
            setGridPositions(newPositions);
        };

        // Initial positions
        setGridPositions(generateGridPositions);

        // Update every 3 seconds
        const interval = setInterval(updatePositions, 3000);
        return () => clearInterval(interval);
    }, [dimensions, particleCount, generateGridPositions]);

    // Generate particles with initial positions
    const particles = useMemo(() => {
        const random = createSeededRandom(seed);
        return Array.from({ length: particleCount }, (_, i) => ({
            id: i,
            size: 4 + random() * 4,
            opacity: 0.3 + random() * 0.4,
            delay: random() * 2,
        }));
    }, [seed, particleCount]);

    return (
        <div
            ref={containerRef}
            className="absolute inset-0 overflow-hidden bg-primary-900"
            aria-hidden="true"
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950" />

            {/* Grid lines (subtle) */}
            <svg className="absolute inset-0 w-full h-full opacity-10">
                <defs>
                    <pattern id="grid" width={gridSize} height={gridSize} patternUnits="userSpaceOnUse">
                        <path
                            d={`M ${gridSize} 0 L 0 0 0 ${gridSize}`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="0.5"
                            className="text-primary-400"
                        />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>

            {/* Particles */}
            {gridPositions.length > 0 && particles.map((particle, index) => (
                <motion.div
                    key={particle.id}
                    className="absolute rounded-full bg-white gpu-accelerated"
                    style={{
                        width: particle.size,
                        height: particle.size,
                    }}
                    initial={{
                        x: generateGridPositions[index]?.x || 0,
                        y: generateGridPositions[index]?.y || 0,
                        opacity: 0,
                    }}
                    animate={{
                        x: gridPositions[index]?.x || 0,
                        y: gridPositions[index]?.y || 0,
                        opacity: particle.opacity,
                    }}
                    transition={{
                        duration: 1.5,
                        ease: "easeInOut",
                        delay: particle.delay * 0.2,
                    }}
                />
            ))}

            {/* Floating glow effect */}
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-primary-300/15 rounded-full blur-3xl" />
        </div>
    );
}

export default ParticleAnimation;
