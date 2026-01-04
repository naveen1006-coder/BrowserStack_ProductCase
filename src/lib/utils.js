import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 * Handles conditional classes and deduplication
 */
export function cn(...inputs) {
    return twMerge(clsx(inputs));
}
