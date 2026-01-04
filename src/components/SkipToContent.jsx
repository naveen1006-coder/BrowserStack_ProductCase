/**
 * Skip to Content Link - Accessibility Component
 * Provides keyboard users a way to skip navigation and go directly to main content
 */
export function SkipToContent({ targetId = "main-content" }) {
    return (
        <a
            href={`#${targetId}`}
            className="skip-to-content"
            aria-label="Skip to main content"
        >
            Skip to content
        </a>
    );
}

export default SkipToContent;
