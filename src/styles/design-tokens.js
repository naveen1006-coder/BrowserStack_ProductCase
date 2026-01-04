/**
 * Align Design Tokens
 * BrowserStack brand colors and design system constants
 */

export const colors = {
    // Primary - BrowserStack Blue
    primary: {
        50: '#eef0f9',
        100: '#d4d9f0',
        200: '#a9b3e1',
        300: '#7e8dd2',
        400: '#5367c3',
        500: '#2B3990', // Main brand color
        600: '#232e73',
        700: '#1a2256',
        800: '#121739',
        900: '#090b1c',
    },

    // Semantic colors
    success: {
        50: '#ecfdf5',
        100: '#d1fae5',
        500: '#10b981',
        600: '#059669',
    },
    warning: {
        50: '#fffbeb',
        100: '#fef3c7',
        500: '#f59e0b',
        600: '#d97706',
    },
    danger: {
        50: '#fef2f2',
        100: '#fee2e2',
        500: '#ef4444',
        600: '#dc2626',
    },

    // Neutral palette
    neutral: {
        50: '#fafafa',
        100: '#f4f4f5',
        200: '#e4e4e7',
        300: '#d4d4d8',
        400: '#a1a1aa',
        500: '#71717a',
        600: '#52525b',
        700: '#3f3f46',
        800: '#27272a',
        900: '#18181b',
    },
};

export const typography = {
    fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
    },
    fontSize: {
        xs: '0.75rem',     // 12px
        sm: '0.875rem',    // 14px
        base: '1rem',      // 16px
        lg: '1.125rem',    // 18px
        xl: '1.25rem',     // 20px
        '2xl': '1.5rem',   // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
        normal: 400,
        medium: 500,
        semibold: 600,
        bold: 700,
    },
    lineHeight: {
        tight: 1.25,
        normal: 1.5,
        relaxed: 1.75,
    },
};

export const spacing = {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
};

export const borderRadius = {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.375rem',  // 6px
    lg: '0.5rem',    // 8px
    xl: '0.75rem',   // 12px
    '2xl': '1rem',   // 16px
    full: '9999px',
};

export const shadows = {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
};

export const transitions = {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
};

// Accessibility - ensure WCAG AA contrast ratios
export const a11y = {
    focusRing: `0 0 0 2px ${colors.primary[500]}`,
    focusRingOffset: '2px',
    minTouchTarget: '44px',
};

export default {
    colors,
    typography,
    spacing,
    borderRadius,
    shadows,
    transitions,
    a11y,
};
