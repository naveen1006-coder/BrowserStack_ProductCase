/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // BrowserStack Blue - Primary brand color
                primary: {
                    50: '#eef0f9',
                    100: '#d4d9f0',
                    200: '#a9b3e1',
                    300: '#7e8dd2',
                    400: '#5367c3',
                    500: '#2B3990',  // Main brand color
                    600: '#232e73',
                    700: '#1a2256',
                    800: '#121739',
                    900: '#090b1c',
                },
                // Neutral grays for text and backgrounds
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                },
                // Success - Emerald green
                success: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                    900: '#064e3b',
                },
                // Warning - Amber
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                },
                // Danger - Red
                danger: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    900: '#7f1d1d',
                },
                // Slate for dark mode backgrounds
                slate: {
                    50: '#f8fafc',
                    100: '#f1f5f9',
                    200: '#e2e8f0',
                    300: '#cbd5e1',
                    400: '#94a3b8',
                    500: '#64748b',
                    600: '#475569',
                    700: '#334155',
                    800: '#1e293b',
                    900: '#0f172a',
                    950: '#020617',
                },
                // Emerald - for refined/success states
                emerald: {
                    50: '#ecfdf5',
                    100: '#d1fae5',
                    200: '#a7f3d0',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                    700: '#047857',
                },
                // Amber - for warning states
                amber: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                },
                // Purple - for review/special states
                purple: {
                    50: '#faf5ff',
                    100: '#f3e8ff',
                    400: '#c084fc',
                    500: '#a855f7',
                    600: '#9333ea',
                    900: '#581c87',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                'scan': 'scan 1.5s ease-in-out infinite',
                'fade-in': 'fadeIn 0.3s ease-out',
                'slide-up': 'slideUp 0.3s ease-out',
                'fly-out': 'flyOut 0.4s ease-in forwards',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
            },
            keyframes: {
                scan: {
                    '0%, 100%': { opacity: 0.4 },
                    '50%': { opacity: 1 },
                },
                fadeIn: {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 },
                },
                slideUp: {
                    '0%': { opacity: 0, transform: 'translateY(10px)' },
                    '100%': { opacity: 1, transform: 'translateY(0)' },
                },
                flyOut: {
                    '0%': { opacity: 1, transform: 'translateX(0) rotate(0deg)' },
                    '100%': { opacity: 0, transform: 'translateX(200px) rotate(10deg)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: 1 },
                    '50%': { opacity: 0.7 },
                },
            },
        },
    },
    plugins: [],
}
