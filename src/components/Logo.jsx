import { cn } from "@/lib/utils";

/**
 * BrowserStack Logo Component
 * Displays the BrowserStack icon logo with optional size and styling
 */
export function Logo({ className, size = "md" }) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-8 h-8",
    lg: "w-10 h-10",
  };

  // Get base path from import.meta.env (Vite's way of handling base path)
  const basePath = import.meta.env.BASE_URL || "/";
  const logoSrc = `${basePath}browserstack-icon.svg`;

  return (
    <img
      src={logoSrc}
      alt="BrowserStack"
      className={cn(sizeClasses[size], className)}
    />
  );
}

export default Logo;
