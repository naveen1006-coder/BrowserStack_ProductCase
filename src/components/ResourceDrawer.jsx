import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Users as UsersIcon,
  Clock,
  AlertTriangle,
  Minus,
  Download,
  Edit2,
  Check,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  TEAM_ROSTER,
  getNetAvailability,
  getUtilization,
  getCapacityStatus,
  getStatusColor,
  getTeamTotals,
  getCapacityByRole,
  detectBottlenecks,
} from "@/data/teamRoster";
import { exportTeamCapacity } from "@/utils/exportTeamData";

const DEDUCTION_ICONS = {
  Leave: Calendar,
  "Shadow Project": UsersIcon,
  "Meeting Overload": Clock,
};

/**
 * Resource Bifurcation Drawer
 * Detailed view of team capacity with deductions and bottleneck alerts
 */
export function ResourceDrawer({
  isOpen,
  onClose,
  roster = TEAM_ROSTER,
  requiredByRole = {},
  onLog,
  onCapacityChange,
}) {
  const [editingMember, setEditingMember] = useState(null);
  const [editingDeduction, setEditingDeduction] = useState(null);
  const [localRoster, setLocalRoster] = useState(roster);

  const totals = useMemo(() => getTeamTotals(localRoster), [localRoster]);
  const capacityByRole = useMemo(
    () => getCapacityByRole(localRoster),
    [localRoster]
  );
  const bottlenecks = useMemo(
    () => detectBottlenecks(localRoster, requiredByRole),
    [localRoster, requiredByRole]
  );

  // Handle deduction change
  const handleDeductionChange = useCallback(
    (memberId, deductionIndex, newValue) => {
      setLocalRoster((prev) => {
        const updated = prev.map((member) => {
          if (member.id === memberId) {
            const newDeductions = [...member.deductions];
            const oldValue = newDeductions[deductionIndex].value;
            newDeductions[deductionIndex] = {
              ...newDeductions[deductionIndex],
              value: newValue,
            };

            // Log the change
            onLog?.({
              actor: "SYSTEM",
              action: "CAPACITY_CHANGE",
              details: `${member.name}'s availability updated (${newDeductions[deductionIndex].type}: ${oldValue} → ${newValue} pts)`,
              type: "info",
            });

            return { ...member, deductions: newDeductions };
          }
          return member;
        });

        onCapacityChange?.(updated);
        return updated;
      });

      setEditingDeduction(null);
    },
    [onLog, onCapacityChange]
  );

  // Handle adding a new deduction
  const handleAddDeduction = useCallback(
    (memberId, type, value, reason) => {
      setLocalRoster((prev) => {
        const updated = prev.map((member) => {
          if (member.id === memberId) {
            const newDeductions = [
              ...member.deductions,
              { type, value, reason },
            ];

            onLog?.({
              actor: "SYSTEM",
              action: "CAPACITY_CHANGE",
              details: `${member.name}'s availability updated. Added ${type}: -${value} pts`,
              type: "info",
            });

            return { ...member, deductions: newDeductions };
          }
          return member;
        });

        onCapacityChange?.(updated);
        return updated;
      });
    },
    [onLog, onCapacityChange]
  );

  // Handle removing a deduction
  const handleRemoveDeduction = useCallback(
    (memberId, deductionIndex) => {
      setLocalRoster((prev) => {
        const updated = prev.map((member) => {
          if (member.id === memberId) {
            const removed = member.deductions[deductionIndex];
            const newDeductions = member.deductions.filter(
              (_, i) => i !== deductionIndex
            );

            onLog?.({
              actor: "SYSTEM",
              action: "CAPACITY_CHANGE",
              details: `${member.name}'s availability updated. Removed ${removed.type}: +${removed.value} pts`,
              type: "success",
            });

            return { ...member, deductions: newDeductions };
          }
          return member;
        });

        onCapacityChange?.(updated);
        return updated;
      });
    },
    [onLog, onCapacityChange]
  );

  // Handle export
  const handleExport = () => {
    exportTeamCapacity(localRoster);
    onLog?.({
      actor: "USER_MJ",
      action: "EXPORT",
      details: "Team capacity data exported to CSV",
      type: "info",
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/30 z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 w-[600px] max-w-full !bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="px-8 py-5 border-b !border-neutral-200 flex items-center justify-between !bg-neutral-50">
              <div>
                <h2 className="text-xl font-semibold !text-neutral-900 mb-1">
                  Resource Bifurcation
                </h2>
                <p className="text-sm !text-neutral-500">
                  Team capacity breakdown with deductions
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleExport}>
                  <Download className="w-4 h-4 mr-1" />
                  Export
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Summary bar */}
            <div className="px-8 py-5 !bg-primary-50 border-b !border-primary-100">
              <div className="grid grid-cols-4 gap-6 text-center">
                <div>
                  <p className="text-2xl font-bold !text-neutral-800 mb-1">
                    {totals.totalBase}
                  </p>
                  <p className="text-xs !text-neutral-500 uppercase tracking-wide">
                    Base Capacity
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-danger-600 mb-1">
                    -{totals.totalDeductions}
                  </p>
                  <p className="text-xs !text-neutral-500 uppercase tracking-wide">
                    Deductions
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary-600 mb-1">
                    {totals.totalNet}
                  </p>
                  <p className="text-xs !text-neutral-500 uppercase tracking-wide">
                    Net Available
                  </p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-success-600 mb-1">
                    {totals.availablePoints}
                  </p>
                  <p className="text-xs !text-neutral-500 uppercase tracking-wide">
                    Unassigned
                  </p>
                </div>
              </div>
            </div>

            {/* Bottleneck alerts */}
            {bottlenecks.length > 0 && (
              <div className="px-8 py-4 !bg-danger-50 border-b !border-danger-100">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-danger-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold !text-danger-700 mb-2">
                      Capacity Conflicts Detected
                    </p>
                    <ul className="space-y-1.5">
                      {bottlenecks.map((alert, idx) => (
                        <li
                          key={idx}
                          className="text-xs !text-danger-600 leading-relaxed"
                        >
                          • {alert.message}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Content - scrollable */}
            <div className="flex-1 overflow-y-auto">
              {/* Role breakdown */}
              <div className="px-8 py-6 border-b !border-neutral-100">
                <h3 className="text-xs font-semibold !text-neutral-500 uppercase tracking-wide mb-4">
                  Capacity by Specialization
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {Object.entries(capacityByRole).map(([role, data]) => (
                    <div
                      key={role}
                      className="!bg-neutral-50 rounded-lg p-4 border !border-neutral-200"
                    >
                      <div className="mb-3">
                        <Badge className="!bg-primary-100 !text-primary-700 text-xs px-2 py-0.5 mb-2">
                          {role}
                        </Badge>
                        <p className="text-xs !text-neutral-400">
                          {data.members.length} member
                          {data.members.length !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex items-baseline gap-1 mb-3">
                        <span className="text-xl font-bold !text-primary-600">
                          {data.available}
                        </span>
                        <span className="text-sm !text-neutral-400">
                          / {data.net} pts
                        </span>
                      </div>
                      <Progress
                        value={
                          data.net > 0 ? (data.assigned / data.net) * 100 : 0
                        }
                        className="h-2 !bg-neutral-200"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Team members table */}
              <div className="px-8 py-6">
                <h3 className="text-xs font-semibold !text-neutral-500 uppercase tracking-wide mb-5">
                  Individual Breakdown
                </h3>

                <div className="space-y-4">
                  {localRoster.map((member) => {
                    const netAvailable = getNetAvailability(member);
                    const utilization = getUtilization(member);
                    const status = getCapacityStatus(member);
                    const colors = getStatusColor(status);
                    const totalDeductions = member.deductions.reduce(
                      (sum, d) => sum + d.value,
                      0
                    );

                    return (
                      <div
                        key={member.id}
                        className="!bg-white border !border-neutral-200 rounded-lg p-5 hover:!border-primary-200 transition-colors shadow-sm"
                      >
                        {/* Header row */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div
                              className="w-12 h-12 rounded-full flex items-center justify-center text-base font-bold text-white shadow-sm"
                              style={{ backgroundColor: member.color }}
                            >
                              {member.initials}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-semibold text-base !text-neutral-900">
                                  {member.name}
                                </span>
                                <Badge className="!bg-neutral-100 !text-neutral-600 text-xs px-2 py-0.5">
                                  {member.role}
                                </Badge>
                              </div>
                              <p className="text-sm !text-neutral-400">
                                Base: {member.basePoints} pts/sprint
                              </p>
                            </div>
                          </div>

                          <div className="text-right">
                            <div
                              className={cn(
                                "text-xl font-bold mb-1",
                                utilization > 90
                                  ? "text-danger-600"
                                  : utilization >= 50
                                  ? "text-success-600"
                                  : "text-primary-600"
                              )}
                            >
                              {netAvailable} pts
                            </div>
                            <p className="text-xs !text-neutral-400">
                              Net Available
                            </p>
                          </div>
                        </div>

                        {/* Deductions */}
                        {member.deductions.length > 0 && (
                          <div className="mb-4 pl-5 border-l-2 !border-neutral-200">
                            <p className="text-xs !text-neutral-500 uppercase tracking-wide mb-2.5 font-medium">
                              Deductions (-{totalDeductions} pts)
                            </p>
                            <div className="space-y-2">
                              {member.deductions.map((deduction, idx) => {
                                const Icon =
                                  DEDUCTION_ICONS[deduction.type] || Minus;
                                const isEditing =
                                  editingDeduction === `${member.id}-${idx}`;

                                return (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between text-sm group py-1"
                                  >
                                    <div className="flex items-center gap-2.5 !text-neutral-700">
                                      <Icon className="w-4 h-4 !text-neutral-500" />
                                      <span className="font-medium">
                                        {deduction.type}
                                      </span>
                                      <span className="!text-neutral-500">
                                        • {deduction.reason}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      {isEditing ? (
                                        <>
                                          <Input
                                            type="number"
                                            defaultValue={deduction.value}
                                            className="w-12 h-6 text-xs p-1 !bg-white !border-neutral-300 !text-neutral-900"
                                            min={0}
                                            max={member.basePoints}
                                            onKeyDown={(e) => {
                                              if (e.key === "Enter") {
                                                handleDeductionChange(
                                                  member.id,
                                                  idx,
                                                  Number(e.target.value)
                                                );
                                              }
                                              if (e.key === "Escape") {
                                                setEditingDeduction(null);
                                              }
                                            }}
                                            autoFocus
                                          />
                                          <button
                                            className="text-success-500 hover:text-success-600"
                                            onClick={(e) => {
                                              const input =
                                                e.target.parentElement.querySelector(
                                                  "input"
                                                );
                                              handleDeductionChange(
                                                member.id,
                                                idx,
                                                Number(input.value)
                                              );
                                            }}
                                          >
                                            <Check className="w-3 h-3" />
                                          </button>
                                          <button
                                            className="text-neutral-400 hover:text-neutral-600"
                                            onClick={() =>
                                              setEditingDeduction(null)
                                            }
                                          >
                                            <XCircle className="w-3 h-3" />
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <span className="!text-danger-500 font-medium">
                                            -{deduction.value}
                                          </span>
                                          <button
                                            className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-primary-500 transition-opacity ml-1"
                                            onClick={() =>
                                              setEditingDeduction(
                                                `${member.id}-${idx}`
                                              )
                                            }
                                          >
                                            <Edit2 className="w-3 h-3" />
                                          </button>
                                          <button
                                            className="opacity-0 group-hover:opacity-100 text-neutral-400 hover:text-danger-500 transition-opacity"
                                            onClick={() =>
                                              handleRemoveDeduction(
                                                member.id,
                                                idx
                                              )
                                            }
                                          >
                                            <X className="w-3 h-3" />
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}

                        {/* Workload bar */}
                        <div className="mt-1">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="!text-neutral-600 font-medium">
                              Live Workload
                            </span>
                            <span
                              className={cn(
                                "font-semibold",
                                utilization > 90
                                  ? "text-danger-600"
                                  : utilization >= 50
                                  ? "text-success-600"
                                  : "text-primary-600"
                              )}
                            >
                              {member.assignedPoints}/{netAvailable} pts (
                              {utilization}%)
                            </span>
                          </div>
                          <div className="relative">
                            <Progress
                              value={Math.min(utilization, 100)}
                              className={cn(
                                "h-2.5",
                                utilization > 90
                                  ? "!bg-danger-100"
                                  : utilization >= 50
                                  ? "!bg-success-100"
                                  : "!bg-primary-100"
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-8 py-5 border-t !border-neutral-200 !bg-neutral-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 text-sm !text-neutral-600">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-primary-500" />
                    <span>Under-utilized</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-success-500" />
                    <span>Optimal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-danger-500" />
                    <span>Overloaded</span>
                  </div>
                </div>
                <Button onClick={onClose} className="px-6">
                  Done
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ResourceDrawer;
