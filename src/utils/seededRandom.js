/**
 * Mulberry32 - A simple seeded PRNG
 * Produces deterministic random numbers for same seed
 */
export function createSeededRandom(seed) {
    let state = seed;

    return function () {
        state |= 0;
        state = state + 0x6D2B79F5 | 0;
        let t = Math.imul(state ^ state >>> 15, 1 | state);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

/**
 * Generate a seed from a string (for deterministic behavior)
 */
export function stringToSeed(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * Shuffle array deterministically using seeded random
 */
export function shuffleArray(array, random) {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}

/**
 * Pick N items from array deterministically
 */
export function pickN(array, n, random) {
    const shuffled = shuffleArray(array, random);
    return shuffled.slice(0, n);
}
