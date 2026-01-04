import { motion } from "framer-motion";
import { Rabbit, Slack, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Diff View Component
 * Before/after comparison for ticket refinement
 */
export function DiffView({ improvements = [], className = "" }) {
  if (!improvements || improvements.length === 0) {
    return (
      <div className={cn("text-center py-8 !text-neutral-500", className)}>
        No improvements suggested
      </div>
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {improvements.map((improvement, index) => (
        <motion.div
          key={`${improvement.field}-${index}`}
          className="!border-neutral-200 border rounded-lg overflow-hidden !bg-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          {/* Header */}
          <div className="px-4 py-2 !bg-neutral-50 !border-neutral-200 border-b flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium !text-neutral-700 capitalize">
                {improvement.field}
              </span>
              <span className="text-xs px-2 py-0.5 !bg-primary-100 !text-primary-700 rounded">
                {improvement.type}
              </span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Rabbit className="w-3 h-3 !text-primary-500" />
              <span
                className={cn(
                  "font-medium",
                  improvement.confidence >= 0.8
                    ? "!text-success-600"
                    : improvement.confidence >= 0.6
                    ? "!text-primary-600"
                    : "!text-warning-600"
                )}
              >
                {Math.round(improvement.confidence * 100)}% confidence
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x !divide-neutral-200">
            {/* Before */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium !text-neutral-500 uppercase tracking-wide">
                  Before
                </span>
              </div>
              <div className="!bg-danger-50/50 rounded-lg p-3 text-sm !text-neutral-700 !border-danger-100 border">
                {improvement.before || (
                  <span className="italic !text-neutral-400">Not defined</span>
                )}
              </div>
            </div>

            {/* After */}
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-medium !text-neutral-500 uppercase tracking-wide">
                  After
                </span>
                <span className="text-xs !text-success-600">AI Suggested</span>
              </div>
              <div className="!bg-success-50/50 rounded-lg p-3 text-sm !text-neutral-700 !border-success-100 border whitespace-pre-wrap">
                {Array.isArray(improvement.after) ? (
                  <ul className="list-disc list-inside space-y-1">
                    {improvement.after.map((item, idx) => (
                      <li key={idx}>
                        {typeof item === "object" && item.message
                          ? item.message
                          : String(item)}
                      </li>
                    ))}
                  </ul>
                ) : typeof improvement.after === "object" &&
                  improvement.after !== null ? (
                  <pre className="text-xs">
                    {JSON.stringify(improvement.after, null, 2)}
                  </pre>
                ) : (
                  improvement.after
                )}
              </div>
            </div>
          </div>

          {/* Reason */}
          {improvement.reason && (
            <div className="px-4 py-2 !bg-neutral-50 !border-neutral-200 border-t">
              <p className="text-xs !text-neutral-500">
                <span className="font-medium">Reason:</span>{" "}
                {improvement.reason}
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default DiffView;
