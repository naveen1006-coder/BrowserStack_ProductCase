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
  // Files in public folder are served from the base path root
  const basePath = import.meta.env.BASE_URL || "/";
  // Construct the logo path: basePath should already include trailing slash if needed
  // For root base ("/"), the path should be "/browserstack-icon.svg"
  // For subdirectory base ("/repo/"), the path should be "/repo/browserstack-icon.svg"
  const logoSrc = basePath === "/" 
    ? "/browserstack-icon.svg" 
    : `${basePath.replace(/\/$/, "")}/browserstack-icon.svg`;

  return (
    <img
      src={logoSrc}
      alt="BrowserStack"
      className={cn(sizeClasses[size], className)}
    />
  );
}

export default Logo;
