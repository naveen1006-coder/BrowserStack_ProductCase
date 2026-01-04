import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

/**
 * Theme Toggle Component
 * A button that toggles between light and dark mode
 */
export function ThemeToggle({ className = "" }) {
    const { theme, toggleTheme, isDark } = useTheme();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className={cn(
                "relative w-9 h-9 rounded-full",
                className
            )}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
        >
            <Sun className={cn(
                "h-4 w-4 transition-all",
                isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
            )} />
            <Moon className={cn(
                "absolute h-4 w-4 transition-all",
                isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
            )} />
        </Button>
    );
}

export default ThemeToggle;
