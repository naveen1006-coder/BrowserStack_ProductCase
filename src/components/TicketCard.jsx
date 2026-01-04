import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle, Sparkles, Rabbit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Ticket Card Component
 * Displays ticket information with priority, story points, and AI confidence
 * Supports fly-out animation on rejection
 */
export function TicketCard({
  ticket,
  onReject,
  onClick,
  isRejecting = false,
  showConfidence = true,
  className = "",
}) {
  const priorityStyles = {
    high: "bg-danger-50 text-danger-600 border-danger-200",
    medium: "bg-warning-50 text-warning-600 border-warning-200",
    low: "bg-neutral-100 text-neutral-600 border-neutral-200",
  };

  const priorityLabels = {
    high: "High Priority",
    medium: "Medium",
    low: "Low",
  };

  const priorityShadowStyles = {
    high: "shadow-[-4px_0_6px_-1px_rgba(239,68,68,0.3),-2px_0_4px_-1px_rgba(239,68,68,0.2)] hover:shadow-[-6px_0_10px_-2px_rgba(239,68,68,0.4),-3px_0_6px_-1px_rgba(239,68,68,0.3)]",
    medium:
      "shadow-[-4px_0_6px_-1px_rgba(245,158,11,0.3),-2px_0_4px_-1px_rgba(245,158,11,0.2)] hover:shadow-[-6px_0_10px_-2px_rgba(245,158,11,0.4),-3px_0_6px_-1px_rgba(245,158,11,0.3)]",
    low: "shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.1),-2px_0_4px_-1px_rgba(0,0,0,0.06)] hover:shadow-[-6px_0_10px_-2px_rgba(0,0,0,0.15),-3px_0_6px_-1px_rgba(0,0,0,0.1)]",
  };

  return (
    <AnimatePresence>
      {!isRejecting && (
        <motion.div
          layout
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{
            opacity: 0,
            x: 200,
            rotate: 10,
            transition: { duration: 0.4, ease: "easeIn" },
          }}
        >
          <Card
            className={cn(
              "p-4 cursor-pointer transition-shadow border-l-4 !bg-white !text-neutral-900",
              ticket.priority === "high" && "!border-l-danger-500",
              ticket.priority === "medium" && "!border-l-warning-500",
              ticket.priority === "low" && "!border-l-neutral-400",
              !ticket.priority && "!border-neutral-200",
              priorityShadowStyles[ticket.priority] || priorityShadowStyles.low,
              className
            )}
            onClick={() => onClick?.(ticket)}
            role="button"
            tabIndex={0}
            aria-label={`Ticket ${ticket.id}: ${ticket.title}`}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.(ticket);
              }
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                {/* Header */}
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium !text-neutral-500">
                    {ticket.id}
                  </span>
                  <Badge
                    className={cn(
                      "text-xs",
                      priorityStyles[ticket.priority],
                      "!bg-danger-50 !text-danger-600",
                      ticket.priority === "medium" &&
                        "!bg-warning-50 !text-warning-600",
                      ticket.priority === "low" &&
                        "!bg-neutral-100 !text-neutral-600"
                    )}
                    aria-label={priorityLabels[ticket.priority]}
                  >
                    {ticket.priority}
                  </Badge>
                  {ticket.techDebt && (
                    <Badge
                      variant="secondary"
                      className="text-xs !bg-neutral-100 !text-neutral-700"
                    >
                      Tech Debt
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h4 className="font-medium !text-neutral-900 mb-2 line-clamp-2">
                  {ticket.title}
                </h4>

                {/* Meta info */}
                <div className="flex items-center gap-4 text-sm !text-neutral-500">
                  <span className="font-medium">
                    {ticket.storyPoints}{" "}
                    {ticket.storyPoints === 1 ? "point" : "points"}
                  </span>

                  {showConfidence && ticket.confidence && (
                    <span className="flex items-center gap-1 !text-primary-600">
                      <Rabbit className="w-3 h-3" />
                      {Math.round(ticket.confidence * 100)}% confidence
                    </span>
                  )}
                </div>

                {/* Labels */}
                {ticket.labels && ticket.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {ticket.labels.slice(0, 3).map((label) => (
                      <span
                        key={label}
                        className="px-2 py-0.5 text-xs !bg-neutral-100 !text-neutral-600 rounded"
                      >
                        {label}
                      </span>
                    ))}
                    {ticket.labels.length > 3 && (
                      <span className="px-2 py-0.5 text-xs !text-neutral-400">
                        +{ticket.labels.length - 3}
                      </span>
                    )}
                  </div>
                )}

                {/* Selection reason */}
                {ticket.selectionReason && (
                  <p className="mt-2 text-xs !text-primary-600 italic">
                    {ticket.selectionReason}
                  </p>
                )}
              </div>

              {/* Reject button */}
              {onReject && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 text-neutral-400 hover:text-danger-500 hover:bg-danger-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReject(ticket);
                  }}
                  aria-label={`Reject ticket ${ticket.id}`}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Warnings */}
            {ticket.warnings && ticket.warnings.length > 0 && (
              <div className="mt-3 p-2 !bg-warning-50 rounded-lg flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 !text-warning-500 shrink-0 mt-0.5" />
                <p className="text-xs !text-warning-700">
                  {ticket.warnings[0].message}
                </p>
              </div>
            )}
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TicketCard;
